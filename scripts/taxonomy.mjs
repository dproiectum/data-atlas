import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dataDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/data');
export function loadTaxonomies(directory = dataDir) {
  const registry = JSON.parse(fs.readFileSync(path.join(directory, 'taxonomy-registry.json'), 'utf8'));
  const seen = new Set();
  return registry.map(t => {
    const topics = JSON.parse(fs.readFileSync(path.join(directory, t.file), 'utf8'));
    for (const topic of topics) {
      if (!topic.id.startsWith(t.id + '.') || seen.has(topic.id)) throw new Error('Invalid or duplicate topic: ' + topic.id);
      seen.add(topic.id);
    }
    return { ...t, topics };
  });
}
