import AdmZip from 'adm-zip';
import fs from 'node:fs';
const src = 'F:/Unity Projects/FrostSpace/Builds/WebGL';
const out = 'F:/Unity Projects/FrostSpace/Builds/frostspace-webgl-linux.zip';
const zip = new AdmZip();
zip.addLocalFolder(src);
zip.writeZip(out);
console.log(out, (fs.statSync(out).size / 1048576).toFixed(1), 'MB');
