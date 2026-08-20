# BrousseHub — AGENTS.md

## Mission
BrousseHub est un hub web sobre et rapide pour centraliser des outils économiques liés à Dofus.

La V1 contient cinq outils :
1. Achat / Craft / Revente
2. Tracker FM
3. Marge FM
4. Calcul Stuff
5. Up Métier

Phrase produit : « Bienvenue dans le Hub de La Brousse ».

## Stack V1
- React
- TypeScript strict
- Vite
- React Router
- CSS natif organisé autour de Design Tokens
- Persistance locale pour le prototype
- Couche de stockage pensée pour être remplacée par une synchronisation cloud par compte

## Principes produit
- Aller directement au calcul utile : pas de dashboard décoratif ni de métriques inventées.
- Chaque outil possède ses propres sauvegardes nommées.
- Ne pas introduire une notion globale de « projet » : les sauvegardes appartiennent aux outils.
- Les données communes devront pouvoir être mutualisées plus tard : items, recettes, ressources, runes et prix.
- Les calculs doivent être compréhensibles, déterministes et testables.
- Les actions fréquentes doivent demander le moins de clics possible.
- Toujours distinguer coût brut, coût net, bénéfice, marge et ROI.

## Design system
La source de vérité visuelle est `src/styles/tokens.css`.

Une valeur réutilisable ou une règle de design doit passer par un token :
- couleurs primitives et sémantiques ;
- typographies ;
- espacements ;
- rayons ;
- bordures ;
- ombres ;
- hauteurs et largeurs de composants ;
- états hover, focus, active, disabled et danger ;
- mouvements et z-index.

Direction visuelle : sobre, épurée, claire, contrastée, avec un accent vert forêt lié à l’identité « Brousse ». Pas de gradient décoratif, glassmorphism, néon ou accumulation de cartes.

## Architecture React
- `App.tsx` reste un fichier de composition et de routes.
- Les composants génériques vont dans `src/components`.
- Les écrans métiers vont dans `src/pages`.
- Les helpers purs vont dans `src/lib`.
- Les hooks partagés vont dans `src/hooks`.
- Ne pas définir de composants React à l’intérieur d’autres composants.
- Préférer l’état dérivé pendant le rendu à des `useEffect` de synchronisation.
- Les mises à jour de tableaux doivent rester immuables.

## Accessibilité
- Tous les champs ont un label ou un nom accessible.
- Navigation et actions accessibles au clavier.
- Focus visible et cohérent.
- La couleur n’est jamais le seul moyen de transmettre une information.
- Les zones tactiles visent au moins 40 px lorsque possible.

## Responsive
- Desktop : navigation latérale + grande zone de travail.
- Tablette/mobile : navigation compacte.
- Les tableaux denses utilisent un conteneur horizontal scrollable plutôt que de déformer leurs colonnes.

## Données et sauvegardes
- Les sauvegardes V1 sont versionnées dans `localStorage` par outil.
- Préfixe : `broussehub:v1:`.
- Ne jamais coupler la logique de calcul au mécanisme de stockage.
- La future synchronisation multi-ordinateurs doit pouvoir remplacer le repository local sans réécrire les pages.
- Aucune donnée de démonstration ne doit être présentée comme une donnée réelle du joueur.

## Qualité
Avant livraison :
1. `npm run check`
2. `npm run build`
3. vérifier les cinq routes principales ;
4. vérifier desktop et mobile ;
5. vérifier que les calculs réagissent aux champs ;
6. vérifier les sauvegardes nommées de chaque outil.

## Nommage
- UI et textes visibles : français.
- Code : anglais lorsque cela améliore la lisibilité technique.
- Composants React : PascalCase.
- Hooks : `useXxx`.
- Variables CSS : `--category-token-name`.

## Hors périmètre immédiat V1
- Automatisation du jeu.
- Lecture mémoire/processus du client Dofus.
- Botting.
- Marketplace entre utilisateurs.
- Tracker Ocre.
- Gestion globale de patrimoine/kamas.

Ces éléments ne doivent pas être ajoutés sans décision produit explicite.
