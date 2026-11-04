#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, parseFragment, serialize } from 'parse5';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ui = JSON.parse(fs.readFileSync(path.join(root, 'src/i18n/interface-en.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(root, 'src/i18n/content-en.json'), 'utf8'));
const richContent = JSON.parse(fs.readFileSync(path.join(root, 'src/i18n/content-rich-en.json'), 'utf8'));

// English names identify the spaces and controls in both locales. Only the
// explanatory content changes language. Technical taxonomy labels are preserved.
function translate(value, english) {
  const white = value.match(/^(\s*)([\s\S]*?)(\s*)$/);
  let text = white[2];
  const exact = ui[text] ?? (english ? content[text] : undefined);
  if (exact !== undefined) text = exact;
  else if (text.includes(' · ')) text = text.split(' · ').map(t => translate(t, english)).join(' · ');
  text = text
    .replace(/^(\d+) fiche(s)? liée(s)? à ([A-Z][A-Z0-9_-]*\.\d{2})$/, (_, n, s, linked, id) => `${n} ${n === '1' ? 'note' : 'notes'} linked to ${id}`)
    .replace(/^(\d+) fiche(s)? associée(s)? →$/, (_, n) => `${n} linked ${n === '1' ? 'note' : 'notes'} →`)
    .replace(/^(\d+) fiches? présentes$/, '$1 entries')
    .replace(/^(\d+) domaines DE disponibles$/, '$1 DE domains')
    .replace(/^(\d+) domaines$/, '$1 domains')
    .replace(/^(\d+) fiches?$/, '$1 entries')
    .replace(/^Dernière mise à jour : /, 'Last updated: ');
  if (english) {
    text = text.replace(/(\d{2}) nov\. (\d{4})/g, '$1 Nov $2');
  }
  return white[1] + text + white[3];
}
const attr = (node, name) => node.attrs?.find(a => a.name === name);
function setAttr(node, name, value) {
  const existing = attr(node, name);
  if (existing) existing.value = value;
  else (node.attrs ||= []).push({ name, value });
}
function* walk(node) {
  yield node;
  for (const child of node.childNodes || []) yield* walk(child);
}
function textOf(node) {
  return node.nodeName === '#text' ? node.value : (node.childNodes || []).map(textOf).join(' ');
}
function* htmlFiles(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['en', 'pagefind'].includes(item.name)) continue;
    const p = path.join(dir, item.name);
    if (item.isDirectory()) yield* htmlFiles(p);
    else if (p.endsWith('.html')) yield p;
  }
}
const sources = [...htmlFiles(dist)];
const englishBodies = {};
for (const file of sources) {
  const relative = path.relative(dist, file).split(path.sep).join('/');
  const route = '/' + relative.replace(/index\.html$/, '');
  const original = fs.readFileSync(file, 'utf8');
  for (const english of [false, true]) {
    const doc = parse(original);
    for (const node of walk(doc)) {
      const rich = english && ['p', 'li'].includes(node.tagName) && richContent[textOf(node).replace(/\s+/g, ' ').trim()];
      if (rich) {
        node.childNodes = parseFragment(rich).childNodes;
        node.childNodes.forEach(n => n.parentNode = node);
      }
      if (node.tagName === 'html') setAttr(node, 'lang', english ? 'en' : 'fr');
      if (node.nodeName === '#text') {
        const parent = node.parentNode?.tagName;
        if (!['script', 'style', 'code', 'pre'].includes(parent)) {
          node.value = translate(node.value, english);
        } else if (parent === 'script' && english) {
          // Dynamic search labels and URLs must match the current locale too.
          for (const [fr, en] of Object.entries(content).filter(([key]) => key.length > 15)) {
            node.value = node.value.replaceAll(fr, en);
          }
          node.value = node.value
            .replaceAll("fetch('/search-index.json')", "fetch('/en/search-index.json')")
            .replaceAll("url:'/knowledge/'", "url:'/en/knowledge/'")
            .replaceAll("url:'/knowledge-map/'", "url:'/en/knowledge-map/'")
            .replaceAll("location.href='/search/'", "location.href='/en/search/'");
        }
      }
      for (const a of node.attrs || []) {
        if (['aria-label', 'title', 'placeholder', 'alt'].includes(a.name)) a.value = translate(a.value, english);
        if (node.tagName === 'meta' && a.name === 'content' && attr(node, 'name')?.value === 'description') a.value = translate(a.value, english);
      }
      const choice = attr(node, 'data-language')?.value;
      if (choice) {
        setAttr(node, 'href', (choice === 'en' ? '/en' : '') + route + '?lang=' + choice);
        setAttr(node, 'aria-current', choice === (english ? 'en' : 'fr') ? 'true' : 'false');
        setAttr(node, 'lang', choice);
      } else if (english && node.tagName === 'a') {
        const href = attr(node, 'href');
        if (href?.value.startsWith('/') && !href.value.startsWith('//')) href.value = '/en' + href.value;
      }
    }
    const target = english ? path.join(dist, 'en', relative) : file;
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, serialize(doc));
    if (english && relative.startsWith('knowledge/')) {
      const article = [...walk(doc)].find(n => n.tagName === 'article');
      if (article) englishBodies[relative.split('/')[1]] = textOf(article);
    }
  }
}
const index = JSON.parse(fs.readFileSync(path.join(dist, 'search-index.json'), 'utf8'));
const enIndex = {
  ...index,
  knowledge: index.knowledge.map(e => ({
    ...e, title: translate(e.title, true), description: translate(e.description, true),
    source: translate(e.source, true), body: englishBodies[e.id] ?? e.body
  }))
};
fs.writeFileSync(path.join(dist, 'en/search-index.json'), JSON.stringify(enIndex));
console.log(`Bilingual build: ${sources.length} pages per locale; English interface, French/English content.`);
