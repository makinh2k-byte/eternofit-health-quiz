const fs = require('fs');

const raw = fs.readFileSync('src/data/products.js', 'utf8');
const jsonStrMatch = raw.match(/export const products = (\[[\s\S]*?\]);\n\nexport const getFilteredProducts/);

if (!jsonStrMatch) {
    console.log("Could not find products array.");
    process.exit(1);
}

const products = JSON.parse(jsonStrMatch[1]);

const seenDescriptions = new Set();
const toRemove = [];

products.forEach(p => {
    const desc = p.description.trim();
    if (seenDescriptions.has(desc)) {
        console.log(`Duplicate description found: ${p.name} (ID ${p.id})`);
        toRemove.push(p.id);
    } else {
        seenDescriptions.add(desc);
    }
});

console.log(`\nFound ${toRemove.length} description overlaps.`);
if (toRemove.length > 0) {
    const filtered = products.filter(p => !toRemove.includes(p.id));
    const logicPart = raw.substring(raw.indexOf('export const getFilteredProducts'));
    const finalContent = `export const products = ${JSON.stringify(filtered, null, 2)};\n\n${logicPart}`;
    fs.writeFileSync('src/data/products.js', finalContent);
    console.log(`Removed ${toRemove.length} products. ${filtered.length} products remaining.`);
}
