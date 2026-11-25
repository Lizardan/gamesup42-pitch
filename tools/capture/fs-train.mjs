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
const shot = async (name) => {
  await page.screenshot({ path: path.join(root, `docs/design/${name}.png`) });
  console.log('shot', name);
};

await page.goto('http://127.0.0.1:8099/play/frostspace/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(46000);
await page.mouse.click(960, 540);
await page.waitForTimeout(500);
await page.mouse.click(200, 450);      // НАЧАТЬ
await page.waitForTimeout(22000);
await page.mouse.click(1340, 820);     // ПОДТВЕРДИТЬ
await page.waitForTimeout(24000);
await shot('fs-train-1');

await page.keyboard.down('KeyW');
await page.waitForTimeout(1600);
await page.keyboard.up('KeyW');
await page.waitForTimeout(800);
await shot('fs-train-2');

await page.keyboard.press('KeyE');
await page.waitForTimeout(2500);
await shot('fs-train-3');

await page.keyboard.press('Space');
await page.waitForTimeout(2500);
await shot('fs-train-4');

await context.close();
await browser.close();
console.log('done', fs.readdirSync(dir).length, 'videos');
