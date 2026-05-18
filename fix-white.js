const fs = require('fs');
const path = 'src/app/checkout/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/text-white/g, 'text-[#eff8ee]');
content = content.replace(/border-white\/10/g, 'border-[#eff8ee]/10');
content = content.replace(/text-white\/40/g, 'text-[#eff8ee]/40');
content = content.replace(/text-white\/20/g, 'text-[#eff8ee]/20');

fs.writeFileSync(path, content);
console.log('Fixed remaining white colors.');
