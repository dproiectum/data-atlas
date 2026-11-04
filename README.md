# Data Atlas — Knowledge Library

**Local first · Astro · Markdown · GitHub · PWA**  
URL cible (non déployée) : `https://dataatlas.allops.cloud`

## Objectif

Data Atlas relie trois espaces de connaissances :

- **Tech Watch** : blogs, Medium, retours d'expérience et synthèses critiques ;
- **Job Seeking** : O'Reilly Radar, tendances, Job Scan et compétences ;
- **Learning Lab** : eBooks, parcours d'apprentissage, concepts et exercices.

**Les deux ressources de référence ne sont pas modifiées :**

1. **DE Summary** : ses 28 domaines et sous-thèmes sont répliqués uniquement dans `src/data/de-summary.json` pour la navigation et le mapping. Modifier cet index dans Atlas n'édite pas le DE Summary original.
2. **Bibliothèque eBooks** : aucun PDF n'a été importé, déplacé ou renommé ; les notices contiennent simplement une référence à OneDrive.

## Démarrage recommandé — sans installation Node.js sur Mac

Tu peux utiliser Git **déjà disponible sur ton Mac** pour modifier les Markdown et publier les changements. **Node.js et Astro seront exécutés sur Cloudflare Pages** lors du build distant, pas sur ton ordinateur.

- [`docs/CHATGPT_ORGANISATION.md`](docs/CHATGPT_ORGANISATION.md) : noms des sections, dossiers et conversations ChatGPT (à appliquer manuellement dans l'interface).
- [`docs/PUBLICATION_SANS_INSTALLATION.md`](docs/PUBLICATION_SANS_INSTALLATION.md) : dépôt GitHub, import des fichiers, Cloudflare Pages, domaine et PWA.
- [`templates/`](templates/) : modèles à copier pour un article Medium, un Radar de marché ou un eBook.

**Prévisualisation Astro locale (facultative)** : uniquement si tu décides un jour d'installer Node.js sur le Mac, `npm install && npm run dev`. Ce n'est pas nécessaire pour publier et lire le site via GitHub + Cloudflare.

## Consultation locale sans installation

La version compilée locale s’ouvre en double-cliquant sur `index.html` dans le dossier exporté. Navigation, filtres et recherche fonctionnent directement depuis les fichiers, sans serveur ni installation Node.js sur le Mac.

Pour produire cette copie dans un environnement de compilation Node.js :

```bash
npm ci
npm run build:local
```

Le dossier `local-site/` contient le résultat à copier sur le Mac. Garder tous ses sous-dossiers avec `index.html`. Cette copie ne se synchronise pas automatiquement ; après modification des Markdown, il faut la régénérer. Les PDF ne sont pas inclus et les liens externes demandent Internet.

## Ajouter une ressource

La voie **sans installation locale** consiste à copier l’un des fichiers de `templates/` vers `src/content/entries/<nom-unique>.md`, puis à remplacer ses métadonnées et son contenu. Une modification depuis l’éditeur GitHub fonctionne également.

Si Node.js est disponible dans un environnement de développement, le script ci-dessous permet de générer les mêmes fiches plus rapidement :

```bash
# Article Medium
npm run add -- \
  --space tech-watch \
  --kind article \
  --title "My New Article" \
  --source "Medium" \
  --url "https://example.com/article" \
  --topic DE.17 \
  --related DE.14,DE.09 \
  --tags "Semantic Layer,AI Agents"

# Notice d'un livre : ne copie ou ne déplace pas le PDF.
npm run add -- \
  --space learning-lab \
  --kind ebook \
  --title "My Spark Book" \
  --source "OneDrive eBooks" \
  --topic DE.11 \
  --related DE.23 \
  --tags "Spark,Optimization"
```

Ce script génère un fichier Markdown dans `src/content/entries/`. Ouvre-le pour compléter le résumé, les concepts et l'analyse. Les pages du site sont générées à partir du contenu au démarrage ou au prochain build.

**Pour modifier une fiche**, édite directement le Markdown existant en conservant son nom de fichier, qui constitue son identifiant stable. Utilise `relatedEntries: [...]` avec les identifiants (noms de fichiers sans `.md`).

## Vérifier et générer le site (sur Cloudflare ou environnement Node.js)

```bash
npm run validate
npm run build
npm run preview
```

`npm run build` effectue `astro build`, puis génère l'index **Pagefind** à partir des pages dans `dist/`. Un index JSON indépendant rend aussi la recherche fonctionnelle en développement. Le résultat `dist/` est un **site statique** : pas de base SQL, API ni CMS.

> **Vérification :** compilation Astro complète réussie dans l’environnement de travail, 42 pages générées et cinq fiches indexées par Pagefind. Les dépendances exactes sont enregistrées dans `package-lock.json`. GitHub Actions répète la compilation sur les push vers `main` et sur les pull requests.

## Organisation

```text
data-atlas/
├── public/
│   ├── icons/                # Icône PWA
│   ├── manifest.webmanifest
│   ├── offline.html
│   └── service-worker.js
├── src/
│   ├── components/           # UI réutilisable
│   ├── content/
│   │   └── entries/          # Articles, livres, notes Markdown
│   ├── content.config.ts     # Schéma et validation Astro
│   ├── data/
│   │   └── de-summary.json   # Réplique de consultation des 28 domaines
│   ├── layouts/
│   ├── lib/
│   ├── pages/                # Routes statiques
│   └── styles/
├── scripts/
│   ├── new-entry.mjs        # Création de fiche CLI
│   └── validate-content.mjs # Contrôle des références de mapping
└── package.json
```

## Publication (non effectuée)

Option ciblée : **GitHub (public pour le moment, choix validé) → Cloudflare Pages → `dataatlas.allops.cloud`**.

- Connecter un dépôt GitHub à Cloudflare Pages.
- Framework : **Astro** ; Build command : `npm run build` ; Output : `dist`.
- Configurer le sous-domaine personnalisé dans Cloudflare DNS.
- **Avant la publication**, mettre en place Cloudflare Access si tes notes doivent rester privées. Un dépôt GitHub privé, ou la balise `noindex`, **ne protège pas** le site publié.
- Éviter les informations confidentielles, chemins complets de ton Mac et PDF protégés par le droit d'auteur dans le répertoire `public/` et dans le Markdown publié.

## PWA sur iPhone

Après déploiement HTTPS, ouvre le site dans Safari puis utilise **Partager → Sur l'écran d'accueil**. La PWA est **en lecture seule**.

- La page d'accueil et les espaces sont préchargés ; les fiches de détail sont mises en cache lors de leur première visite.
- Le service worker tente d'abord la version réseau, puis les pages en cache quand Internet est indisponible.
- Les notes nouvelles ne sont pas automatiquement synchronisées depuis ChatGPT. Elles doivent être converties en Markdown et publiées via Git.
- Une mise à jour du site est normalement visible lors d'une prochaine consultation en ligne ; en cas de modification majeure du cache, changer la constante `VERSION` du service worker.

## Cycle d'enrichissement

1. Lire/discuter dans ChatGPT ou annoter un eBook.
2. Créer ou compléter une fiche Markdown.
3. Associer `primaryTopic`, `relatedTopics`, `tags` et éventuellement `relatedEntries`.
4. Vérifier les métadonnées de la fiche, puis consulter le résultat du build Cloudflare après le push (`npm run build` inclut la validation).
5. Après contrôle des différences Git, publier quand tu le souhaites.

## Pas encore inclus dans la V1

- Intégration directe des conversations ChatGPT ;
- Import automatique d'articles Medium ou des PDF OneDrive ;
- Job Scan connecté aux offres réelles ;
- CMS et modification depuis mobile ;
- Authentification Cloudflare Access configurée ;
- Publication GitHub / DNS / Cloudflare.

Ces éléments peuvent être ajoutés sans changer les fichiers Markdown existants.
