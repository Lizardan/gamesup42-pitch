import { chromium } from 'playwright';
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const img = (n) => path.join(root, 'site/assets/img', n);
const work = path.join(root, 'docs/design');
const out = path.join(root, 'site/assets/video/trailer.mp4');
const music = 'F:/Unity Projects/FrostSpace/Assets/_Project/Content/Audio/Resources/Music/Music_FrostSpaceTheme.mp3';
const ffmpeg = (await import('ffmpeg-static')).default;

fs.mkdirSync(path.dirname(out), { recursive: true });

/* title cards via Chromium so Cyrillic fonts are the real system ones */
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const card = (kicker, title, sub) => `<!doctype html><html><body style="margin:0;width:1600px;height:900px;background:#0B0E12;color:#E9EEF2;font-family:'Segoe UI',sans-serif;display:grid;place-items:center">
<div style="text-align:center;padding:0 80px">
<div style="font-family:Consolas,monospace;font-size:14px;letter-spacing:.32em;color:#E8A85A;margin-bottom:34px">${kicker}</div>
<div style="font-size:64px;font-weight:200;letter-spacing:.12em;line-height:1.1">${title}</div>
<div style="font-family:Consolas,monospace;font-size:15px;letter-spacing:.18em;color:#8A98A3;margin-top:30px">${sub}</div>
</div></body></html>`;

const cards = [
  ['card1.png', card('СМЕНА · 30 МИНУТ', 'ДОНЕСТИ ГРУЗ.<br>НЕ ЗАМОЛЧАТЬ.', 'FROSTSPACE · 2026')],
  ['card2.png', card('ИГРАТЬ В БРАУЗЕРЕ', 'LIZARDAN.GITHUB.IO<br>/GAMESUP42-PITCH', 'FROSTSPACE · BARAKI · WOODBERRY')],
];
for (const [name, html] of cards) {
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(work, name) });
}
await browser.close();

/* hero webp -> png for ffmpeg */
await sharp(img('hero.webp')).png().toFile(path.join(work, 'trailer-hero.png'));

const shots = [
  path.join(work, 'trailer-hero.png'),
  img('train.png'),
  img('scan.png'),
  path.join(work, 'card1.png'),
  img('depot.png'),
  img('frontier.png'),
  path.join(work, 'card2.png'),
];

const per = 6, fade = 0.8;
const inputs = shots.flatMap((s) => ['-loop', '1', '-t', String(per), '-i', s]);
const scaled = shots.map((_, i) => `[${i}:v]scale=1600:900:force_original_aspect_ratio=increase,crop=1600:900,fps=25,trim=duration=${per},setpts=PTS-STARTPTS[v${i}]`);
let prev = 'v0';
let chain = scaled.join(';');
for (let i = 1; i < shots.length; i++) {
  const off = (per - fade) * i;
  const name = `x${i}`;
  chain += `;[${prev}][v${i}]xfade=transition=fade:duration=${fade}:offset=${off.toFixed(2)}[${name}]`;
  prev = name;
}
const total = per * shots.length - fade * (shots.length - 1);

const args = [
  '-y', ...inputs,
  '-stream_loop', '-1', '-i', music,
  '-filter_complex', chain,
  '-map', `[${prev}]`, '-map', `${shots.length}:a`,
  '-t', String(total),
  '-af', `afade=t=in:st=0:d=1.5,afade=t=out:st=${(total - 4).toFixed(1)}:d=4,volume=0.85`,
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '25', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart',
  out,
];
console.log('total', total.toFixed(1), 's');
execFileSync(ffmpeg, args, { stdio: 'inherit' });
console.log('trailer', out, (fs.statSync(out).size / 1048576).toFixed(1), 'MB');
