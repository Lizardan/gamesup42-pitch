import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const browser = await chromium.launch({ headless: true, args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const shot = async (n) => { await page.screenshot({ path: path.join(root, `docs/design/${n}.png`) }); console.log(n); };
await page.goto('http://127.0.0.1:8099/play/frostspace/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(46000);
await page.mouse.click(960, 540); await page.waitForTimeout(500);
await page.mouse.click(200, 450);  await page.waitForTimeout(22000);
await page.mouse.click(1340, 820); await page.waitForTimeout(24000);
await page.mouse.click(800, 450); await page.waitForTimeout(600);   // focus
await page.mouse.move(800, 450); await page.mouse.move(800, 250, { steps: 12 }); // pitch up
await page.waitForTimeout(600);
await shot('fs-talk3');
await page.keyboard.press('KeyE'); await page.waitForTimeout(2500);
await shot('fs-talk4');
await browser.close();
