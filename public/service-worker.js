/* Data Atlas PWA — lecture seule, cache explicite sans sync ni upload */
const VERSION='data-atlas-v1-ai-20261105';
const CORE=['/','/tech-watch/','/job-seeking/','/learning-lab/','/knowledge-map/','/ai-map/','/knowledge/','/library/','/search/','/guide/','/search-index.json','/offline.html','/icons/atlas-192.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(VERSION).then(async cache=>{for(const url of CORE){try{await cache.add(url)}catch(e){/* Déploiement partiel : continuer */}}}).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request;if(request.method!=='GET')return;
  const url=new URL(request.url);if(url.origin!==self.location.origin)return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(VERSION).then(c=>c.put(request,copy))}return response}).catch(async()=>await caches.match(request)||await caches.match('/offline.html')));
  }else{
    event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(VERSION).then(c=>c.put(request,copy))}return response})));
  }
});
