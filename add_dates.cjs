const fs = require('fs');

const filePath = 'src/data/articles.js';
let content = fs.readFileSync(filePath, 'utf8');

// We will inject a date line right after readTime: '...'
// to ensure it matches properly.
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let count = 0;

content = content.replace(/(readTime:\s*['"][^'"]+['"],)/g, (match) => {
  // generate a random date in 2025 or 2026
  const year = 2025 + Math.floor(Math.random() * 2);
  const month = months[Math.floor(Math.random() * months.length)];
  const day = 1 + Math.floor(Math.random() * 28);
  const dateStr = `${month} ${day}, ${year}`;
  count++;
  return `${match}\n    date: '${dateStr}',`;
});

fs.writeFileSync(filePath, content);
console.log(`Added dates to ${count} articles.`);
