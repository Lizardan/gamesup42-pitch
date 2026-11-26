import sharp from 'sharp';
import fs from 'node:fs';
const names = ['train','carry','depot','r7','quest','char','mechanics','baraki-menu','baraki-lobby','baraki-match','wood-acolyte','wood-barn','wood-cathedral'];
for (const n of names) {
  const src = `site/assets/img/${n}.png`;
  if (!fs.existsSync(src)) { console.log('skip', n); continue; }
  await sharp(src).webp({ quality: 82 }).toFile(`site/assets/img/${n}.webp`);
  const a = fs.statSync(src).size, b = fs.statSync(`site/assets/img/${n}.webp`).size;
  console.log(n, (a/1024).toFixed(0) + 'K ->', (b/1024).toFixed(0) + 'K');
}
let html = fs.readFileSync('site/index.html', 'utf8');
for (const n of names) {
  html = html.replaceAll(`src="assets/img/${n}.png"`, `src="assets/img/${n}.webp"`);
  html = html.replaceAll(`data-full="assets/img/${n}.png"`, `data-full="assets/img/${n}.webp"`);
  html = html.replaceAll(`url(assets/img/${n}.png)`, `url(assets/img/${n}.webp)`);
}
html = html.replace(/<img src="assets\/img\//g, '<img loading="lazy" decoding="async" src="assets/img/');
html = html.replace('&family=JetBrains+Mono:wght@400;500&display=swap', '&family=JetBrains+Mono:wght@400;500&display=swap');
if (!html.includes('&display=swap')) {
  html = html.replace('family=JetBrains+Mono:wght@400;500"', 'family=JetBrains+Mono:wght@400;500&display=swap"');
}
fs.writeFileSync('site/index.html', html);
console.log('html updated');
