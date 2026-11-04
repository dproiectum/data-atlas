import allTopics from '../data/de-summary.json';
export const topics = allTopics;
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
