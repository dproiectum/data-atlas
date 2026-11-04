---
title: "Semantic Layer et fiabilité des SQL Agents"
description: "Notions clarifiées dans nos échanges à propos de l’analyse de données en langage naturel."
space: "tech-watch"
kind: "note"
status: "reading"
source: "Discussion autour d’un article Medium"
updatedAt: 2026-11-05
primaryTopic: "DE.17"
relatedTopics: ["DE.14", "DE.09", "AI.04"]
tags: ["Semantic Layer", "Text-to-SQL", "AI Agents", "Data Governance"]
relatedEntries: ["medium-harness-engineering"]
---

## Problématique

Un utilisateur demande en langage naturel : « Quelle est la dépense cloud par équipe ce mois-ci ? »

Un agent connecté à SQL peut générer une requête syntaxiquement valide, tout en sélectionnant la mauvaise table ou en appliquant une définition incorrecte des coûts.

## Apport d’une couche sémantique

Une **Semantic Layer** documente les métriques et les règles métier : définition de la dépense, période de référence, dimensions utilisées, relations pertinentes, etc.

Elle améliore le contexte de génération des requêtes, mais **ne garantit pas l’exactitude** de chaque résultat. Les politiques d’accès, les tests de requêtes et les évaluations sont complémentaires.

## Liens dans le DE Summary

- **DE.17 — Analytics Engineering** : Semantic Layer, Metrics.
- **DE.14 — Data Governance** : définitions, métadonnées.
- **DE.09 — SQL** : logique des requêtes générées.
