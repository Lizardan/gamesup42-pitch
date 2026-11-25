import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const browser = await chromium.launch({ headless: true, args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const shot = async (n) => { await page.screenshot({ path: path.join(root, `docs/design/${n}.png`), timeout: 120000 }); console.log(n); };
const holdE = async () => { await page.keyboard.down('KeyE'); await page.waitForTimeout(900); await page.keyboard.up('KeyE'); };
await page.goto('http://127.0.0.1:8099/play/frostspace/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(48000);
for (let i = 0; i < 3; i++) { await page.mouse.click(200, 450); await page.waitForTimeout(2500); }
await page.waitForTimeout(32000);
for (let i = 0; i < 3; i++) { await page.mouse.click(1340, 820); await page.waitForTimeout(2000); }
await page.waitForTimeout(32000);
await page.mouse.click(800, 450); await page.waitForTimeout(700);
let vx = 800, vy = 470;
for (let i = 0; i < 3; i++) { vx += 210; vy += 20; await page.mouse.move(vx, vy, { steps: 10 }); await page.waitForTimeout(600); }
vx += 30; vy += 220; await page.mouse.move(vx, vy, { steps: 12 }); await page.waitForTimeout(800);
await holdE(); await page.waitForTimeout(2200);
await holdE(); await page.waitForTimeout(2200);
await page.mouse.click(800, 751); await page.waitForTimeout(900);
await page.keyboard.press('Enter'); await page.waitForTimeout(2500);
await shot('k1');
await holdE(); await page.waitForTimeout(1800);
await holdE(); await page.waitForTimeout(800); await holdE(); await page.waitForTimeout(1400);
await shot('k2');
await page.keyboard.down('KeyA'); await page.waitForTimeout(1500); await page.keyboard.up('KeyA'); await page.waitForTimeout(500);
await holdE(); await page.waitForTimeout(800);
await page.keyboard.down('KeyD'); await page.waitForTimeout(1500); await page.keyboard.up('KeyD'); await page.waitForTimeout(500);
await holdE(); await page.waitForTimeout(1400);
await shot('k3');
await browser.close();
