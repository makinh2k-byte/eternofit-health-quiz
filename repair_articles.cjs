const fs = require('fs');

const filePath = './src/data/articles.js';
let content = fs.readFileSync(filePath, 'utf8');

// Find where the new articles started
const badStartIndex = content.indexOf(',\n{\n  "id": "prevent-falls-stay-steady"');

if (badStartIndex !== -1) {
  content = content.substring(0, badStartIndex) + '\n];\n';
  fs.writeFileSync(filePath, content);
  console.log('Restored articles.js to original state.');
} else {
  console.log('Could not find the bad start index. It might already be fixed.');
}
