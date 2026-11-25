import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const work = path.join(root, 'docs/design');
const out = path.join(root, 'site/assets/video/trailer.mp4');
const gameplay = path.join(root, 'site/assets/video/gameplay-train.mp4');
const music = 'F:/Unity Projects/FrostSpace/Assets/_Project/Content/Audio/Resources/Music/Music_FrostSpaceTheme.mp3';
const ffmpeg = path.join(root, 'node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe');

const webm = fs.readdirSync(path.join(work, 'rec-new'))
  .filter((f) => f.endsWith('.webm'))
  .map((f) => path.join(work, 'rec-new', f))
  .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];

const card1 = path.join(work, 'card1.png');
const card2 = path.join(work, 'card2.png');

const total = 51.5;
const filter = [
  `[0:v]scale=1600:900,fps=25,setpts=PTS-STARTPTS,fade=t=in:st=0:d=0.5,fade=t=out:st=9.5:d=0.5[v0]`,
  `[1:v]scale=1600:900,fps=25,setpts=PTS-STARTPTS,fade=t=in:st=0:d=0.5,fade=t=out:st=5.5:d=0.5[v1]`,
  `[2:v]scale=1600:900,fps=25,setpts=PTS-STARTPTS,fade=t=in:st=0:d=0.5,fade=t=out:st=15.5:d=0.5[v2]`,
  `[3:v]scale=1600:900,fps=25,trim=duration=3.5,setpts=PTS-STARTPTS,fade=t=in:st=0:d=0.4,fade=t=out:st=3.1:d=0.4[v3]`,
  `[4:v]scale=1600:900,fps=25,setpts=PTS-STARTPTS,fade=t=in:st=0:d=0.5,fade=t=out:st=11.5:d=0.5[v4]`,
  `[5:v]scale=1600:900,fps=25,trim=duration=4,setpts=PTS-STARTPTS,fade=t=in:st=0:d=0.5,fade=t=out:st=3.5:d=0.5[v5]`,
  `[v0][v1][v2][v3][v4][v5]concat=n=6:v=1:a=0[vout]`,
  `[6:a]atrim=0:${total},afade=t=in:st=0:d=1.5,afade=t=out:st=${total - 4}:d=4,volume=0.85[aout]`,
].join(';');

execFileSync(ffmpeg, [
  '-y',
  '-ss', '59', '-t', '10', '-i', webm,
  '-ss', '86', '-t', '6', '-i', webm,
  '-ss', '110', '-t', '16', '-i', webm,
  '-loop', '1', '-t', '3.5', '-i', card1,
  '-ss', '135', '-t', '12', '-i', webm,
  '-loop', '1', '-t', '4', '-i', card2,
  '-i', music,
  '-filter_complex', filter,
  '-map', '[vout]', '-map', '[aout]',
  '-t', String(total),
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '22', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart',
  out,
], { stdio: 'inherit' });

execFileSync(ffmpeg, [
  '-y', '-ss', '100', '-t', '30', '-i', webm,
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '24', '-pix_fmt', 'yuv420p', '-an',
  '-movflags', '+faststart', gameplay,
], { stdio: 'inherit' });

console.log('trailer', (fs.statSync(out).size / 1048576).toFixed(1), 'MB');
console.log('gameplay', (fs.statSync(gameplay).size / 1048576).toFixed(1), 'MB');
