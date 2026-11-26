import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const url = process.argv[2] || 'http://127.0.0.1:4173/play/baraki/';
const browser = await chromium.launch({ headless: true, args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text().slice(0, 400)}`));
page.on('pageerror', (e) => logs.push('PAGEERR ' + String(e).slice(0, 400)));
const shot = async (name) => page.screenshot({ path: path.join(root, `docs/design/verify-${name}.png`), timeout: 120000 });
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForTimeout(65000);
await page.mouse.click(1322, 771); await page.waitForTimeout(6000);
await page.mouse.click(800, 651); await page.waitForTimeout(2500);
await page.mouse.click(800, 716);
for (const t of [4, 8, 11]) { await page.waitForTimeout(4000); await shot(`race-${t}`); }
await page.waitForTimeout(3000);
await page.mouse.click(795, 400); await page.waitForTimeout(800);
await shot('hall');
await page.mouse.click(632, 290); await page.waitForTimeout(800);
await shot('tower');
await page.mouse.click(795, 470); await page.waitForTimeout(800);
await shot('hall2');
console.log('LOGS:');
for (const l of logs) {
  if (!/WebGLDemo|SPAWN|Capsule|Kernel|error CS|Exception/.test(l)) continue;
  console.log(l);
}
await browser.close();
