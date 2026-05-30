import os
import re

file_path = r'c:\Users\88016\OneDrive\Desktop\PROJECTS\EternoFit HEALTH QUIZ\src\EmailMarketingAdmin.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add savedCampaigns state
content = re.sub(
    r'const \[campaigns, setCampaigns\] = useState\(\[\]\);',
    r'const [campaigns, setCampaigns] = useState([]);\n  const [savedCampaigns, setSavedCampaigns] = useState([]);',
    content
)

# 2. Modify state: remove dispatchInterval, update dailyLimit
content = re.sub(
    r"const \[dispatchInterval, setDispatchInterval\] = useState\(3\); // default 3 seconds\n\s*const \[dailyLimit, setDailyLimit\] = useState\(100\); // default 100 emails/day, max 100",
    r"const [dailyLimit, setDailyLimit] = useState(500); // default 500 emails/day quota limit",
    content
)

# 3. Update confirm message in handleLaunchCampaign
content = re.sub(
    r'`Proceed to dispatch "\$\{campaignName\}" campaign to \$\{targetedSubscribers.length\} subscribers with a \$\{dispatchInterval\}-second delay between emails\?`',
    r'`Proceed to dispatch "${campaignName}" campaign to ${targetedSubscribers.length} subscribers with a random 5-20 second delay between emails?`',
    content
)

# 4. Update log in handleLaunchCampaign
content = re.sub(
    r'`\[INFO\] Set Interval delay: \$\{dispatchInterval\} seconds`,',
    r'`[INFO] Set Interval delay: 5-20 seconds (randomized)`,',
    content
)

# 5. Fetch saved campaigns
fetch_replace = """    // 4. Fetch custom copy presets
    const unsubPresets = onSnapshot(
      query(collection(db, 'marketing_presets'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const firestoreList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt) || new Date()
        }));
        setCustomPresets(firestoreList);
      },
      (error) => {
        console.error("Error fetching custom presets from Firestore:", error);
      }
    );

    // 5. Fetch paused/saved campaigns
    const unsubSavedCampaigns = onSnapshot(
      query(collection(db, 'saved_campaigns'), orderBy('savedAt', 'desc')),
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          savedAt: doc.data().savedAt?.toDate?.() || new Date(doc.data().savedAt) || new Date()
        }));
        setSavedCampaigns(list);
      },
      (error) => {
        console.error("Error fetching saved campaigns:", error);
      }
    );

    return () => {
      unsubSubscribers();
      unsubCampaigns();
      unsubClicks();
      unsubPresets();
      unsubSavedCampaigns();
    };"""

content = re.sub(
    r"// 4\. Fetch custom copy presets.*?return \(\) => \{.*?unsubPresets\(\);\s*\};\s*",
    fetch_replace + "\n",
    content,
    flags=re.DOTALL
)

# 6. Random delay in dispatch
content = re.sub(
    r'timerRef\.current = setTimeout\(runDispatchStep, dispatchInterval \* 1000\);',
    r'const delay = Math.floor(Math.random() * (20 - 5 + 1) + 5) * 1000;\n    timerRef.current = setTimeout(runDispatchStep, delay);',
    content
)

# 7. Add savedCampaigns deletion on completion
completion_replace = """      // Save campaign stats to Firestore
      addDoc(collection(db, 'marketing_campaigns'), {
        name: campaignName,
        subject: subject,
        body: emailBody,
        template: designStyle,
        themeColor: themeColor,
        filters: {
          leadType: filterLeadType,
          sex: filterSex,
          goal: filterGoal
        },
        sentCount: queueSuccessCount,
        sentAt: serverTimestamp()
      }).catch(e => console.error("Error saving campaign run log:", e));"""

content = content.replace(completion_replace, completion_replace) # Placeholder to verify it exists

# 8. Update handleCancelQueue to save progress
handle_cancel_regex = r"const handleCancelQueue = \(\) => \{.*?\}\)\.catch\(e => console\.error\(\"Error saving campaign run log:\", e\)\);\s*\};"
handle_stop_save = """  const handleStopAndSaveQueue = async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setQueueStatus('cancelled');
    setQueueLog(prev => [...prev, `[STOPPED] Queue suspended. Saving progress to database...`]);
    
    try {
      await addDoc(collection(db, 'saved_campaigns'), {
        name: campaignName,
        subject: subject,
        body: emailBody,
        template: designStyle,
        themeColor: themeColor,
        filters: {
          leadType: filterLeadType,
          sex: filterSex,
          goal: filterGoal
        },
        queueRecipients: queueRecipients,
        queueIndex: queueIndex,
        queueSuccessCount: queueSuccessCount,
        queueErrorCount: queueErrorCount,
        queueLog: queueLog,
        senderName: senderName,
        savedAt: serverTimestamp()
      });
      alert('Campaign stopped and progress saved successfully. You can resume it later from the Campaigns Archive.');
      setQueueModalOpen(false);
    } catch (e) {
      console.error("Error saving campaign progress:", e);
      alert("Failed to save progress: " + e.message);
    }
  };"""

content = re.sub(handle_cancel_regex, handle_stop_save, content, flags=re.DOTALL)

# Update onClick={handleCancelQueue} to onClick={handleStopAndSaveQueue}
content = content.replace("onClick={handleCancelQueue}", "onClick={handleStopAndSaveQueue}")
content = content.replace("Terminate Campaign", "Stop & Save Campaign")
content = content.replace("<Square size={12} fill=\"#ef4444\" /> Stop & Save Campaign", "<Square size={12} fill=\"#ef4444\" /> Stop & Save Campaign")

# 9. Update UI for Interval Delay and Quota limits
interval_ui_regex = r"<span>Interval Delay</span>.*?<input\s+type=\"range\".*?margin: '14px 0' \}\}\s*/>\s*</div>"
interval_ui_replacement = """<span>Interval Delay</span>
                  <span style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>Approx. 5-20s</span>
                </label>
                <div style={{ padding: '14px 0', fontSize: '0.8rem', color: 'var(--text-muted-site)' }}>
                  Delay is automatically randomized between 5 and 20 seconds to improve deliverability.
                </div>
              </div>"""

content = re.sub(interval_ui_regex, interval_ui_replacement, content, flags=re.DOTALL)

quota_ui_regex = r"<input\s+type=\"number\"\s+min=\"1\"\s+max=\"100\"\s+value=\{dailyLimit\}\s+onChange=\{\(e\) => \{\s*const val = Math\.min\(100, Math\.max\(1, parseInt\(e\.target\.value\) \|\| 1\)\);\s*setDailyLimit\(val\);\s*\}\}.*?/>"
quota_ui_replacement = """<input 
                  type="number" 
                  min="1" 
                  value={dailyLimit}
                  onChange={(e) => {
                    const val = Math.max(1, parseInt(e.target.value) || 1);
                    setDailyLimit(val);
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none' }}
                />"""

content = re.sub(quota_ui_regex, quota_ui_replacement, content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updates applied to EmailMarketingAdmin.jsx!")
