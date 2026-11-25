import { chromium } from 'playwright';
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const shot = async (n) => { await page.screenshot({ path: path.join(root, `docs/design/${n}.png`), timeout: 120000 }); console.log(n); };

async function findMarker() {
  const buf = await page.screenshot({ timeout: 120000 });
  const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let sx = 0, sy = 0, n = 0;
  for (let y = 80; y < 620; y++) {
    for (let x = 650; x < 1600; x++) {
      const i = (y * info.width + x) * 3;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (b > 225 && g > 195 && r < 150 && b - r > 80) {
        sx += x; sy += y; n++;
      }
    }
  }
  return n > 20 ? { x: sx / n, y: sy / n, n } : null;
}

await page.goto('http://127.0.0.1:8099/play/frostspace/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(48000);
await page.mouse.click(960, 540); await page.waitForTimeout(500);
await page.mouse.click(200, 450);  await page.waitForTimeout(28000);
await page.mouse.click(1340, 820); await page.waitForTimeout(32000);
await page.mouse.click(800, 450); await page.waitForTimeout(800);

let vx = 800, vy = 450;
for (let i = 0; i < 4; i++) {
  const m = await findMarker();
  console.log('marker', i, m);
  if (!m) break;
  const tx = 800, ty = 450;
  const dx = Math.max(-260, Math.min(260, (tx - m.x) * 0.9));
  const dy = Math.max(-200, Math.min(200, (ty - (m.y + 130)) * 0.9));
  if (Math.abs(dx) < 12 && Math.abs(dy) < 12) break;
  vx += dx; vy += dy;
  await page.mouse.move(vx, vy, { steps: 10 });
  await page.waitForTimeout(700);
}
await shot('aimcv');
await page.keyboard.down('KeyE'); await page.waitForTimeout(900); await page.keyboard.up('KeyE');
await page.waitForTimeout(2500);
await shot('aimcv2');
await browser.close();
