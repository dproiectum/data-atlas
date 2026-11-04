#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.join(root, 'local-site');
if (!fs.existsSync(path.join(site, 'en/index.html'))) throw new Error('Build the bilingual local edition first.');
const payload = execFileSync('tar', ['-czf', '-', '-C', site, '.'], { maxBuffer: 20 * 1024 * 1024 });
const hash = createHash('sha256').update(payload).digest('hex');
const encoded = payload.toString('base64').match(/.{1,76}/g).join('\n');
const script = `#!/bin/bash
# Data Atlas local updater. No network requests, Node.js or installation.
# Existing files are backed up before the compiled site is copied into place.
set -euo pipefail
target_dir="\${1:-/Users/dtl/Desktop/Data_Atlas_Local}"
if [[ ! -d "$target_dir" || ! -f "$target_dir/index.html" ]]; then
  printf 'Data Atlas folder not found: %s\\nExpected index.html in this folder. No files changed.\\n' "$target_dir" >&2
  exit 1
fi
temp_dir="$(mktemp -d "\${TMPDIR:-/tmp}/data-atlas-update.XXXXXX")"
trap 'rm -rf "$temp_dir"' EXIT
if [[ "$(uname -s)" == Darwin ]]; then decode_flag=-D; else decode_flag=-d; fi
base64 "$decode_flag" > "$temp_dir/site.tar.gz" <<'DATA_ATLAS_PAYLOAD'
${encoded}
DATA_ATLAS_PAYLOAD
actual_hash="$(shasum -a 256 "$temp_dir/site.tar.gz")"
actual_hash="\${actual_hash%% *}"
if [[ "$actual_hash" != '${hash}' ]]; then
  printf 'The update file is incomplete or damaged. No files changed.\\n' >&2
  exit 1
fi
mkdir "$temp_dir/files"
tar -xzf "$temp_dir/site.tar.gz" -C "$temp_dir/files"
backup_dir="$(mktemp -d "\${target_dir}_Backup_XXXXXX")"
cp -R "$target_dir/." "$backup_dir/"
cp -R "$temp_dir/files/." "$target_dir/"
printf 'Data Atlas updated: %s\\nBackup saved: %s\\nChoose Français or English in the header.\\n' "$target_dir" "$backup_dir"
if [[ "$(uname -s)" == Darwin ]]; then open "$target_dir/index.html"; fi
`;
const output = path.join(root, 'Data_Atlas_Update.command');
fs.writeFileSync(output, script, { mode: 0o755 });
console.log(`Local updater ready: ${output}`);
