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
const index = fs.readFileSync(path.join(source, 'search-index.json'), 'utf8').replace(/</g, '\\u003c');
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
  html = html.replace("location.href='/search/'", `location.href=${JSON.stringify(relativeUrl(page, '/search/'))}`);
  html = html.replace(/\s*if\('serviceWorker' in navigator[^\n]*\n/g, '\n');
  if (path.relative(output, page) === path.join('search', 'index.html')) {
    html = replaceRequired(html,
      "fetch('/search-index.json').then(r=>{if(!r.ok)throw Error('Index indisponible');return r.json()})",
      `Promise.resolve(${index})`);
    html = replaceRequired(html, "url:'/knowledge/'+encodeURIComponent(x.id)+'/'", "url:'../knowledge/'+encodeURIComponent(x.id)+'/index.html'");
    html = replaceRequired(html, "url:'/knowledge-map/'+x.id+'/'", "url:'../knowledge-map/'+x.id+'/index.html'");
    html = replaceRequired(html, 'async function enhanceWithPagefind(){', 'async function enhanceWithPagefind(){\n        return; // The embedded full-text JSON index works without file fetches.');
    html = html.replace("Les résultats proviennent de l'index local généré au build. Pagefind est également créé après <code>npm run build</code> pour la recherche intégrale sur les pages.", 'La recherche utilise les titres, tags et textes des fiches ainsi que les 28 domaines. Son index est inclus dans cette page et fonctionne hors connexion.');
    html = html.replace('Impossible de charger l’index de recherche. Utilise le serveur local Astro.', 'La recherche locale est indisponible. Ouvre les fiches depuis Toutes les ressources.');
  }
  if (path.relative(output, page) === path.join('guide', 'index.html')) {
    html = html.replace('Une fois Cloudflare Pages connecté au dépôt, chaque mise à jour de <code>main</code> déclenchera la construction du site.', 'Cette copie locale est une version compilée. Une modification des fichiers Markdown nécessite de générer une nouvelle copie pour être visible ici.');
    html = html.replace('GitHub Actions vérifie le projet.', 'GitHub Actions vérifie le projet source.');
  }
  fs.writeFileSync(page, html);
  pages++;
}
fs.writeFileSync(path.join(output, 'LIRE_MOI.txt'), `DATA ATLAS — VERSION LOCALE\n\n1. Décompresse tout le dossier.\n2. Ouvre index.html dans Safari, Chrome ou Firefox.\n3. Garde index.html avec les sous-dossiers.\n\nAucune installation ni commande n’est nécessaire pour consulter ce site.\nLa navigation, les filtres et la recherche fonctionnent sans connexion.\nLes liens externes (Medium, O’Reilly, etc.) nécessitent Internet.\nLes eBooks PDF restent dans ta bibliothèque : ils ne sont pas inclus.\n\nCette copie contient 28 domaines et cinq fiches de départ.\nElle ne se synchronise pas automatiquement avec GitHub ou ChatGPT.\nAprès modification du Markdown, une nouvelle compilation est nécessaire.\nLa PWA concerne la future version HTTPS, pas cette copie de fichiers.\n\nPour régénérer depuis le code source dans un environnement Node.js :\nnpm ci\nnpm run build:local\nLe dossier local-site/ est alors prêt à copier sur le Mac.\n`);
console.log(`Local export ready: ${pages} HTML files in ${output}`);
