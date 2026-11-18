// news-image-20261117 v2 entry (Node 22, standard library only).
// The image is entry.png beside this file (a true PNG: the program
// verifies the PNG signature before copying) and the program copies it
// byte-for-byte to /output/entry.png. Deterministic: the same input bytes
// are copied on every run, so two runs write identical files.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// An empty MAKEFUN_OUTPUT_DIR counts as unset: fall back to /output.
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, 'entry.png');
// Fail fast with a clear message if the entry image is missing, instead of
// a bare ENOENT stack from copyFileSync.
if (!existsSync(src) || !statSync(src).isFile()) {
  throw new Error(`news-image-20261117 v2: entry image not found at ${src}`);
}
// The entry must be a true PNG, not JPEG bytes under a .png name: check
// the 8-byte PNG signature (89 50 4E 47 0D 0A 1A 0A) before copying.
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!readFileSync(src).subarray(0, 8).equals(PNG_SIGNATURE)) {
  throw new Error('news-image-20261117 v2: entry.png is not a PNG file');
}
mkdirSync(outDir, { recursive: true });
copyFileSync(src, join(outDir, 'entry.png'));
