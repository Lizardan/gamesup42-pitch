import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const url = process.env.GAME_URL || 'http://127.0.0.1:8099/play/frostspace/';
const out = process.env.OUT || path.join(root, 'docs/design/fs-menu.png');

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('console', (m) => console.log('[console]', m.type(), m.text().slice(0, 200)));
page.on('pageerror', (e) => console.log('[pageerror]', e.message));

await page.goto(url, { waitUntil: 'domcontentloaded' });
console.log('navigated');
await page.waitForTimeout(45000);
await page.screenshot({ path: out });
console.log('shot', out);
await browser.close();
