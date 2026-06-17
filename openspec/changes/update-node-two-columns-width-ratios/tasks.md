## 1. Modèle de données

- [x] 1.1 Étendre `ColumnWidth` avec `25-75`, `75-25` et `custom` dans `NodeTwoColumns/index.ts`
- [x] 1.2 Ajouter `customDesktop` (type `{ left: number; right: number }`) à `NodeTwoColumnsLayout` (desktop uniquement)

## 2. Réglages (Settings)

- [x] 2.1 Ajouter `25-75` et `75-25` aux options du sélecteur pour desktop, tablette et mobile
- [x] 2.2 Ajouter `Personnalisé` uniquement dans le sélecteur desktop
- [x] 2.3 Afficher une ligne supplémentaire sous la ligne desktop (pas dans la cellule) avec champs gauche/droite (%) lorsque `custom` est actif
- [x] 2.4 Masquer cette ligne lorsque desktop n'est plus `custom`
- [x] 2.5 Valider que `left + right === 100` (entiers 1–99, sans pas imposé) et persister dans `attributes.layout.customDesktop`

## 3. Rendu (View)

- [x] 3.1 Mapper `25-75` et `75-25` dans les tables `GRID_COLS` / `*_SPAN` (grille 4 colonnes)
- [x] 3.2 Pour `desktop: custom`, appliquer `--two-cols-template-lg` sur le conteneur grille
- [x] 3.3 Ajouter la règle CSS desktop (`lg:`) dans `node-two-column.css` pour `grid-template-columns` via variable
- [x] 3.4 Vérifier le rendu en mode édition (breakpoint sélectionné) et en mode view (responsive réel)

## 4. Validation

- [x] 4.1 Tester chaque preset (dont `25-75`, `75-25`) sur desktop / tablette / mobile
- [x] 4.2 Tester un ratio custom desktop (ex. `40-60`) et vérifier la persistance après sauvegarde / rechargement
- [x] 4.3 Vérifier que `custom` n'apparaît pas pour tablette et mobile
- [x] 4.4 Vérifier l'affichage/masquage de la ligne custom sous la ligne desktop
- [x] 4.5 Vérifier qu'une page existante avec `50-50` n'est pas altérée
