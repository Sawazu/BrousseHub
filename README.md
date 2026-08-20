# Broussehub

> Bienvenue dans le Hub de La Brousse

V1 web de Broussehub : un hub d’outils économiques Dofus avec une identité verte marquée, thèmes clair/sombre et calculs rapides.

## Stack
- React 19
- TypeScript strict
- Vite
- React Router
- Design Tokens CSS natifs
- Tesseract.js chargé à la demande pour l’OCR local

## Outils V1
- Achat / Craft / Revente
- Tracker FM
- Marge FM
- Calcul Stuff
- Up Métier

## Fonctionnalités déjà posées
- navigation desktop et mobile ;
- thèmes clair et sombre persistés localement ;
- calculs interactifs pour les cinq outils ;
- sauvegardes nommées séparées par outil ;
- import d’une session sauvegardée du Tracker FM dans Marge FM ;
- import de captures du chat Dofus dans Tracker FM ;
- extraction ciblée des lignes `100 x [Rune ...] (123 456 kamas)` ;
- validation manuelle des lignes OCR avant ajout à la session ;
- regroupement des achats par rune avec prix unitaire moyen ;
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

## Import screenshot
Le Tracker FM accepte jusqu’à 8 captures PNG/JPG/WEBP. L’image est prétraitée puis l’OCR s’exécute dans le navigateur. Broussehub ignore les messages privés, créations de runes et autres messages pour ne conserver que les lignes d’achat correspondant au format attendu.

Les captures qui se chevauchent peuvent contenir des achats identiques : l’écran de résultat permet de décocher les doublons avant l’ajout à la session.

## Persistance V1
Le prototype utilise `localStorage` avec des clés versionnées et séparées par outil. Il n’existe volontairement pas de notion globale de « projet ».

## Synchronisation de compte
La V1 cible une synchronisation multi-ordinateurs par compte. Le backend n’est pas simulé dans cette fondation : l’interface indique clairement que la synchronisation reste à connecter.

L’étape prévue est de brancher une couche d’authentification et de stockage distant — par exemple Supabase/PostgreSQL — derrière le repository de données, afin de conserver la logique métier et les pages intactes.

## Documentation
- `AGENTS.md` : règles produit, architecture et qualité.
- `docs/DESIGN_SYSTEM.md` : principes et Design Tokens.
