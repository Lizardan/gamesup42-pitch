import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const browser = await chromium.launch({ headless: true, args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const shot = async (n) => { await page.screenshot({ path: path.join(root, `docs/design/${n}.png`), timeout: 120000 }); console.log(n); };
const holdE = async () => { await page.keyboard.down('KeyE'); await page.waitForTimeout(900); await page.keyboard.up('KeyE'); };
const hold = async (key, ms) => { await page.keyboard.down(key); await page.waitForTimeout(ms); await page.keyboard.up(key); await page.waitForTimeout(250); };
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
await holdE(); await page.waitForTimeout(2500);
await page.mouse.click(800, 820); await page.waitForTimeout(2500);
for (let i = 0; i < 3; i++) { await page.keyboard.press('Digit3'); await page.waitForTimeout(400); await page.keyboard.press('Enter'); await page.waitForTimeout(1200); }
await holdE(); await page.waitForTimeout(1200);
vy += 300; await page.mouse.move(vx, vy, { steps: 12 }); await page.waitForTimeout(800);
// B1
await hold('KeyD', 1000); await holdE(); await page.waitForTimeout(500);
await hold('KeyA', 3000); await hold('KeyW', 1500); await holdE(); await page.waitForTimeout(1200);
await shot('r1');
// B2
await hold('KeyD', 2500); await holdE(); await page.waitForTimeout(500);
await hold('KeyA', 2500); await hold('KeyW', 600); await holdE(); await page.waitForTimeout(1200);
await shot('r2');
// B3
await hold('KeyD', 2200); await holdE(); await page.waitForTimeout(500);
await hold('KeyA', 2200); await hold('KeyW', 500); await holdE(); await page.waitForTimeout(1200);
await shot('r3');
// B4
await hold('KeyD', 1800); await holdE(); await page.waitForTimeout(500);
await hold('KeyA', 1800); await hold('KeyW', 400); await holdE(); await page.waitForTimeout(1500);
await shot('r4');
await browser.close();
