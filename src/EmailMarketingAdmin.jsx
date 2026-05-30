import React, { useState, useEffect, useMemo, useRef } from 'react';
import { db } from './firebase';
import { 
  collection, query, orderBy, onSnapshot, getDocs, addDoc, updateDoc, doc, where, serverTimestamp, deleteDoc, arrayUnion 
} from 'firebase/firestore';
import { 
  Mail, Send, History, BarChart3, Users, CheckCircle2, AlertCircle, Trash2, 
  Play, Pause, Square, UserPlus, ChevronRight, ChevronLeft, Plus, Search, X, Globe, 
  RefreshCcw, FileText, Check, Settings, Clock, ArrowRight, MousePointerClick, 
  ExternalLink, Eye, AlertTriangle, Calendar
} from 'lucide-react';
import { trackEvent } from './analytics';

const EmailMarketingAdmin = ({ globalProducts = [] }) => {
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const savedCampaigns = campaigns.filter(c => c.isPaused);
  const historyCampaigns = campaigns.filter(c => !c.isPaused);
    const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('compose'); // compose | import | history | clicks

  // Compose Campaign State
  const [campaignName, setCampaignName] = useState('');
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [designStyle, setDesignStyle] = useState('professional'); // professional | modern | midnight | minimalist
  const [themeColor, setThemeColor] = useState('#0084ff'); // default Clinical Blue
  const [allEvents, setAllEvents] = useState([]);
  const [filterOpener, setFilterOpener] = useState('all'); // all | openers | non-openers
  const [blacklistText, setBlacklistText] = useState('');
  const [blacklistSuccessMsg, setBlacklistSuccessMsg] = useState('');
  const [isBlacklisting, setIsBlacklisting] = useState(false);
  const [senderName, setSenderName] = useState('EternoFit Wellness');
  const [filterSex, setFilterSex] = useState('all'); // all | male | female
  const [filterGoal, setFilterGoal] = useState('all'); // all | Muscle & Physique | Anti-aging & Vitality | Skin & Beauty | Brain & Focus | Intimate Performance
  const [filterLeadType, setFilterLeadType] = useState('all'); // all | quiz | cold
  const [dailyLimit, setDailyLimit] = useState(500); // default 500 emails/day quota limit
  const [emailsSentToday, setEmailsSentToday] = useState(0);
  
  // Campaigns Archive (History) Filters & Pagination States
  const [historySearch, setHistorySearch] = useState('');
  const [historyStartDate, setHistoryStartDate] = useState('');
  const [historyEndDate, setHistoryEndDate] = useState('');
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
  const [historyItemsPerPage, setHistoryItemsPerPage] = useState(10);

  // Traceable Clicks Feed Filters & Pagination States
  const [clicksSearch, setClicksSearch] = useState('');
  const [clicksStartDate, setClicksStartDate] = useState('');
  const [clicksEndDate, setClicksEndDate] = useState('');
  const [clicksCurrentPage, setClicksCurrentPage] = useState(1);
  const [clicksItemsPerPage, setClicksItemsPerPage] = useState(10);
  
  // Reset pages when filters change
  useEffect(() => {
    setHistoryCurrentPage(1);
  }, [historySearch, historyStartDate, historyEndDate, historyItemsPerPage]);

  useEffect(() => {
    setClicksCurrentPage(1);
  }, [clicksSearch, clicksStartDate, clicksEndDate, clicksItemsPerPage]);
  
  const [customPresets, setCustomPresets] = useState([]);
  const [presetNameInput, setPresetNameInput] = useState('');
  const [savingPreset, setSavingPreset] = useState(false);
  
  // Cold Leads Inline Editor States
  const [editingColdLeadId, setEditingColdLeadId] = useState(null);
  const [editColdLeadEmail, setEditColdLeadEmail] = useState('');
  const [editColdLeadName, setEditColdLeadName] = useState('');
  const [coldLeadsSearch, setColdLeadsSearch] = useState('');
  const [coldLeadsCurrentPage, setColdLeadsCurrentPage] = useState(1);
  const [coldLeadsItemsPerPage, setColdLeadsItemsPerPage] = useState(10);
  
  // Reset cold leads page when search changes
  useEffect(() => {
    setColdLeadsCurrentPage(1);
  }, [coldLeadsSearch, coldLeadsItemsPerPage]);



  // Importer State
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccessMsg, setImportSuccessMsg] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Dispatch Queue Runner State
  const [queueModalOpen, setQueueModalOpen] = useState(false);
  const [queueRecipients, setQueueRecipients] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [queueStatus, setQueueStatus] = useState('idle'); // idle | dispatching | paused | completed | cancelled
  const [queueSuccessCount, setQueueSuccessCount] = useState(0);
  const [queueErrorCount, setQueueErrorCount] = useState(0);
  const [queueLog, setQueueLog] = useState([]);
  
  const timerRef = useRef(null);
  const logEndRef = useRef(null);

  // Fetch all leads/subscribers, campaigns and click events
  useEffect(() => {
    setLoading(true);
    
    // 1. Fetch subscribers (submissions that haven't unsubscribed)
    const unsubSubscribers = onSnapshot(
      query(collection(db, 'submissions'), orderBy('timestamp', 'desc')), 
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().timestamp) || new Date()
        }));
        setSubscribers(list);
      },
      (error) => console.error("Error fetching subscribers:", error)
    );

    // 2. Fetch campaign runs
    const unsubCampaigns = onSnapshot(
      query(collection(db, 'marketing_campaigns'), orderBy('sentAt', 'desc')),
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          sentAt: doc.data().sentAt?.toDate?.() || new Date(doc.data().sentAt) || new Date()
        }));
        setCampaigns(list);
      },
      (error) => console.error("Error fetching campaigns:", error)
    );

    // 3. Fetch affiliate clicks and opens from email
    const unsubClicks = onSnapshot(
      query(collection(db, 'analytics_events'), where('event', 'in', ['email_affiliate_clicked', 'email_opened'])),
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate?.() || new Date()
        })).sort((a, b) => b.timestamp - a.timestamp);
        
        setAllEvents(list);
        setClicks(list.filter(item => item.event === 'email_affiliate_clicked'));
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching clicks/opens:", error);
        setLoading(false);
      }
    );

        // 4. Fetch custom copy presets
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

    return () => {
      unsubSubscribers();
      unsubCampaigns();
      unsubClicks();
      unsubPresets();
    };
  }, []);

  // Scroll queue logs to bottom
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [queueLog]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Parse pasted cold leads
  const parsedColdLeads = useMemo(() => {
    if (!importText.trim()) return [];
    const lines = importText.split('\n');
    const leads = [];
    
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      const parts = trimmed.split(',');
      const email = parts[0]?.trim();
      const name = parts[1]?.trim() || '';
      
      // Basic email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(email);
      
      leads.push({
        lineNum: idx + 1,
        raw: trimmed,
        email,
        name: name || 'Subscriber',
        isValid
      });
    });
    
    return leads;
  }, [importText]);

  // Execute Cold Leads Import
  const handleImportLeads = async () => {
    const validLeads = parsedColdLeads.filter(l => l.isValid);
    if (validLeads.length === 0) {
      setImportError("No valid email addresses found to import.");
      return;
    }

    setIsImporting(true);
    setImportError('');
    setImportSuccessMsg('');

    try {
      let importedCount = 0;
      let duplicateCount = 0;

      // Check duplicates first
      const existingEmails = new Set(subscribers.map(s => s.email.toLowerCase()));

      for (const lead of validLeads) {
        const emailLower = lead.email.toLowerCase();
        if (existingEmails.has(emailLower)) {
          duplicateCount++;
          continue;
        }

        // Add lead as a submission document designated as cold
        await addDoc(collection(db, 'submissions'), {
          email: lead.email,
          answers: {
            name: lead.name,
            gender: 'Other',
            primaryGoal: ['General Health'],
            specificFocus: 'General Health'
          },
          isColdLead: true,
          status: 'Received',
          timestamp: new Date().toISOString()
        });

        // Add locally to prevent quick duplicate uploads during batch loops
        existingEmails.add(emailLower);
        importedCount++;
      }

      setImportSuccessMsg(`Import complete! Successfully added ${importedCount} new cold leads.${duplicateCount > 0 ? ` (${duplicateCount} duplicate email addresses skipped).` : ''}`);
      setImportText('');
    } catch (e) {
      setImportError("Database error during import: " + e.message);
    } finally {
      setIsImporting(false);
    }
  };

  // Compute who has opened a campaign before
  const openerEmails = useMemo(() => {
    const opens = allEvents.filter(e => e.event === 'email_opened');
    return new Set(opens.map(o => o.recipient?.toLowerCase()).filter(Boolean));
  }, [allEvents]);

  // Filter subscribers list for targeting
  const targetedSubscribers = useMemo(() => {
    return subscribers.filter(s => {
      // 1. Unsubscribed / Bounced / Blacklisted check
      if (s.unsubscribed || s.bounced || s.blacklisted || s.status === 'Bounced' || s.status === 'Blacklisted') return false;

      // 2. Lead Type filter
      if (filterLeadType === 'quiz' && s.isColdLead) return false;
      if (filterLeadType === 'cold' && !s.isColdLead) return false;

      // 3. Gender filter
      if (filterSex !== 'all') {
        const gender = s.answers?.gender || 'Other';
        if (filterSex === 'male' && gender !== 'Male') return false;
        if (filterSex === 'female' && gender !== 'Female') return false;
      }

      // 4. Goals filter
      if (filterGoal !== 'all') {
        const goals = s.answers?.primaryGoal || [];
        if (!goals.includes(filterGoal)) return false;
      }

      // 5. Openers segment filter
      const emailLower = s.email.toLowerCase();
      if (filterOpener === 'openers' && !openerEmails.has(emailLower)) return false;
      if (filterOpener === 'non-openers' && openerEmails.has(emailLower)) return false;

      // 6. Already received check (duplicate-send protection)
      if (campaignName && s.receivedCampaigns && s.receivedCampaigns.includes(campaignName)) return false;

      return true;
    });
  }, [subscribers, filterLeadType, filterSex, filterGoal, filterOpener, openerEmails, campaignName]);

  // Statistics Computations
  const stats = useMemo(() => {
    const totalSubscribers = subscribers.filter(s => !s.unsubscribed).length;
    const quizSubscribers = subscribers.filter(s => !s.unsubscribed && !s.isColdLead).length;
    const coldSubscribers = subscribers.filter(s => !s.unsubscribed && s.isColdLead).length;
    const unsubscribedCount = subscribers.filter(s => s.unsubscribed).length;
    const campaignsCount = campaigns.length;
    
    // Clicks CTR
    const totalClicksCount = clicks.length;
    const totalCampaignSentCount = campaigns.reduce((sum, c) => sum + (c.sentCount || 0), 0);
    const averageCTR = totalCampaignSentCount > 0 
      ? ((totalClicksCount / totalCampaignSentCount) * 100).toFixed(1)
      : '0.0';

    return {
      totalSubscribers,
      quizSubscribers,
      coldSubscribers,
      unsubscribedCount,
      campaignsCount,
      totalClicksCount,
      averageCTR
    };
  }, [subscribers, campaigns, clicks]);

  // Filter Campaigns Archive by search and date range
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(camp => {
      // 1. Text Search (Campaign Name or Subject)
      if (historySearch.trim()) {
        const query = historySearch.toLowerCase();
        const nameMatch = camp.name?.toLowerCase().includes(query);
        const subjectMatch = camp.subject?.toLowerCase().includes(query);
        if (!nameMatch && !subjectMatch) return false;
      }
      
      // 2. Date Range Bounds Check
      if (historyStartDate) {
        const start = new Date(historyStartDate + 'T00:00:00');
        if (camp.sentAt < start) return false;
      }
      if (historyEndDate) {
        const end = new Date(historyEndDate + 'T23:59:59');
        if (camp.sentAt > end) return false;
      }
      
      return true;
    });
  }, [campaigns, historySearch, historyStartDate, historyEndDate]);

  // Paginated Campaigns
  const paginatedCampaigns = useMemo(() => {
    const startIndex = (historyCurrentPage - 1) * historyItemsPerPage;
    return filteredCampaigns.slice(startIndex, startIndex + historyItemsPerPage);
  }, [filteredCampaigns, historyCurrentPage, historyItemsPerPage]);

  const historyTotalPages = Math.ceil(filteredCampaigns.length / historyItemsPerPage) || 1;

  // Filter Clicks Feed by search and date range
  const filteredClicks = useMemo(() => {
    return clicks.filter(clk => {
      // 1. Text Search (Recipient Email, Product, Campaign Name, Location, IP)
      if (clicksSearch.trim()) {
        const query = clicksSearch.toLowerCase();
        const emailMatch = clk.recipient?.toLowerCase().includes(query);
        const productMatch = clk.product?.toLowerCase().includes(query);
        const campaignMatch = clk.campaign?.toLowerCase().includes(query);
        const locationMatch = clk.location?.toLowerCase().includes(query);
        const ipMatch = clk.ip?.toLowerCase().includes(query);
        if (!emailMatch && !productMatch && !campaignMatch && !locationMatch && !ipMatch) return false;
      }
      
      // 2. Date Range Bounds Check
      if (clicksStartDate) {
        const start = new Date(clicksStartDate + 'T00:00:00');
        if (clk.timestamp < start) return false;
      }
      if (clicksEndDate) {
        const end = new Date(clicksEndDate + 'T23:59:59');
        if (clk.timestamp > end) return false;
      }
      
      return true;
    });
  }, [clicks, clicksSearch, clicksStartDate, clicksEndDate]);

  // Paginated Clicks Feed
  const paginatedClicks = useMemo(() => {
    const startIndex = (clicksCurrentPage - 1) * clicksItemsPerPage;
    return filteredClicks.slice(startIndex, startIndex + clicksItemsPerPage);
  }, [filteredClicks, clicksCurrentPage, clicksItemsPerPage]);

  const clicksTotalPages = Math.ceil(filteredClicks.length / clicksItemsPerPage) || 1;

  // Filter imported Cold Leads by search query
  const filteredColdLeads = useMemo(() => {
    const list = subscribers.filter(s => s.isColdLead);
    if (!coldLeadsSearch.trim()) return list;
    const query = coldLeadsSearch.toLowerCase();
    return list.filter(lead => {
      const emailMatch = lead.email?.toLowerCase().includes(query);
      const nameMatch = lead.answers?.name?.toLowerCase().includes(query);
      return emailMatch || nameMatch;
    });
  }, [subscribers, coldLeadsSearch]);

  // Paginated imported Cold Leads
  const paginatedColdLeads = useMemo(() => {
    const startIndex = (coldLeadsCurrentPage - 1) * coldLeadsItemsPerPage;
    return filteredColdLeads.slice(startIndex, startIndex + coldLeadsItemsPerPage);
  }, [filteredColdLeads, coldLeadsCurrentPage, coldLeadsItemsPerPage]);

  const coldLeadsTotalPages = Math.ceil(filteredColdLeads.length / coldLeadsItemsPerPage) || 1;

  // Insert helper tags into email body
  const insertPlaceholder = (tag) => {
    setEmailBody(prev => prev + tag);
  };

  // Compile individual email template dynamically (personalization replacement)
  const compileEmailContent = (recipient, rawBody, isHtml = true) => {
    if (!recipient) return rawBody;
    
    const name = recipient.answers?.name || 'Subscriber';
    const email = recipient.email;
    const goals = recipient.answers?.primaryGoal ? recipient.answers.primaryGoal.join(' & ') : 'General Health';
    
    // Health score mock evaluation
    let healthScoreStr = 'N/A';
    if (recipient.answers) {
      // Basic client-side score algorithm matches app
      let totalPoints = 0;
      let maxPoints = 0;
      const evalScore = (val, thres) => {
        if (!val) return;
        maxPoints += 15;
        totalPoints += thres[val] || 0;
      };
      evalScore(recipient.answers.sleepQuality, { 'Deep & Restful': 15, 'Occasionally Restless': 10, 'Often Waking Up': 5, 'Poor': 0 });
      evalScore(recipient.answers.tiredness, { 'Rarely, I have consistent energy': 15, 'Sometimes, usually in the afternoon': 8, 'Often, I feel drained': 4, 'Constantly, I struggle to stay awake': 0 });
      const score = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 72;
      healthScoreStr = `${score}/100`;
    }

    // 1. Replace base text variables
    let compiledBody = rawBody;
    const quizLink = 'https://www.eternofit.com/quiz';
    let compiled = compiledBody
      .replace(/{{name}}/g, name)
      .replace(/{{email}}/g, email)
      .replace(/{{goals}}/g, goals)
      .replace(/{{healthScore}}/g, healthScoreStr)
      .replace(/{{quizLink}}/g, quizLink);

    // 2. Replace {{product_box:ProductName}} with customized HTML blocks
    const productBoxRegex = /{{product_box:([^}]+)}}/g;
    compiled = compiled.replace(productBoxRegex, (match, prodName) => {
      const prod = globalProducts.find(p => p.name.toLowerCase() === prodName.trim().toLowerCase());
      if (!prod) return `<div style="padding:1rem; border:1px dashed #ef4444; color:#ef4444; margin:1rem 0;">Product [${prodName}] not found in inventory</div>`;
      
      const affiliateLink = prod.affiliateLink || '#';
      
      if (!isHtml) {
        return `\n=== RECOMMENDED PRODUCT: ${prod.name} ===\n${prod.description}\nLink: ${affiliateLink}\n`;
      }

      return `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#f8fafc; border-radius:14px; border:1px solid #e2e8f0; margin:20px 0; overflow:hidden;">
        <tr>
          <td style="padding:24px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td valign="top" style="padding-right:16px;">
                  <img src="${prod.image.startsWith('http') ? prod.image : window.location.origin + '/' + (prod.image.startsWith('/') ? prod.image.substring(1) : prod.image)}" alt="${prod.name}" width="80" height="80" style="width:80px; height:80px; border-radius:8px; border:1px solid #cbd5e1; background:#ffffff; object-fit:contain; display:block;">
                </td>
                <td valign="top">
                  <h4 style="margin:0 0 4px 0; font-size:16px; font-weight:700; color:#1e293b;">${prod.name}</h4>
                  <p style="margin:0 0 10px 0; font-size:13px; font-weight:600; color:${themeColor};">✓ Expert Clinical Recommendation</p>
                  <p style="margin:0; font-size:13px; color:#475569; line-height:1.5;">${prod.description}</p>
                </td>
              </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-top:16px;">
              <tr>
                <td style="background:#ffffff; border-radius:8px; padding:12px; border:1px solid #e2e8f0; border-left:3px solid ${themeColor};">
                  <p style="margin:0 0 2px; font-size:12px; font-weight:700; color:#1e293b;">Clinical Rationale:</p>
                  <p style="margin:0; font-size:12px; color:#64748b; line-height:1.4;">${prod.rationale || `Recommended to support active health goals and restore optimal recovery mechanisms.`}</p>
                </td>
              </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-top:16px;">
              <tr>
                <td align="center">
                  <a href="${affiliateLink}" target="_blank" style="display:inline-block; background:${themeColor}; color:#ffffff; padding:10px 24px; border-radius:8px; text-decoration:none; font-weight:700; font-size:13px; box-shadow:0 3px 8px rgba(0,132,255,0.2);">Claim Discount & Shop Now &rarr;</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      `;
    });

    // 3. Scan and rewrite any inline client redirect links like `/click?product=ProductName` to fully personalized links
    const clientLinkRegex = /href=["'](?:https?:\/\/[^\/]+)?\/click\?product=([^"']+)["']/g;
    compiled = compiled.replace(clientLinkRegex, (match, prodName) => {
      const prod = globalProducts.find(p => p.name.toLowerCase() === prodName.trim().toLowerCase());
      if (prod) {
        const affiliateLink = prod.affiliateLink || '#';
        return `href="${affiliateLink}"`;
      }
      return match;
    });

    return compiled;
  };

  // Compile complete HTML Layout (Professional, Modern, Midnight, Minimalist templates)
  const getCompiledTemplateHtml = (recipient, compiledBody) => {
    if (!recipient) return compiledBody;
    const name = recipient.answers?.name || 'Subscriber';
    const email = recipient.email;
    const baseUrl = window.location.origin + '/';
    
    // Append server-side invisible open tracking pixel
    const openTrackingPixel = `<img src="${baseUrl}api/track-open?email=${encodeURIComponent(email)}&campaign=${encodeURIComponent(campaignName || 'Direct Campaign')}" width="1" height="1" style="display:none; width:1px; height:1px; border:none; pointer-events:none;" />`;

    if (designStyle === 'blank') {
      const html = `<!DOCTYPE html>
      <html>
      <body style="margin:0; padding:20px; font-family:Helvetica,Arial,sans-serif; background-color:#ffffff; color:#1e293b; line-height:1.6;">
        ${compiledBody}
      </body>
      </html>`;
      return html.replace('</body>', `${openTrackingPixel}</body>`);
    }

    if (designStyle === 'minimalist') {
      // Direct minimalist template
      const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family:Helvetica,Arial,sans-serif; padding:40px 20px; line-height:1.7; color:#1e293b; background:#ffffff;">
        <div style="max-width:600px; margin:0 auto;" id="letter-content">
          ${compiledBody}
          <hr style="border:none; border-top:1px solid #e2e8f0; margin:32px 0;" />
          <p style="font-size:14px; color:#475569; margin-top:20px;">
            Best regards,<br>
            <strong>The ${senderName} Team</strong><br>
            Clinical Wellness Division
          </p>
          <p style="font-size:11px; color:#94a3b8; margin-top:48px; text-align:center; border-top:1px solid #f1f5f9; padding-top:16px;">
            You received this update because you are subscribed to EternoFit. 
            <a href="${baseUrl}unsubscribe" style="color:${themeColor}; text-decoration:underline;">Unsubscribe</a>
          </p>
        </div>
      </body>
      </html>`;
      return html.replace('</div>\n      </body>', `${openTrackingPixel}</div>\n      </body>`).replace('</div>', `${openTrackingPixel}</div>`);
    }

    if (designStyle === 'modern') {
      // Modern Glassmorphic / Vibrant layout
      const html = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { margin:0 !important; padding:0 !important; background-color:#f8fafc; font-family:Helvetica,Arial,sans-serif; }
          .wrapper { background-color:#f8fafc; padding:50px 16px; }
          .container { background:#ffffff; border-radius:24px; overflow:hidden; border:none; box-shadow:0 20px 40px rgba(0,0,0,0.04); max-width:600px; margin:0 auto; border-top:6px solid ${themeColor}; }
          .header { background:#ffffff; padding:40px 32px 24px; text-align:center; }
          .logo { width:68px; height:68px; border-radius:50%; display:block; margin:0 auto 16px; background:#0b0f19; object-fit:contain; border:3px solid ${themeColor}; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
          .banner-title { margin:0; font-size:26px; font-weight:800; color:#0f172a; line-height:1.2; letter-spacing:-0.5px; }
          .content { padding:16px 40px 32px; font-size:15px; color:#334155; line-height:1.75; }
          .footer { background:#f8fafc; padding:32px 40px; text-align:center; border-top:1px solid #f1f5f9; font-size:12px; color:#94a3b8; }
          .footer a { color:#64748b; text-decoration:underline; margin:0 8px; }
          a.action-btn { display:inline-block; background:${themeColor}; color:#ffffff; padding:12px 28px; border-radius:10px; text-decoration:none; font-weight:700; font-size:14px; box-shadow:0 4px 12px rgba(0,132,255,0.2); }
        </style>
      </head>
      <body>
        <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
          <tr>
            <td align="center">
              <table class="container" width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td class="header">
                    <img src="${baseUrl}Eterno%20Fit%20Logo%20Design.png" alt="EternoFit" class="logo">
                    <h1 class="banner-title">${senderName}</h1>
                    <p style="margin:8px 0 0 0; font-size:14px; color:#64748b; font-weight:500;">Attaining Peak Performance & Longevity</p>
                  </td>
                </tr>
                <tr>
                  <td class="content">
                    ${compiledBody}
                  </td>
                </tr>
                <tr>
                  <td class="footer">
                    <p style="margin:0 0 6px 0; font-weight:700; color:#475569; font-size:13px;">${senderName} Wellness</p>
                    <p style="margin:0 0 16px 0; line-height:1.5;">This email was sent exclusively to ${email}. We strictly support your clinical privacy regulations.</p>
                    <p style="margin:0 0 20px 0;">
                      <a href="${baseUrl}support">Clinical Support</a> | 
                      <a href="${baseUrl}#privacy">Privacy Policy</a>
                    </p>
                    <p style="margin:0 0 8px 0;">© 2026 EternoFit Wellness. All rights reserved.</p>
                    <a href="${baseUrl}unsubscribe" style="color:${themeColor}; text-decoration:underline; font-weight:600;">Unsubscribe from list</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`;
      return html.replace('</body>', `${openTrackingPixel}</body>`);
    }

    if (designStyle === 'midnight') {
      // Midnight Dark Mode template
      const html = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { margin:0 !important; padding:0 !important; background-color:#090d16; font-family:Helvetica,Arial,sans-serif; }
          .wrapper { background-color:#090d16; padding:50px 16px; }
          .container { background:#0f172a; border-radius:24px; overflow:hidden; border:1px solid #1e293b; box-shadow:0 25px 60px rgba(0,0,0,0.4); max-width:600px; margin:0 auto; }
          .header { background:#0b0f19; padding:40px 32px; text-align:center; border-bottom:1px solid #1e293b; }
          .logo { width:64px; height:64px; border-radius:50%; display:block; margin:0 auto 16px; background:#000000; object-fit:contain; border:2px solid ${themeColor}; box-shadow: 0 0 20px rgba(0,255,102,0.15); }
          .banner-title { margin:0; font-size:24px; font-weight:800; color:#ffffff; line-height:1.2; letter-spacing:-0.5px; }
          .content { padding:32px 40px; font-size:15px; color:#cbd5e1; line-height:1.75; }
          .footer { background:#0b0f19; padding:32px 40px; text-align:center; border-top:1px solid #1e293b; font-size:12px; color:#64748b; }
          .footer a { color:#94a3b8; text-decoration:underline; margin:0 8px; }
          a.action-btn { display:inline-block; background:${themeColor}; color:#000000; padding:12px 28px; border-radius:10px; text-decoration:none; font-weight:800; font-size:14px; box-shadow:0 0 20px rgba(0,255,102,0.25); }
        </style>
      </head>
      <body>
        <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
          <tr>
            <td align="center">
              <table class="container" width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td class="header">
                    <img src="${baseUrl}Eterno%20Fit%20Logo%20Design.png" alt="EternoFit" class="logo">
                    <h1 class="banner-title">${senderName}</h1>
                    <p style="margin:8px 0 0 0; font-size:13px; color:#94a3b8; font-weight:500;">Attaining Peak Performance & Longevity</p>
                  </td>
                </tr>
                <tr>
                  <td class="content">
                    ${compiledBody}
                  </td>
                </tr>
                <tr>
                  <td class="footer">
                    <p style="margin:0 0 6px 0; font-weight:700; color:#94a3b8; font-size:13px;">${senderName} Wellness</p>
                    <p style="margin:0 0 16px 0; line-height:1.5;">This email was sent exclusively to ${email}. We strictly support your clinical privacy regulations.</p>
                    <p style="margin:0 0 20px 0;">
                      <a href="${baseUrl}support">Clinical Support</a> | 
                      <a href="${baseUrl}#privacy">Privacy Policy</a>
                    </p>
                    <p style="margin:0 0 8px 0;">© 2026 EternoFit Wellness. All rights reserved.</p>
                    <a href="${baseUrl}unsubscribe" style="color:${themeColor}; text-decoration:underline; font-weight:700;">Unsubscribe from list</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`;
      return html.replace('</body>', `${openTrackingPixel}</body>`);
    }

    // Gorgeous premium clinical newsletter template (Professional)
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { margin:0 !important; padding:0 !important; background-color:#f1f5f9; font-family:Helvetica,Arial,sans-serif; }
        .wrapper { background-color:#f1f5f9; padding:40px 16px; }
        .container { background:#ffffff; border-radius:20px; overflow:hidden; border:1px solid #e2e8f0; box-shadow:0 8px 30px rgba(0,0,0,0.05); max-width:600px; margin:0 auto; }
        .header { background:#ffffff; padding:32px; text-align:center; border-bottom:4px solid ${themeColor}; }
        .logo { width:64px; height:64px; border-radius:50%; display:block; margin:0 auto 12px; background:#000000; object-fit:contain; border:2px solid #00ff66; }
        .banner-title { margin:0; font-size:24px; font-weight:700; color:#1e293b; line-height:1.2; }
        .content { padding:32px 32px 24px; font-size:15px; color:#1e293b; line-height:1.7; }
        .footer { background:#f8fafc; padding:32px; text-align:center; border-top:1px solid #e2e8f0; font-size:12px; color:#94a3b8; }
        .footer a { color:#94a3b8; text-decoration:underline; margin:0 8px; }
        a.action-btn { display:inline-block; background:${themeColor}; color:#ffffff; padding:12px 28px; border-radius:10px; text-decoration:none; font-weight:700; font-size:14px; box-shadow:0 4px 12px rgba(0,132,255,0.2); }
      </style>
    </head>
    <body>
      <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
        <tr>
          <td align="center">
            <table class="container" width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td class="header">
                  <img src="${baseUrl}Eterno%20Fit%20Logo%20Design.png" alt="EternoFit" class="logo">
                  <h1 class="banner-title">${senderName} Updates</h1>
                  <p style="margin:6px 0 0 0; font-size:13px; color:#64748b;">Attainment of Peak Performance & Lifespan Support</p>
                </td>
              </tr>
              <tr>
                <td class="content">
                  ${compiledBody}
                </td>
              </tr>
              <tr>
                <td class="footer">
                  <p style="margin:0 0 6px 0; font-weight:600; color:#64748b; font-size:13px;">${senderName} Wellness</p>
                  <p style="margin:0 0 16px 0; line-height:1.5;">This email was sent exclusively to ${email}. We strictly support your clinical privacy regulations.</p>
                  <p style="margin:0 0 20px 0;">
                    <a href="${baseUrl}support">Clinical Support</a> | 
                    <a href="${baseUrl}#privacy">Privacy Policy</a>
                  </p>
                  <p style="margin:0 0 8px 0;">© 2026 EternoFit Wellness. All rights reserved.</p>
                  <a href="${baseUrl}unsubscribe" style="color:${themeColor}; text-decoration:underline;">Unsubscribe from list</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>`;
    return html.replace('</body>', `${openTrackingPixel}</body>`);
  };

  // Compile sample preview HTML for the preview iframe
  const samplePreviewHtml = useMemo(() => {
    // Compile using fallback mock data
    const recipient = {
      email: 'preview@example.com',
      answers: { name: 'John Doe', gender: 'Male', primaryGoal: ['Muscle & Physique'] }
    };

    const compiledBody = compileEmailContent(recipient, emailBody || '<p style="color:#94a3b8; text-align:center;">Email body is empty. Compose content inside the editor to view preview.</p>', true);
    return getCompiledTemplateHtml(recipient, compiledBody);
  }, [emailBody, designStyle, themeColor, senderName, campaignName]);

  // Save current configurations as a custom preset (Firestore + LocalStorage Hybrid)
  const handleSaveCustomPreset = async (e) => {
    if (e) e.preventDefault();
    if (!presetNameInput.trim()) {
      alert("Please enter a name for your custom preset.");
      return;
    }
    if (!emailBody.trim()) {
      alert("Email body cannot be empty when saving a preset.");
      return;
    }

    const newPreset = {
      name: presetNameInput.trim(),
      campaignName: campaignName || presetNameInput.trim(),
      subject: subject || '',
      body: emailBody || '',
      templateStyle: designStyle || 'professional',
      themeColor: themeColor || '#0084ff',
      senderName: senderName || 'EternoFit Wellness',
      createdAt: new Date().toISOString()
    };

    setSavingPreset(true);

    try {
      await addDoc(collection(db, 'marketing_presets'), {
        ...newPreset,
        createdAt: serverTimestamp()
      });
      alert(`Preset "${presetNameInput.trim()}" saved successfully to Cloud database!`);
      setPresetNameInput('');
    } catch (err) {
      console.error("Firestore preset save failed:", err);
      alert("Error saving custom preset to Cloud: " + err.message + "\nMake sure your Firestore security rules are configured to allow writing to 'marketing_presets'.");
    } finally {
      setSavingPreset(false);
    }
  };

  // Delete custom preset from Firestore
  const handleDeleteCustomPreset = async (presetId, presetName) => {
    if (presetId && window.confirm(`Are you sure you want to permanently delete custom preset "${presetName}"?`)) {
      try {
        await deleteDoc(doc(db, 'marketing_presets', presetId));
        alert("Preset deleted successfully.");
      } catch (err) {
        console.error("Failed to delete preset", err);
        alert("Failed to delete preset from Cloud: " + err.message);
      }
    }
  };

  // Load campaign copy presets (system and custom)
  const handleLoadPreset = (presetType) => {
    if (!presetType) return;

    // Check custom presets first
    const custom = customPresets.find(p => p.id === presetType);
    if (custom) {
      if (campaignName.trim() || subject.trim() || emailBody.trim()) {
        if (!window.confirm(`Loading custom preset "${custom.name}" will overwrite your current configurations. Do you want to proceed?`)) {
          return;
        }
      }
      setCampaignName(custom.campaignName || '');
      setSubject(custom.subject || '');
      setEmailBody(custom.body || '');
      setDesignStyle(custom.templateStyle || 'professional');
      setThemeColor(custom.themeColor || '#0084ff');
      setSenderName(custom.senderName || 'EternoFit Wellness');
      return;
    }
    
    if (campaignName.trim() || subject.trim() || emailBody.trim()) {
      if (!window.confirm("Loading a preset will overwrite your current subject, body, campaign name, and styles. Do you want to proceed?")) {
        return;
      }
    }

    const dateStr = new Date().toLocaleDateString([], { month: 'short', day: 'numeric' });

    if (presetType === 'quiz_invite') {
      setCampaignName(`Quiz Invitation - ${dateStr}`);
      setSubject(`Hi {{name}}, discover your personalized Vitality Score 🩺`);
      setEmailBody(`<p>Hi {{name}},</p>

<p>At EternoFit Wellness, we believe that understanding your body's unique biomarker trends is the absolute first step toward unlocking peak physical performance, metabolic longevity, and daily recovery.</p>

<p>We've designed the state-of-the-art <strong>EternoFit Health & Vitality Quiz</strong> to evaluate your wellness baseline (including sleep resilience, energy recovery levels, and targeted goals) in under 3 minutes.</p>

<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin: 30px 0;">
  <tr>
    <td align="center">
      <a href="{{quizLink}}" class="action-btn">Start Your Vitality Quiz &rarr;</a>
    </td>
  </tr>
</table>

<p>Upon completion of the quiz, our system will generate a detailed <strong>Clinical Vitality Report</strong> tailored to your unique parameters (e.g., to support your target of <em>{{goals}}</em>).</p>

<p>Your privacy is fully protected under our clinical data protection standards. It is completely free and takes only a few minutes.</p>

<p>To your ultimate wellness,<br>
<strong>The EternoFit Clinical Team</strong></p>`);
      setDesignStyle('professional');
      setThemeColor('#0084ff');
    } else if (presetType === 'product_promo') {
      setCampaignName(`Product Promo - ${dateStr}`);
      setSubject(`Exclusive Clinical Recommendation: Support {{goals}} with Science 🔬`);
      setEmailBody(`<p>Hi {{name}},</p>

<p>We are writing to share a vetted clinical recommendation tailored specifically to your active fitness and longevity objectives: <strong>{{goals}}</strong>.</p>

<p>After analyzing biomarker data and metabolic profiles, our medical board has selected a premier product in our active inventory that has shown exceptional clinical efficacy for your specific needs.</p>

{{product_box:Testosil}}

<p>Testosil utilizes patented clinical extracts to bolster peak performance, stimulate lean recovery, and promote vitality under physical stress.</p>

<p>Click the link inside the recommendation block above or use the button below to secure an exclusive clinical discount of up to 40% off your supply.</p>

<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin: 30px 0;">
  <tr>
    <td align="center">
      <a href="/click?product=Testosil" class="action-btn">Claim Vetted Discount Now &rarr;</a>
    </td>
  </tr>
</table>

<p>Every batch is manufactured in cGMP certified environments and third-party laboratory tested for purity.</p>

<p>Wishing you consistent progress,<br>
<strong>EternoFit Clinical Wellness</strong></p>`);
      setDesignStyle('modern');
      setThemeColor('#10b981');
    } else if (presetType === 'newsletter_tips') {
      setCampaignName(`Newsletter - ${dateStr}`);
      setSubject(`3 Medical Secrets to Unlock Cellular Energy (Clinical Guide) 💡`);
      setEmailBody(`<p>Hi {{name}},</p>

<p>Maintaining high energy levels through the afternoon isn't just about caffeine—it is about cellular mitochondria and optimizing recovery cycles.</p>

<p>Today, our clinical board outlines 3 critical practices to boost your vitality index:</p>

<h3>1. Respect Your Circadian Phase</h3>
<p>Ensure light exposure within 30 minutes of waking to anchor cortisol cycles. This is the single highest leverage habit for overnight sleep quality.</p>

<h3>2. Micronutrient Supplementation</h3>
<p>Target active cellular optimization with high-grade micronutrient complexes. When addressing goals like <strong>{{goals}}</strong>, ensuring structural mineral replenishment is crucial.</p>

<h3>3. Periodic Baseline Evaluations</h3>
<p>Your biomarkers are constantly shifting. We recommend updating your metabolic profile quarterly by taking our quick assessment tool.</p>

<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin: 30px 0;">
  <tr>
    <td align="center">
      <a href="{{quizLink}}" class="action-btn">Re-Evaluate Your Health Score &rarr;</a>
    </td>
  </tr>
</table>

<p>Keep training hard and prioritizing recovery!</p>

<p>To your health,<br>
<strong>EternoFit Medical Board</strong></p>`);
      setDesignStyle('professional');
      setThemeColor('#8b5cf6');
    } else if (presetType === 'blank') {
      setCampaignName(`Campaign - ${dateStr}`);
      setSubject('');
      setEmailBody('');
      setDesignStyle('blank');
      setThemeColor('#0084ff');
    }
  };

  // Restore/unblock contact from blacklist/unsubscribed/bounce status
  const handleRestoreLead = async (leadId) => {
    if (window.confirm("Are you sure you want to restore this contact? They will be eligible for future marketing campaigns.")) {
      try {
        await updateDoc(doc(db, 'submissions', leadId), {
          blacklisted: false,
          bounced: false,
          unsubscribed: false,
          status: 'Received'
        });
      } catch (e) {
        alert("Error restoring lead: " + e.message);
      }
    }
  };

  // Cold Leads Editor Helpers
  const handleStartEditColdLead = (lead) => {
    setEditingColdLeadId(lead.id);
    setEditColdLeadEmail(lead.email || '');
    setEditColdLeadName(lead.answers?.name || '');
  };

  const handleCancelEditColdLead = () => {
    setEditingColdLeadId(null);
    setEditColdLeadEmail('');
    setEditColdLeadName('');
  };

  const handleSaveEditColdLead = async (lead) => {
    if (!editColdLeadEmail.trim()) {
      alert("Email cannot be empty.");
      return;
    }
    try {
      await updateDoc(doc(db, 'submissions', lead.id), {
        email: editColdLeadEmail.trim(),
        answers: {
          ...lead.answers,
          name: editColdLeadName.trim()
        }
      });
      setEditingColdLeadId(null);
    } catch (e) {
      alert("Error saving changes: " + e.message);
    }
  };

  const handleDeleteColdLead = async (leadId) => {
    if (window.confirm("Are you sure you want to permanently delete this cold lead from the database? This cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'submissions', leadId));
      } catch (e) {
        alert("Error deleting cold lead: " + e.message);
      }
    }
  };

  // Get current time in US Eastern Time Zone
  const getUSEasternTime = () => {
    const etString = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
    return new Date(etString);
  };

  // Check if current time is within US morning hours (9:00 AM - 9:00 PM Eastern Time)
  const isUSMorningHours = () => {
    const etDate = getUSEasternTime();
    const hours = etDate.getHours();
    return hours >= 9 && hours < 21; // 9:00 AM to 9:00 PM
  };

  // Calculate millisecond delay until next US Morning (9:00 AM Eastern Time)
  const getMsUntilUSMorning = () => {
    const etNow = getUSEasternTime();
    const etTarget = new Date(etNow);
    
    if (etNow.getHours() >= 21) {
      // Late evening or night. Target is tomorrow at 9:00 AM ET.
      etTarget.setDate(etNow.getDate() + 1);
      etTarget.setHours(9, 0, 0, 0);
    } else if (etNow.getHours() < 9) {
      // Early morning today. Target is today at 9:00 AM ET.
      etTarget.setHours(9, 0, 0, 0);
    } else {
      // We are already inside the 9AM - 9PM ET window!
      return 0;
    }
    
    // Calculate the difference in milliseconds
    const diffMs = etTarget.getTime() - etNow.getTime();
    return diffMs;
  };

  // Campaign Dispatch Runner logic
  const handleLaunchCampaign = () => {
    if (!campaignName.trim()) {
      alert("⚠️ Please enter a Campaign Name for analytics tracking.");
      return;
    }
    if (!subject.trim()) {
      alert("⚠️ Please provide a Subject Line.");
      return;
    }
    if (!emailBody.trim()) {
      alert("⚠️ Email body cannot be blank.");
      return;
    }
    if (targetedSubscribers.length === 0) {
      alert("⚠️ Selected audience size is 0. Check filters.");
      return;
    }

    if (!window.confirm(`Proceed to dispatch "${campaignName}" campaign to ${targetedSubscribers.length} subscribers with a random 10-20 second delay between emails?`)) {
      return;
    }

    // Initialize Dispatch Queue
    setEmailsSentToday(0);
    
    // Shuffle recipients to send randomly, not in sequence
    const shuffledSubscribers = [...targetedSubscribers].sort(() => Math.random() - 0.5);
    setQueueRecipients(shuffledSubscribers);
    setQueueIndex(0);
    setQueueSuccessCount(0);
    setQueueErrorCount(0);
    setQueueStatus('dispatching');
    setQueueLog([
      `[INFO] Starting dispatch of campaign: "${campaignName}"`,
      `[INFO] Target count: ${targetedSubscribers.length} subscribers`,
      `[INFO] Set Interval delay: 10-20 seconds (randomized)`,
      `[INFO] ----------------------------------------------------`
    ]);
    setQueueModalOpen(true);
  };

  const handleSendTestEmail = async () => {
    if (!testEmailAddress.trim() || !testEmailAddress.includes('@')) {
      alert("⚠️ Please enter a valid test email address.");
      return;
    }
    if (!subject.trim()) {
      alert("⚠️ Please provide a Subject Line for the test.");
      return;
    }
    if (!emailBody.trim()) {
      alert("⚠️ Email body cannot be blank for the test.");
      return;
    }

    setIsSendingTestEmail(true);

    try {
      // Mock recipient for compilation
      const mockRecipient = {
        email: testEmailAddress,
        id: 'test-user-id',
        answers: { name: 'Test User' }
      };

      const compiledBody = compileEmailContent(mockRecipient, emailBody, true);
      const fullHtml = getCompiledTemplateHtml(mockRecipient, compiledBody);
      
      const response = await fetch('/api/send-marketing-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testEmailAddress,
          subject: subject.replace(/{{name}}/g, 'Test User'),
          html: fullHtml,
          text: `Hello Test User,\n\nPlease read our personalized clinical update by visiting the web platform.`,
          fromName: senderName
        })
      });

      if (response.ok) {
        alert(`✅ Test email successfully sent to ${testEmailAddress}`);
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(`❌ Failed to send test email: ${errData.error || response.statusText}`);
      }
    } catch (err) {
      alert(`❌ Error sending test email: ${err.message}`);
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  // Async dispatch runner loop
  useEffect(() => {
    if (queueStatus !== 'dispatching') return;

    if (queueIndex >= queueRecipients.length) {
      // Completed Queue!
      setQueueStatus('completed');
      setQueueLog(prev => [...prev, `[SUCCESS] Queue completed! ${queueSuccessCount} sent successfully. ${queueErrorCount} failed.`]);
      
      // Save campaign stats to Firestore
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
      }).catch(e => console.error("Error saving campaign run log:", e));
      
      // Trigger analytics
      trackEvent('marketing_campaign_sent', { name: campaignName, count: queueSuccessCount });
      return;
    }

    // 1. Enforce US Morning timeframe bounds (9:00 AM - 9:00 PM Eastern Time)
    const msUntilUSMorning = getMsUntilUSMorning();
    if (msUntilUSMorning > 0) {
      const hoursWait = (msUntilUSMorning / (1000 * 60 * 60)).toFixed(1);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setQueueLog(prev => [
        ...prev, 
        `[${timeStr}] [WAIT] Outside US Morning hours (9AM-9PM ET). Pausing dispatches.`,
        `[${timeStr}] [WAIT] Auto-resuming loop in ${hoursWait} hours (at 9:00 AM ET today/tomorrow)...`
      ]);
      
      timerRef.current = setTimeout(() => {
        setEmailsSentToday(0); // Reset quota for the new daily cycle
      }, msUntilUSMorning);
      
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }

    // 2. Enforce customizable daily sending quota (up to 100 emails max)
    if (emailsSentToday >= dailyLimit) {
      const etNow = getUSEasternTime();
      const etTomorrow = new Date(etNow);
      etTomorrow.setDate(etNow.getDate() + 1);
      etTomorrow.setHours(9, 0, 0, 0); // 9:00 AM ET tomorrow morning
      const msToNextDayMorning = etTomorrow.getTime() - etNow.getTime();
      
      const hoursWait = (msToNextDayMorning / (1000 * 60 * 60)).toFixed(1);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setQueueLog(prev => [
        ...prev,
        `[${timeStr}] [WAIT] Daily campaign send limit of ${dailyLimit} reached.`,
        `[${timeStr}] [WAIT] Auto-resuming next batch tomorrow in ${hoursWait} hours (at 9:00 AM ET)...`
      ]);
      
      timerRef.current = setTimeout(() => {
        setEmailsSentToday(0); // Reset daily session sent count
      }, msToNextDayMorning);
      
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }

    const runDispatchStep = async () => {
      const recipient = queueRecipients[queueIndex];
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      setQueueLog(prev => [...prev, `[${timeStr}] [${queueIndex + 1}/${queueRecipients.length}] Sending to ${recipient.email}...`]);

      try {
        const compiledBody = compileEmailContent(recipient, emailBody, true);
        const fullHtml = getCompiledTemplateHtml(recipient, compiledBody);
        
        // Dispatch via worker endpoint
        const response = await fetch('/api/send-marketing-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: recipient.email,
            subject: subject.replace(/{{name}}/g, recipient.answers?.name || 'Subscriber'),
            html: fullHtml,
            text: `Hello ${recipient.answers?.name || 'Subscriber'},\n\nPlease read our personalized clinical update by visiting the web platform.`,
            fromName: senderName
          })
        });

        if (response.ok) {
          setQueueSuccessCount(c => c + 1);
          setEmailsSentToday(c => c + 1);

          // Log receivedCampaign in Firestore to prevent double dispatches
          try {
            const recipientRef = doc(db, 'submissions', recipient.id);
            await updateDoc(recipientRef, {
              receivedCampaigns: arrayUnion(campaignName)
            });
          } catch (dbErr) {
            console.error("Failed to log receivedCampaign in Firestore:", dbErr);
          }

          setQueueLog(prev => {
            const copy = [...prev];
            copy[copy.length - 1] += " SUCCESS";
            return copy;
          });
        } else {
          const errData = await response.json().catch(() => ({}));
          setQueueErrorCount(c => c + 1);
          setQueueLog(prev => {
            const copy = [...prev];
            copy[copy.length - 1] += ` FAILED (${errData.error || response.statusText})`;
            return copy;
          });
        }
      } catch (err) {
        setQueueErrorCount(c => c + 1);
        setQueueLog(prev => {
          const copy = [...prev];
          copy[copy.length - 1] += ` FAILED (Error: ${err.message})`;
          return copy;
        });
      }

      // Schedule next dispatch step after custom delay
      setQueueIndex(idx => idx + 1);
    };

    const delay = Math.floor(Math.random() * (20 - 10 + 1) + 10) * 1000;
    timerRef.current = setTimeout(runDispatchStep, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [queueStatus, queueIndex, emailsSentToday, dailyLimit]);

  // Handle manual queue controls
  const handlePauseQueue = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setQueueStatus('paused');
    setQueueLog(prev => [...prev, `[PAUSED] Queue sending suspended by administrator.`]);
  };

  const handleResumeQueue = () => {
    setQueueStatus('dispatching');
    setQueueLog(prev => [...prev, `[RESUMING] Queue sending resumed...`]);
  };

    const handleStopAndSaveQueue = async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setQueueStatus('cancelled');
    setQueueLog(prev => [...prev, `[STOPPED] Queue suspended. Saving progress to database...`]);
    
    try {
      await addDoc(collection(db, 'marketing_campaigns'), {
        isPaused: true,
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
        sentAt: serverTimestamp(),
        savedAt: serverTimestamp()
      });
      alert('Campaign stopped and progress saved successfully. You can resume it later from the Campaigns Archive.');
      setQueueModalOpen(false);
    } catch (e) {
      console.error("Error saving campaign progress:", e);
      alert("Failed to save progress: " + e.message);
    }
  };

  // Unique campaign clicks aggregator helper
  const getCampaignClicks = (campName) => {
    const list = clicks.filter(c => c.campaign === campName);
    return {
      total: list.length,
      unique: new Set(list.map(c => c.recipient.toLowerCase())).size
    };
  };

  const handleResumeSavedCampaign = async (savedCamp) => {
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
      await deleteDoc(doc(db, 'marketing_campaigns', savedCamp.id));
    } catch (e) {
      console.error("Failed to delete resumed campaign from DB", e);
    }
  };

  const handleDeleteSavedCampaign = async (id) => {
    if (window.confirm("Permanently delete this paused campaign? You will lose its progress and won't be able to resume it.")) {
      try {
        await deleteDoc(doc(db, 'marketing_campaigns', id));
      } catch (e) {
        alert("Failed to delete: " + e.message);
      }
    }
  };

  // paste blacklist logic helper
  const handleBlacklistLeads = async () => {
    if (!blacklistText.trim()) return;
    const lines = blacklistText.split('\n');
    const emailsToBlacklist = lines.map(l => l.trim().toLowerCase()).filter(Boolean);
    if (emailsToBlacklist.length === 0) return;

    setIsBlacklisting(true);
    setBlacklistSuccessMsg('');

    try {
      let count = 0;
      for (const rawEmail of emailsToBlacklist) {
        const q = query(collection(db, 'submissions'), where('email', '==', rawEmail));
        const snap = await getDocs(q);
        if (!snap.empty) {
          for (const d of snap.docs) {
            await updateDoc(doc(db, 'submissions', d.id), {
              blacklisted: true,
              status: 'Blacklisted'
            });
          }
        } else {
          await addDoc(collection(db, 'submissions'), {
            email: rawEmail,
            blacklisted: true,
            status: 'Blacklisted',
            answers: { name: 'Blacklisted Lead', gender: 'Other', primaryGoal: ['General Health'] },
            timestamp: new Date().toISOString()
          });
        }
        count++;
      }
      setBlacklistSuccessMsg(`Successfully blacklisted ${count} email addresses.`);
      setBlacklistText('');
    } catch (e) {
      alert("Blacklist error: " + e.message);
    } finally {
      setIsBlacklisting(false);
    }
  };

  const handleDeleteClick = async (clickId) => {
    if (window.confirm("Are you sure you want to permanently delete this traceable click log?")) {
      try {
        await deleteDoc(doc(db, 'analytics_events', clickId));
      } catch (e) {
        alert("Error deleting click log: " + e.message);
      }
    }
  };

  const handleClearAllClicks = async () => {
    if (window.confirm("Are you sure you want to permanently delete ALL traceable click logs from Firestore? This cannot be undone.")) {
      try {
        const q = query(collection(db, 'analytics_events'), where('event', '==', 'email_affiliate_clicked'));
        const snap = await getDocs(q);
        await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
        alert("All click logs cleared successfully.");
      } catch (e) {
        alert("Error clearing click logs: " + e.message);
      }
    }
  };

  const handleResetOpenersData = async () => {
    if (window.confirm("Are you sure you want to permanently delete all email open history tracking from Firestore? This will reset all emails to non-openers. This cannot be undone.")) {
      try {
        const q = query(collection(db, 'analytics_events'), where('event', '==', 'email_opened'));
        const snap = await getDocs(q);
        await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
        alert("All email open history has been cleared successfully. All contacts are now non-openers.");
      } catch (e) {
        alert("Error resetting openers data: " + e.message);
      }
    }
  };

  return (
    <div className="email-marketing-admin-container fade-enter" style={{ color: 'var(--text-main-site)' }}>
      
      {/* Visual KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Subscribers List', value: stats.totalSubscribers, desc: `${stats.quizSubscribers} Quiz | ${stats.coldSubscribers} Cold`, color: 'var(--primary)', icon: <Users size={18} /> },
          { label: 'Campaigns Ran', value: stats.campaignsCount, desc: 'Logged Campaign Runs', color: '#10b981', icon: <History size={18} /> },
          { label: 'Traceable Clicks', value: stats.totalClicksCount, desc: 'Affiliate Clicks Recorded', color: '#f59e0b', icon: <MousePointerClick size={18} /> },
          { label: 'Average CTR', value: `${stats.averageCTR}%`, desc: 'Click-Through Performance', color: '#8b5cf6', icon: <BarChart3 size={18} /> },
          { label: 'Unsubscribed Leads', value: stats.unsubscribedCount, desc: 'Compliant Opt-Outs', color: '#ef4444', icon: <AlertCircle size={18} /> }
        ].map((item, idx) => (
          <div key={idx} style={{
            background: 'var(--bg-surface)',
            borderRadius: '14px',
            padding: '1.25rem',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: item.color }}>
              {item.icon}
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>{item.label}</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', margin: '4px 0 2px' }}>{item.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted-site)' }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Sub-tab Navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', gap: '1.5rem', marginBottom: '2rem', overflowX: 'auto' }}>
        {[
          { id: 'compose', label: 'Compose Newsletter', icon: <Send size={16} /> },
          { id: 'import', label: 'Import Cold Leads', icon: <UserPlus size={16} /> },
          { id: 'history', label: 'Campaigns Archive', icon: <FileText size={16} /> },
          { id: 'clicks', label: 'Traceable Clicks Feed', icon: <MousePointerClick size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 8px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeSubTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeSubTab === tab.id ? 'var(--primary)' : 'var(--text-muted-site)',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB CONTENTS */}

      {/* 1. COMPOSE & PREVIEW CAMPAIGN */}
      {activeSubTab === 'compose' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'stretch' }}>
          
          {/* Left Hand: Compose Panel */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
              <Settings size={20} color="var(--primary)" /> Configure Campaign
            </h3>

            {/* Campaign Presets */}
            <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Campaign Copy Preset</label>
                <select 
                  onChange={(e) => handleLoadPreset(e.target.value)}
                  defaultValue=""
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="">-- Load a Predefined or Custom Copy Preset --</option>
                  <optgroup label="System Copy Presets">
                    <option value="blank">Blank Custom Template (Start From Scratch)</option>
                    <option value="quiz_invite">EternoFit Quiz Invitation (High Converting)</option>
                    <option value="product_promo">Product Showcase Pitch (Affiliate Pitch)</option>
                    <option value="newsletter_tips">General Wellness & Longevity Newsletter</option>
                  </optgroup>
                  {customPresets.length > 0 && (
                    <optgroup label="My Custom Saved Presets">
                      {customPresets.map(preset => (
                        <option key={preset.id} value={preset.id}>{preset.name}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              {/* Form to Save Current Layout as Preset */}
              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="text"
                  placeholder="Save current settings as new custom preset..."
                  value={presetNameInput}
                  onChange={(e) => setPresetNameInput(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', outline: 'none' }}
                />
                <button
                  type="button"
                  onClick={handleSaveCustomPreset}
                  disabled={savingPreset || !presetNameInput.trim()}
                  className="btn-primary"
                  style={{ width: 'auto', padding: '8px 16px', fontSize: '0.8rem', color: '#000', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  {savingPreset ? 'Saving...' : 'Save Preset'}
                </button>
              </div>

              {/* Quick list of custom presets with delete actions if any exist */}
              {customPresets.length > 0 && (
                <div style={{ fontSize: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted-site)', fontWeight: '700' }}>Custom Presets:</span>
                  {customPresets.map(preset => (
                    <span key={preset.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      {preset.name}
                      <button 
                        type="button"
                        onClick={() => handleDeleteCustomPreset(preset.id, preset.name)}
                        title={`Delete ${preset.name}`}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Row: Filter Audience */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'flex-end', minHeight: '34px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Lead Database</label>
                <select 
                  value={filterLeadType}
                  onChange={(e) => setFilterLeadType(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none' }}
                >
                  <option value="all">All (Leads + Cold)</option>
                  <option value="quiz">Quiz Leads Only</option>
                  <option value="cold">Cold Leads Only</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'flex', alignItems: 'flex-end', minHeight: '34px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Filter Sex</label>
                <select 
                  value={filterSex}
                  onChange={(e) => setFilterSex(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none' }}
                >
                  <option value="all">Any Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'flex-end', minHeight: '34px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Filter Health Goal</label>
                <select 
                  value={filterGoal}
                  onChange={(e) => setFilterGoal(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none' }}
                >
                  <option value="all">Any Goal</option>
                  <option value="Intimate Performance">Intimate Performance</option>
                  <option value="Muscle & Physique">Muscle & Physique</option>
                  <option value="Anti-aging & Vitality">Anti-aging & Vitality</option>
                  <option value="Skin & Beauty">Skin & Beauty</option>
                  <option value="Brain & Focus">Brain & Focus</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', minHeight: '34px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  <span>Openers Segment</span>
                  <button 
                    type="button"
                    onClick={handleResetOpenersData}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.7rem', fontWeight: '800', textDecoration: 'underline', textTransform: 'none', padding: 0 }}
                    title="Clear all email open history tracking from Firestore"
                  >
                    Reset Openers Data
                  </button>
                </label>
                <select 
                  value={filterOpener}
                  onChange={(e) => setFilterOpener(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none' }}
                >
                  <option value="all">All Active Contacts</option>
                  <option value="openers">Openers Only</option>
                  <option value="non-openers">Non-Openers Only</option>
                </select>
              </div>
            </div>

            {/* Campaign Metrics Notification */}
            <div style={{ background: 'rgba(0, 255, 102, 0.05)', border: '1px solid rgba(0, 255, 102, 0.2)', padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted-site)', fontWeight: '600' }}>🎯 Selected target audience size:</span>
              <strong style={{ color: 'var(--primary)', fontSize: '1rem', fontFamily: 'monospace' }}>{targetedSubscribers.length} Subscribers</strong>
            </div>

            {/* Sender, Template, Interval and Daily Limit Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'flex-end', minHeight: '34px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Sender Display Name</label>
                <input 
                  type="text" 
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="EternoFit Wellness"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'flex-end', minHeight: '34px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Design Template Style</label>
                <select 
                  value={designStyle}
                  onChange={(e) => setDesignStyle(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none' }}
                >
                  <option value="professional">Professional (Clinical)</option>
                  <option value="modern">Modern (Vibrant Slate)</option>
                  <option value="midnight">Midnight (Neon Dark Mode)</option>
                  <option value="minimalist">Minimalist (Direct Letter)</option>
                  <option value="blank">Raw Blank (No Header/Footer)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', minHeight: '34px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  <span>Interval Delay</span>
                  <span style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>Approx. 10-20s</span>
                </label>
                <div style={{ padding: '14px 0', fontSize: '0.8rem', color: 'var(--text-muted-site)' }}>
                  Delay is automatically randomized between 10 and 20 seconds to improve deliverability.
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', minHeight: '34px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  <span>Daily Quota</span>
                  <span style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>{dailyLimit}/day</span>
                </label>
                <input 
                  type="number" 
                  min="1" 
                  value={dailyLimit}
                  onChange={(e) => {
                    const val = Math.max(1, parseInt(e.target.value) || 1);
                    setDailyLimit(val);
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none' }}
                />
              </div>
            </div>

            {/* Brand Theme Color Selector Row */}
            {designStyle !== 'minimalist' && designStyle !== 'blank' && (
              <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase' }}>Brand Primary Color Accent</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  {/* Hex Color Input */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="color" 
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      style={{ border: 'none', background: 'transparent', width: '32px', height: '32px', cursor: 'pointer', padding: 0 }}
                    />
                    <input 
                      type="text" 
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      placeholder="#0084ff"
                      style={{ width: '90px', padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', outline: 'none', fontFamily: 'monospace' }}
                    />
                  </div>
                  
                  {/* Quick Dots Selection */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '12px' }}>
                    {[
                      { name: 'Blue', hex: '#0084ff' },
                      { name: 'Green', hex: '#10b981' },
                      { name: 'Purple', hex: '#8b5cf6' },
                      { name: 'Amber', hex: '#f59e0b' },
                      { name: 'Rose', hex: '#ec4899' },
                      { name: 'Slate', hex: '#64748b' }
                    ].map((col) => (
                      <button
                        key={col.hex}
                        type="button"
                        onClick={() => setThemeColor(col.hex)}
                        title={col.name}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: col.hex,
                          border: themeColor.toLowerCase() === col.hex.toLowerCase() ? '2px solid #fff' : '2px solid transparent',
                          boxShadow: themeColor.toLowerCase() === col.hex.toLowerCase() ? `0 0 10px ${col.hex}` : 'none',
                          cursor: 'pointer',
                          padding: 0,
                          transition: 'all 0.2s ease'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Campaign Name & Subject Line */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Campaign Identifier (Analytics)</label>
                <input 
                  type="text" 
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. May Hormone Newsletter"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Subject Line</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Hi {{name}}, custom wellness evaluation"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none' }}
                />
              </div>
            </div>

            {/* Toolbar for personalization placeholders and product links insertion */}
            <div style={{ display: 'flex', flexFlow: 'wrap', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted-site)', alignSelf: 'center', marginRight: '4px' }}>Insert placeholders:</span>
              
              {[
                { label: 'Recipient Name', tag: '{{name}}' },
                { label: 'Recipient Email', tag: '{{email}}' },
                { label: 'Recipient Goals', tag: '{{goals}}' },
                { label: 'Health Score', tag: '{{healthScore}}' },
                { label: 'Quiz Link', tag: '{{quizLink}}' }
              ].map((ph, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => insertPlaceholder(ph.tag)}
                  style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                  {ph.label}
                </button>
              ))}

              {/* Product Insertion Dropdowns */}
              <div style={{ display: 'flex', gap: '6px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '8px', marginLeft: '4px' }}>
                <select
                  id="toolbar-product-select"
                  style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', outline: 'none' }}
                >
                  <option value="">-- Choose Product --</option>
                  {globalProducts.filter(p => p.status !== 'inactive').map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    const sel = document.getElementById('toolbar-product-select').value;
                    if (sel) insertPlaceholder(`{{product_box:${sel}}}`);
                  }}
                  style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', background: 'var(--primary)', color: '#000', border: 'none', cursor: 'pointer' }}
                >
                  + Insert Showcase Box
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const sel = document.getElementById('toolbar-product-select').value;
                    if (sel) insertPlaceholder(`<a href="/click?product=${sel}" style="color:#0084ff; text-decoration:underline; font-weight:700;">Get ${sel} at Discount</a>`);
                  }}
                  style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(0, 255, 102, 0.1)', color: 'var(--primary)', border: '1px solid rgba(0, 255, 102, 0.2)', cursor: 'pointer' }}
                >
                  + Insert Traceable Link
                </button>
              </div>
            </div>

            {/* Editor Body */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Email Body (Supports Custom text, placeholders, HTML & showcases)</label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Write your email here... Use placeholders above to customize. For product showcases, use the toolbar helper."
                rows={12}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '0.95rem', outline: 'none', fontFamily: 'monospace', resize: 'vertical', lineHeight: '1.6' }}
              />
            </div>

            {/* Launch Campaign */}
            <button
              onClick={handleLaunchCampaign}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '1.15rem',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '0.5rem'
              }}
            >
              <Send size={18} /> Launch Custom Campaign <ChevronRight size={18} />
            </button>

            <hr style={{ borderColor: 'var(--border-subtle)', margin: '1rem 0', borderStyle: 'dashed' }} />

            {/* Test Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase' }}>Send Test Email</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="email"
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  placeholder="admin@example.com"
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    background: 'rgba(0,0,0,0.1)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleSendTestEmail}
                  disabled={isSendingTestEmail}
                  style={{
                    padding: '0 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: isSendingTestEmail ? '#555' : 'var(--bg-surface-elevated)',
                    color: '#fff',
                    cursor: isSendingTestEmail ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {isSendingTestEmail ? 'Sending...' : 'Send Test'}
                </button>
              </div>
            </div>

          </div>

          {/* Right Hand: Side-by-side Visual Preview Frame */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            
            {/* Preview Frame */}
            <div style={{ 
              background: '#fff', 
              borderRadius: '16px', 
              border: '4px solid var(--bg-surface)', 
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              height: '100%', 
              minHeight: '640px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ background: '#f1f5f9', padding: '8px 16px', borderBottom: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={14} color="#64748b" />
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Campaign Template Preview</span>
              </div>
              <iframe
                title="Visual Previewer"
                srcDoc={samplePreviewHtml}
                style={{ width: '100%', height: 'calc(100% - 32px)', border: 'none', background: '#fff' }}
              />
            </div>

          </div>

        </div>
      )}

      {/* 2. COLD LEADS & BLACKLIST MANAGER PANEL */}
      {activeSubTab === 'import' && (<>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'stretch' }}>
          
          {/* Column 1: Cold Leads Importer */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
              <UserPlus size={20} color="var(--primary)" /> Import Cold Leads
            </h3>
            <p style={{ color: 'var(--text-muted-site)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              Directly insert high-volume cold contact lists. Format options:
              <br />
              • **Email only**: e.g. `john@example.com`
              <br />
              • **CSV pair**: `email,name` e.g. `john@example.com,John`
            </p>

            {importError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px 14px', borderRadius: '8px', color: '#ef4444', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={14} /> {importError}
              </div>
            )}

            {importSuccessMsg && (
              <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '10px 14px', borderRadius: '8px', color: '#10b981', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} /> {importSuccessMsg}
              </div>
            )}

            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="john@example.com,John&#10;mary@example.com,Mary&#10;steve@example.com"
              rows={6}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '0.85rem', outline: 'none', fontFamily: 'monospace', resize: 'vertical' }}
            />
            
            <button
              disabled={isImporting || parsedColdLeads.filter(l => l.isValid).length === 0}
              onClick={handleImportLeads}
              className="btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
            >
              {isImporting ? 'Processing Database Writes...' : `Import ${parsedColdLeads.filter(l => l.isValid).length} Valid Leads`}
            </button>

            {/* List Diagnostics Parser */}
            <div style={{ 
              border: '1px solid var(--border-subtle)', 
              background: 'rgba(0,0,0,0.1)', 
              borderRadius: '10px', 
              height: '140px', 
              overflowY: 'auto',
              padding: '10px',
              fontSize: '0.75rem'
            }}>
              {parsedColdLeads.length === 0 ? (
                <div style={{ color: 'var(--text-muted-site)', textAlign: 'center', padding: '1.5rem 0' }}>Diagnostics Parser Console</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted-site)' }}>
                      <th style={{ textAlign: 'left', paddingBottom: '4px' }}>Line</th>
                      <th style={{ textAlign: 'left', paddingBottom: '4px' }}>Email</th>
                      <th style={{ textAlign: 'center', paddingBottom: '4px' }}>Valid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedColdLeads.map((lead, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                        <td style={{ padding: '4px 0', fontFamily: 'monospace', color: 'var(--text-muted-site)' }}>{lead.lineNum}</td>
                        <td style={{ padding: '4px 0', fontWeight: '600', color: lead.isValid ? 'inherit' : '#ef4444' }}>{lead.email || '—'}</td>
                        <td style={{ padding: '4px 0', textAlign: 'center' }}>
                          {lead.isValid ? <CheckCircle2 size={10} color="#10b981" /> : <AlertTriangle size={10} color="#ef4444" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Column 2: Blacklist & Bounce List Manager */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
              <AlertTriangle size={20} color="#ef4444" /> Blacklist & Bounce Manager
            </h3>
            <p style={{ color: 'var(--text-muted-site)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              Instantly blacklist or bounce problematic emails (invalid contacts, spam traps, or bounces). Paste one email address per line. Blacklisted leads are strictly barred from receiving marketing runs.
            </p>

            {blacklistSuccessMsg && (
              <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '10px 14px', borderRadius: '8px', color: '#10b981', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} /> {blacklistSuccessMsg}
              </div>
            )}

            <textarea
              value={blacklistText}
              onChange={(e) => setBlacklistText(e.target.value)}
              placeholder="bounced-email@example.com&#10;spam-trap@domain.com"
              rows={6}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '0.85rem', outline: 'none', fontFamily: 'monospace', resize: 'vertical' }}
            />
            
            <button
              disabled={isBlacklisting || !blacklistText.trim()}
              onClick={handleBlacklistLeads}
              className="btn-secondary"
              style={{ width: '100%', padding: '10px', fontSize: '0.9rem', border: '1px solid #ef4444', color: '#ef4444' }}
            >
              {isBlacklisting ? 'Blacklisting in Database...' : 'Blacklist pasted Email addresses'}
            </button>

            {/* Blacklist stats card */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted-site)', fontWeight: '600' }}>🛡️ Total Compliantly Blocked Contacts:</span>
              <strong style={{ color: '#ef4444', fontFamily: 'monospace', fontSize: '1rem' }}>
                {subscribers.filter(s => s.blacklisted || s.bounced || s.status === 'Blacklisted' || s.status === 'Bounced').length} leads
              </strong>
            </div>
          </div>

        </div>

        {/* Imported Cold Leads Database Manager */}
        <div style={{ marginTop: '2rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
                <Users size={20} color="var(--primary)" /> Imported Cold Leads Database Directory
              </h3>
              <p style={{ color: 'var(--text-muted-site)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                Manage your imported cold contact records. You can search, edit, or permanently delete cold leads from your active targeting queue.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', fontFamily: 'monospace' }}>
                Active Cold: <strong>{filteredColdLeads.length}</strong> leads
              </span>
            </div>
          </div>

          {/* Search bar inside Cold Leads manager */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '1.25rem', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 250px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted-site)' }} />
                <input 
                  type="text"
                  value={coldLeadsSearch}
                  onChange={(e) => setColdLeadsSearch(e.target.value)}
                  placeholder="Search cold leads by email or name..."
                  style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div style={{ width: '110px' }}>
              <select 
                value={coldLeadsItemsPerPage}
                onChange={(e) => setColdLeadsItemsPerPage(Number(e.target.value))}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                <option value={10}>10 items</option>
                <option value={25}>25 items</option>
                <option value={50}>50 items</option>
              </select>
            </div>

            {coldLeadsSearch && (
              <button
                onClick={() => setColdLeadsSearch('')}
                style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', height: '40px' }}
              >
                <X size={14} /> Clear Search
              </button>
            )}
          </div>

          {filteredColdLeads.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted-site)', border: '1px dashed var(--border-subtle)', borderRadius: '12px' }}>
              No imported cold leads found in database. Paste them in Column 1 to upload list!
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted-site)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700' }}>Email Address</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700' }}>Name / Identifier</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '700', width: '180px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedColdLeads.map((sub) => {
                      const isEditing = editingColdLeadId === sub.id;
                      
                      return (
                        <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>
                          
                          {/* Email Column */}
                          <td style={{ padding: '12px 16px' }}>
                            {isEditing ? (
                              <input 
                                type="email"
                                value={editColdLeadEmail}
                                onChange={(e) => setEditColdLeadEmail(e.target.value)}
                                style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                              />
                            ) : (
                              <span style={{ fontWeight: '600', color: '#fff' }}>{sub.email}</span>
                            )}
                          </td>
                          
                          {/* Name Column */}
                          <td style={{ padding: '12px 16px' }}>
                            {isEditing ? (
                              <input 
                                type="text"
                                value={editColdLeadName}
                                onChange={(e) => setEditColdLeadName(e.target.value)}
                                style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                              />
                            ) : (
                              <span style={{ color: 'var(--text-muted-site)' }}>{sub.answers?.name || 'Subscriber'}</span>
                            )}
                          </td>

                          {/* Status Badge */}
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ 
                              padding: '3px 8px', 
                              borderRadius: '4px', 
                              fontSize: '0.75rem', 
                              fontWeight: '700',
                              background: sub.unsubscribed || sub.blacklisted || sub.bounced ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                              color: sub.unsubscribed || sub.blacklisted || sub.bounced ? '#ef4444' : '#10b981'
                            }}>
                              {sub.unsubscribed ? 'Unsubscribed' : (sub.blacklisted ? 'Blacklisted' : (sub.bounced ? 'Bounced' : 'Active Lead'))}
                            </span>
                          </td>

                          {/* Actions Column */}
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => handleSaveEditColdLead(sub)}
                                    style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={handleCancelEditColdLead}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleStartEditColdLead(sub)}
                                    style={{ background: 'rgba(0, 132, 255, 0.1)', border: '1px solid rgba(0, 132, 255, 0.3)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteColdLead(sub.id)}
                                    style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Numbered Pagination Selector Footer */}
              {filteredColdLeads.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.15)', borderRound: '0 0 12px 12px', marginTop: '1px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)' }}>
                    Showing <strong style={{ color: '#fff' }}>{(coldLeadsCurrentPage - 1) * coldLeadsItemsPerPage + 1}</strong> to <strong style={{ color: '#fff' }}>{Math.min(coldLeadsCurrentPage * coldLeadsItemsPerPage, filteredColdLeads.length)}</strong> of <strong style={{ color: '#fff' }}>{filteredColdLeads.length}</strong> cold leads
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      disabled={coldLeadsCurrentPage === 1}
                      onClick={() => setColdLeadsCurrentPage(p => Math.max(1, p - 1))}
                      style={{ padding: '6px 10px', borderRadius: '6px', background: coldLeadsCurrentPage === 1 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: coldLeadsCurrentPage === 1 ? 'var(--text-muted-site)' : '#fff', cursor: coldLeadsCurrentPage === 1 ? 'not-allowed' : 'pointer', outline: 'none' }}
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: coldLeadsTotalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === coldLeadsTotalPages || Math.abs(p - coldLeadsCurrentPage) <= 1)
                      .map((p, idx, arr) => {
                        const showEllipsisBefore = idx > 0 && p - arr[idx - 1] > 1;
                        return (
                          <React.Fragment key={p}>
                            {showEllipsisBefore && <span style={{ color: 'var(--text-muted-site)', padding: '0 4px' }}>...</span>}
                            <button
                              onClick={() => setColdLeadsCurrentPage(p)}
                              style={{ width: '32px', height: '32px', borderRadius: '6px', background: coldLeadsCurrentPage === p ? 'var(--primary)' : 'rgba(255,255,255,0.05)', border: coldLeadsCurrentPage === p ? 'none' : '1px solid var(--border-subtle)', color: coldLeadsCurrentPage === p ? '#000' : '#fff', fontWeight: '700', cursor: 'pointer', outline: 'none', fontSize: '0.85rem' }}
                            >
                              {p}
                            </button>
                          </React.Fragment>
                        );
                      })}

                    <button
                      disabled={coldLeadsCurrentPage === coldLeadsTotalPages}
                      onClick={() => setColdLeadsCurrentPage(p => Math.min(coldLeadsTotalPages, p + 1))}
                      style={{ padding: '6px 10px', borderRadius: '6px', background: coldLeadsCurrentPage === coldLeadsTotalPages ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: coldLeadsCurrentPage === coldLeadsTotalPages ? 'var(--text-muted-site)' : '#fff', cursor: coldLeadsCurrentPage === coldLeadsTotalPages ? 'not-allowed' : 'pointer', outline: 'none' }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Blocked Leads Directory */}
        <div style={{ marginTop: '2rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '2rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
            <AlertCircle size={20} color="#ef4444" /> Bounces, Unsubscribes & Blacklisted Directory
          </h3>
          <p style={{ color: 'var(--text-muted-site)', fontSize: '0.85rem', lineHeight: '1.5', margin: '0 0 1.5rem 0' }}>
            Below is a directory of contacts in your database who have unsubscribed, bounced, or been blacklisted. You can restore their marketing eligibility by clicking "Restore Contact".
          </p>
          
          {subscribers.filter(s => s.unsubscribed || s.bounced || s.blacklisted || s.status === 'Bounced' || s.status === 'Blacklisted').length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted-site)', border: '1px dashed var(--border-subtle)', borderRadius: '12px' }}>
              No contacts are currently blacklisted, bounced, or unsubscribed. Your list is 100% clean!
            </div>
          ) : (
            <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted-site)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700' }}>Email Address</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700' }}>Block Type</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700' }}>Lead Source</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '700' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.filter(s => s.unsubscribed || s.bounced || s.blacklisted || s.status === 'Bounced' || s.status === 'Blacklisted').map((sub) => {
                    let badgeColor = '#ef4444';
                    let badgeText = 'Blacklisted';
                    if (sub.unsubscribed) {
                      badgeColor = '#f59e0b';
                      badgeText = 'Unsubscribed';
                    } else if (sub.bounced || sub.status === 'Bounced') {
                      badgeColor = '#64748b';
                      badgeText = 'Bounced';
                    }
                    
                    return (
                      <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>
                        <td style={{ padding: '12px 16px', fontWeight: '600', color: '#fff' }}>{sub.email}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ 
                            padding: '4px 10px', 
                            borderRadius: '20px', 
                            fontSize: '0.75rem', 
                            fontWeight: '700',
                            background: `rgba(${badgeColor === '#ef4444' ? '239,68,68' : (badgeColor === '#f59e0b' ? '245,158,11' : '100,116,139')}, 0.1)`,
                            color: badgeColor
                          }}>
                            {badgeText}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-muted-site)' }}>
                          {sub.isColdLead ? 'Cold Lead Import' : 'Quiz Submission'}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleRestoreLead(sub.id)}
                            style={{
                              background: 'rgba(16, 185, 129, 0.1)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              color: '#10b981',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: '700',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'; }}
                          >
                            Restore Eligibility
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </>)}

      {/* 3. CAMPAIGNS HISTORICAL ARCHIVE */}
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

          <div className="admin-table-container">
          {/* Controls & Filter Header */}
          <div style={{ 
            background: 'rgba(0,0,0,0.2)', 
            padding: '1.5rem', 
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                <History size={18} color="var(--primary)" /> Campaigns Log History
              </h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', fontFamily: 'monospace' }}>
                Found: <strong>{filteredCampaigns.length}</strong> campaigns
              </span>
            </div>

            <div style={{ 
              display: 'flex',
              flexWrap: 'nowrap',
              gap: '12px',
              alignItems: 'flex-end',
              overflowX: 'auto',
              paddingBottom: '4px'
            }}>
              {/* Search input */}
              <div style={{ flex: '2 1 200px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Search Campaigns</label>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted-site)' }} />
                  <input 
                    type="text"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    placeholder="Search by campaign name or email subject..."
                    style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Date range start */}
              <div style={{ flex: '1 1 130px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>From Date</label>
                <input 
                  type="date"
                  value={historyStartDate}
                  onChange={(e) => setHistoryStartDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none', fontSize: '0.85rem', colorScheme: 'dark' }}
                />
              </div>

              {/* Date range end */}
              <div style={{ flex: '1 1 130px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>To Date</label>
                <input 
                  type="date"
                  value={historyEndDate}
                  onChange={(e) => setHistoryEndDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none', fontSize: '0.85rem', colorScheme: 'dark' }}
                />
              </div>

              {/* Items Per Page */}
              <div style={{ width: '110px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Per Page</label>
                <select 
                  value={historyItemsPerPage}
                  onChange={(e) => setHistoryItemsPerPage(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  <option value={10}>10 items</option>
                  <option value={25}>25 items</option>
                  <option value={50}>50 items</option>
                </select>
              </div>

              {/* Reset Filters */}
              {(historySearch || historyStartDate || historyEndDate) && (
                <button
                  onClick={() => {
                    setHistorySearch('');
                    setHistoryStartDate('');
                    setHistoryEndDate('');
                  }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    height: '40px',
                    transition: 'all 0.2s ease',
                    borderLeft: '2px solid #ef4444'
                  }}
                >
                  <X size={14} /> Clear Filters
                </button>
              )}
            </div>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Sent Date</th>
                <th>Campaign Name</th>
                <th>Subject</th>
                <th style={{ textAlign: 'center' }}>Recipients</th>
                <th style={{ textAlign: 'center' }}>Unique Clicks</th>
                <th style={{ textAlign: 'center' }}>Total Clicks</th>
                <th style={{ textAlign: 'center' }}>CTR %</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted-site)', fontSize: '0.95rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <AlertTriangle size={24} color="var(--text-muted-site)" />
                      <span>No campaigns found matching your current search or date range filters.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCampaigns.map((camp) => {
                  const clickStats = getCampaignClicks(camp.name);
                  const ctr = camp.sentCount > 0 
                    ? ((clickStats.total / camp.sentCount) * 100).toFixed(1)
                    : '0.0';
                  
                  return (
                    <tr key={camp.id}>
                      <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                        {camp.sentAt.toLocaleString()}
                      </td>
                      <td>
                        <strong style={{ color: 'var(--text-main-site)' }}>{camp.name}</strong>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)' }}>
                        {camp.subject}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: '700', fontFamily: 'monospace' }}>
                        {camp.sentCount}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: '700', color: '#3b82f6', fontFamily: 'monospace' }}>
                        {clickStats.unique}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: '700', color: 'var(--primary)', fontFamily: 'monospace' }}>
                        {clickStats.total}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '6px', 
                          background: parseFloat(ctr) > 10 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.2)',
                          color: parseFloat(ctr) > 10 ? '#10b981' : 'inherit',
                          fontWeight: '700',
                          fontFamily: 'monospace'
                        }}>
                          {ctr}%
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={async () => {
                            if (window.confirm("Permanently delete this campaign run log from archive? Clicks will be retained.")) {
                              await deleteDoc(doc(db, 'marketing_campaigns', camp.id));
                            }
                          }}
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination Footer */}
          {filteredCampaigns.length > 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '1.25rem 1.5rem', 
              borderTop: '1px solid var(--border-subtle)',
              background: 'rgba(0,0,0,0.15)',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)' }}>
                Showing <strong style={{ color: '#fff' }}>{(historyCurrentPage - 1) * historyItemsPerPage + 1}</strong> to <strong style={{ color: '#fff' }}>{Math.min(historyCurrentPage * historyItemsPerPage, filteredCampaigns.length)}</strong> of <strong style={{ color: '#fff' }}>{filteredCampaigns.length}</strong> campaigns
                {(historySearch || historyStartDate || historyEndDate) && <span style={{ color: 'var(--primary)' }}> (filtered)</span>}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  disabled={historyCurrentPage === 1}
                  onClick={() => setHistoryCurrentPage(p => Math.max(1, p - 1))}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: historyCurrentPage === 1 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: historyCurrentPage === 1 ? 'var(--text-muted-site)' : '#fff',
                    cursor: historyCurrentPage === 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: historyTotalPages }, (_, i) => i + 1)
                  .filter(p => {
                    return p === 1 || p === historyTotalPages || Math.abs(p - historyCurrentPage) <= 1;
                  })
                  .map((p, index, arr) => {
                    const showEllipsisBefore = index > 0 && p - arr[index - 1] > 1;
                    return (
                      <React.Fragment key={p}>
                        {showEllipsisBefore && <span style={{ color: 'var(--text-muted-site)', padding: '0 4px', fontSize: '0.8rem' }}>...</span>}
                        <button
                          onClick={() => setHistoryCurrentPage(p)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            background: historyCurrentPage === p ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            border: historyCurrentPage === p ? 'none' : '1px solid var(--border-subtle)',
                            color: historyCurrentPage === p ? '#000' : '#fff',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            outline: 'none',
                            fontSize: '0.85rem'
                          }}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}

                <button
                  disabled={historyCurrentPage === historyTotalPages}
                  onClick={() => setHistoryCurrentPage(p => Math.min(historyTotalPages, p + 1))}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: historyCurrentPage === historyTotalPages ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: historyCurrentPage === historyTotalPages ? 'var(--text-muted-site)' : '#fff',
                    cursor: historyCurrentPage === historyTotalPages ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
        </div>
      )}

      {/* 4. EMAIL CLICK ANALYTICS FEED */}
      {activeSubTab === 'clicks' && (
        <div className="admin-table-container">
          {/* Controls & Filter Header */}
          <div style={{ 
            background: 'rgba(0,0,0,0.2)', 
            padding: '1.5rem', 
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                <MousePointerClick size={18} color="var(--primary)" /> Real-Time Click Attribution Streams
              </h3>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted-site)', fontFamily: 'monospace' }}>
                  Found: <strong>{filteredClicks.length}</strong> clicks
                </span>
                <button
                  onClick={handleClearAllClicks}
                  className="btn-secondary"
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    border: '1px solid #ef4444',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    width: 'auto',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <Trash2 size={12} /> Clear Clicks Log
                </button>
              </div>
            </div>

            <div style={{ 
              display: 'flex',
              flexWrap: 'nowrap',
              gap: '12px',
              alignItems: 'flex-end',
              overflowX: 'auto',
              paddingBottom: '4px'
            }}>
              {/* Search input */}
              <div style={{ flex: '2 1 200px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Search Clicks</label>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted-site)' }} />
                  <input 
                    type="text"
                    value={clicksSearch}
                    onChange={(e) => setClicksSearch(e.target.value)}
                    placeholder="Search by email, product, campaign, IP, location..."
                    style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Date range start */}
              <div style={{ flex: '1 1 130px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>From Date</label>
                <input 
                  type="date"
                  value={clicksStartDate}
                  onChange={(e) => setClicksStartDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none', fontSize: '0.85rem', colorScheme: 'dark' }}
                />
              </div>

              {/* Date range end */}
              <div style={{ flex: '1 1 130px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>To Date</label>
                <input 
                  type="date"
                  value={clicksEndDate}
                  onChange={(e) => setClicksEndDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none', fontSize: '0.85rem', colorScheme: 'dark' }}
                />
              </div>

              {/* Items Per Page */}
              <div style={{ width: '110px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '6px' }}>Per Page</label>
                <select 
                  value={clicksItemsPerPage}
                  onChange={(e) => setClicksItemsPerPage(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)', outline: 'none', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  <option value={10}>10 items</option>
                  <option value={25}>25 items</option>
                  <option value={50}>50 items</option>
                </select>
              </div>

              {/* Reset Filters */}
              {(clicksSearch || clicksStartDate || clicksEndDate) && (
                <button
                  onClick={() => {
                    setClicksSearch('');
                    setClicksStartDate('');
                    setClicksEndDate('');
                  }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    height: '40px',
                    transition: 'all 0.2s ease',
                    borderLeft: '2px solid #ef4444'
                  }}
                >
                  <X size={14} /> Clear Filters
                </button>
              )}
            </div>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Recipient Email</th>
                <th>Campaign Source</th>
                <th>Product Link</th>
                <th>Location Details</th>
                <th>IP Address</th>
                <th>Merchant Target URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClicks.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted-site)', fontSize: '0.95rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <AlertTriangle size={24} color="var(--text-muted-site)" />
                      <span>No clickable analytics events found matching your criteria.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedClicks.map((clk) => (
                  <tr key={clk.id}>
                    <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      {clk.timestamp.toLocaleString()}
                    </td>
                    <td style={{ fontWeight: '600', color: 'var(--text-main-site)' }}>
                      {clk.recipient}
                    </td>
                    <td>
                      <span style={{ 
                        padding: '3px 8px', 
                        borderRadius: '4px', 
                        fontSize: '0.75rem', 
                        fontWeight: '700',
                        background: 'rgba(139, 92, 246, 0.1)',
                        color: '#8b5cf6',
                        textTransform: 'uppercase'
                      }}>
                        {clk.campaign || 'Direct Campaign'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: '700', color: 'var(--primary)' }}>
                        {clk.product}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Globe size={12} color="var(--accent-green)" /> {clk.location || 'Unknown'}
                      </div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {clk.ip || 'Unknown'}
                    </td>
                    <td style={{ fontSize: '0.75rem', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                      <a href={clk.destination} target="_blank" rel="noreferrer" style={{ color: '#0084ff', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        Redirect <ExternalLink size={10} />
                      </a>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteClick(clk.id)}
                        style={{
                          background: 'transparent',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#ef4444',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Footer */}
          {filteredClicks.length > 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '1.25rem 1.5rem', 
              borderTop: '1px solid var(--border-subtle)',
              background: 'rgba(0,0,0,0.15)',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted-site)' }}>
                Showing <strong style={{ color: '#fff' }}>{(clicksCurrentPage - 1) * clicksItemsPerPage + 1}</strong> to <strong style={{ color: '#fff' }}>{Math.min(clicksCurrentPage * clicksItemsPerPage, filteredClicks.length)}</strong> of <strong style={{ color: '#fff' }}>{filteredClicks.length}</strong> click logs
                {(clicksSearch || clicksStartDate || clicksEndDate) && <span style={{ color: 'var(--primary)' }}> (filtered)</span>}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  disabled={clicksCurrentPage === 1}
                  onClick={() => setClicksCurrentPage(p => Math.max(1, p - 1))}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: clicksCurrentPage === 1 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: clicksCurrentPage === 1 ? 'var(--text-muted-site)' : '#fff',
                    cursor: clicksCurrentPage === 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: clicksTotalPages }, (_, i) => i + 1)
                  .filter(p => {
                    return p === 1 || p === clicksTotalPages || Math.abs(p - clicksCurrentPage) <= 1;
                  })
                  .map((p, index, arr) => {
                    const showEllipsisBefore = index > 0 && p - arr[index - 1] > 1;
                    return (
                      <React.Fragment key={p}>
                        {showEllipsisBefore && <span style={{ color: 'var(--text-muted-site)', padding: '0 4px', fontSize: '0.8rem' }}>...</span>}
                        <button
                          onClick={() => setClicksCurrentPage(p)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            background: clicksCurrentPage === p ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            border: clicksCurrentPage === p ? 'none' : '1px solid var(--border-subtle)',
                            color: clicksCurrentPage === p ? '#000' : '#fff',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            outline: 'none',
                            fontSize: '0.85rem'
                          }}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}

                <button
                  disabled={clicksCurrentPage === clicksTotalPages}
                  onClick={() => setClicksCurrentPage(p => Math.min(clicksTotalPages, p + 1))}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: clicksCurrentPage === clicksTotalPages ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: clicksCurrentPage === clicksTotalPages ? 'var(--text-muted-site)' : '#fff',
                    cursor: clicksCurrentPage === clicksTotalPages ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DISPATCH INTERACTIVE QUEUE MODAL */}
      {queueModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '650px',
            boxShadow: '0 20px 50px rgba(0,255,102,0.1)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            
            {/* Modal Header */}
            <div style={{ 
              padding: '1.5rem 2rem', 
              borderBottom: '1px solid var(--border-subtle)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: 'rgba(0,0,0,0.2)'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color="var(--primary)" /> Custom Campaign Dispatch Queue
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted-site)' }}>
                  Campaign: <strong>{campaignName}</strong>
                </p>
              </div>
              
              {/* Close helper when finished or paused */}
              {(queueStatus === 'completed' || queueStatus === 'cancelled') && (
                <button
                  onClick={() => setQueueModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Modal Content */}
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Pulse status indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted-site)' }}>
                  Current Status:
                </span>
                
                <span style={{
                  padding: '5px 12px',
                  borderRadius: '30px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: queueStatus === 'dispatching' ? 'rgba(0, 255, 102, 0.1)' : (queueStatus === 'paused' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.05)'),
                  color: queueStatus === 'dispatching' ? 'var(--primary)' : (queueStatus === 'paused' ? '#f59e0b' : '#cbd5e1')
                }}>
                  {queueStatus === 'dispatching' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 1.2s infinite' }} />}
                  {queueStatus}
                </span>
              </div>

              {/* Glowing Progress bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                  <span>Dispatch completeness:</span>
                  <strong style={{ fontFamily: 'monospace' }}>
                    {Math.round((queueIndex / queueRecipients.length) * 100)}% ({queueIndex} of {queueRecipients.length})
                  </strong>
                </div>
                <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ 
                    width: `${(queueIndex / queueRecipients.length) * 100}%`, 
                    height: '100%', 
                    background: 'linear-gradient(to right, var(--primary), #00d2ff)',
                    borderRadius: '5px',
                    transition: 'width 0.3s ease',
                    boxShadow: '0 0 10px rgba(0, 255, 102, 0.5)'
                  }} />
                </div>
              </div>

              {/* Counters Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', textAlign: 'center' }}>
                <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', fontFamily: 'monospace' }}>{queueSuccessCount}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginTop: '2px' }}>Sent Success</div>
                </div>
                
                <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ef4444', fontFamily: 'monospace' }}>{queueErrorCount}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginTop: '2px' }}>Errors</div>
                </div>

                <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'monospace' }}>{queueRecipients.length - queueIndex}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginTop: '2px' }}>Remaining</div>
                </div>
              </div>

              {/* Interactive Dispatch Logs (Terminal console style) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted-site)', textTransform: 'uppercase', marginBottom: '8px' }}>Queue Dispatch Console Logs</label>
                <div style={{
                  background: '#090d16',
                  border: '1px solid #1e293b',
                  borderRadius: '12px',
                  padding: '1rem',
                  height: '200px',
                  overflowY: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  color: '#34d399',
                  lineHeight: '1.5',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
                }}>
                  {queueLog.map((logLine, idx) => (
                    <div key={idx} style={{ 
                      color: logLine.includes('FAILED') ? '#f87171' : (logLine.includes('INFO') ? '#60a5fa' : '#34d399')
                    }}>
                      {logLine}
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              </div>

              {/* Interactive controls */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '0.5rem' }}>
                {queueStatus === 'dispatching' && (
                  <button
                    onClick={handlePauseQueue}
                    className="btn-secondary"
                    style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #f59e0b', color: '#f59e0b', width: 'auto' }}
                  >
                    <Pause size={14} /> Pause Dispatch
                  </button>
                )}

                {queueStatus === 'paused' && (
                  <button
                    onClick={handleResumeQueue}
                    className="btn-primary"
                    style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '6px', width: 'auto', color: '#000' }}
                  >
                    <Play size={14} /> Resume Queue
                  </button>
                )}

                {(queueStatus === 'dispatching' || queueStatus === 'paused') && (
                  <button
                    onClick={handleStopAndSaveQueue}
                    className="btn-secondary"
                    style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #ef4444', color: '#ef4444', width: 'auto' }}
                  >
                    <Square size={12} fill="#ef4444" /> Stop & Save Campaign
                  </button>
                )}

                {(queueStatus === 'completed' || queueStatus === 'cancelled') && (
                  <button
                    onClick={() => setQueueModalOpen(false)}
                    className="btn-secondary"
                    style={{ padding: '10px 24px', width: 'auto' }}
                  >
                    Close Queue Dashboard
                  </button>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default EmailMarketingAdmin;
