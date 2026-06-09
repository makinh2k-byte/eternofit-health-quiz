const fs = require('fs');
const path = require('path');

const metaDescs = {
  'Testosil':                              'Testosil uses clinically studied KSM-66 Ashwagandha to naturally boost testosterone, increase energy, and support muscle recovery — no synthetic hormones.',
  'GenF20 Plus':                           'GenF20 Plus naturally stimulates HGH production to fight aging, boost energy, and restore vitality. Enteric-coated tablets for maximum absorption.',
  'DIM 3X':                                'DIM 3X helps men balance estrogen and support healthy testosterone with Diindolylmethane and Bioperine. Ideal for hormonal balance and lean muscle.',
  'Testodren':                             'Testodren uses patented Furosap fenugreek extract to increase free testosterone by up to 72%. A single-ingredient, clinically studied booster for men.',
  'CalmLean':                              'CalmLean is a stimulant-free fat burner using ForsLean Coleus forskohlii to support lean body composition without jitters or caffeine. Ideal for men.',
  'CortiSync':                             'CortiSync uses 7 adaptogenic ingredients to lower cortisol, reduce stress, and naturally restore testosterone levels in men. Clinically studied formula.',
  'HyperGH 14x':                           'HyperGH 14x combines oral capsules and oral spray to maximize HGH release during workouts and sleep, supporting muscle growth and faster recovery.',
  'TestRX':                                'TestRX uses ZMA (zinc, magnesium, B6) with ashwagandha to naturally restore testosterone, improve sleep quality, and rebuild gym performance in men.',
  'GenFX':                                 'GenFX is a daily anti-aging supplement with amino acids and plant extracts to naturally support HGH production, metabolism, and mental clarity.',
  'Provacyl':                              'Provacyl tackles male andropause with amino acids, herbs, and DHEA to restore testosterone, HGH levels, and overall male vitality after 40.',
  'Brain Pill':                            'Brain Pill is a premium nootropic with Cognizin and Vinpocetine to sharpen memory, boost focus, and enhance mental clarity. Rated #1 by executives.',
  'PrimeGENIX Prostate Support':           'PrimeGENIX Prostate Support uses Saw Palmetto and Beta-Sitosterol to reduce frequent urination and support healthy prostate function in men.',
  'Total Curve':                           'Total Curve combines a daily herbal supplement with Volufiline gel to naturally lift, firm, and enhance breast shape — no surgery required.',
  'Confitrol24':                           'Confitrol24 uses clinically studied Urox to reduce bladder leakage, urgency, and nighttime trips to the bathroom by up to 76% in just 8 weeks.',
  'Kollagen Intensiv':                     'Kollagen Intensiv uses patented SYN-COLL peptides to clinically reduce wrinkles and firm skin, shown to boost collagen production by up to 354%.',
  'Dermefface FX7':                        'Dermefface FX7 reduces acne scars, surgical scars, stretch marks, and dark spots with 7 clinically proven active ingredients. Results in 4–8 weeks.',
  'Illuminatural 6i':                      'Illuminatural 6i is a chemical-free skin lightener using 6 active ingredients to safely reduce dark spots, hyperpigmentation, and uneven skin tone.',
  'Icelandic Red Algae Calcium by GenF20': 'Icelandic Red Algae Calcium by GenF20 delivers premium plant-based calcium from Nordic algae for superior bone density and joint health support.',
  'PrimeGENIX Bone Complex':               'PrimeGENIX Bone Complex blends calcium, vitamin D3, and magnesium to protect bone density and joint strength in men over 40. Doctor-recommended.',
  'VigRX Plus':                            'VigRX Plus is the #1 clinically studied male enhancement pill — proven to improve erection quality, sexual stamina, and satisfaction in 84-day trials.',
  'Erectin':                               'Erectin uses enteric-coated liquid gel caps for superior absorption, clinically proven to improve erection hardness, libido, and sexual satisfaction.',
  'Semenax':                               'Semenax is a clinically tested semen volume enhancer proven to increase ejaculation volume, orgasm intensity, and sexual pleasure. Doctor endorsed.',
  'Erectin Gummies':                       'Erectin Gummies deliver beet root and six nitric oxide boosters in a daily chewable for stronger erections and improved male sexual performance.',
  'ProExtender':                           'ProExtender is a urologist-endorsed penis extender device clinically shown to increase length and girth safely over time — no surgery required.',
  'ProSolution Plus':                      'ProSolution Plus is the only clinically proven natural supplement for premature ejaculation, shown to improve stamina by 64% in a double-blind trial.',
  'Erectin Gel':                           'Erectin Gel is a fast-acting topical male enhancement gel delivering harder erections and heightened sensitivity within minutes of application.',
  'Volume Pills':                          'Volume Pills is a potent herbal formula that increases semen volume, boosts ejaculation force, and intensifies orgasms in men. A decade of results.',
  'ProSolution Pills':                     'ProSolution Pills is a leading male enhancement supplement with patented ingredients clinically shown to improve erection quality, libido, and confidence.',
  'VigRX Oil':                             'VigRX Oil is a doctor-endorsed topical male enhancement oil delivering instant erection support and heightened sexual sensation. Apply and feel results.',
  'VigRX Delay Spray':                     'VigRX Delay Spray uses benzocaine to reduce sensitivity and help men last longer during sex — fast-acting, discreet, and doctor endorsed.',
  'ProSolution Gel':                       'ProSolution Gel is an instant-action arousal gel for men that boosts erection speed, hardness, and sensation on contact. Results felt within seconds.',
  'Nexus Pheromones':                      'Nexus Pheromones is a scientifically formulated men\'s cologne with androstenone pheromones shown to increase female attention and social confidence.',
  'MagnaRX':                               'MagnaRX is a natural male enhancement formula developed by Dr. George Aguilar MD to improve erection quality, stamina, and sexual performance safely.',
  'VigRX Delay Wipes':                     'VigRX Delay Wipes are all-natural benzocaine wipes that reduce penile sensitivity to help men last longer — discreet, portable, and effective.',
  'SemEnhance':                            'SemEnhance is a natural supplement that improves the taste and scent of semen using pineapple, kiwi, and vitamin C. Made by the Semenax team.',
  'Fertility Factor 5':                    'Fertility Factor 5 by VigRX uses clinically studied ingredients to improve sperm count, motility, and overall male fertility naturally and safely.',
  'Extenze':                               'Extenze is one of the world\'s best-selling male enhancement supplements — over 1 billion pills sold — for stronger erections, libido, and performance.',
  'VigRX Nitric Oxide':                    'VigRX Nitric Oxide uses patented Velox technology with L-Citrulline to boost blood flow, enhance workout performance, and support strong erections.',
  'VigRX Incontinix':                      'VigRX Incontinix uses a clinically studied blend with GRC, Lindera Root, and Horsetail to reduce male urinary incontinence and improve bladder control.',
  'VigRX Max Volume':                      'VigRX Max Volume uses Zinc, Sunflower Lecithin, and L-Arginine to naturally increase semen volume, ejaculation force, and orgasm intensity for men.',
  'HerSolution':                           'HerSolution is a doctor-endorsed daily supplement for women to boost libido, improve lubrication, and restore sexual desire naturally and safely.',
  'Provestra':                             'Provestra is a doctor-endorsed female libido supplement that restores desire, improves lubrication, and enhances pleasure in women with low sex drive.',
  'Vigorelle':                             'Vigorelle is an all-natural arousal cream for women that enhances sensitivity and sexual pleasure instantly on contact. Hormone-free and safe daily.',
  'HerSolution Gel':                       'HerSolution Gel is an instant-action female arousal gel that boosts lubrication, clitoral sensitivity, and sexual pleasure within minutes of use.',
  '7-Day Wellness Reset Tracker':          'The 7-Day Wellness Reset Tracker is a digital guide to kickstart healthy habits with structured daily tracking for nutrition, sleep, and activity.',
  '90-Day Wellness Tracker':               'The 90-Day Wellness Tracker helps you build lasting health habits with daily logs for fitness, nutrition, sleep, and personal wellness goals.',
  'Meal Planning Pack':                    'The EternoFit Meal Planning Pack provides done-for-you meal plans, shopping lists, and nutrition guides to simplify healthy eating all week long.',
  'Self-Care Journal':                     'The EternoFit Self-Care Journal guides daily self-care with prompts for gratitude, mindfulness, stress management, and personal wellbeing tracking.',
  'Workout Log':                           'The EternoFit Workout Log tracks gym sessions, personal records, and progress with structured templates for strength and performance training.',
  '30 Quick & Healthy Meals':              '30 Quick & Healthy Meals gives you 30 fast, nutritious recipes for busy lifestyles — all under 30 minutes with full macronutrient breakdowns.',
};

const filePath = path.join(__dirname, '../src/data/products.js');
let content = fs.readFileSync(filePath, 'utf8');

let injected = 0;
let skipped = 0;

for (const [name, metaDesc] of Object.entries(metaDescs)) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match the "name": "ProductName", line — then insert metaDesc after it
  const pattern = new RegExp(`("name":\\s*"${escapedName}",)`, 'g');

  if (content.includes(`"metaDesc"`) && content.includes(`"name": "${name}"`)) {
    // Already has metaDesc near this name — skip to avoid double insertion
    // Check if metaDesc already follows this specific name
    const idx = content.indexOf(`"name": "${name}"`);
    const snippet = content.slice(idx, idx + 300);
    if (snippet.includes('"metaDesc"')) {
      skipped++;
      continue;
    }
  }

  const newContent = content.replace(pattern, `$1\n    "metaDesc": "${metaDesc}",`);
  if (newContent !== content) {
    content = newContent;
    injected++;
    console.log(`✅ ${name}`);
  } else {
    console.log(`⚠️  No match: ${name}`);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log(`\nDone. Injected: ${injected}, Skipped: ${skipped}`);
