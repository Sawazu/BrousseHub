# BrousseHub — AGENTS.md

## Mission
BrousseHub est un hub web sobre et rapide pour centraliser des outils économiques liés à Dofus. La V1 contient cinq outils :

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
- Persistance locale pour le prototype, avec une couche prévue pour la synchronisation cloud par compte

## Principes produit
- Aller droit au calcul utile : pas de dashboard décoratif ni de métriques inventées.
- Chaque outil possède ses propres sauvegardes nommées.
- Les données communes doivent pouvoir être mutualisées plus tard : items, recettes, ressources, runes et prix.
- Les calculs doivent être compréhensibles, déterministes et testables.
- Les actions fréquentes doivent demander le moins de clics possible.
- Ne jamais masquer un coût dans un calcul : distinguer coût brut, coût net, bénéfice, marge et ROI.

## Design system
Toutes les valeurs de présentation réutilisables doivent venir de `src/styles/tokens.css` :
- couleurs et états sémantiques ;
- typographies ;
- espacements ;
- rayons ;
- bordures ;
- ombres ;
- dimensions de contrôles ;
- largeurs de layout ;
- mouvements et focus.

Éviter les valeurs CSS arbitraires dans les composants. Si une valeur se répète ou représente une règle de design, créer ou réutiliser un token.

Direction visuelle : sobre, épurée, claire, contrastée, avec un accent vert forêt assorti à l’identité « Brousse ». Pas de gradients décoratifs, de glassmorphism, d’effets néon ni d’empilement gratuit de cartes.

## Architecture React
- `App.tsx` reste un fichier de composition et de routes.
- Les composants génériques vont dans `src/components`.
- Les primitives réutilisables vont dans `src/components/ui`.
- Les écrans métiers vont dans `src/pages`.
- Les helpers purs vont dans `src/lib`.
- Les hooks partagés vont dans `src/hooks`.
- Ne pas définir de composants React à l’intérieur d’autres composants.
- Préférer l’état dérivé pendant le rendu à des `useEffect` de synchronisation.
- Les mises à jour de tableaux doivent rester immuables.

## Accessibilité
- Tous les champs ont un label.
- Navigation et actions accessibles au clavier.
- Focus visible et cohérent.
- Couleur jamais utilisée comme seul moyen de transmettre une information.
- Zones tactiles d’au moins 40 px lorsque possible.

## Responsive
- Desktop : navigation latérale + zone de travail.
- Mobile : navigation compacte, outils utilisables sans débordement horizontal obligatoire.
- Les tableaux denses peuvent utiliser un conteneur scrollable plutôt que de casser leur structure métier.

## Données et sauvegardes
- Les sauvegardes V1 sont versionnées dans `localStorage` par outil.
- Préfixe recommandé : `broussehub:v1:`.
- Ne jamais coupler la logique de calcul au mécanisme de stockage.
- La future synchronisation par compte doit pouvoir remplacer le repository local sans réécrire les pages.

## Qualité
Avant livraison d’une modification :
1. `npm run build`
2. `npm run lint`
3. vérifier les cinq routes principales ;
4. vérifier un viewport desktop et mobile ;
5. vérifier que les calculs réagissent aux modifications de champs ;
6. vérifier qu’aucune donnée de démonstration n’est présentée comme une donnée réelle du joueur.

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
