#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dir=path.join(root,'src/content/entries');
const ids=new Set(JSON.parse(fs.readFileSync(path.join(root,'src/data/de-summary.json'),'utf8')).map(x=>x.id));
const files=fs.readdirSync(dir).filter(x=>x.endsWith('.md'));
const slugs=new Set(files.map(x=>x.replace(/\.md$/,'')));
let errors=0;
for(const file of files){
  const body=fs.readFileSync(path.join(dir,file),'utf8');
  const match=body.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if(!match){console.error(file+': frontmatter YAML manquant');errors++;continue;}
  const front=match[1];
  for(const key of ['title','description','space','kind','status','source','updatedAt'])if(!new RegExp('^'+key+':','m').test(front)){console.error(file+': champ requis absent : '+key);errors++;}
  const refs=[...(front.matchAll(/DE\.\d{2}/g))].map(x=>x[0]);
  for(const ref of refs)if(!ids.has(ref)){console.error(file+': topic inexistant : '+ref);errors++;}
  const relationLine=front.match(/^relatedEntries:\s*\[([^\]]*)\]/m)?.[1]||'';
  for(const x of relationLine.matchAll(/"([^"]+)"|'([^']+)'/g)){
    const id=x[1]||x[2];if(!slugs.has(id)){console.error(file+': relatedEntries inexistant : '+id);errors++;}
  }
}
if(errors){console.error(`${errors} erreur(s) détectée(s).`);process.exit(1);}
console.log(`OK — ${files.length} fiches Markdown, ${ids.size} domaines DE, références internes connues. Les schémas Astro valideront les autres métadonnées au build.`);
