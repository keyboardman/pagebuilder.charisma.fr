## Why

La vue article `default` de **NodeCollection** rend déjà le markup `.ce-card`, mais le panneau de réglages n’expose pas les options de **NodeCardApi** (position image, alignement, ratio, gap, styles card/container/image/titre/texte/labels). Les éditeurs ne peuvent donc pas configurer la card collection comme une Card API unitaire, ce qui casse la promesse « thème NodeCardApi ».

## What Changes

- Exposer dans les settings NodeCollection, lorsque `collectionType=article` et `view=default`, les **mêmes options de card** que NodeCardApi :
  - toggles show : image, title, text (description), labels ;
  - layout container : `position`, `align`, `ratio`, gap contenu ;
  - styles par sous-partie : `card`, `container`, `image`, `title`, `text`, `labels` (background / border / spacing / object / className selon le pattern Card API).
- Aligner le mapping `show.description` ↔ `show.text` côté collection pour rester compatible avec le schéma existant tout en reflétant le vocabulaire Card API dans l’UI.
- Réutiliser ou adapter les sous-composants settings de NodeCardApi (Card / Container / Image / Title / Text / Labels) plutôt que de dupliquer la logique.
- Conserver la vue étendue `article` (liste `.ce-list-api`) inchangée ; les options card ne s’affichent que pour `view=default`.
- Mettre à jour les specs / tests pour garantir parité visuelle et options avec NodeCardApi.

## Capabilities

### New Capabilities

<!-- Aucune nouvelle capability : extension du comportement NodeCollection existant. -->

### Modified Capabilities

- `node-collection` : la vue article `default` SHALL offrir le rendu **et** les options de configuration alignés sur NodeCardApi (layout container + styles sous-parties), pas seulement le markup `.ce-card`.

## Impact

- Affected code :
  - `assets/editeur/ManagerNode/NodeCollection/Settings.tsx` et `Settings/StyleTab.tsx` (ou nouveaux onglets card)
  - éventuelle réutilisation de `NodeCardApi/Settings/*`
  - `NodeCollection/View/items/article/DefaultItem.tsx` (vérifier parité avec `NodeCardApi/View.tsx`)
  - `NodeCollection/index.ts` (schéma `content` déjà partiellement présent : `card`, `container`, `text`, `labels`)
  - tests `View.test.tsx` / éventuels tests settings
- Specs : delta `node-collection`
- Non-goals : ne pas modifier NodeCardApi lui-même ; ne pas changer le rendu de la vue étendue `article` ; ne pas étendre ces options aux types `image` / `video` dans cette change
