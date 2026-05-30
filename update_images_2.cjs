const fs = require('fs');

let content = fs.readFileSync('src/data/articles.js', 'utf8');

const replacements = [
  {
    title: "Anxiety That Won", // Just match partial
    newImg: "/images/articles/anxiety_real.png"
  },
  {
    title: "Lower Back Pain From Sitting All Day",
    newImg: "/images/articles/back_pain_real.png"
  },
  {
    title: "Heartburn Keeps Coming Back",
    newImg: "/images/articles/heartburn_real.png"
  },
  {
    title: "Tired All the Time?",
    newImg: "/images/articles/fatigue_real.png"
  },
  {
    title: "Headaches Every Day?",
    newImg: "/images/articles/headache_real.png"
  },
  {
    title: "Hair Falling Out?",
    newImg: "/images/articles/hair_loss_real.png"
  }
];

replacements.forEach(rep => {
  const titleIdx = content.indexOf(rep.title);
  if (titleIdx !== -1) {
    const objStart = content.lastIndexOf('{', titleIdx);
    const objEnd = content.indexOf('}', titleIdx);
    
    if (objStart !== -1 && objEnd !== -1) {
      const objBlock = content.slice(objStart, objEnd);
      const newBlock = objBlock.replace(/image:\s*['"][^'"]+['"]/, `image: '${rep.newImg}'`);
      content = content.slice(0, objStart) + newBlock + content.slice(objEnd);
      console.log('Updated image for:', rep.title);
    }
  } else {
    console.log('Could not find title:', rep.title);
  }
});

fs.writeFileSync('src/data/articles.js', content);
console.log('Done replacing images in articles.js');
