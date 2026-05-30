const fs = require('fs');

const raw = fs.readFileSync('src/data/products.js', 'utf8');
const jsonStrMatch = raw.match(/export const products = (\[[\s\S]*?\]);\n\nexport const getFilteredProducts/);

if (!jsonStrMatch) {
    console.log("Could not find products array.");
    process.exit(1);
}

const products = JSON.parse(jsonStrMatch[1]);

const nameCount = {};
const idCount = {};
const duplicates = [];

products.forEach(p => {
    nameCount[p.name] = (nameCount[p.name] || 0) + 1;
    idCount[p.id] = (idCount[p.id] || 0) + 1;
});

console.log("--- Duplicate Names ---");
for (const [name, count] of Object.entries(nameCount)) {
    if (count > 1) {
        console.log(`${name}: ${count} occurrences`);
        duplicates.push({ name, type: 'name' });
    }
}

console.log("\n--- Duplicate IDs ---");
for (const [id, count] of Object.entries(idCount)) {
    if (count > 1) {
        console.log(`ID ${id}: ${count} occurrences`);
        duplicates.push({ id, type: 'id' });
    }
}

if (duplicates.length === 0) {
    console.log("No exact duplicates found.");
}

// Check for fuzzy overlaps (e.g., "HerSolution" and "HerSolution Gel")
console.log("\n--- Potential Fuzzy Overlaps ---");
products.forEach((p1, i) => {
    products.slice(i + 1).forEach(p2 => {
        const n1 = p1.name.toLowerCase();
        const n2 = p2.name.toLowerCase();
        if (n1.includes(n2) || n2.includes(n1)) {
            console.log(`Potential overlap: "${p1.name}" (ID ${p1.id}) and "${p2.name}" (ID ${p2.id})`);
        }
    });
});
