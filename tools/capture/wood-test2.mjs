import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const browser = await chromium.launch({ headless: true, args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', (e) => console.log('PAGEERR', String(e).slice(0, 200)));
try {
  console.log('goto');
  await page.goto('http://127.0.0.1:8099/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log('loaded');
  await page.waitForTimeout(3000);
  const n = await page.locator('#woodStage').count();
  console.log('stages', n);
  await page.evaluate(() => document.getElementById('woodStage').scrollIntoView({ block: 'center' }));
  console.log('scrolled');
  await page.waitForTimeout(1800);
  await page.screenshot({ path: path.join(root, 'docs/design/wood-1.png'), timeout: 60000 });
  console.log('shot1');
  await page.click('.wood-tab[data-place="cathedral"]', { timeout: 15000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(root, 'docs/design/wood-2.png'), timeout: 60000 });
  console.log('shot2');
  await page.locator('.wood-choice').first().click({ timeout: 15000 });
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(root, 'docs/design/wood-3.png'), timeout: 60000 });
  console.log('shot3');
} catch (e) { console.log('FAIL', String(e).slice(0, 300)); }
await browser.close();
