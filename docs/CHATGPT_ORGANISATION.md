# Organisation ChatGPT — Data Atlas

Cette nomenclature est un plan d'organisation **à appliquer manuellement** dans l'interface ChatGPT. Les fichiers de ce dépôt **ne créent pas** de dossiers dans ChatGPT et ne déplacent pas les conversations existantes.

## Sections et dossiers

```text
Tech Watch
├── 00 — Inbox
├── 01 — Data Engineering & Platforms
├── 02 — AI, LLM & Agents
├── 03 — Cloud & FinOps
├── 04 — Architecture & DevOps
└── 99 — Synthèses

Job Seeking
├── 01 — Job Scan
├── 02 — Market Radar
├── 03 — Skills & Gap Analysis
└── 99 — Synthèses

Learning Lab
├── 01 — Apache Spark
├── 02 — SQL & Data Modeling
├── 03 — Streaming & Distributed Systems
└── 99 — Synthèses

Data Atlas (conception du site)
├── 01 — Architecture & Mapping
├── 02 — Site & Design
├── 03 — Development & Deployment
└── 99 — Roadmap & Decisions

DE Summary
└── Ne pas modifier l'existant
```

> **Important** : si l'interface ChatGPT ne prend pas en charge ces dossiers dans les sections, utiliser les mêmes noms comme préfixes dans les titres des conversations. Cette classification logique reste exploitable par Data Atlas.

## Convention de nommage des conversations

| Espace | Format | Exemple |
|---|---|---|
| Tech Watch | `TW · [Domaine] · [Sujet]` | `TW · AI Agents · Harness Engineering` |
| Job Seeking | `JS · [Type] · [Sujet]` | `JS · Market Radar · O’Reilly Oct 2026` |
| Learning Lab | `LL · [Technologie] · [Chapitre/concept]` | `LL · Spark · Shuffle` |
| Développement | `ATLAS · [Sous-système] · [Sujet]` | `ATLAS · GitHub · Deployment` |

Une conversation reste un espace d'échange ; seules les **fiches de connaissance validées** sont conservées dans Data Atlas.

## Règles de contenu

1. Chaque article Medium reste dans **Tech Watch**, même s'il traite de Spark ou de Data Governance.
2. O'Reilly **Radar Trends** et l'analyse du marché de l'emploi vont dans **Job Seeking / Market Radar**.
3. Les notes issues d'eBooks et les exercices vont dans **Learning Lab**.
4. **DE Summary : 28 domaines inchangés**. Les notes et livres utilisent `DE.01` à `DE.28` comme références.
5. **Bibliothèque eBooks inchangée** : aucun PDF déplacé, renommé ou publié.
6. Une fiche Markdown peut être liée à plusieurs domaines DE grâce à `primaryTopic` et `relatedTopics`.
7. Les nouvelles sous-catégories sont ajoutées seulement si le volume le justifie.

## Mise à jour à chaque nouvelle lecture

ChatGPT → résumé/discussion → fiche `src/content/entries/*.md` → vérification → dépôt GitHub → build Cloudflare → consultation sur Data Atlas.

Les discussions ChatGPT et les PDF OneDrive ne sont **pas synchronisés automatiquement** par cette version.
