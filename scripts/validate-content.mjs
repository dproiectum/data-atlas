#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';
import { loadTaxonomies } from './taxonomy.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
function filesIn(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(item => {
    const file = path.join(directory, item.name);
    return item.isDirectory() ? filesIn(file) : file.endsWith('.md') ? [file] : [];
  });
}
export function validateContent(directory = path.join(root, 'src/content/entries')) {
  const taxonomies = loadTaxonomies();
  const ids = new Set(taxonomies.flatMap(t => t.topics.map(x => x.id)));
  const files = filesIn(directory);
  const entryIds = new Set(files.map(file => path.relative(directory, file).split(path.sep).join('/').replace(/\.md$/, '')));
  const errors = [];
  for (const file of files) {
    const label = path.relative(directory, file);
    const frontmatter = fs.readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    if (!frontmatter) { errors.push(label + ': missing YAML frontmatter'); continue; }
    const doc = parseDocument(frontmatter[1]);
    if (doc.errors.length) { errors.push(label + ': invalid YAML'); continue; }
    const data = doc.toJS();
    if (!data || typeof data !== 'object' || Array.isArray(data)) { errors.push(label + ': metadata must be a mapping'); continue; }
    for (const key of ['title', 'description', 'space', 'kind', 'status', 'source', 'updatedAt']) {
      if (data[key] === undefined || data[key] === null || data[key] === '') errors.push(label + ': missing required field ' + key);
    }
    if (data.primaryTopic !== undefined && !ids.has(data.primaryTopic)) errors.push(label + ': unknown topic ' + data.primaryTopic);
    for (const [key, allowed] of [['relatedTopics', ids], ['relatedEntries', entryIds]]) {
      if (data[key] === undefined) continue;
      if (!Array.isArray(data[key])) { errors.push(label + ': ' + key + ' must be an array'); continue; }
      for (const id of data[key]) if (!allowed.has(id)) errors.push(label + ': unknown ' + key + ' reference ' + id);
    }
  }
  return { errors, entries: files.length, taxonomies: taxonomies.map(t => ({ id: t.id, count: t.topics.length })) };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = validateContent();
  if (result.errors.length) { result.errors.forEach(e => console.error(e)); process.exitCode = 1; }
  else console.log(`OK — ${result.entries} Markdown entries; ${result.taxonomies.map(t => t.count + ' ' + t.id + ' domains').join(', ')}; valid cross-references.`);
}
