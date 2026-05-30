const fs = require('fs');
let content = fs.readFileSync('src/data/articles.js', 'utf8');
const titles = [...content.matchAll(/title:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
console.log(JSON.stringify(titles, null, 2));
