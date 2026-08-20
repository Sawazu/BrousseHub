# Broussehub — Design System V1

## Direction
Broussehub reste un outil de travail, mais l’identité visuelle doit désormais être plus présente. Le vert Brousse sert de fil conducteur dans la navigation, les actions principales, les métriques importantes, les imports et les états sélectionnés.

Le système possède deux thèmes complets : clair et sombre. Le sombre n’est pas une simple inversion ; surfaces, contrastes, bordures, ombres et intensité du vert possèdent leurs propres valeurs.

## Source de vérité
Tous les Design Tokens sont déclarés dans `src/styles/tokens.css`. `src/styles/experience.css` ne doit consommer que ces tokens pour la couche visuelle expressive.

## Couleurs
- `forest-*` : identité Brousse et interactions principales.
- `stone-*` : fonds, textes, bordures et surfaces.
- rouge, ambre et bleu : états sémantiques.
- les composants utilisent les alias `--color-*` plutôt que les primitives.
- le thème sombre surcharge uniquement les alias sémantiques et les élévations nécessaires.

## Gradients et halos
- `--gradient-brand` : actions principales, marque, icônes importantes.
- `--gradient-panel` : surfaces mises en avant sans casser la lisibilité.
- `--color-accent-glow` et `--shadow-accent` : focus visuel ponctuel.

Ils ne doivent pas remplacer la hiérarchie typographique ou transformer toutes les surfaces en éléments décoratifs.

## États
Les boutons et champs disposent de tokens dédiés pour default, hover, active, focus et disabled. Les états danger, positif, avertissement et information restent séparés de l’accent de marque.

## Typographie
Pile système avec `Inter` en préférence. Échelle de 10 à 48 px, quatre graisses, plusieurs hauteurs de ligne et tracking dédié. Les résultats numériques utilisent des chiffres tabulaires. Les lignes OCR peuvent utiliser la pile monospace quand la composition brute doit être lisible.

## Espacements
Échelle basée sur 4 px, de 4 à 96 px.

## Rayons
6, 8, 10, 12, 16, 20 et 24 px, plus `pill`.

## Bordures et ombres
Bordures de 1 ou 2 px. Trois niveaux d’ombre génériques, un focus ring et une ombre d’accent dédiée. Les ombres sombres sont recalibrées pour le thème sombre.

## Dimensions
- contrôles : 28 / 32 / 40 / 44 / 48 px ;
- icônes : 14 / 16 / 18 / 20 / 24 / 32 px ;
- sidebar : 264 px ;
- topbar : 64 px ;
- ligne de tableau : 48 px ;
- contenu maximal : 1536 px ;
- panneau OCR : hauteur minimale 416 px sur desktop.

## Responsive
- > 1100 px : quatre colonnes de métriques et import OCR en deux colonnes ;
- <= 1100 px : deux colonnes de métriques et import OCR empilé ;
- <= 900 px : navigation horizontale et topbar compacte ;
- <= 640 px : une colonne et actions OCR pleine largeur.

Les tableaux denses restent horizontalement scrollables afin de conserver leur anatomie métier.

## Thème
Le choix clair/sombre est enregistré dans `localStorage` sous `broussehub:v1:theme`. En l’absence de choix, Broussehub suit `prefers-color-scheme`. Le thème est appliqué avant le rendu React pour éviter un flash clair au chargement.

## Règles
1. Pas de couleur arbitraire dans les composants.
2. Pas de nouvel espacement répété sans token.
3. Les gradients sont réservés à la marque, aux actions principales et aux éléments de hiérarchie forte.
4. Ne pas transformer toutes les sections en cartes ; tableaux et listes restent prioritaires pour les données.
5. Les chiffres utiles dominent visuellement les labels.
6. La couleur n’est jamais le seul moyen de transmettre une information.
7. Toute nouvelle surface doit être vérifiée dans les deux thèmes.
