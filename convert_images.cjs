const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function processImages() {
  const articlesDir = path.join(__dirname, 'public', 'images', 'articles');
  const files = fs.readdirSync(articlesDir);
  
  for (const file of files) {
    if (file.endsWith('.png')) {
      const inputPath = path.join(articlesDir, file);
      const outputName = file.replace(/\.png$/, '.jpg');
      const outputPath = path.join(articlesDir, outputName);
      
      console.log(`Converting ${file} to ${outputName}...`);
      
      try {
        await sharp(inputPath)
          .jpeg({ quality: 75, progressive: true, mozjpeg: true })
          .toFile(outputPath);
          
        // Delete original png
        fs.unlinkSync(inputPath);
        console.log(`Deleted ${file}`);
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
      }
    }
  }

  // Update articles.js
  const jsPath = path.join(__dirname, 'src', 'data', 'articles.js');
  let jsContent = fs.readFileSync(jsPath, 'utf8');
  
  jsContent = jsContent.replace(/\.png/g, '.jpg');
  fs.writeFileSync(jsPath, jsContent);
  console.log('Updated src/data/articles.js');
}

processImages().catch(console.error);
