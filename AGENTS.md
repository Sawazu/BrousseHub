# BrousseHub — AGENTS.md

## Mission
BrousseHub est un hub web rapide pour centraliser des outils économiques liés à Dofus.

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
- Tesseract.js chargé à la demande pour l’import OCR de captures

## Principes produit
- Aller directement au calcul utile : pas de métriques inventées.
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
- thèmes clair et sombre ;
- typographies ;
- espacements ;
- rayons ;
- bordures ;
- ombres ;
- gradients de marque ;
- hauteurs et largeurs de composants ;
- états hover, focus, active, disabled et danger ;
- mouvements et z-index.

Direction visuelle : interface de travail moderne, plus expressive qu’un dashboard neutre, avec une présence forte du vert Brousse. Les gradients et halos sont autorisés lorsqu’ils renforcent l’identité ou la hiérarchie, mais restent réservés aux éléments importants. Le thème sombre doit être traité comme un thème complet, pas comme une simple inversion de couleurs.

## Architecture React
- `App.tsx` reste un fichier de composition et de routes.
- Les composants génériques vont dans `src/components`.
- Les écrans métiers vont dans `src/pages`.
- Les helpers purs vont dans `src/lib`.
- Les hooks partagés vont dans `src/hooks`.
- Ne pas définir de composants React à l’intérieur d’autres composants.
- Préférer l’état dérivé pendant le rendu à des `useEffect` de synchronisation.
- Les mises à jour de tableaux doivent rester immuables.
- Les dépendances lourdes non essentielles au premier rendu, comme l’OCR, doivent être chargées dynamiquement.

## Import screenshot / OCR
- L’OCR ne doit s’activer qu’à la demande de l’utilisateur.
- Pour le Tracker FM, seules les lignes de transaction contenant quantité + `Rune ...` + prix en kamas doivent être utilisées.
- Les autres lignes du chat Dofus doivent être ignorées.
- Une capture qui chevauche une autre peut contenir des doublons : laisser l’utilisateur vérifier/décocher les lignes avant import.
- L’import doit transformer le prix total d’un achat en prix unitaire moyen sans perdre le coût total.
- Le traitement des captures reste local dans le navigateur ; ne pas téléverser une capture vers un backend sans décision produit explicite.

## Accessibilité
- Tous les champs ont un label ou un nom accessible.
- Navigation et actions accessibles au clavier.
- Focus visible et cohérent.
- La couleur n’est jamais le seul moyen de transmettre une information.
- Les zones tactiles visent au moins 40 px lorsque possible.
- Le sélecteur de thème doit avoir un libellé accessible.

## Responsive
- Desktop : navigation latérale + grande zone de travail.
- Tablette/mobile : navigation compacte.
- Les tableaux denses utilisent un conteneur horizontal scrollable plutôt que de déformer leurs colonnes.
- L’import screenshot passe sur une seule colonne lorsque l’espace manque.

## Données et sauvegardes
- Les sauvegardes V1 sont versionnées dans `localStorage` par outil.
- Préfixe : `broussehub:v1:`.
- Le choix du thème est également persisté localement.
- Ne jamais coupler la logique de calcul au mécanisme de stockage.
- La future synchronisation multi-ordinateurs doit pouvoir remplacer le repository local sans réécrire les pages.
- Aucune donnée de démonstration ne doit être présentée comme une donnée réelle du joueur.

## Qualité
Avant livraison :
1. `npm run check`
2. `npm run build`
3. vérifier les cinq routes principales ;
4. vérifier desktop et mobile ;
5. vérifier les thèmes clair et sombre ;
6. vérifier que les calculs réagissent aux champs ;
7. vérifier les sauvegardes nommées de chaque outil ;
8. tester le parseur OCR sur plusieurs formats de quantité/prix, notamment `10`, `100` et `1 000`.

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
