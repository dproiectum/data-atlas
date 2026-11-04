# Data Atlas — Déploiement sans installer Node.js sur le Mac

**Objectif :** saisir/modifier les fichiers Markdown sur le Mac (ou dans l'éditeur web GitHub), laisser Cloudflare compiler Astro, consulter le site sur `dataatlas.allops.cloud` et iPhone.

## État au 4 novembre 2026

- Dépôt créé : https://github.com/dproiectum/data-atlas.
- Visibilité publique conservée à la demande de l’utilisateur.
- V1 compilée et liens internes vérifiés ; accès GitHub accordé, sources importées dans `main`. Aucun déploiement Cloudflare effectué.

## Étape 1 : travailler avec le dépôt existant

Après l’import initial, récupérer les fichiers sur le Mac avec Git déjà installé :

```bash
git clone https://github.com/dproiectum/data-atlas.git
cd data-atlas
```

Modifier les fiches Markdown avec un éditeur existant, ou directement sur GitHub. Aucune installation Node.js n’est nécessaire sur le Mac.

## Étape 2 : connecter Cloudflare Pages

1. Dans Cloudflare, créer un projet Pages connecté à GitHub.
2. Sélectionner le dépôt `dproiectum/data-atlas`.
3. Framework : **Astro** ; branche : `main`.
4. Build command : `npm run build`.
5. Output directory : `dist` ; répertoire racine : `/`.
6. Configurer une version Node.js compatible avec le `package.json` et `.nvmrc` du projet (Node 22 est le choix retenu).
7. Laisser Cloudflare installer les dépendances et compiler. **Aucune installation Node.js sur Mac nécessaire.**
8. Vérifier les journaux de build et le site généré. Le résultat GitHub Actions est consultable dans l’onglet Actions du dépôt.

## Étape 3 : protéger avant de publier

**Ne pas exposer directement les notes personnelles.** Configurer Cloudflare Access ou une autre couche d'authentification sur la page `*.pages.dev` **et** le domaine personnalisé, puis tester l'accès en navigation privée. Un dépôt privé ou `noindex` ne protège pas une page déployée.

## Étape 4 : domaine et PWA

1. Ajouter `dataatlas.allops.cloud` comme domaine personnalisé Cloudflare Pages.
2. Configurer le DNS selon les instructions de Cloudflare (l'enregistrement exact dépend de la zone).
3. Vérifier HTTPS, accès privé, recherche et navigation.
4. Ouvrir depuis Safari iPhone, puis **Partager → Sur l'écran d'accueil**.
5. Tester hors ligne les pages déjà ouvertes ou préchargées ; cela ne garantit pas la disponibilité de l'ensemble des livres ou PDF.

## Mettre à jour sans Node.js sur le Mac

1. Ajouter une nouvelle fiche dans `src/content/entries/` à partir d'un modèle du dossier `templates/`, ou modifier une fiche existante.
2. Relier la fiche à `DE.XX` et compléter le texte. **Ne pas toucher au DE Summary original ou aux PDF OneDrive.**
3. Prévisualiser les modifications Git : `git diff`, `git status`.
4. Publier : `git add …`, `git commit`, `git push` après vérification.
5. Cloudflare Pages exécute les validations et le build à chaque push et publie les fichiers `dist/` si tout réussit.
6. Consulter le site à jour sur mobile après rafraîchissement du cache.

**Limite du mode sans installation :** pas de serveur Astro local ni de prévisualisation du site fraîchement compilé sur Mac avant le build distant. Une maquette HTML autonome peut rester disponible pour consultation hors ligne, mais ne se synchronise pas automatiquement avec les nouvelles fiches.
