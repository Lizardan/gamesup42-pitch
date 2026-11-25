import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
await page.goto('http://127.0.0.1:8099/play/baraki/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(55000);
await page.screenshot({ path: path.join(root, 'docs/design/baraki-1.png') });
console.log('launcher shot');

await page.mouse.click(1445, 868);
await page.waitForTimeout(4000);
await page.screenshot({ path: path.join(root, 'docs/design/baraki-2.png') });
console.log('after play click');

console.log('errors', JSON.stringify(errors.slice(0, 5)));
await browser.close();
