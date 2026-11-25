import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(pathToFileURL(path.join(root, 'site/index.html')).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.querySelectorAll('.rv').forEach((e) => e.classList.add('in')));
await page.waitForTimeout(900);

for (const id of ['about', 'play', 'ai', 'roadmap', 'projects']) {
  const el = page.locator(`#${id}`);
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  await el.screenshot({ path: path.join(root, `docs/design/sec-${id}.png`) });
  console.log(id);
}

await browser.close();
