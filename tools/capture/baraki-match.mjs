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
await page.mouse.click(800, 651);  await page.waitForTimeout(2000); // fill slots
await page.mouse.click(800, 586);  await page.waitForTimeout(1500); // ready
await page.mouse.click(800, 716);  await page.waitForTimeout(9000); // start
await page.screenshot({ path: path.join(root, 'docs/design/baraki-race.png') });
console.log('race shot');
await page.mouse.click(800, 820); await page.waitForTimeout(15000); // confirm
await page.screenshot({ path: path.join(root, 'docs/design/baraki-game.png') });
console.log('game shot');
await browser.close();
