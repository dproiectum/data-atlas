---
title: "Apache Spark — Shuffle & Performance"
description: "Fiche de travail sur les échanges de données entre partitions et leurs impacts sur la performance."
space: "learning-lab"
kind: "concept"
status: "inbox"
source: "Notes de formation Data Engineering"
updatedAt: 2026-11-04
primaryTopic: "DE.11"
relatedTopics: ["DE.23", "DE.10"]
tags: ["Apache Spark", "Shuffle", "Partitioning", "Data Skew"]
relatedEntries: ["high-performance-spark-2e"]
---

## Objectif pédagogique

Comprendre ce qui déclenche un **shuffle** dans Spark, pourquoi il consomme des ressources réseau et disque, et comment le diagnostiquer.

## Questions de travail

- Quelle différence entre transformation *narrow* et *wide* ?
- Quand un `groupBy` ou un `join` nécessite-t-il un shuffle ?
- Quel est le rôle des partitions et du *data skew* ?
- Comment lire un plan d’exécution Spark SQL ?

## À produire pendant la lecture

1. Un schéma du chemin des données.
2. Un exemple PySpark et son plan d’exécution.
3. Un test avant/après optimisation avec les mesures réelles.
4. Une référence précise au livre utilisé (chapitre et page).

> Fiche de démarrage, à enrichir à partir d’exercices et de lectures vérifiées.
