import fs from 'node:fs';
const base = 'https://lizardan.github.io/gamesup42-pitch/';
const html = fs.readFileSync('site/index.html', 'utf8');
const refs = new Set();
for (const m of html.matchAll(/(?:src|href|data-src|data-full)="([^"#][^"]*)"/g)) {
  const u = m[1];
  if (!u.startsWith('http') && !u.startsWith('#') && !u.startsWith('mailto') && !u.startsWith('play/')) refs.add(u);
}
const ids = [...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
let bad = 0;
for (const ref of [...refs].sort()) {
  const res = await fetch(base + ref, { method: 'HEAD' });
  if (!res.ok) { console.log('MISS', res.status, ref); bad++; }
}
for (const a of anchors) if (!ids.includes(a)) { console.log('BROKEN ANCHOR', a); bad++; }
console.log(`checked ${refs.size} refs, ${anchors.length} anchors, bad=${bad}`);
