const fs = require('fs');

let content = fs.readFileSync('src/data/articles.js', 'utf8');

// The articles to update are:
// "Brain Fog Won't Lift? Here's What's Really Going On" -> /images/articles/brain_fog_real.png
// "High Blood Pressure Basics: What Those Numbers Actually Mean" -> /images/articles/blood_pressure_real.png
// "Always Feeling Cold? Why Your Body Might Be Struggling to Stay Warm" -> /images/articles/always_cold_real.png
// "Why Do You Feel So Tired After Eating? (And How to Fix It)" -> /images/articles/tired_eating_real.png
// "Forgetfulness vs. Dementia: When Should You Be Concerned?" -> /images/articles/forgetfulness_real.png
// "Waking Up with Dry Mouth? Why It Happens and How to Stop It" -> /images/articles/dry_mouth_real.png
// "Unexpected Weight Gain Over 50? It’s Not Just \"Getting Older\"" -> /images/articles/weight_gain_real.png
// "Stiff, Achy Joints in Your 30s and 40s: Here's What's Going On" -> /images/articles/stiff_joints_real.png

const replacements = [
  {
    title: "Brain Fog Won't Lift? Here's What's Really Going On",
    oldImg: "/images/articles/brain_fog.png",
    newImg: "/images/articles/brain_fog_real.png"
  },
  {
    title: "High Blood Pressure Basics: What Those Numbers Actually Mean",
    oldImg: "/images/articles/blood_pressure.png", // Wait, maybe it's not blood_pressure.png? Let's use regex near title
    newImg: "/images/articles/blood_pressure_real.png"
  },
  {
    title: "Always Feeling Cold? Why Your Body Might Be Struggling to Stay Warm",
    newImg: "/images/articles/always_cold_real.png"
  },
  {
    title: "Why Do You Feel So Tired After Eating?",
    newImg: "/images/articles/tired_eating_real.png"
  },
  {
    title: "Forgetfulness vs. Dementia",
    newImg: "/images/articles/forgetfulness_real.png"
  },
  {
    title: "Waking Up with Dry Mouth",
    newImg: "/images/articles/dry_mouth_real.png"
  },
  {
    title: "Unexpected Weight Gain Over 50",
    newImg: "/images/articles/weight_gain_real.png"
  },
  {
    title: "Stiff, Achy Joints in Your 30s",
    newImg: "/images/articles/stiff_joints_real.png"
  }
];

// Instead of exact string replacement, let's find the object block with the title, and replace its image.
replacements.forEach(rep => {
  // Find the title index
  const titleIdx = content.indexOf(rep.title);
  if (titleIdx !== -1) {
    // find 'image:' after title, or before title?
    // It's an object in an array. Let's find the start of the object and end.
    // Or just use regex to replace the image within a window
    
    // find previous '{'
    const objStart = content.lastIndexOf('{', titleIdx);
    // find next '}'
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
