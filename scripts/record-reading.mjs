#!/usr/bin/env node
/**
 * Automates the free-reading page on a mobile viewport and records video.
 *
 * Usage:
 *   node scripts/record-reading.mjs --year 2000 --month 4 --day 19 --gender female --time 8
 *
 * Options:
 *   --year, --month, --day   Birth date (required)
 *   --gender                 male | female (default: female)
 *   --time                   Time index 0-12 (default: 6 = unknown/day)
 *   --locale                 zh | en (default: zh)
 *   --reveal                 Reveal level: full | basic | false (default: full)
 *   --base-url               Dev server URL (default: http://localhost:3000)
 *   --output                 Output directory for video (default: ./recordings)
 */

import { chromium } from '@playwright/test';
import { parseArgs } from 'node:util';
import { mkdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const { values: args } = parseArgs({
  options: {
    year: { type: 'string' },
    month: { type: 'string' },
    day: { type: 'string' },
    gender: { type: 'string', default: 'female' },
    time: { type: 'string', default: '6' },
    locale: { type: 'string', default: 'zh' },
    reveal: { type: 'string', default: 'full' },
    'base-url': { type: 'string', default: 'http://localhost:3000' },
    output: { type: 'string', default: './recordings' },
  },
});

if (!args.year || !args.month || !args.day) {
  console.error('Error: --year, --month, --day are required');
  process.exit(1);
}

const pad = (n) => String(n).padStart(2, '0');
const folderName = `${args.year}-${pad(args.month)}-${pad(args.day)}-${args.gender[0]}-${args.time}`;
const videoName = args.locale;
const outputDir = resolve(args.output, folderName);
mkdirSync(outputDir, { recursive: true });

console.log(`Recording: ${folderName}/${videoName}`);
console.log(`Output: ${outputDir}`);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 600, height: 1300 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  recordVideo: {
    dir: outputDir,
    size: { width: 600, height: 1300 },
  },
});

const page = await context.newPage();

const baseUrl = args['base-url'];
const locale = args.locale;
const revealParam = args.reveal && args.reveal !== 'false' ? `?reveal=${args.reveal}` : '';
const url = `${baseUrl}/${locale}/free-reading${revealParam}`;

console.log(`Navigating to: ${url}`);
await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(100);

// Fill in the form
console.log('Filling form...');
const yearInput = page.locator('input[type="number"]').nth(0);
const monthInput = page.locator('input[type="number"]').nth(1);
const dayInput = page.locator('input[type="number"]').nth(2);

await yearInput.click();
await page.waitForTimeout(300);
await yearInput.pressSequentially(args.year, { delay: 120 });
await page.waitForTimeout(600);

await monthInput.click();
await page.waitForTimeout(200);
await monthInput.pressSequentially(args.month, { delay: 120 });
await page.waitForTimeout(600);

await dayInput.click();
await page.waitForTimeout(200);
await dayInput.pressSequentially(args.day, { delay: 120 });
await page.waitForTimeout(800);

// Select gender
if (args.gender === 'male') {
  const genderButtons = page.locator('button[type="button"]');
  await genderButtons.nth(1).click();
  await page.waitForTimeout(700);
}

// Select time
const timeSelect = page.locator('select');
await timeSelect.selectOption(args.time);
await page.waitForTimeout(700);

// Scroll submit button into view and click
console.log('Submitting...');
const submitButton = page.locator('button[type="submit"]');
await submitButton.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await submitButton.click();
console.log('Submit button clicked');

// Wait for loading animation (1.5s) + result render
console.log('Waiting for result...');
await page.waitForTimeout(3000);
console.log('Result loaded');

// Smooth scroll until "换一个日期试试" button is visible in viewport
console.log('Scrolling to bottom...');
await page.evaluate(() => {
  return new Promise(resolve => {
    const pxPerFrame = 2;
    const interval = 16;

    function isTargetVisible() {
      const buttons = Array.from(document.querySelectorAll('button'));
      const target = buttons.find(b => b.textContent?.includes('换一个日期') || b.textContent?.includes('Try another'));
      if (!target) return false;
      const rect = target.getBoundingClientRect();
      return rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
    }

    const timer = setInterval(() => {
      if (isTargetVisible()) {
        clearInterval(timer);
        resolve();
        return;
      }
      window.scrollBy(0, pxPerFrame);
      // Safety: stop at page bottom
      if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 10) {
        clearInterval(timer);
        resolve();
      }
    }, interval);
  });
});

// Brief pause at the end
await page.waitForTimeout(1500);

// Close
await page.close();
await context.close();
await browser.close();

// Rename + upscale to 1080x1920
const { readdirSync, renameSync, unlinkSync } = await import('node:fs');
const { execSync } = await import('node:child_process');
const files = readdirSync(outputDir).filter(f => f.endsWith('.webm') && f.startsWith('page'));
const latest = files.sort().pop();
if (latest) {
  const rawPath = join(outputDir, `${videoName}-raw.webm`);
  const finalPath = join(outputDir, `${videoName}.mp4`);
  if (existsSync(rawPath)) unlinkSync(rawPath);
  if (existsSync(finalPath)) unlinkSync(finalPath);
  renameSync(join(outputDir, latest), rawPath);
  // upscale 600x1300 → 1080x1920, keyframe every 1s for seek
  execSync(`ffmpeg -y -i "${rawPath}" -vf "scale=1080:1920" -c:v libx264 -r 30 -g 30 -keyint_min 30 -movflags +faststart -an -pix_fmt yuv420p "${finalPath}"`);
  unlinkSync(rawPath);
  console.log(`\nVideo saved: ${finalPath}`);
} else {
  console.log('\nWarning: No video file found in output directory');
}
