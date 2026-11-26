import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const ff = path.join(root, 'node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe');
const vid = 'C:/Users/Lizardan/Desktop/Запись 2026-11-26 023953.mp4';
const music = 'F:/Unity Projects/FrostSpace/Assets/_Project/Content/Audio/Resources/Music/Music_FrostSpaceTheme.mp3';
const d = path.join(root, 'docs/design');
const tmp = path.join(d, 'montage');
fs.mkdirSync(tmp, { recursive: true });

const V = 'scale=1600:794,fps=25,eq=brightness=-0.02:saturation=1.05,vignette=angle=PI/5';
function label(text, t0, t1) {
  const box = `drawtext=fontfile=docs/design/font.ttf:text='${text}':fontcolor=white:fontsize=30:x=88:y=h-166:box=1:boxcolor=black@0.35:boxborderw=16:enable='between(t,${t0},${t1})'`;
  const sq = `drawbox=x=62:y=h-158:w=10:h=10:color=0xE8A85A@1:t=fill:enable='between(t,${t0},${t1})'`;
  return `${box},${sq}`;
}
function clip(name, { ss, t, card, labels = [] }) {
  const out = path.join(tmp, name);
  const args = ['-y'];
  if (card) args.push('-loop', '1', '-t', String(t), '-i', card);
  else args.push('-ss', String(ss), '-t', String(t), '-i', vid);
  const vf = [`${V},format=yuv420p`];
  vf.push(`fade=t=in:st=0:d=0.5,fade=t=out:st=${t - 0.5}:d=0.5`);
  labels.forEach(([txt, a, b]) => vf.push(label(txt, a, b)));
  args.push('-vf', vf.join(','), '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', out);
  execFileSync(ff, args, { stdio: 'inherit' });
  return `file '${out.replaceAll('\\', '/')}'`;
}

// trailer
const parts = [
  clip('t0.mp4', { card: path.join(d, 'card-title.png'), t: 3 }),
  clip('t1.mp4', { ss: 10, t: 8 }),
  clip('t2.mp4', { ss: 33, t: 5, labels: [['КУРЬЕР', 0.6, 4.4]] }),
  clip('t3.mp4', { ss: 45, t: 6 }),
  clip('t4.mp4', { ss: 66, t: 10, labels: [['ГРУЗ', 0.6, 9.4]] }),
  clip('t5.mp4', { ss: 112, t: 10, labels: [['ДЕПО', 0.6, 9.4]] }),
  clip('t6.mp4', { ss: 136, t: 10, labels: [['R7 ЗНАЕТ ДОРОГУ', 0.6, 9.4]] }),
  clip('t7.mp4', { card: path.join(d, 'card-end.png'), t: 4 }),
];
const list = path.join(tmp, 'trailer.txt');
fs.writeFileSync(list, parts.join('\n'));
const base = path.join(tmp, 'trailer-base.mp4');
execFileSync(ff, ['-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', base], { stdio: 'inherit' });
const out = path.join(root, 'site/assets/video/trailer.mp4');
execFileSync(ff, ['-y', '-i', base, '-i', music, '-t', '56', '-map', '0:v', '-map', '1:a',
  '-c:v', 'copy', '-af', 'atrim=0:56,afade=t=in:st=0:d=1.5,afade=t=out:st=52:d=4,volume=0.9',
  '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', out], { stdio: 'inherit' });
console.log('trailer', (fs.statSync(out).size / 1048576).toFixed(1), 'MB');

// gameplay 33-165 with chapter labels
const g = clip('g0.mp4', { ss: 33, t: 132, labels: [
  ['01 / ПОЕЗД', 1.5, 8],
  ['02 / ПОГРУЗКА', 30.5, 37],
  ['03 / ДЕПО', 65.5, 72],
] });
const glist = path.join(tmp, 'gameplay.txt');
fs.writeFileSync(glist, g);
const gbase = path.join(tmp, 'gameplay-base.mp4');
execFileSync(ff, ['-y', '-f', 'concat', '-safe', '0', '-i', glist, '-c', 'copy', gbase], { stdio: 'inherit' });
const gout = path.join(root, 'site/assets/video/gameplay.mp4');
execFileSync(ff, ['-y', '-i', gbase, '-i', music, '-t', '132', '-map', '0:v', '-map', '1:a',
  '-c:v', 'copy', '-af', 'atrim=0:132,afade=t=in:st=0:d=1.5,afade=t=out:st=129:d=3,volume=0.85',
  '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', gout], { stdio: 'inherit' });
console.log('gameplay', (fs.statSync(gout).size / 1048576).toFixed(1), 'MB');
