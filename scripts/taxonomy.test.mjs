import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { validateContent } from './validate-content.mjs';
function fixture(run) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-taxonomy-'));
  try { return run(dir); } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}
const base = 'title: Fixture note\ndescription: A fixture for mixed topic mapping.\nspace: tech-watch\nkind: note\nstatus: inbox\nsource: Fixture\nupdatedAt: 2026-11-05\n';
function note(dir, name, metadata) {
  const file = path.join(dir, name + '.md');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, '---\n' + base + metadata + '\n---\nFixture body.\n');
}
test('DE and AI references work together, including multiline YAML and nested notes', () => fixture(dir => {
  note(dir, 'nested/agent', 'primaryTopic: AI.04\nrelatedTopics:\n  - DE.17\n  - AI.05\nrelatedEntries:\n  - semantic');
  note(dir, 'semantic', 'primaryTopic: DE.17\nrelatedTopics: [AI.04]');
  assert.deepEqual(validateContent(dir).errors, []);
}));
test('unknown AI and DE references are rejected', () => fixture(dir => {
  note(dir, 'invalid', 'primaryTopic: AI.99\nrelatedTopics:\n  - DE.99\n  - AI.98');
  const errors = validateContent(dir).errors.join('\n');
  for (const id of ['AI.99', 'DE.99', 'AI.98']) assert(errors.includes(id));
}));
test('broken entry links and malformed YAML lists are rejected', () => fixture(dir => {
  note(dir, 'invalid', 'relatedTopics: AI.04\nrelatedEntries:\n  - missing-note');
  const errors = validateContent(dir).errors.join('\n');
  assert(errors.includes('relatedTopics must be an array'));
  assert(errors.includes('missing-note'));
}));
test('the original 28-domain DE taxonomy is unchanged and production notes validate', () => {
  const original = fs.readFileSync(new URL('../src/data/de-summary.json', import.meta.url));
  const gitBlob = createHash('sha1').update(Buffer.from('blob '+original.length+'\0')).update(original).digest('hex');
  assert.equal(gitBlob, 'fc60490d12a8c041e912d0a1f86f62d333875a64');
  const result = validateContent();
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.taxonomies, [{ id: 'DE', count: 28 }, { id: 'AI', count: 7 }]);
});
