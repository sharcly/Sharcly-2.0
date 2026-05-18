const fs = require('fs');
const path = 'src/app/checkout/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Global Background & Text
content = content.replace(/bg-\[\#FDFDFB\]/g, 'bg-[#040e07]');
content = content.replace(/text-\[\#062D1B\](?!\/)/g, 'text-[#eff8ee]');
content = content.replace(/text-\[\#062D1B\]\/([0-9]+)/g, 'text-[#eff8ee]/$1');

// Gold Accents
content = content.replace(/text-\[\#EBB56B\]/g, 'text-[#E8C547]');
content = content.replace(/bg-\[\#EBB56B\]/g, 'bg-[#E8C547]');

// Primary Buttons
content = content.replace(/bg-\[\#062D1B\] text-white/g, 'bg-[#E8C547] text-[#082f1d] hover:bg-[#f0cf55]');
content = content.replace(/bg-\[\#062D1B\]/g, 'bg-[#082f1d]'); // fallback for other backgrounds
content = content.replace(/border-\[\#062D1B\]/g, 'border-[#E8C547]');

// Cards & Backgrounds
content = content.replace(/bg-white(?!\/)/g, 'bg-[#082f1d]/40');
content = content.replace(/bg-white\/([0-9]+)/g, 'bg-[#eff8ee]/$1'); // e.g. bg-white/80
content = content.replace(/border-gray-[0-9]+/g, 'border-[#eff8ee]/10');
content = content.replace(/bg-gray-[0-9]+/g, 'bg-[#082f1d]/20');

// Stripe Elements styling
content = content.replace(/color: '#062D1B'/g, "color: '#eff8ee'");
content = content.replace(/'::placeholder': { color: 'rgba\\(6, 45, 27, 0.2\\)' }/g, "'::placeholder': { color: 'rgba(239, 248, 238, 0.4)' }");

// Checkout Input CSS
content = content.replace(/border-color: #f1f5f9; background: #ffffff;/g, 'border-color: rgba(239,248,238,0.1); background: rgba(8,47,29,0.4); color: #eff8ee;');
content = content.replace(/border-color: #062D1B; ring-color: #062D1B;/g, 'border-color: #E8C547; ring-color: #E8C547; outline: none;');

// Specific tweaks
content = content.replace(/text-black\/10/g, 'text-[#eff8ee]/20');
content = content.replace(/bg-emerald-50\/30/g, 'bg-[#E8C547]/10');
content = content.replace(/border-emerald-100/g, 'border-[#E8C547]/20');
content = content.replace(/text-emerald-700/g, 'text-[#E8C547]');
content = content.replace(/text-emerald-800\/60/g, 'text-[#eff8ee]/60');

fs.writeFileSync(path, content);
console.log('Replacements completed.');
