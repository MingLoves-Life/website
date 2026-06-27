#!/usr/bin/env node
/**
 * Saves a reading JSON to public/readings/{key}.json
 *
 * Usage:
 *   node scripts/save-reading.mjs --file path/to/reading.json
 *   OR pipe JSON via stdin:
 *   echo '{"locale":"zh",...}' | node scripts/save-reading.mjs
 *
 * The JSON must contain birthInfo: { year, month, day, timeIndex, gender }
 * The filename is derived from birthInfo automatically.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { parseArgs } from 'node:util';

const { values: args } = parseArgs({
  options: {
    file: { type: 'string' },
  },
});

let jsonStr;
if (args.file) {
  jsonStr = readFileSync(resolve(args.file), 'utf-8');
} else {
  jsonStr = readFileSync(0, 'utf-8');
}

const data = JSON.parse(jsonStr);

if (!data.birthInfo) {
  console.error('Error: JSON must contain birthInfo field');
  process.exit(1);
}

const { year, month, day, timeIndex, gender } = data.birthInfo;
const pad = (n) => String(n).padStart(2, '0');
const key = `${year}-${pad(month)}-${pad(day)}-${gender[0]}-${timeIndex}`;

const outDir = resolve('public/readings');
mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, `${key}.json`);
writeFileSync(outPath, JSON.stringify(data, null, 2));
console.log(`Saved: ${outPath}`);
