import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const dir = path.join(root, 'docs/design/rec');
fs.mkdirSync(dir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'],
});
const context = await browser.newContext({
  viewport: { width: 1600, height: 900 },
  recordVideo: { dir, size: { width: 1600, height: 900 } },
});
const page = await context.newPage();
await page.goto('http://127.0.0.1:8099/play/frostspace/', { waitUntil: 'domcontentloaded' });
console.log('loaded, waiting unity');
await page.waitForTimeout(46000);
await page.mouse.click(960, 540);
await page.waitForTimeout(600);
await page.mouse.click(200, 450);
console.log('clicked start');
await page.waitForTimeout(22000);
await page.screenshot({ path: path.join(root, 'docs/design/fs-chars2.png') });
console.log('char shot');
await context.close();
await browser.close();
console.log('video dir', dir, fs.readdirSync(dir));
