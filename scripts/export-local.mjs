#!/usr/bin/env node
// Export the compiled site for direct file:// use, without a local server.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'dist');
const output = path.join(root, 'local-site');
if (!fs.existsSync(path.join(source, 'index.html'))) {
  throw new Error('Build the Astro site before exporting it.');
}
fs.rmSync(output, { recursive: true, force: true });
fs.cpSync(source, output, {
  recursive: true,
  filter: p => !['pagefind', 'service-worker.js', 'manifest.webmanifest'].includes(path.basename(p))
});

function* walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, item.name);
    if (item.isDirectory()) yield* walk(p);
    else yield p;
  }
}
function relativeUrl(page, route) {
  const url = new URL(route, 'https://local.invalid');
  let target = path.join(output, decodeURIComponent(url.pathname));
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
  return path.relative(path.dirname(page), target).split(path.sep).join('/') + url.search + url.hash;
}
function replaceRequired(text, from, to) {
  if (!text.includes(from)) throw new Error('Offline export pattern missing: ' + from);
  return text.replace(from, to);
}
let pages = 0;
for (const page of walk(output)) {
  if (!page.endsWith('.html')) continue;
  let html = fs.readFileSync(page, 'utf8');
  html = html.replace(/<link\b[^>]*rel="manifest"[^>]*>/g, '');
  html = html.replace(/\b(href|src)="(\/[^"\s]*)"/g,
    (match, attribute, route) => route.startsWith('//') ? match : `${attribute}="${relativeUrl(page, route)}"`);
  const english = path.relative(output, page).split(path.sep)[0] === 'en';
  const prefix = english ? '/en' : '';
  html = html.replace("location.href='"+prefix+"/search/'", `location.href=${JSON.stringify(relativeUrl(page, prefix+'/search/'))}`);
  html = html.replace(/\s*if\('serviceWorker' in navigator[^\n]*\n/g, '\n');
  if (path.relative(output, page) === path.join(english ? 'en' : '', 'search', 'index.html')) {
    const index = fs.readFileSync(path.join(source, english ? 'en' : '', 'search-index.json'), 'utf8').replace(/</g, '\\u003c');
    html = replaceRequired(html,
      "fetch('"+prefix+"/search-index.json').then(r=>{if(!r.ok)throw Error('Index indisponible');return r.json()})",
      `Promise.resolve(${index})`);
    html = replaceRequired(html, "url:'"+prefix+"/knowledge/'+encodeURIComponent(x.id)+'/'", "url:'../knowledge/'+encodeURIComponent(x.id)+'/index.html'");
    html = replaceRequired(html, "url:'"+prefix+"/knowledge-map/'+x.id+'/'", "url:'../knowledge-map/'+x.id+'/index.html'");
    html = replaceRequired(html, 'async function enhanceWithPagefind(){', 'async function enhanceWithPagefind(){\n        return; // The embedded full-text JSON index works without file fetches.');
    html = html.replace(/<p class="search-hint">[\s\S]*?<\/p>/, '<p class="search-hint">'+(english
      ? 'Search covers note titles, tags, full text and the 28 domains. The index is embedded in this page and works offline.'
      : 'La recherche utilise les titres, tags et textes des fiches ainsi que les 28 domaines. Son index est inclus dans cette page et fonctionne hors connexion.')+'</p>');
  }
  if (path.relative(output, page) === path.join(english ? 'en' : '', 'guide', 'index.html')) {
    html = html.replace(/<section class="feature-block guide-prose"><h3>3\.[\s\S]*?<\/section>/,
      '<section class="feature-block guide-prose"><h3>3. '+(english?'Update this local copy':'Mettre à jour cette copie locale')+'</h3><p>'+(english
        ? 'This folder is a compiled snapshot. After editing the Markdown source, generate a new local export. GitHub Actions can build the site and prepare the downloadable local artifact without installing Node.js on your Mac.'
        : 'Ce dossier est une copie compilée. Après modification des sources Markdown, il faut générer un nouvel export local. GitHub Actions peut construire le site et préparer la copie locale sans installer Node.js sur ton Mac.')+'</p></section>');
  }
  fs.writeFileSync(page, html);
  pages++;
}
fs.writeFileSync(path.join(output, 'README.md'), `# Data Atlas — Local Edition

1. Keep this complete folder together.
2. Open index.html in Safari, Chrome or Firefox.
3. Choose Français or English in the header to change the content language.

No installation or local server is required. Navigation, filters and search work offline.
Workspace names and main controls stay in English in both content languages.
Explanations, summaries and the five initial notes have French and English versions.
The technical terms and 28-domain DE Summary are preserved.

External source links require Internet. Original eBook PDFs are not included.
This is a compiled snapshot; it does not automatically sync with GitHub or ChatGPT.
After editing source Markdown, rebuild the local export to see the changes.
For future entries, add an explicit English translation in src/i18n/content-en.json;
text without a translation is kept in its original language.

To regenerate in a Node.js build environment:
    npm ci
    npm run build:local

Copy the resulting local-site/ folder to your Mac. Cloudflare deployment is optional.
`);
console.log(`Local export ready: ${pages} HTML files in ${output}`);
