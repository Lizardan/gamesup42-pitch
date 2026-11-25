import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const browser = await chromium.launch({ headless: true, args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await page.goto('http://127.0.0.1:8099/play/baraki/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(55000);
await page.mouse.click(1450, 856); await page.waitForTimeout(5000);
await page.mouse.click(1322, 771); await page.waitForTimeout(6000);
await page.mouse.click(800, 651);  await page.waitForTimeout(2500); // fill (also readies player)
await page.mouse.click(800, 716);  await page.waitForTimeout(12000); // start
await page.screenshot({ path: path.join(root, 'docs/design/baraki-pick.png') });
console.log('pick shot');
await page.mouse.click(800, 760); await page.waitForTimeout(4000);
await page.screenshot({ path: path.join(root, 'docs/design/baraki-pick2.png') });
console.log('pick2 shot');
await browser.close();
