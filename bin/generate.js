#!/usr/bin/env node

/**
 * wiz-theme bulk video generator
 * 
 * Usage:
 * npx wiz-theme generate-videos --url http://localhost:4321
 * 
 * This script uses Puppeteer to navigate to your Astro site, automatically discover
 * all quotes, and trigger the native 10-second video rendering sequence for each.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const rawArgs = process.argv.slice(2);
  if (rawArgs[0] === 'admin') {
    process.argv.splice(2, 1);
    await import('./admin.js');
    return;
  }

  let puppeteer;
  try {
    puppeteer = (await import('puppeteer')).default;
  } catch (err) {
    console.error('\n❌ Puppeteer is not installed.');
    console.error('To use the bulk video generator, please install it in your project:');
    console.error('\n  npm install -D puppeteer\n');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  let targetUrl = 'http://localhost:4321';
  let outputDir = path.join(process.cwd(), 'out-videos');

  // Parse basic args
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' && args[i + 1]) {
      targetUrl = args[i + 1];
      i++;
    } else if (args[i] === '--out' && args[i + 1]) {
      outputDir = path.join(process.cwd(), args[i + 1]);
      i++;
    }
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`\n🚀 Starting Wiz Theme Bulk Video Generator`);
  console.log(`🎯 Target URL: ${targetUrl}`);
  console.log(`📁 Output Dir: ${outputDir}\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1080, height: 1920 }, // 9:16 aspect ratio
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu-vsync', '--force-device-scale-factor=1']
  });

  const page = await browser.newPage();
  
  // Intercept downloads to save to our output directory
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: outputDir
  });

  console.log(`⏳ Navigating to ${targetUrl}...`);
  try {
    await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 30000 });
  } catch (e) {
    console.error(`❌ Failed to load ${targetUrl}. Is your dev server running?`);
    await browser.close();
    process.exit(1);
  }

  // Discover all quotes on the page
  const quoteIds = await page.evaluate(() => {
    const slides = document.querySelectorAll('.quote-slide[data-quote-id]');
    return Array.from(slides).map(s => s.getAttribute('data-quote-id'));
  });

  if (quoteIds.length === 0) {
    console.error(`❌ No quotes found on the page. Ensure the URL points to a master feed.`);
    await browser.close();
    process.exit(1);
  }

  console.log(`✨ Found ${quoteIds.length} quotes to render.\n`);

  for (let i = 0; i < quoteIds.length; i++) {
    const id = quoteIds[i];
    console.log(`[${i + 1}/${quoteIds.length}] 🎬 Rendering ${id}...`);

    try {
      // 1. Navigate to the specific quote hash to trigger the background update
      await page.goto(`${targetUrl}/#${id}`);
      await new Promise(r => setTimeout(r, 1500)); // Wait for slide to settle and background to paint

      // 2. Open the Share Modal for this quote
      const opened = await page.evaluate((quoteId) => {
        const btn = document.querySelector(`.action-btn-share[data-quote-id="${quoteId}"]`);
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      }, id);

      if (!opened) {
        console.warn(`   ⚠️ Could not find share button for ${id}. Skipping.`);
        continue;
      }

      await new Promise(r => setTimeout(r, 1000)); // Wait for modal animation

      // 3. Click the Share Video button to start the 10-second rendering process
      await page.evaluate(() => {
        const videoBtn = document.getElementById('share-video-btn');
        if (videoBtn) videoBtn.click();
      });

      console.log(`   ⏳ Recording (takes 10 seconds)...`);

      // 4. Wait for the download to complete (10s render + 2s buffer)
      await new Promise(r => setTimeout(r, 12000));

      // 5. Close the modal so we can proceed to the next quote
      await page.evaluate(() => {
        const closeBtn = document.getElementById('share-close-btn');
        if (closeBtn) closeBtn.click();
      });
      await new Promise(r => setTimeout(r, 500)); 

      console.log(`   ✅ Finished ${id}`);

    } catch (err) {
      console.error(`   ❌ Error rendering ${id}:`, err.message);
    }
  }

  console.log(`\n🎉 All videos have been rendered and saved to: ${outputDir}`);
  await browser.close();
}

run().catch(console.error);
