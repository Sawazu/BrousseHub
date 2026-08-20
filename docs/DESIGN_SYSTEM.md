# Broussehub — Design System V1

## Direction
Broussehub est un outil de travail avant d’être une vitrine. L’interface privilégie les calculs, les tableaux et les résultats. Le vert forêt est réservé à l’identité, aux actions principales et aux états sélectionnés.

Le système évite les gradients décoratifs, les effets de verre, les ombres lourdes et les empilements de cartes. La hiérarchie repose surtout sur la typographie, l’espace, les bordures et quelques surfaces bien définies.

## Source de vérité
Tous les Design Tokens sont déclarés dans `src/styles/tokens.css`.

## Couleurs
- `forest-*` : identité et interactions principales.
- `stone-*` : fonds, textes, bordures et surfaces.
- rouge, ambre et bleu : états sémantiques.
- les composants utilisent des alias `--color-*` plutôt que les primitives.

## États
Les boutons et champs disposent de tokens dédiés pour default, hover, active, focus et disabled. Les états danger, positif, avertissement et information sont séparés de l’accent de marque.

## Typographie
Pile système avec `Inter` en préférence. Échelle de 10 à 48 px, quatre graisses, plusieurs hauteurs de ligne et tracking dédié. Les résultats numériques utilisent des chiffres tabulaires.

## Espacements
Échelle basée sur 4 px, de 4 à 96 px.

## Rayons
6, 8, 10, 12, 16, 20 px et pill.

## Bordures et ombres
Bordures de 1 ou 2 px. Trois niveaux d’ombre maximum. Les bordures et l’espace restent les principaux moyens de séparation.

## Dimensions
- contrôles : 28 / 32 / 40 / 44 / 48 px ;
- icônes : 14 / 16 / 18 / 20 / 24 px ;
- sidebar : 248 px ;
- topbar : 64 px ;
- ligne de tableau : 48 px ;
- contenu maximal : 1472 px.

## Responsive
- > 1100 px : quatre colonnes de métriques ;
- <= 1100 px : deux colonnes ;
- <= 900 px : navigation horizontale ;
- <= 640 px : une colonne.

Les tableaux denses restent horizontalement scrollables afin de conserver leur anatomie métier.

## Règles
1. Pas de couleur arbitraire dans les composants.
2. Pas de nouvel espacement répété sans token.
3. Pas de gradient décoratif par défaut.
4. Pas de carte lorsqu’une liste ou un tableau suffit.
5. Les chiffres utiles dominent visuellement les labels.
6. La couleur n’est jamais le seul moyen de transmettre une information.
