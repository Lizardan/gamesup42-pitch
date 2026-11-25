import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto('http://127.0.0.1:8099/play/frostspace/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(46000);
await page.mouse.click(960, 540);
await page.waitForTimeout(600);
await page.mouse.click(200, 540);
await page.waitForTimeout(3500);
await page.screenshot({ path: path.join(root, 'docs/design/fs-chars.png') });
console.log('char screen shot');
await browser.close();
