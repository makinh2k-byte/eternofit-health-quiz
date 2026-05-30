const fs = require('fs');

const raw = fs.readFileSync('src/data/products.js', 'utf8');

// We just want to extract the products array from the file, process it, and write it back.
// Since it's a JS file, we can do string manipulation or evaluate it.
const jsonStrMatch = raw.match(/export const products = (\[[\s\S]*?\]);\n\nexport const getFilteredProducts/);
if (!jsonStrMatch) {
    console.log("Could not find products array.");
    process.exit(1);
}

let products = JSON.parse(jsonStrMatch[1]);

const badWords = ['affiliate', 'commission', 'cash', 'traffic', 'sale', 'sales page', 'average order', 'epc', 'conversion', 'offer'];

function cleanText(text) {
    if (!text) return "";
    let sentences = text.split(/[.!?\n]/).map(s => s.trim()).filter(s => s.length > 10);
    // filter out sentences with bad words
    sentences = sentences.filter(s => {
        const lower = s.toLowerCase();
        return !badWords.some(w => lower.includes(w));
    });
    return sentences;
}

products = products.map(p => {
    let goodSentences = cleanText(p.description + " " + (p.bullets ? p.bullets.join(" ") : ""));
    if (goodSentences.length === 0) {
        goodSentences = [`Premium clinical formulation specifically engineered for ${p.subniche || p.category.toLowerCase()}.`, `Provides high-affinity support for your primary health goals.`];
    }
    
    p.description = goodSentences[0] + ".";
    p.bullets = goodSentences.slice(0, 3).map(s => s + ".");
    
    // Fix category if it's generic
    if (p.category === 'General Health') {
        if (p.subniche === 'Testosterone Boost' || p.subniche === 'Erectile Support' || p.subniche === 'Semen Volume') {
            p.category = "Men's Health";
        } else if (p.subniche === 'Female Libido') {
            p.category = "Women's Health";
        } else if (p.subniche === 'Skin Care') {
            p.category = "Skin Care";
        } else if (p.subniche === 'HGH Boost' || p.subniche === 'Brain Health') {
            p.category = "Anti-aging";
        } else if (p.subniche === 'Fat Loss') {
            p.category = "Muscle & Fitness";
        }
    }

    p.rationale = `Authorized clinical formulation based on your specific focus in ${p.subniche}. Proven to deliver optimized support via high-affinity biological absorption.`;

    return p;
});

const logicPart = raw.substring(raw.indexOf('export const getFilteredProducts'));

const finalContent = `export const products = ${JSON.stringify(products, null, 2)};\n\n${logicPart}`;

fs.writeFileSync('src/data/products.js', finalContent);
console.log("Cleaned descriptions for " + products.length + " products.");
