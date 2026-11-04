---
title: "Data Agents Need Harness Engineering More Than a New Model"
description: "Analyse d’un point de vue sur la fiabilité des agents Data : contexte, contrôles et couche sémantique."
space: "tech-watch"
kind: "article"
status: "reading"
source: "Medium · DataExpert"
sourceUrl: "https://dataexpert.medium.com/data-agents-need-harness-engineering-more-than-a-new-model-511d0b30c1b9"
author: "DataExpert"
updatedAt: 2026-11-05
primaryTopic: "DE.17"
relatedTopics: ["DE.14", "DE.15", "AI.04", "AI.05"]
tags: ["AI Agents", "Harness Engineering", "Semantic Layer", "Text-to-SQL"]
relatedEntries: ["semantic-layer-sql-agents"]
---

## TL;DR

Notre discussion de cet article porte sur une idée : **la qualité d’un agent Data ne dépend pas seulement du modèle LLM**. Les outils disponibles, les règles, le contexte, les permissions et la validation des réponses sont également déterminants.

## Concepts à retenir

- **LLM** : modèle de langage, tel que celui utilisé par ChatGPT, distinct de l’application qui l’entoure.
- **Harness** : ensemble de composants, d’outils, de contraintes et d’évaluations qui encadrent le modèle.
- **Semantic Layer** : conventions et définitions métier qui aident à interpréter correctement les tables, relations et indicateurs.
- **Text-to-SQL** : génération d’une requête SQL à partir d’une question en langage naturel.

## Ce que nous avons discuté

L’accès direct d’un LLM à une base SQL ne garantit pas une requête pertinente. Une couche sémantique peut réduire certaines ambiguïtés, mais des tests, des permissions et des contrôles de résultats restent nécessaires.

## À approfondir

- Comparer plusieurs approches d’orchestration des agents Data.
- Concevoir un jeu de questions métier de référence et de requêtes attendues.
- Ajouter une distinction entre assertions de l’auteur et conclusions de notre discussion.

> Note de départ issue des échanges : à enrichir et vérifier avant de la considérer comme synthèse définitive de l’article.
