import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const url = process.env.GAME_URL || 'http://127.0.0.1:8099/play/baraki/';
const out = process.env.OUT || path.join(root, 'docs/design/baraki-boot.png');
const wait = Number(process.env.WAIT || 60000);

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 300)); });
page.on('pageerror', (e) => errors.push('PAGE ' + e.message));

await page.goto(url, { waitUntil: 'domcontentloaded' });
console.log('navigated', url);
await page.waitForTimeout(wait);
await page.screenshot({ path: out });
console.log('shot', out);
console.log('errors', JSON.stringify(errors.slice(0, 10), null, 1));
await browser.close();
