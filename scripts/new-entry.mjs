#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadTaxonomies } from './taxonomy.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args={};
for(let i=2;i<process.argv.length;i++){
  const arg=process.argv[i];
  if(arg.startsWith('--')){const k=arg.slice(2);if(['help','dry-run'].includes(k)){args[k]=true;continue;} args[k]=process.argv[++i]??'';}
}
const usage=`Usage : npm run add -- --space tech-watch --kind article --title "Titre" --source "Medium" [--url https://...] [--topic AI.04] [--related DE.17,AI.05] [--tags "AI Agents,SQL"] [--location "OneDrive/..."]\nEspaces : tech-watch | job-seeking | learning-lab\nTypes : article | market-report | ebook | note | concept\n`;
if(args.help){console.log(usage);process.exit(0);}
const spaces=new Set(['tech-watch','job-seeking','learning-lab']);
const kinds=new Set(['article','market-report','ebook','note','concept']);
function invalid(msg){console.error('Erreur : '+msg+'\n'+usage);process.exit(1);}
if(!spaces.has(args.space)) invalid('Espace manquant ou invalide');
if(!kinds.has(args.kind)) invalid('Type manquant ou invalide');
if(!args.title?.trim()) invalid('Le titre est obligatoire');
if(!args.source?.trim()) invalid('La source est obligatoire');
if(args.url&&!/^https?:\/\/\S+$/i.test(args.url))invalid('URL non valide');
const taxonomy=loadTaxonomies().flatMap(t=>t.topics);
const allowed=new Set(taxonomy.map(x=>x.id));
const primary=args.topic||'';
const related=(args.related||'').split(',').map(x=>x.trim()).filter(Boolean);
for(const ref of [primary,...related].filter(Boolean))if(!allowed.has(ref))invalid('Topic inconnu : '+ref);
const tags=(args.tags||'').split(',').map(x=>x.trim()).filter(Boolean);
const slug=args.title.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,72);
if(!slug) invalid('Titre impossible à convertir en nom de fichier');
const filepath=path.join(root,'src/content/entries',slug+'.md');
if(fs.existsSync(filepath))invalid('Le fichier existe déjà : '+filepath);
const q=v=>JSON.stringify(v);
const array=a=>'['+a.map(q).join(', ')+']';
const now=new Date().toISOString().slice(0,10);
const front=['---',`title: ${q(args.title.trim())}`,`description: ${q('Fiche à enrichir : '+args.title.trim())}`,`space: ${q(args.space)}`,`kind: ${q(args.kind)}`,'status: "inbox"',`source: ${q(args.source.trim())}`];
if(args.url)front.push(`sourceUrl: ${q(args.url)}`);
if(args.location)front.push(`sourceLocation: ${q(args.location)}`);
if(args.author)front.push(`author: ${q(args.author)}`);
front.push(`updatedAt: ${now}`);
if(primary)front.push(`primaryTopic: ${q(primary)}`);
front.push(`relatedTopics: ${array(related)}`,`tags: ${array(tags)}`,'relatedEntries: []','---','');
const body=['# Notes initiales','','## Résumé','','À rédiger après lecture ou discussion.','','## Concepts clés','','À compléter.','','## Ce que j’ai appris','','À compléter.','','## Relations et ressources','','À compléter.',''];
const content=front.join('\n')+body.join('\n');
if(args['dry-run']){console.log(content);process.exit(0);}
fs.writeFileSync(filepath,content,'utf8');console.log('Fiche créée : '+filepath);console.log('Étape suivante : compléter le Markdown, puis npm run validate && npm run build');
