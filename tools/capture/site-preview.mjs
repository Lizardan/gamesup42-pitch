import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('requestfailed', (r) => errors.push(`FAILED ${r.url()} ${r.failure()?.errorText}`));

await page.goto('file:///' + path.join(root, 'site/index.html').replaceAll('\\', '/'), { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await page.screenshot({ path: path.join(root, 'docs/design/site-hero.png') });
await page.evaluate(() => document.querySelectorAll('.rv').forEach((el) => el.classList.add('in')));
await page.screenshot({ path: path.join(root, 'docs/design/site-full.png'), fullPage: true });
const height = await page.evaluate(() => document.body.scrollHeight);
console.log('height', height);
console.log('errors', JSON.stringify(errors, null, 1));
await browser.close();
