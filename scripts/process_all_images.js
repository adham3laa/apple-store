const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const catalogPath = path.join(__dirname, '..', 'src', 'data', 'cosmo-catalog.ts');
let content = fs.readFileSync(catalogPath, 'utf8');

// Find all unique Apple CDN URLs in the catalog
const urlRegex = /https:\/\/store\.storeimages\.cdn-apple\.com\/4982\/as-images\.apple\.com\/is\/[^"\s?]+/g;
const matchedUrls = [...new Set(content.match(urlRegex) || [])];

console.log(`Found ${matchedUrls.length} unique Apple CDN image assets.`);

const outputDir = path.join(__dirname, '..', 'public', 'devices');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadImage(url) {
  const fullUrl = `${url}?wid=2000&hei=2000&fmt=png-alpha`;
  return new Promise((resolve, reject) => {
    https.get(fullUrl, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch ${url} - Status ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function processImages() {
  const urlToLocalMap = {};

  for (let i = 0; i < matchedUrls.length; i++) {
    const rawUrl = matchedUrls[i];
    const filename = rawUrl.split('/').pop() + '.png';
    const outputPath = path.join(outputDir, filename);
    const localUrl = `/devices/${filename}`;

    urlToLocalMap[rawUrl] = localUrl;

    try {
      console.log(`[${i + 1}/${matchedUrls.length}] Downloading & trimming: ${filename}`);
      const rawBuf = await downloadImage(rawUrl);
      
      // Auto-trim transparent padding to exact hardware silhouette bounds
      const trimmedBuffer = await sharp(rawBuf)
        .trim() // Removes all empty transparent border pixels!
        .png({ quality: 95, compressionLevel: 8 })
        .toBuffer();

      fs.writeFileSync(outputPath, trimmedBuffer);
      const meta = await sharp(trimmedBuffer).metadata();
      console.log(`   ✓ Saved: ${meta.width}x${meta.height} (100% tightly trimmed transparent silhouette)`);
    } catch (err) {
      console.error(`   ✗ Error processing ${rawUrl}:`, err.message);
    }
  }

  // Update cosmo-catalog.ts to use the local tightly-trimmed assets
  console.log('\nUpdating cosmo-catalog.ts with local trimmed image paths...');
  let updatedContent = content;
  for (const [rawUrl, localPath] of Object.entries(urlToLocalMap)) {
    // Replace rawUrl with or without query params
    const escaped = rawUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const replaceRegex = new RegExp(`${escaped}(\\?[^"']*)?`, 'g');
    updatedContent = updatedContent.replace(replaceRegex, localPath);
  }

  fs.writeFileSync(catalogPath, updatedContent, 'utf8');
  console.log('✓ Successfully updated cosmo-catalog.ts with trimmed background-free hardware silhouettes!');
}

processImages().catch(console.error);
