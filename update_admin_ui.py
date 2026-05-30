import os
import re

file_path = r'c:\Users\88016\OneDrive\Desktop\PROJECTS\EternoFit HEALTH QUIZ\src\EmailMarketingAdmin.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add handleResumeSavedCampaign
resume_func = """  const handleResumeSavedCampaign = async (savedCamp) => {
    if (!window.confirm(`Are you sure you want to resume the paused campaign "${savedCamp.name}"? This will immediately continue dispatching to the remaining queue.`)) return;

    // Load states
    setCampaignName(savedCamp.name);
    setSubject(savedCamp.subject || '');
    setEmailBody(savedCamp.body || '');
    setDesignStyle(savedCamp.template || 'professional');
    setThemeColor(savedCamp.themeColor || '#0084ff');
    setFilterLeadType(savedCamp.filters?.leadType || 'all');
    setFilterSex(savedCamp.filters?.sex || 'all');
    setFilterGoal(savedCamp.filters?.goal || 'all');
    setSenderName(savedCamp.senderName || 'EternoFit Wellness');

    // Load queue state
    setQueueRecipients(savedCamp.queueRecipients || []);
    setQueueIndex(savedCamp.queueIndex || 0);
    setQueueSuccessCount(savedCamp.queueSuccessCount || 0);
    setQueueErrorCount(savedCamp.queueErrorCount || 0);
    
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setQueueLog([
      ...(savedCamp.queueLog || []),
      `[${timeStr}] [INFO] Resuming paused campaign from database...`
    ]);

    setQueueModalOpen(true);
    setQueueStatus('dispatching');

    // Optionally delete from saved_campaigns since we are resuming
    try {
      await deleteDoc(doc(db, 'saved_campaigns', savedCamp.id));
    } catch (e) {
      console.error("Failed to delete resumed campaign from DB", e);
    }
  };

  const handleDeleteSavedCampaign = async (id) => {
    if (window.confirm("Permanently delete this paused campaign? You will lose its progress and won't be able to resume it.")) {
      try {
        await deleteDoc(doc(db, 'saved_campaigns', id));
      } catch (e) {
        alert("Failed to delete: " + e.message);
      }
    }
  };"""

# Insert the functions before `const handleBlacklistLeads = async () => {`
content = content.replace("  // paste blacklist logic helper", resume_func + "\n\n  // paste blacklist logic helper")

# Add the UI for Saved Campaigns above the History Table
history_ui_regex = r"\{/\* 3\. CAMPAIGNS HISTORICAL ARCHIVE \*/\}\s*\{activeSubTab === 'history' && \(\s*<div className=\"admin-table-container\">"
saved_campaigns_ui = """{/* 3. CAMPAIGNS HISTORICAL ARCHIVE */}
      {activeSubTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {savedCampaigns.length > 0 && (
            <div className="admin-table-container" style={{ border: '1px solid #f59e0b' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1.5rem', borderBottom: '1px solid #f59e0b' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', color: '#f59e0b' }}>
                  <Pause size={18} /> Paused / Saved Campaigns
                </h3>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Saved Date</th>
                    <th>Campaign Name</th>
                    <th style={{ textAlign: 'center' }}>Progress</th>
                    <th style={{ textAlign: 'center' }}>Success/Error</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {savedCampaigns.map((camp) => (
                    <tr key={camp.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>{camp.savedAt.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                      <td><strong>{camp.name}</strong><br/><span style={{ fontSize: '0.75rem', color: 'var(--text-muted-site)' }}>{camp.subject}</span></td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${((camp.queueIndex || 0) / (camp.queueRecipients?.length || 1)) * 100}%`, height: '100%', background: '#f59e0b' }}></div>
                          </div>
                          <span style={{ fontSize: '0.8rem' }}>{camp.queueIndex || 0} / {camp.queueRecipients?.length || 0}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ color: '#10b981' }}>{camp.queueSuccessCount || 0} sent</span> / <span style={{ color: '#ef4444' }}>{camp.queueErrorCount || 0} failed</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleResumeSavedCampaign(camp)} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Play size={12} /> Resume</button>
                          <button onClick={() => handleDeleteSavedCampaign(camp.id)} style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Trash2 size={12} /> Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="admin-table-container">"""

content = re.sub(history_ui_regex, saved_campaigns_ui, content, flags=re.DOTALL)

# Add matching closing div for the new wrapper div we added `<div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>`
# The original code has:
#           </div>
#         </div>
#       )}
#       {/* 4. TRACEABLE CLICKS FEED */}

close_div_regex = r"</div>\s*\)\}\s*\{/\* 4\. TRACEABLE CLICKS FEED \*/\}"
close_div_replacement = "</div>\n        </div>\n      )}\n\n      {/* 4. TRACEABLE CLICKS FEED */}"
content = re.sub(close_div_regex, close_div_replacement, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added UI and logic for paused campaigns!")
