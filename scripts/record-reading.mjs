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
 *   --reveal                 Add ?reveal=true to show unblurred content (default: true)
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
    reveal: { type: 'string', default: 'true' },
    'base-url': { type: 'string', default: 'http://localhost:3000' },
    output: { type: 'string', default: './recordings' },
  },
});

if (!args.year || !args.month || !args.day) {
  console.error('Error: --year, --month, --day are required');
  process.exit(1);
}

const outputDir = resolve(args.output);
if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

const pad = (n) => String(n).padStart(2, '0');
const videoName = `${args.year}-${pad(args.month)}-${pad(args.day)}-${args.gender[0]}-${args.time}`;

console.log(`Recording reading for: ${videoName}`);
console.log(`Output: ${outputDir}`);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  recordVideo: {
    dir: outputDir,
    size: { width: 390, height: 844 },
  },
});

const page = await context.newPage();

const baseUrl = args['base-url'];
const locale = args.locale;
const url = `${baseUrl}/${locale}/free-reading`;

console.log(`Navigating to: ${url}`);
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

// Fill in the form
console.log('Filling form...');
const yearInput = page.locator('input[type="number"]').nth(0);
const monthInput = page.locator('input[type="number"]').nth(1);
const dayInput = page.locator('input[type="number"]').nth(2);

await yearInput.click();
await yearInput.fill(args.year);
await page.waitForTimeout(300);

await monthInput.click();
await monthInput.fill(args.month);
await page.waitForTimeout(300);

await dayInput.click();
await dayInput.fill(args.day);
await page.waitForTimeout(300);

// Select gender
if (args.gender === 'male') {
  const genderButtons = page.locator('button[type="button"]');
  await genderButtons.nth(1).click();
  await page.waitForTimeout(300);
}

// Select time
const timeSelect = page.locator('select');
await timeSelect.selectOption(args.time);
await page.waitForTimeout(300);

// Submit form
console.log('Submitting...');
const submitButton = page.locator('button[type="submit"]');
await submitButton.click();

// Wait for loading to finish and result to appear
// The loading spinner shows for ~1.5s, then result renders
await page.waitForTimeout(4000);
// Wait for result: either h2 or the four-pillar grid appears
await page.waitForFunction(() => {
  return document.querySelector('h2') || document.querySelectorAll('.grid').length > 1;
}, { timeout: 20000 });
await page.waitForTimeout(1000);
console.log('Result loaded');

// If reveal=true, add the param to trigger real reading fetch
if (args.reveal === 'true') {
  const currentUrl = new URL(page.url());
  currentUrl.searchParams.set('reveal', 'true');
  await page.goto(currentUrl.toString(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
}

// Slow scroll to bottom to capture the full reading
console.log('Scrolling to bottom...');
const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
const viewportHeight = 844;
const scrollSteps = Math.ceil(scrollHeight / (viewportHeight * 0.6));

for (let i = 0; i < scrollSteps; i++) {
  await page.evaluate((step) => {
    window.scrollBy({ top: window.innerHeight * 0.6, behavior: 'smooth' });
  }, i);
  await page.waitForTimeout(1200);
}

// Pause at the bottom
await page.waitForTimeout(2000);

// Close
await page.close();
await context.close();
await browser.close();

// Rename the video file
const { readdirSync, renameSync } = await import('node:fs');
const files = readdirSync(outputDir).filter(f => f.endsWith('.webm'));
const latest = files.sort().pop();
if (latest) {
  const finalPath = join(outputDir, `${videoName}.webm`);
  renameSync(join(outputDir, latest), finalPath);
  console.log(`\nVideo saved: ${finalPath}`);
} else {
  console.log('\nWarning: No video file found in output directory');
}
