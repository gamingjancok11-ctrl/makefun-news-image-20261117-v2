// Build tool (runs on the author's machine only, never in the grader):
// renders page.html to entry.png with headless Chromium via Playwright.
// The entry itself is the rendered image; main.ts copies it to /output.
// Requires a Playwright chromium install in ~/.cache/ms-playwright.
// Usage: node render.mjs   (writes entry.png next to this file)
import { createRequire } from 'node:module';
import { statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire('/home/hatch/workspace/makefun/gta6-tools/package.json');
const { chromium } = require('playwright');

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'entry.png');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 1 });
await page.goto('file://' + join(here, 'page.html'), { waitUntil: 'load' });
await page.waitForTimeout(400);
// True PNG bytes in entry.png: lossless, so the dense small text stays
// crisp at the judge's ~300px view, and still under the 1 MiB cap.
await page.screenshot({ path: out, type: 'png' });
await browser.close();
console.log('wrote', out, statSync(out).size, 'bytes');
