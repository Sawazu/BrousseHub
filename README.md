# Broussehub

> Bienvenue dans le Hub de La Brousse

Première fondation de la V1 web de Broussehub : un hub sobre et direct pour les calculs économiques Dofus.

## Stack
- React 19
- TypeScript strict
- Vite
- React Router
- Design Tokens CSS natifs

## Outils V1
- Achat / Craft / Revente
- Tracker FM
- Marge FM
- Calcul Stuff
- Up Métier

## Fonctionnalités déjà posées
- navigation desktop et mobile ;
- calculs interactifs pour les cinq outils ;
- sauvegardes nommées séparées par outil ;
- écrasement d’une sauvegarde en réutilisant le même nom ;
- import d’une session sauvegardée du Tracker FM dans Marge FM ;
- stock pris en compte dans Achat / Craft / Revente ;
- comparaison automatique achat/craft dans Calcul Stuff ;
- plan de crafts et coût net après revente dans Up Métier ;
- design system centralisé dans `src/styles/tokens.css`.

## Lancer le projet
```bash
npm install
npm run dev
```

## Vérifications
```bash
npm run check
npm run build
```

## Persistance V1
Le prototype utilise `localStorage` avec des clés versionnées et séparées par outil. Il n’existe volontairement pas de notion globale de « projet ».

## Synchronisation de compte
La V1 cible une synchronisation multi-ordinateurs par compte. Le backend n’est pas simulé dans cette première fondation : l’interface indique clairement que la synchronisation reste à connecter.

L’étape prévue est de brancher une couche d’authentification et de stockage distant — par exemple Supabase/PostgreSQL — derrière le repository de données, afin de conserver la logique métier et les pages intactes.

## Documentation
- `AGENTS.md` : règles produit, architecture et qualité.
- `docs/DESIGN_SYSTEM.md` : principes et Design Tokens.
