const fs = require('fs');
const https = require('https');

const catalogPath = './src/data/cosmo-catalog.ts';
const content = fs.readFileSync(catalogPath, 'utf8');

// Parse COSMO_CATALOG
const lines = content.split('\n');
let inCatalog = false;
let currentProduct = null;
const products = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('export const COSMO_CATALOG')) inCatalog = true;
  if (!inCatalog) continue;

  if (line.match(/^\s*\{\s*$/) && lines[i+1]?.includes('id:')) {
    currentProduct = {};
  }
  if (currentProduct) {
    const idMatch = line.match(/id:\s*"([^"]+)"/);
    if (idMatch && !currentProduct.id) currentProduct.id = idMatch[1];

    const titleMatch = line.match(/title:\s*"([^"]+)"/);
    if (titleMatch && !currentProduct.title) currentProduct.title = titleMatch[1];

    const imgMatch = line.match(/primaryImage:\s*"([^"]+)"/);
    if (imgMatch && !currentProduct.primaryImage) {
      currentProduct.primaryImage = imgMatch[1];
      products.push(currentProduct);
      currentProduct = null;
    }
  }
}

console.log(`Parsed ${products.length} products:`);
products.forEach((p, idx) => {
  console.log(`${idx + 1}. [${p.id}] ${p.title}`);
  console.log(`   ${p.primaryImage}`);
});
