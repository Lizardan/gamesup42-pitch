import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });

for (const name of ['a', 'b', 'c']) {
  const file = path.join(root, 'docs/design', `${name}.html`);
  await page.goto('file:///' + file.replaceAll('\\', '/'));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(root, 'docs/design', `shot-${name}.png`) });
  console.log('shot', name);
}

await browser.close();
