import registry from '../data/taxonomy-registry.json';
export interface TopicNode { label: string; children: TopicNode[]; }
export interface Topic { id: string; name: string; children: TopicNode[]; }
const summaries = import.meta.glob('../data/*-summary.json', { eager: true, import: 'default' });
export const taxonomies = registry.map(t => {
  const entries = summaries['../data/'+t.file] as Topic[] | undefined;
  if (!entries) throw new Error('Missing taxonomy file: '+t.file);
  return { ...t, topics: entries };
});
export const topics = taxonomies.flatMap(t => t.topics);
export const deTopics = taxonomies.find(t => t.id === 'DE')!.topics;
export const aiTopics = taxonomies.find(t => t.id === 'AI')!.topics;
export function taxonomyForTopic(id: string) { return taxonomies.find(t => t.id === id.split('.')[0]); }
export function topicUrl(id: string) { return `/knowledge-map/${encodeURIComponent(id)}/`; }
export type Space = 'tech-watch' | 'job-seeking' | 'learning-lab';
export const spaceNames: Record<Space,string> = {
  'tech-watch':'Tech Watch', 'job-seeking':'Job Seeking', 'learning-lab':'Learning Lab'
};
export const spaceColors: Record<Space,string> = {
  'tech-watch':'violet', 'job-seeking':'blue', 'learning-lab':'green'
};
export const kindNames: Record<string,string> = {
  article:'Article', 'market-report':'Radar', ebook:'eBook', note:'Note', concept:'Concept'
};
export const statusNames: Record<string,string> = {
  inbox:'À lire', reading:'En cours', reviewed:'Analysé', connected:'Connecté', 'needs-update':'À actualiser'
};
export function topicName(id:string): string {
  return topics.find((t)=>t.id===id)?.name ?? id;
}
export function displayDate(d:Date | string | undefined): string {
  if(!d) return '—';
  return new Intl.DateTimeFormat('fr-FR',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(d));
}
export function entryUrl(id:string):string { return `/knowledge/${encodeURIComponent(id)}/`; }
export function allTopicIds():Set<string> { return new Set(topics.map(t=>t.id)); }
