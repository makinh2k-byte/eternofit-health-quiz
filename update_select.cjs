const fs = require('fs');
let c = fs.readFileSync('src/ToolsPage.jsx', 'utf8');

c = c.replace(/backgroundImage:\s*'url\([^)]+\)'/g, 
  "backgroundImage: 'url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'24\\' height=\\'24\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'%2300ff66\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'%3e%3cpolyline points=\\'6 9 12 15 18 9\\'%3e%3c/polyline%3e%3c/svg%3e\")', paddingRight: '44px'");

fs.writeFileSync('src/ToolsPage.jsx', c);
console.log('Selects updated');
