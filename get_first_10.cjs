const fs = require('fs');
const content = fs.readFileSync('src/data/articles.js', 'utf8');
const ids = [...content.matchAll(/id:\s*['"](.*?)['"]/g)].map(m => m[1]);
const titles = [...content.matchAll(/title:\s*['"](.*?)['"]/g)].map(m => m[1]);
const images = [...content.matchAll(/image:\s*['"](.*?)['"]/g)].map(m => m[1]);

console.log(ids.slice(0, 10).map((id, i) => `${id} --- ${titles[i]} --- ${images[i]}`).join('\n'));
