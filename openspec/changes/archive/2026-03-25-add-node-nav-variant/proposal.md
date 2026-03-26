# Change: Variantes CSS pour NodeNav

## Why
Le nœud `NodeNav` ne permet pas aujourd’hui de différencier facilement des patterns de rendu (par ex. `navbar` vs `liste`) via des hooks DOM simples. Ajouter une option `variant` permet aux utilisateurs de cibler facilement le CSS (via attribut et classe) lors de la prévisualisation et à l’export.

## What Changes
- Ajouter une option `variant` au nœud `NodeNav` avec valeurs `navbar` et `liste` (persistée dans le contenu sérialisé).
- Étendre l’interface de configuration du nœud `NodeNav` pour exposer le champ « Variante ».
- Étendre le rendu `NodeNav` pour ajouter, sur le `<nav>` :
  - `data-ce-variant="{variant}"`
  - classe CSS `ce-menu--{variant}`

## Impact
- Affected specs: **page-builder**
- Affected code: `assets/editeur/ManagerNode/NodeNav/index.ts`, `assets/editeur/ManagerNode/NodeNav/View.tsx`, `assets/editeur/ManagerNode/NodeNav/Settings.tsx`

