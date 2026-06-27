#!/usr/bin/env node
/**
 * Takes a full-page screenshot of the reading result page.
 *
 * Usage:
 *   node scripts/screenshot-reading.mjs --year 2000 --month 4 --day 19 --gender female --time 10
 *
 * Options:
 *   --year, --month, --day   Birth date (required)
 *   --gender                 male | female (default: female)
 *   --time                   Time index 0-12 (default: 6)
 *   --locale                 zh | en (default: zh)
 *   --reveal                 Reveal level: full | basic | false (default: full)
 *   --base-url               Dev server URL (default: http://localhost:3000)
 *   --output                 Output directory (default: ./screenshots)
 */

import { chromium } from 'playwright';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';
import { parseArgs } from 'node:util';

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

const pad = (n) => String(n).padStart(2, '0');
const folderName = `${args.year}-${pad(args.month)}-${pad(args.day)}-${args.gender[0]}-${args.time}`;
const outputDir = join(args.output, folderName);
mkdirSync(outputDir, { recursive: true });

const baseUrl = args['base-url'];
const locale = args.locale;
const revealParam = args.reveal && args.reveal !== 'false' ? `&reveal=${args.reveal}` : '';
const url = `${baseUrl}/${locale}/free-reading?y=${args.year}&m=${args.month}&d=${args.day}&t=${args.time}&g=${args.gender}${revealParam}`;

console.log(`Screenshotting: ${folderName}/${args.locale}`);
console.log(`URL: ${url}`);

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
});

const page = await context.newPage();
await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);

const outputPath = join(outputDir, `${args.locale}.png`);
await page.screenshot({ fullPage: true, path: outputPath });

await page.close();
await context.close();
await browser.close();

console.log(`\nScreenshot saved: ${outputPath}`);
