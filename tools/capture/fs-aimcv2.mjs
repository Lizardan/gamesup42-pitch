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
  const pts = [];
  for (let y = 80; y < 650; y++) {
    for (let x = 760; x < 1600; x++) {
      const i = (y * info.width + x) * 3;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (b > 175 && g > 160 && r < 120 && b - r > 70) pts.push([x, y]);
    }
  }
  if (pts.length < 15) return null;
  let sx = 0, sy = 0;
  for (const [x, y] of pts) { sx += x; sy += y; }
  return { x: sx / pts.length, y: sy / pts.length, n: pts.length };
}

await page.goto('http://127.0.0.1:8099/play/frostspace/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(50000);
for (let i = 0; i < 3; i++) { await page.mouse.click(200, 450); await page.waitForTimeout(2500); }
await page.waitForTimeout(34000);
for (let i = 0; i < 3; i++) { await page.mouse.click(1340, 820); await page.waitForTimeout(2000); }
await page.waitForTimeout(36000);
await page.mouse.click(800, 450); await page.waitForTimeout(800);
await shot('robust-train');

let vx = 800, vy = 450;
for (let i = 0; i < 5; i++) {
  const m = await findMarker();
  console.log('marker', i, m);
  if (!m) break;
  const dx = Math.max(-240, Math.min(240, (800 - m.x) * 0.85));
  const dy = Math.max(-180, Math.min(180, (450 - (m.y + 190)) * 0.8));
  if (Math.abs(dx) < 12 && Math.abs(dy) < 12) break;
  vx += dx; vy += dy;
  await page.mouse.move(vx, vy, { steps: 10 });
  await page.waitForTimeout(800);
}
await shot('robust-aim');
await page.keyboard.down('KeyE'); await page.waitForTimeout(900); await page.keyboard.up('KeyE');
await page.waitForTimeout(2500);
await shot('robust-e');
await browser.close();
