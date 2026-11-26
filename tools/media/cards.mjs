import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const out = path.join(root, 'docs/design');
const b64 = (p) => fs.readFileSync(p).toString('base64');
const menu = b64(path.join(out, 'u-40.png'));
const depot = b64(path.join(out, 'card-bg-depot.png'));

const fonts = `<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">`;
const base = `
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;font-family:'Manrope',sans-serif;color:#E9EEF2}
.card{position:relative;width:1600px;height:794px;overflow:hidden}
.bg{position:absolute;inset:0;background-size:cover;background-position:center}
.veil{position:absolute;inset:0;background:linear-gradient(90deg,rgba(5,7,9,.96) 0%,rgba(5,7,9,.78) 46%,rgba(5,7,9,.32) 100%)}
.inner{position:absolute;left:96px;top:50%;transform:translateY(-50%);max-width:900px}
.mono{font-family:'JetBrains Mono',monospace;letter-spacing:.3em;text-transform:uppercase;font-size:16px;color:#8A98A3}
.amber{color:#E8A85A}
h1{font-weight:800;font-size:132px;line-height:.92;letter-spacing:.01em;margin:20px 0 12px}
.sub{font-family:'JetBrains Mono',monospace;font-weight:500;font-size:46px;letter-spacing:.36em;color:#6FD7E6}
.line{width:132px;height:2px;background:#E8A85A;margin:28px 0}
.tag{font-family:'JetBrains Mono',monospace;font-size:16px;letter-spacing:.22em;color:#8A98A3}
h2{font-weight:800;font-size:110px;line-height:1;letter-spacing:.02em;margin:16px 0}
`;
const html = `<!doctype html><html><head><meta charset="utf-8">${fonts}<style>${base}</style></head><body>
<div class="card" id="title"><div class="bg" style="background-image:url(data:image/png;base64,${menu})"></div><div class="veil"></div>
  <div class="inner"><div class="mono amber">Сюжетный срез · 30 минут</div><h1>FROSTSPACE</h1><div class="sub">СМЕНА</div><div class="line"></div>
  <div class="tag">ПОЕЗД · ДЕПО · СТАНЦИЯ «СЕВЕР-7»</div></div></div>
<div class="card" id="end"><div class="bg" style="background-image:url(data:image/png;base64,${depot})"></div><div class="veil"></div>
  <div class="inner"><div class="mono amber">Полная версия</div><h2>6 МЕСЯЦЕВ</h2><div class="line"></div>
  <div class="tag">СТАНЦИЯ «СЕВЕР-7» · КООП · СЕЗОНЫ</div>
  <div class="tag" style="margin-top:18px;color:#6FD7E6">LIZARDAN.GITHUB.IO/GAMESUP42-PITCH</div></div></div>
</body></html>`;

const labelHtml = (text) => `<!doctype html><html><head><meta charset="utf-8">${fonts}
<style>body{background:transparent;font-family:'JetBrains Mono',monospace}
.label{display:inline-flex;align-items:center;gap:16px;padding:16px 26px 16px 22px;font-size:32px;letter-spacing:.24em;text-transform:uppercase;color:#E9EEF2;white-space:nowrap;text-shadow:0 2px 18px rgba(0,0,0,.6)}
.label::before{content:'';width:11px;height:11px;background:#E8A85A;box-shadow:0 0 18px rgba(232,168,90,.7)}
.label i{font-style:normal;color:#E8A85A}</style></head><body><div class="label" id="lbl">${text}</div></body></html>`;

const browser = await chromium.launch({ headless: true });

const page = await browser.newPage({ viewport: { width: 1600, height: 794 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.locator('#title').screenshot({ path: path.join(out, 'card-title.png') });
await page.locator('#end').screenshot({ path: path.join(out, 'card-end.png') });
console.log('cards', fs.statSync(path.join(out, 'card-title.png')).size, fs.statSync(path.join(out, 'card-end.png')).size);

const labels = [
  ['courier', 'КУРЬЕР'],
  ['cargo', 'ГРУЗ'],
  ['depot', 'ДЕПО'],
  ['r7', 'R7 ЗНАЕТ ДОРОГУ'],
  ['01', '<i>01</i> ПОЕЗД'],
  ['02', '<i>02</i> ПОГРУЗКА'],
  ['03', '<i>03</i> ДЕПО'],
];
const lp = await browser.newPage({ viewport: { width: 1000, height: 160 } });
for (const [id, text] of labels) {
  await lp.setContent(labelHtml(text), { waitUntil: 'networkidle' });
  await lp.evaluate(() => document.fonts.ready);
  await lp.waitForTimeout(250);
  await lp.locator('#lbl').screenshot({ path: path.join(out, `label-${id}.png`), omitBackground: true });
  console.log('label', id);
}
await browser.close();