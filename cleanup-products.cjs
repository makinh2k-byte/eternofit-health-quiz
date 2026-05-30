const fs = require('fs');

const raw = fs.readFileSync('src/data/products.js', 'utf8');
const jsonStrMatch = raw.match(/export const products = (\[[\s\S]*?\]);\n\nexport const getFilteredProducts/);

if (!jsonStrMatch) {
    console.log("Could not find products array.");
    process.exit(1);
}

let products = JSON.parse(jsonStrMatch[1]);

// IDs to remove based on analysis:
// 28: Generic "VigRX" (redundant with VigRX Plus, etc.)
// 11: Generic "PrimeGENIX" (redundant with Bone Complex, etc.)
// 64: duplicate "hersolution" (lowercase)
// 62: duplicate "provestra" (lowercase)
// 101: duplicate "Dermefface FX7 Scar Reduction Therapy" (redundant with ID 45)
const toRemove = [28, 11, 64, 62, 101];

const filtered = products.filter(p => !toRemove.includes(p.id));

const logicPart = raw.substring(raw.indexOf('export const getFilteredProducts'));
const finalContent = `export const products = ${JSON.stringify(filtered, null, 2)};\n\n${logicPart}`;

fs.writeFileSync('src/data/products.js', finalContent);
console.log(`Cleaned up ${toRemove.length} overlapping/duplicate entries. ${filtered.length} products remaining.`);
