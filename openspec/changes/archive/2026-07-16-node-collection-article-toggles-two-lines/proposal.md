## Why

Dans les settings NodeCollection (carte article), les quatre switchs **Image**, **Title**, **Text** et **Label** sont affichés sur une seule ligne (`flex justify-between`). Dans le panneau latéral étroit, cette rangée déborde légèrement et gêne la lisibilité. Les répartir sur deux lignes corrige le problème sans changer le comportement des toggles.

## What Changes

- Réorganiser la rangée de switchs show (Image / Title / Text / Label) en **deux lignes** de deux contrôles dans `CardLayoutSettings`.
- Aucun changement de modèle de données ni de logique `content.show.*`.

## Capabilities

### New Capabilities

<!-- Aucune — ajustement de layout UI uniquement. -->

### Modified Capabilities

- `node-collection` : les toggles de visibilité des parties de carte article dans les settings doivent s’afficher sur deux lignes (2 × 2) pour tenir correctement dans le panneau.

## Impact

- Affected specs: **node-collection** (delta)
- Affected code:
  - `assets/editeur/ManagerNode/NodeCollection/Settings/CardLayoutSettings.tsx` (layout des switchs)
