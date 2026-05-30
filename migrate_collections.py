import os
import re

file_path = r'c:\Users\88016\OneDrive\Desktop\PROJECTS\EternoFit HEALTH QUIZ\src\EmailMarketingAdmin.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove separate savedCampaigns state
content = content.replace("const [savedCampaigns, setSavedCampaigns] = useState([]);\n", "")

# 2. Add derived states right after `const [campaigns, setCampaigns] = useState([]);`
# Wait, we can just define `savedCampaigns` inside the component body, not as state.
# We'll put it right after `const [campaigns, setCampaigns] = useState([]);`
derived_state = """const [campaigns, setCampaigns] = useState([]);
  const savedCampaigns = campaigns.filter(c => c.isPaused);
  const historyCampaigns = campaigns.filter(c => !c.isPaused);"""
content = content.replace("const [campaigns, setCampaigns] = useState([]);", derived_state)

# 3. Update Stop & Save to use marketing_campaigns
save_logic_old = "await addDoc(collection(db, 'saved_campaigns'), {"
save_logic_new = "await addDoc(collection(db, 'marketing_campaigns'), {\n        isPaused: true,"
content = content.replace(save_logic_old, save_logic_new)

# Update `savedAt` to `sentAt` so the orderBy works without new indexes
content = content.replace("savedAt: serverTimestamp()", "sentAt: serverTimestamp(),\n        savedAt: serverTimestamp()")

# 4. Remove unsubSavedCampaigns
fetch_regex = r"// 5\. Fetch paused/saved campaigns.*?unsubSavedCampaigns\(\);\s*\};\s*"
fetch_replacement = "};\n"
content = re.sub(fetch_regex, fetch_replacement, content, flags=re.DOTALL)

# 5. Update handleResumeSavedCampaign to delete from marketing_campaigns
resume_delete_old = "await deleteDoc(doc(db, 'saved_campaigns', savedCamp.id));"
resume_delete_new = "await deleteDoc(doc(db, 'marketing_campaigns', savedCamp.id));"
content = content.replace(resume_delete_old, resume_delete_new)

# 6. Update handleDeleteSavedCampaign to delete from marketing_campaigns
content = content.replace(resume_delete_old, resume_delete_new) # already replaced by above if identical, wait, let's just do both
delete_old = "await deleteDoc(doc(db, 'saved_campaigns', id));"
delete_new = "await deleteDoc(doc(db, 'marketing_campaigns', id));"
content = content.replace(delete_old, delete_new)

# 7. Use historyCampaigns instead of campaigns for filteredCampaigns
filter_old = "const filteredCampaigns = campaigns.filter(camp => {"
filter_new = "const filteredCampaigns = historyCampaigns.filter(camp => {"
content = content.replace(filter_old, filter_new)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Migrated saved campaigns to marketing_campaigns!")
