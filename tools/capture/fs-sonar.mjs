import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const browser = await chromium.launch({ headless: true, args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const shot = async (n) => { await page.screenshot({ path: path.join(root, `docs/design/${n}.png`), timeout: 120000 }); console.log(n); };
await page.goto('http://127.0.0.1:8099/play/frostspace/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(48000);
for (let i = 0; i < 3; i++) { await page.mouse.click(200, 450); await page.waitForTimeout(2500); }
await page.waitForTimeout(32000);
for (let i = 0; i < 3; i++) { await page.mouse.click(1340, 820); await page.waitForTimeout(2000); }
await page.waitForTimeout(32000);
await page.mouse.click(800, 450); await page.waitForTimeout(700);
await page.keyboard.press('KeyQ'); await page.waitForTimeout(2200);
await shot('sonar1');
await page.keyboard.press('KeyQ'); await page.waitForTimeout(3500);
await shot('sonar2');
await browser.close();
