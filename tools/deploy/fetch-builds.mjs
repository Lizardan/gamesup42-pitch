import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import AdmZip from 'adm-zip';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const playDir = path.join(root, 'site/play');
const skipBaraki = process.argv.includes('--skip-baraki');

const FROSTSPACE_BASE = 'https://lizardan.github.io/FrostSpace/';
const FROSTSPACE_ZIP = 'https://github.com/Lizardan/FrostSpace/releases/download/webgl-latest/frostspace-webgl.zip';
const FROSTSPACE_FILES = [
  'index.html',
  'Build/WebGL.loader.js',
  'Build/WebGL.framework.js.unityweb',
  'Build/WebGL.wasm.unityweb',
  'Build/WebGL.data.unityweb',
];
const BARAKI_ZIP = 'https://github.com/Lizardan/BARAKI/releases/download/webgl-demo/baraki-webgl.zip';

async function download(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function mirrorFrostSpace() {
  const out = path.join(playDir, 'frostspace');
  await fsp.rm(out, { recursive: true, force: true });

  try {
    const buf = await download(FROSTSPACE_ZIP);
    new AdmZip(buf).extractAllTo(out, true);
    console.log(`FrostSpace: ${(buf.length / 1048576).toFixed(1)} MB zip extracted (latest build)`);
    return;
  } catch (error) {
    console.warn(`FrostSpace release asset unavailable (${error.message}); falling back to live build`);
  }

  let total = 0;
  for (const file of FROSTSPACE_FILES) {
    const buf = await download(FROSTSPACE_BASE + file);
    const dest = path.join(out, file);
    await fsp.mkdir(path.dirname(dest), { recursive: true });
    await fsp.writeFile(dest, buf);
    total += buf.length;
    console.log(`frostspace/${file} ${(buf.length / 1048576).toFixed(2)} MB`);
  }
  console.log(`FrostSpace: ${(total / 1048576).toFixed(1)} MB (live build)`);
}

async function mirrorBaraki() {
  if (skipBaraki) {
    console.log('BARAKI: skipped by flag');
    return;
  }
  const out = path.join(playDir, 'baraki');
  try {
    const buf = await download(BARAKI_ZIP);
    await fsp.rm(out, { recursive: true, force: true });
    new AdmZip(buf).extractAllTo(out, true);
    console.log(`BARAKI: ${(buf.length / 1048576).toFixed(1)} MB zip extracted`);
  } catch (error) {
    console.warn(`BARAKI: not available (${error.message}) — site will ship without it`);
  }
}

await fsp.mkdir(playDir, { recursive: true });
await mirrorFrostSpace();
await mirrorBaraki();

const index = path.join(root, 'site/play/frostspace/index.html');
if (!fs.existsSync(index)) {
  console.error('FrostSpace mirror failed: no index.html');
  process.exit(1);
}
