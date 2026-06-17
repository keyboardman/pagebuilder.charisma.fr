# Change: Ratios 25-75, 75-25 et personnalisé pour NodeTwoColumns

## Why

Le nœud `NodeTwoColumns` ne propose aujourd'hui que quatre répartitions prédéfinies (`33-66`, `50-50`, `66-33`, `100-100`). Les maquettes courantes utilisent aussi des ratios asymétriques `25-75` et `75-25`, et parfois des pourcentages libres (ex. `40-60`) que les presets actuels ne couvrent pas.

## What Changes

- Ajouter les presets `25-75` et `75-25` dans le sélecteur de largeur de colonnes (desktop, tablette, mobile).
- Ajouter une option **Personnalisé** uniquement sur le breakpoint **desktop**, avec saisie libre en pourcentage entier (colonne gauche / colonne droite, somme = 100 %, sans pas imposé). Les champs de saisie s'affichent sur une **ligne dédiée sous la ligne desktop** du tableau de réglages.
- Étendre le rendu (`View.tsx`) pour appliquer les nouveaux presets (grille Tailwind) et le ratio personnalisé desktop (variable CSS `grid-template-columns` sur `lg:`).
- Persister les pourcentages personnalisés dans `attributes.layout.customDesktop` du JSON builder.
- Conserver la rétrocompatibilité : les pages existantes avec les presets actuels restent inchangées.

## Impact

- Affected specs: `page-builder`
- Affected code:
  - `assets/editeur/ManagerNode/NodeTwoColumns/index.ts` (types `ColumnWidth`, `NodeTwoColumnsLayout`)
  - `assets/editeur/ManagerNode/NodeTwoColumns/Settings.tsx` (sélecteur + champs custom)
  - `assets/editeur/ManagerNode/NodeTwoColumns/View.tsx` (classes Tailwind + variables CSS)
  - `assets/editeur/assets/themes/base/css/node-two-column.css` (règles responsive pour `grid-template-columns` custom, si nécessaire)
