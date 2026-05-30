const fs = require('fs');
let c = fs.readFileSync('src/ToolsPage.jsx', 'utf8');

c = c.replace(/className="site-btn-primary"\s+style=\{\{([^}]+)\}\}/g, (match, styleContent) => {
  if (!styleContent.includes('textAlign:')) {
    return `className="site-btn-primary"\n                    style={{${styleContent}, textAlign: 'center', justifyContent: 'center'}}`;
  }
  return match;
});

// Also let's style the question template slightly better since they wanted it redesigned
// Currently the buttons for questions are:
// background: tAnswers[q.key] === opt.val ? 'rgba(0,230,118,0.06)' : 'transparent',
// We can make them look more like a list item with a nice hover
c = c.replace(/border:\s*tAnswers\[q\.key\] === opt\.val \? '1px solid var\(--accent-green\)' : '1px solid var\(--border-site\)'/g, 
"border: tAnswers[q.key] === opt.val ? '2px solid var(--accent-green)' : '1px solid rgba(255,255,255,0.08)'");

c = c.replace(/background:\s*tAnswers\[q\.key\] === opt\.val \? 'rgba\(0,230,118,0\.06\)' : 'transparent'/g, 
"background: tAnswers[q.key] === opt.val ? 'rgba(0,230,118,0.1)' : 'rgba(255,255,255,0.02)'");

// Do the same for stress checker:
c = c.replace(/border:\s*stressAnswers\[q\.key\] === opt\.val \? '1px solid var\(--accent-green\)' : '1px solid var\(--border-site\)'/g, 
"border: stressAnswers[q.key] === opt.val ? '2px solid var(--accent-green)' : '1px solid rgba(255,255,255,0.08)'");

c = c.replace(/background:\s*stressAnswers\[q\.key\] === opt\.val \? 'rgba\(0,230,118,0\.06\)' : 'transparent'/g, 
"background: stressAnswers[q.key] === opt.val ? 'rgba(0,230,118,0.1)' : 'rgba(255,255,255,0.02)'");

fs.writeFileSync('src/ToolsPage.jsx', c);
console.log('Buttons updated');
