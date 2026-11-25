import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const dir = path.join(root, 'docs/design/rec-quest');
fs.mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required'] });
const context = await browser.newContext({ viewport: { width: 1600, height: 900 }, recordVideo: { dir, size: { width: 1600, height: 900 } } });
const page = await context.newPage();
const t0 = Date.now();
const mark = (s) => console.log(s, ((Date.now() - t0) / 1000).toFixed(1));
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
mark('aim');
await page.keyboard.down('KeyE'); await page.waitForTimeout(900); await page.keyboard.up('KeyE');
mark('open');
await page.waitForTimeout(2200);
await page.mouse.click(800, 820);
mark('advance');
await page.waitForTimeout(2200);
await page.keyboard.press('Digit3'); await page.waitForTimeout(900);
await page.keyboard.press('Enter');
mark('choice');
await page.waitForTimeout(3500);
await page.screenshot({ path: path.join(root, 'docs/design/quest-accepted.png'), timeout: 120000 });
mark('shot');
await page.waitForTimeout(3000);
await context.close(); await browser.close();
console.log('video', fs.readdirSync(dir));
