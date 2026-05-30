const fs = require('fs');
let c = fs.readFileSync('src/data/articles.js', 'utf8');
c = c.replace(/<p><strong>(.*?)<\/strong><br>(.*?)<\/p>/g, '<details class="faq-details"><summary class="faq-summary">$1</summary><div class="faq-answer"><p>$2</p></div></details>');
fs.writeFileSync('src/data/articles.js', c);
console.log('Converted FAQs!');
