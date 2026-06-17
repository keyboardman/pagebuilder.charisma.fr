## Context

`NodeTwoColumns` stocke le layout dans `attributes.layout` avec un `ColumnWidth` par breakpoint (`desktop`, `tablet`, `mobile`) et des flags `reverse*`. Le rendu s'appuie sur des classes Tailwind pré-calculées (`grid-cols-*`, `col-span-*`) mappées depuis `ColumnWidth`.

Les ratios `25-75` et `75-25` peuvent suivre le même modèle que `33-66` / `66-33` (grille à 4 colonnes, spans 1/3 ou 3/1).

Les pourcentages libres ne peuvent pas être couverts par des classes Tailwind statiques (JIT). Il faut un mécanisme dynamique.

## Goals / Non-Goals

- Goals:
  - Offrir `25-75`, `75-25` sur tous les breakpoints et un mode personnalisé **desktop uniquement**.
  - Saisie custom en pourcentages entiers libres (1–99, somme = 100), sans pas de 5.
  - Rendu cohérent en mode édition (breakpoint sélectionné), preview et export HTML.
  - Rétrocompatibilité des pages existantes.
- Non-Goals:
  - Mode personnalisé sur tablette ou mobile.
  - Plus de deux colonnes.
  - Gap personnalisable (déjà fixé à `gap-4`).
  - Migration automatique des anciens contenus.

## Decisions

- **Presets 25-75 / 75-25** : ajout à `ColumnWidth` ; mapping Tailwind sur une grille 4 colonnes (`col-span-1` + `col-span-3` ou l'inverse), comme pour `33-66` / `66-33`.
- **Mode personnalisé (desktop seul)** : valeur `custom` autorisée uniquement pour `layout.desktop` ; pourcentages stockés dans `layout.customDesktop` sous la forme `{ left: number; right: number }` (entiers 1–99, somme = 100, pas libre sans contrainte de pas).
- **Rendu custom** : le conteneur grille reçoit la variable CSS `--two-cols-template-lg` au format `{left}fr {right}fr`, appliquée via `node-two-column.css` sur le breakpoint desktop (`lg:`). Tablette et mobile conservent les presets Tailwind existants.
- **UX Settings** : l'option `Personnalisé` n'apparaît que dans la colonne desktop du tableau. Lorsque `custom` est sélectionné, une **ligne supplémentaire** s'affiche **sous la ligne desktop** du tableau (pas dans la cellule du sélecteur) avec deux champs numériques entiers (gauche / droite, libellés explicites) et validation immédiate ; ajuster automatiquement le second champ si l'utilisateur modifie le premier pour maintenir la somme à 100 %. Cette ligne est visible uniquement tant que `desktop` vaut `custom`.
- **Fallback** : si `desktop: custom` mais `customDesktop` absent ou invalide, utiliser `50-50` sur desktop.

## Risks / Trade-offs

- **Variables CSS vs inline style** → variables CSS + petite feuille partagée : responsive fiable en mode view sans générer de `<style>` par nœud.
- **Validation des pourcentages** → contrainte stricte somme = 100 côté Settings pour éviter des layouts cassés en rendu.

## Migration Plan

Aucune migration requise. Les valeurs `33-66`, `50-50`, `66-33`, `100-100` existantes restent valides.

