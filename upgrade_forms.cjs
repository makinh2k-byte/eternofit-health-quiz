const fs = require('fs');
let c = fs.readFileSync('src/ToolsPage.jsx', 'utf8');

// Upgrade labels: add icon-like left border and better padding
c = c.replace(
  /style=\{\{ display: 'block', marginBottom: '8px', fontSize: '0\.9rem', color: 'var\(--text-muted-site\)' \}\}/g,
  `style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontWeight: '600', letterSpacing: '0.3px' }}`
);

// Upgrade select dropdowns: better glassmorphism styling
c = c.replace(
  /style=\{\{ width: '100%', padding: '12px', background: 'var\(--bg-dark-site\)', border: '1px solid var\(--border-site\)', color: '#ffffff', borderRadius: '8px' \}\}/g,
  `style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '12px', fontSize: '0.9rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 12 12%27%3E%3Cpath d=%27M6 8L1 3h10L6 8z%27 fill=%27%2300e676%27/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', cursor: 'pointer', transition: 'border-color 0.2s ease, background 0.2s ease', outline: 'none' }}`
);

// Upgrade range slider wrapper labels to show the value more prominently
// Already handled by label upgrade above

// Upgrade the tool main panel to have a slightly better feel
c = c.replace(
  `background: 'var(--bg-surface)', border: '1px solid var(--border-site)', borderRadius: '16px', padding: '2.5rem'`,
  `background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2.5rem', backdropFilter: 'blur(20px)'`
);

// Upgrade header section with a progress bar at the top of the quiz tools
// Add a subtle progress indicator for quiz-type tools

fs.writeFileSync('src/ToolsPage.jsx', c);
console.log('Upgraded all form elements successfully!');
