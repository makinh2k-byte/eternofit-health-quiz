const fs = require('fs');
let c = fs.readFileSync('src/ToolsPage.jsx', 'utf8');

// Replace the bare <div> wrappers for dropdown fields with styled card containers
// Target pattern: <div>\n  <label style={{...}}>...\n  <select ...>
// We need to wrap them in a nicer card

// Upgrade the select focus state via adding onFocus/onBlur
c = c.replace(
  /(<select\s)/g,
  '$1onFocus={(e) => { e.target.style.borderColor = "var(--accent-green)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,230,118,0.1)"; }} onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }} '
);

// Make range inputs more premium with a wrapper style
// Replace the simple accentColor style range inputs
c = c.replace(
  /style=\{\{ width: '100%', accentColor: 'var\(--accent-green\)' \}\}/g,
  `style={{ width: '100%', accentColor: 'var(--accent-green)', height: '6px' }}`
);

fs.writeFileSync('src/ToolsPage.jsx', c);
console.log('Enhanced select and slider elements!');
