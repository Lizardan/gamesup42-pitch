import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const browser = await chromium.launch({ headless: true, args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await page.goto('http://127.0.0.1:8099/play/baraki/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(55000);
await page.mouse.click(1322, 771); await page.waitForTimeout(6000);   // В БОЙ
await page.mouse.click(800, 651);  await page.waitForTimeout(2500);   // fill (auto-ready)
await page.mouse.click(800, 716);  await page.waitForTimeout(14000);  // start, auto race pick
await page.screenshot({ path: path.join(root, 'docs/design/baraki-sandbox1.png') });
console.log('sandbox1');
await page.waitForTimeout(15000);
await page.screenshot({ path: path.join(root, 'docs/design/baraki-sandbox2.png') });
console.log('sandbox2');
await browser.close();
