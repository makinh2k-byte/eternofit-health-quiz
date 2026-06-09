// One-off script: append a tailored "References & Further Reading" section to each article.
// Sources are real, authoritative organizations (root domains verified to exist) plus two
// genuine landmark studies. Run once: `node add-references.js`
import fs from 'fs';

const FILE = './src/data/articles.js';

const S = {
  niddk: ['https://www.niddk.nih.gov', 'National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK)', 'U.S. government clinical resource on digestive and metabolic health'],
  mayo: ['https://www.mayoclinic.org', 'Mayo Clinic', 'Evidence-based patient guidance from a leading academic medical center'],
  cleveland: ['https://my.clevelandclinic.org', 'Cleveland Clinic', 'Clinical overviews of symptoms, conditions, and treatments'],
  monash: ['https://www.monashfodmap.com', 'Monash University FODMAP Program', 'The research institution that developed the low-FODMAP approach to bloating and IBS'],
  sleepfdn: ['https://www.sleepfoundation.org', 'Sleep Foundation', 'Research-backed sleep science and hygiene guidance'],
  aasm: ['https://aasm.org', 'American Academy of Sleep Medicine', 'Professional body setting clinical standards for sleep medicine'],
  cdc: ['https://www.cdc.gov', 'Centers for Disease Control and Prevention (CDC)', 'U.S. public health data and guidelines'],
  nhlbi: ['https://www.nhlbi.nih.gov', 'National Heart, Lung, and Blood Institute (NIH)', 'Federal research on heart, sleep, and circulatory health'],
  apa: ['https://www.apa.org', 'American Psychological Association', 'Authoritative resources on stress, anxiety, and mental health'],
  harvard: ['https://www.health.harvard.edu', 'Harvard Health Publishing', 'Consumer health content from Harvard Medical School faculty'],
  alz: ['https://www.alz.org', "Alzheimer's Association", 'Leading authority on memory, cognition, and dementia'],
  nia: ['https://www.nia.nih.gov', 'National Institute on Aging (NIH)', 'Federal research on healthy aging, memory, and social health'],
  adaa: ['https://adaa.org', 'Anxiety & Depression Association of America', 'Evidence-based information on anxiety disorders and coping strategies'],
  nimh: ['https://www.nimh.nih.gov', 'National Institute of Mental Health (NIMH)', 'The lead U.S. federal agency for research on mental disorders, including ADHD'],
  ortho: ['https://orthoinfo.aaos.org', 'OrthoInfo (American Academy of Orthopaedic Surgeons)', 'Patient education from board-certified orthopaedic surgeons'],
  arthritis: ['https://www.arthritis.org', 'Arthritis Foundation', 'Guidance on joint pain, arthritis, and mobility'],
  ninds: ['https://www.ninds.nih.gov', 'National Institute of Neurological Disorders and Stroke (NIH)', 'Federal research on headaches and neurological health'],
  aad: ['https://www.aad.org', 'American Academy of Dermatology', 'Board-certified dermatologist guidance on hair and skin'],
  fda: ['https://www.fda.gov', 'U.S. Food and Drug Administration (FDA)', 'Official guidance on medication safety and interactions'],
  aha: ['https://www.heart.org', 'American Heart Association', 'Clinical guidelines on blood pressure and cardiovascular health'],
  bones: ['https://www.bonehealthandosteoporosis.org', 'Bone Health & Osteoporosis Foundation', 'National authority on bone density and fracture prevention'],
  niams: ['https://www.niams.nih.gov', 'National Institute of Arthritis and Musculoskeletal and Skin Diseases (NIH)', 'Federal research on bone, joint, and muscle health'],
  who: ['https://www.who.int', 'World Health Organization', 'Global physical-activity and public-health guidelines'],
  chadd: ['https://chadd.org', 'CHADD (Children and Adults with ADHD)', 'The leading national nonprofit serving people affected by ADHD'],
  additude: ['https://www.additudemag.com', 'ADDitude', 'Expert-reviewed magazine dedicated to ADHD and related conditions'],
  endocrine: ['https://www.endocrine.org', 'The Endocrine Society', 'Professional body publishing clinical practice guidelines on testosterone'],
  examine: ['https://examine.com', 'Examine.com', 'Independent analysis of nutrition and supplement research'],
  harvardnutrition: ['https://nutritionsource.hsph.harvard.edu', 'The Nutrition Source, Harvard T.H. Chan School of Public Health', 'Research-based nutrition guidance from Harvard'],
};

// Genuine landmark studies (cited as plain text, no fabricated links)
const STUDY_IF = ['de Cabo R, Mattson MP. "Effects of Intermittent Fasting on Health, Aging, and Disease." <em>New England Journal of Medicine</em>, 2019.', 'A widely cited review of the physiology and clinical effects of intermittent fasting.'];
const STUDY_ASH = ['Lopresti AL, et al. "A randomized, double-blind, placebo-controlled, crossover study examining the hormonal and vitality effects of ashwagandha (Withania somnifera) in aging, overweight males." <em>American Journal of Men\'s Health</em>, 2019.', 'Found KSM-66 ashwagandha supplementation was associated with increased testosterone in the study population.'];

const refsById = {
  'how-to-get-rid-of-bloating': [S.niddk, S.monash, S.mayo],
  'how-to-stop-heartburn': [S.niddk, S.mayo, S.cleveland],
  'constipation-relief-gentle-ways': [S.niddk, S.mayo, S.cleveland],
  'cant-sleep-what-to-do': [S.sleepfdn, S.aasm, S.nhlbi],
  'better-sleep-as-you-age': [S.sleepfdn, S.nia, S.aasm],
  'brain-fog-causes-remedies': [S.harvard, S.mayo, S.nimh],
  'memory-changes-what-is-normal': [S.nia, S.alz, S.harvard],
  'how-to-calm-anxiety': [S.adaa, S.apa, S.nimh],
  'lower-back-pain-from-sitting': [S.ortho, S.mayo, S.niams],
  'daily-headaches-causes-remedies': [S.ninds, S.mayo, S.cleveland],
  'knee-pain-after-60': [S.ortho, S.arthritis, S.mayo],
  'stiff-achy-joints-causes': [S.arthritis, S.niams, S.mayo],
  'tired-all-the-time-causes': [S.mayo, S.harvard, S.nhlbi],
  'hair-falling-out-causes': [S.aad, S.mayo, S.cleveland],
  'prevent-falls-stay-steady': [S.cdc, S.nia, S.mayo],
  'managing-your-medications-safely': [S.fda, S.nia, S.cdc],
  'lower-blood-pressure-simple-habits': [S.aha, S.cdc, S.nhlbi],
  'protect-your-bones-prevent-fractures': [S.bones, S.niams, S.mayo],
  'staying-active-after-65': [S.cdc, S.nia, S.who],
  'feeling-lonely-ways-to-reconnect': [S.nia, S.cdc, S.apa],
  'adhd-signs-in-adults': [S.nimh, S.cdc, S.chadd, S.additude],
  'adhd-focus-strategies': [S.chadd, S.additude, S.nimh],
  'adhd-diet-and-nutrition': [S.nimh, S.harvard, S.additude],
  'dopamine-and-adhd': [S.nimh, S.chadd, S.additude],
  'low-testosterone-signs': [S.endocrine, S.mayo, S.cleveland],
  'how-to-boost-testosterone-naturally': [S.endocrine, S.examine, S.mayo],
  'testosterone-sleep-connection': [S.endocrine, S.sleepfdn, S.nhlbi],
  'why-not-losing-weight': [S.niddk, S.harvardnutrition, S.examine],
  'intermittent-fasting-guide': [S.harvardnutrition, S.niddk, S.examine],
  'foods-for-fat-loss': [S.harvardnutrition, S.niddk, S.examine],
  'speed-up-metabolism': [S.niddk, S.harvardnutrition, S.examine],
  'cortisol-and-stress': [S.apa, S.mayo, S.nimh],
  'fix-sleep-schedule': [S.sleepfdn, S.aasm, S.cdc],
  'hrv-explained': [S.aha, S.nhlbi, S.sleepfdn],
};

const extraStudies = {
  'intermittent-fasting-guide': [STUDY_IF],
  'how-to-boost-testosterone-naturally': [STUDY_ASH],
};

function buildBlock(id) {
  const sources = refsById[id];
  if (!sources) return null;
  const liItems = sources.map(([url, name, desc]) =>
    `      <li><a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a> — ${desc}</li>`
  );
  (extraStudies[id] || []).forEach(([cite, desc]) => {
    liItems.push(`      <li>${cite} — ${desc}</li>`);
  });
  return `
    <h2>References &amp; Further Reading</h2>
    <p>The guidance in this article is informed by the following authoritative health organizations and peer-reviewed research. Always consult a qualified healthcare provider for advice specific to your situation.</p>
    <ul>
${liItems.join('\n')}
    </ul>
  `;
}

let src = fs.readFileSync(FILE, 'utf8');
let added = 0, skipped = 0, missing = 0;

for (const id of Object.keys(refsById)) {
  // locate the article by its id field (single or double quoted)
  const idRe = new RegExp(`id:\\s*['"]${id.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}['"]`);
  const idMatch = idRe.exec(src);
  if (!idMatch) { console.log('MISSING id:', id); missing++; continue; }

  // find the content template literal opening after the id
  const contentOpen = src.indexOf('content:', idMatch.index);
  if (contentOpen === -1) { console.log('no content for', id); missing++; continue; }
  const backtickOpen = src.indexOf('`', contentOpen);
  if (backtickOpen === -1) { console.log('no opening backtick for', id); missing++; continue; }
  const backtickClose = src.indexOf('`', backtickOpen + 1);
  if (backtickClose === -1) { console.log('no closing backtick for', id); missing++; continue; }

  const contentSlice = src.slice(backtickOpen + 1, backtickClose);
  if (contentSlice.includes('References &amp; Further Reading')) { skipped++; continue; }

  const block = buildBlock(id);
  if (!block) { skipped++; continue; }

  src = src.slice(0, backtickClose) + block + src.slice(backtickClose);
  added++;
}

fs.writeFileSync(FILE, src, 'utf8');
console.log(`Done. Added: ${added}, Skipped (already had): ${skipped}, Missing: ${missing}`);
