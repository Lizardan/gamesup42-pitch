import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const mode = process.env.MODE || 'stills';
const isVideo = mode === 'video';
const dir = path.join(root, 'docs/design/rec-new');
fs.mkdirSync(dir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'],
});
const context = await browser.newContext({
  viewport: isVideo ? { width: 1600, height: 900 } : { width: 1920, height: 1080 },
  ...(isVideo ? { recordVideo: { dir, size: { width: 1600, height: 900 } } } : {}),
});
const page = await context.newPage();
const shot = async (n) => {
  if (isVideo) return;
  await page.screenshot({ path: path.join(root, `docs/design/${n}.png`), timeout: 120000 });
  console.log(n);
};

await page.goto('http://127.0.0.1:8099/play/frostspace/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(55000);
await shot('new-menu');
const startAt = isVideo ? [200, 450] : [200, 540];
const confirmAt = isVideo ? [1340, 820] : [1608, 984];
await page.mouse.click(960, 540); await page.waitForTimeout(500);
await page.mouse.click(startAt[0], startAt[1]);  await page.waitForTimeout(26000);
await shot('new-char');
await page.mouse.click(confirmAt[0], confirmAt[1]); await page.waitForTimeout(30000);
await shot('new-train');
if (isVideo) await page.waitForTimeout(22000);
await page.mouse.click(960, 540); await page.waitForTimeout(600);
await page.keyboard.down('KeyW'); await page.waitForTimeout(2200); await page.keyboard.up('KeyW');
await page.waitForTimeout(isVideo ? 16000 : 7000);
await shot('new-train2');
await context.close();
await browser.close();
console.log('done', mode, isVideo ? fs.readdirSync(dir) : '');
