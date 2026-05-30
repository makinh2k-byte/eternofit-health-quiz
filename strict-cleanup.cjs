const fs = require('fs');

const raw = fs.readFileSync('src/data/products.js', 'utf8');
const jsonStrMatch = raw.match(/export const products = (\[[\s\S]*?\]);\n\nexport const getFilteredProducts/);

if (!jsonStrMatch) {
    console.log("Could not find products array.");
    process.exit(1);
}

const products = JSON.parse(jsonStrMatch[1]);

const seenNames = new Set();
const seenLinks = new Set();
const toRemove = [];

products.forEach(p => {
    const cleanName = p.name.toLowerCase().trim();
    const cleanLink = p.affiliateLink.toLowerCase().trim();
    
    if (seenNames.has(cleanName)) {
        console.log(`Duplicate name found: ${p.name} (ID ${p.id})`);
        toRemove.push(p.id);
    } else if (seenLinks.has(cleanLink)) {
        console.log(`Duplicate link found for: ${p.name} (ID ${p.id}) - link: ${p.affiliateLink}`);
        toRemove.push(p.id);
    } else {
        seenNames.add(cleanName);
        seenLinks.add(cleanLink);
    }
});

console.log(`\nFound ${toRemove.length} strict overlaps.`);
if (toRemove.length > 0) {
    const filtered = products.filter(p => !toRemove.includes(p.id));
    const logicPart = raw.substring(raw.indexOf('export const getFilteredProducts'));
    const finalContent = `export const products = ${JSON.stringify(filtered, null, 2)};\n\n${logicPart}`;
    fs.writeFileSync('src/data/products.js', finalContent);
    console.log(`Removed ${toRemove.length} products. ${filtered.length} products remaining.`);
} else {
    console.log("No strict overlaps found.");
}
