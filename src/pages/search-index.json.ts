import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {topics} from '../lib/knowledge';
export const GET: APIRoute=async ()=>{
  const entries=await getCollection('knowledge');
  const data={
    knowledge: entries.map(e=>({id:e.id,title:e.data.title,description:e.data.description,space:e.data.space,kind:e.data.kind,source:e.data.source,tags:e.data.tags,primaryTopic:e.data.primaryTopic,relatedTopics:e.data.relatedTopics,body:typeof e.body==='string'?e.body:''})),
    topics:topics.map(t=>({id:t.id,name:t.name,terms:(function visit(a:any[]):string{return a.map(v=>v.label+' '+visit(v.children||[])).join(' ')})(t.children)}))
  };
  return new Response(JSON.stringify(data),{headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=300'}});
};
