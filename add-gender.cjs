const fs = require('fs');

const raw = fs.readFileSync('src/data/products.js', 'utf8');
const jsonStrMatch = raw.match(/export const products = (\[[\s\S]*?\]);\n\nexport const getFilteredProducts/);

if (!jsonStrMatch) {
    console.error("Could not find products array.");
    process.exit(1);
}

let products = JSON.parse(jsonStrMatch[1]);

// Logic for gender categorization
products = products.map(p => {
    const name = p.name.toLowerCase();
    const cat = p.category.toLowerCase();
    const sub = p.subniche.toLowerCase();
    const desc = p.description.toLowerCase();

    let gender = 'both';

    if (cat.includes('men') || name.includes('vigrx') || name.includes('testo') || name.includes('semen') || name.includes('erect') || name.includes('proextender') || name.includes('prosolution') || name.includes('maxload') || name.includes('volume pills') || desc.includes('male vitality') || desc.includes('men over') || desc.includes('specifically for men')) {
        gender = 'male';
    } else if (cat.includes('female') || name.includes('her') || name.includes('provestra') || name.includes('libidopure') || desc.includes('female')) {
        gender = 'female';
    }

    // Manual overrides for specific ones that might be missed
    if (name.includes('dim 3x')) gender = 'male'; // although general health, it's for men
    if (name.includes('cortisync')) gender = 'male'; // it's in men's health
    if (name.includes('hypergh 14x')) gender = 'male';
    if (name.includes('viasil')) gender = 'male';
    if (name.includes('collagen') || name.includes('dermefface') || name.includes('stretch mark') || name.includes('illuminatural') || name.includes('kollagen')) gender = 'both';
    if (name.includes('brain pill') || name.includes('calmlean') || name.includes('genf20') || name.includes('metaboost')) gender = 'both';

    return { ...p, gender };
});

const logicPart = raw.substring(raw.indexOf('export const getFilteredProducts'));
const finalContent = `export const products = ${JSON.stringify(products, null, 2)};\n\n${logicPart}`;

fs.writeFileSync('src/data/products.js', finalContent);
console.log("Successfully added gender field to all products.");
