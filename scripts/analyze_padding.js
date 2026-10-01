const fs = require('fs');
const https = require('https');
const sharp = require('sharp');
const path = require('path');

const urls = [
  { id: 'iphone-16-pro', url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-deserttitanium?wid=2000&hei=2000&fmt=png-alpha' },
  { id: 'iphone-16', url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-ultramarine?wid=2000&hei=2000&fmt=png-alpha' },
  { id: 'macbook-pro', url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spaceblack-select-202410?wid=2000&hei=2000&fmt=png-alpha' },
  { id: 'airpods-max', url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-202409-starlight?wid=2000&hei=2000&fmt=png-alpha' },
  { id: 'airpods-pro-2', url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MTJV3?wid=2000&hei=2000&fmt=png-alpha' },
  { id: 'apple-watch-ultra-2', url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-card-40-ultra2-202409?wid=2000&hei=2000&fmt=png-alpha' },
  { id: 'studio-display', url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MK0U3?wid=2000&hei=2000&fmt=png-alpha' }
];

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
  });
}

async function analyze() {
  for (const item of urls) {
    const buf = await fetchBuffer(item.url);
    const meta = await sharp(buf).metadata();
    const trimmed = await sharp(buf).trim().toBuffer({ resolveWithObject: true });
    const coverage = ((trimmed.info.width * trimmed.info.height) / (meta.width * meta.height) * 100).toFixed(1);
    console.log(`[${item.id}] Canvas: ${meta.width}x${meta.height} -> Trimmed: ${trimmed.info.width}x${trimmed.info.height} (Occupies only ${coverage}% of canvas area!)`);
  }
}

analyze();
