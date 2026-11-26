import fs from 'node:fs';
const urls = new Set();
for (const f of ['docs/LINKS.md','docs/SUBMISSION.md']) {
  const text = fs.readFileSync(f, 'utf8');
  for (const m of text.matchAll(/https?:\/\/[^\s)\]»"']+/g)) urls.add(m[0].replace(/[.,;]+$/, ''));
}
let bad = 0;
for (const u of [...urls].sort()) {
  try {
    const r = await fetch(u, { method: 'GET', redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0' } });
    if (!r.ok) { console.log('MISS', r.status, u); bad++; }
  } catch (e) { console.log('ERR', u, String(e).slice(0,60)); bad++; }
}
console.log(`checked ${urls.size} urls, bad=${bad}`);
