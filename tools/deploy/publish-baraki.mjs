import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import AdmZip from 'adm-zip';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const buildDir = process.env.BARAKI_BUILD || 'F:/Unity Projects/BARAKI/build/WebGL';
const template = 'F:/Unity Projects/FrostSpace/Assets/WebGLTemplates/FrostSpace/index.html';

let html = fs.readFileSync(template, 'utf8');
html = html.replace(/#if PROGRESSIVE_ASSET_LOADING[\s\S]*?#else\r?\n([\s\S]*?)#endif/, '$1');
html = html.replace(/#if SYMBOLS_FILENAME[\s\S]*?#endif\r?\n?/, '');
html = html.replace(/#if USE_WASM\r?\n([\s\S]*?)#endif/, '$1');
html = html
  .replaceAll('{{{ LOADER_FILENAME }}}', 'WebGL.loader.js')
  .replaceAll('{{{ DATA_FILENAME }}}', 'WebGL.data.unityweb')
  .replaceAll('{{{ FRAMEWORK_FILENAME }}}', 'WebGL.framework.js.unityweb')
  .replaceAll('{{{ CODE_FILENAME }}}', 'WebGL.wasm.unityweb')
  .replaceAll('{{{ JSON.stringify(COMPANY_NAME) }}}', '"Lizardan"')
  .replaceAll('{{{ JSON.stringify(PRODUCT_NAME) }}}', '"BARAKI"')
  .replaceAll('{{{ JSON.stringify(PRODUCT_VERSION) }}}', '"0.3.1"')
  .replaceAll('FrostSpace', 'BARAKI');

// WebGL build files keep stable names; bump the URL so Unity/browser caches
// (including IndexedDB UnityCache) pick up a rebuilt demo instead of the old one.
const dataPath = path.join(buildDir, 'Build/WebGL.data.unityweb');
const dataStat = fs.statSync(dataPath);
const cacheTag = `${dataStat.size.toString(36)}-${Math.round(dataStat.mtimeMs).toString(36)}`;
for (const file of [
  'WebGL.loader.js',
  'WebGL.data.unityweb',
  'WebGL.framework.js.unityweb',
  'WebGL.wasm.unityweb',
]) {
  html = html.replaceAll(file, `${file}?v=${cacheTag}`);
}

fs.writeFileSync(path.join(buildDir, 'index.html'), html);

const zip = path.join(buildDir, '..', 'baraki-webgl.zip');
const archive = new AdmZip();
const addDir = (dir, prefix) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const name = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      addDir(full, name);
    } else {
      archive.addFile(name, fs.readFileSync(full));
    }
  }
};
addDir(buildDir, '');
fs.writeFileSync(zip, archive.toBuffer());

const data = dataStat.size;
const zipSize = fs.statSync(zip).size;
console.log(`data ${(data / 1048576).toFixed(1)} MiB, zip ${(zipSize / 1048576).toFixed(1)} MiB, cache=${cacheTag}`);
if (data > 100 * 1024 * 1024) {
  console.error('data file is over 100 MiB — Pages will reject it');
  process.exit(1);
}
