const fs = require('fs');
const csv = require('csv-parser');

const results = [];
const products = [];
let idCounter = 1;

const getSubniche = (name, category, summary) => {
    name = name.toLowerCase();
    const sum = (summary || '').toLowerCase();
    
    if (name.includes('vigrx plus') || name.includes('erectin') || name.includes('extenze') || name.includes('prosolution') || name.includes('magnarx') || name.includes('proextender')) return 'Erectile Support';
    if (name.includes('testo') || name.includes('testrx') || name.includes('provacyl') || name.includes('cortisync')) return 'Testosterone Boost';
    if (name.includes('genf20') || name.includes('genfx') || name.includes('hypergh')) return 'HGH Boost';
    if (name.includes('hersolution') || name.includes('provestra') || name.includes('vigorelle')) return 'Female Libido';
    if (name.includes('kollagen') || name.includes('dermefface') || name.includes('illuminatural')) return 'Skin Care';
    if (name.includes('brain')) return 'Brain Health';
    if (name.includes('calmlean')) return 'Fat Loss';
    if (name.includes('semenax') || name.includes('volume pills') || name.includes('semenhance') || name.includes('max volume')) return 'Semen Volume';
    if (name.includes('delay')) return 'Stamina & Delay';
    if (name.includes('nexus')) return 'Pheromones';
    if (category.toLowerCase().includes('anti-aging')) return 'Anti-aging';
    if (category.toLowerCase().includes('women')) return 'Women\'s Health';
    if (category.toLowerCase().includes('men')) return 'Men\'s Health';
    return category;
};

const imageMap = {
    'vigrx plus': 'VigRXPlus.jpg',
    'testosil': 'Testosil.jpg',
    'genf20 plus': 'GenF20 Plus.jpg',
    'hersolution': 'HerSolution.jpg',
    'kollagen intensiv': 'KollagenIntensiv.jpg',
    'brain pill': 'BrainPill.jpg',
    'calmlean': 'CalmLean.jpg',
    'semenax': 'Semenax.jpg',
    'buyextenze': 'BuyExtenze.jpg',
    'extenze': 'BuyExtenze.jpg',
    'confitrol24': 'Confitrol24.jpg',
    'cortisync': 'CortiSync.jpg',
    'dim 3x': 'DIM 3X.jpg',
    'dermefface': 'DermeffaceFX7.jpg',
    'dermefface fx7': 'DermeffaceFX7.jpg',
    'erectin gummies': 'Erectin Gummies.jpg',
    'erectin': 'Erectin.jpg',
    'erectin gel': 'ErectinGel.jpg',
    'fertility factor 5': 'FertilityFactor5.jpg',
    'fertilityfactor5': 'FertilityFactor5.jpg',
    'genf20': 'GenF20.jpg',
    'genfx': 'GenFX.jpg',
    'hersolution gel': 'HerSolutionGel.jpg',
    'hypergh 14x': 'HyperGH14x.jpg',
    'illuminatural 6i': 'Illuminatural6i.jpg',
    'magnarx': 'MagnaRX.jpg',
    'nexus pheromones': 'NexusPheromones.jpg',
    'proextender': 'ProExtender.jpg',
    'prosolution gel': 'ProsolutionGel.jpg',
    'prosolution pills': 'ProsolutionPills.jpg',
    'prosolution plus': 'ProsolutionPlus.jpg',
    'provacyl': 'Provacyl.jpg',
    'provestra': 'Provestra.jpg',
    'semenhance': 'SemEnhance.jpg',
    'testrx': 'TestRX.jpg',
    'testodren': 'Testodren.jpg',
    'total curve': 'TotalCurve.jpg',
    'vigrx delay spray': 'VigRXDelaySpray.jpg',
    'vigrx delay wipes': 'VigRXDelayWipes.jpg',
    'vigrx nitric oxide': 'VigRXNitricOxide.jpg',
    'vigrx oil': 'VigRXOil.jpg',
    'vigorelle': 'Vigorelle.jpg',
    'vigrx incontinix': 'VigrxIncontinix.jpg',
    'vigrx max volume': 'VigrxMaxVolume.jpg',
    'volume pills': 'VolumePills.jpg'
};

const cleanName = (name) => {
    return name.replace(/[\?©®™]/g, '').trim();
};

const extractBullets = (summary) => {
    if (!summary) return [];
    // Just extract a few lines that look like bullets or sentences
    const sentences = summary.split(/[.!?\n]/).map(s => s.trim()).filter(s => s.length > 20);
    return sentences.slice(0, 3).map(s => s + '.');
};

const getImage = (name) => {
    const key = name.toLowerCase();
    for (const [k, v] of Object.entries(imageMap)) {
        if (key.includes(k) || k.includes(key)) {
            return `/products/${v}`;
        }
    }
    // Fallback based on alphanumeric match
    const alphaName = key.replace(/[^a-z0-9]/g, '');
    for (const [k, v] of Object.entries(imageMap)) {
        if (v.toLowerCase().replace(/[^a-z0-9]/g, '').includes(alphaName)) {
            return `/products/${v}`;
        }
    }
    return `/products/${name.replace(/[^a-zA-Z0-9]/g, '')}.jpg`; // best guess
};

fs.createReadStream('SellHealth  (1).csv')
  .pipe(csv())
  .on('data', (data) => {
      const name = cleanName(data['Product Name'] || '');
      if (!name) return;

      const category = data['Category'] || 'General Health';
      const affiliateLink = "https://" + (data['Product Link'] || 'www.sellhealth.com') + "/ct/976241";
      const summary = data['Summary'] || '';
      const info = data['Information for Affiliates'] || '';
      
      const combinedText = summary + " " + info;
      const bullets = extractBullets(combinedText);
      const description = bullets[0] || `${name} is a premium ${category.toLowerCase()} supplement.`;
      const rationale = "Clinically formulated with high-quality ingredients based on the latest research for " + category.toLowerCase() + ".";

      products.push({
          id: idCounter++,
          name: name,
          category: category,
          subniche: getSubniche(name, category, combinedText),
          priority: 0, // Will be updated by quiz logic
          description: description,
          bullets: bullets,
          rationale: rationale,
          affiliateLink: affiliateLink,
          image: getImage(name),
          status: 'active'
      });
  })
  .on('end', () => {
      // Deduplicate by name
      const uniqueProducts = [];
      const seen = new Set();
      for (const p of products) {
          if (!seen.has(p.name)) {
              seen.add(p.name);
              uniqueProducts.push(p);
          }
      }

      const jsContent = `export const products = ${JSON.stringify(uniqueProducts, null, 2)};\n\n` + 
`export const getFilteredProducts = (answers, customProducts = products) => {
  const matches = customProducts.filter(p => p.status !== 'inactive').map(product => {
    let score = 0;
    const goals = Array.isArray(answers.primaryGoal) ? answers.primaryGoal : [answers.primaryGoal].filter(Boolean);
    const focuses = answers.specificFocus ? (Array.isArray(answers.specificFocus) ? answers.specificFocus : [answers.specificFocus].filter(Boolean)) : [];
    
    // Evaluate goals
    goals.forEach(goal => {
      if (product.category.includes(goal)) score += 3;
      if (goal === 'Intimate Performance' && product.category === "Men's Health") score += 3;
      if (goal === 'Muscle & Physique' && product.category === "Muscle & Fitness") score += 3;
      if (goal === 'Anti-aging & Vitality' && product.category === "Anti-aging") score += 3;
      if (goal === 'Skin & Beauty' && product.category === "Skin Care") score += 3;
      if (goal === 'Brain & Focus' && product.category === "Anti-aging") score += 2;
    });

    // Evaluate focuses
    focuses.forEach(focus => {
      // Match exactly or closely with subniche
      if (
        ((focus === 'Erection Quality' || focus === 'Stamina') && (product.subniche === 'Erectile Support' || product.subniche === 'Stamina & Delay')) ||
        ((focus === 'Low Libido') && (product.subniche === 'Female Libido' || product.subniche === 'Erectile Support')) ||
        ((focus === 'Semen Volume') && product.subniche === 'Semen Volume') ||
        ((focus === 'Low Testosterone' || focus === 'More Energy') && product.subniche === 'Testosterone Boost') ||
        ((focus === 'Stubborn Fat') && product.subniche === 'Fat Loss') ||
        ((focus === 'Slow Recovery' || focus === 'Low Energy' || focus === 'Anti-aging' || focus === 'General Health') && product.subniche === 'HGH Boost') ||
        ((focus === 'Fine Lines & Wrinkles' || focus === 'Acne Scars' || focus === 'Anti-aging') && product.category === 'Skin Care') ||
        ((focus === 'Brain Fog' || focus === 'Memory Decline') && product.subniche === 'Brain Health')
      ) {
        score += 5; // Higher weight for exact subniche match
      }
      
      // Keyword matching in description/bullets for edge cases
      const keywordMap = {
          'Erection Quality': ['erect', 'hard', 'blood flow'],
          'Stamina': ['stamina', 'delay', 'last longer'],
          'Low Libido': ['libido', 'desire', 'sex drive'],
          'Semen Volume': ['volume', 'semen', 'sperm', 'load'],
          'Low Testosterone': ['testosterone', 't-levels', 'muscle mass'],
          'More Energy': ['energy', 'fatigue', 'vitality'],
          'Stubborn Fat': ['fat', 'weight loss', 'metabolism'],
          'Slow Recovery': ['recovery', 'muscle repair'],
          'Fine Lines & Wrinkles': ['wrinkle', 'collagen', 'aging skin', 'lines'],
          'Acne Scars': ['scar', 'acne', 'blemish'],
          'Brain Fog': ['focus', 'memory', 'cognitive', 'brain fog'],
          'Memory Decline': ['memory', 'recall']
      };
      
      if (keywordMap[focus]) {
          const contentStr = (product.description + " " + product.bullets.join(" ")).toLowerCase();
          for (let keyword of keywordMap[focus]) {
              if (contentStr.includes(keyword)) {
                  score += 2;
              }
          }
      }
    });

    if (score > 0) {
      score += product.priority; // Admin assigned priority
    }

    return { ...product, score };
  });

  // Sort by score descending
  return matches.sort((a, b) => b.score - a.score).filter(p => p.score > 0);
};
`;

      fs.writeFileSync('src/data/products.js', jsContent);
      console.log('Successfully wrote src/data/products.js with ' + uniqueProducts.length + ' products.');
  });
