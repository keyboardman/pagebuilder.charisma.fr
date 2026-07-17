## Why

En mode **liste**, NodeCollection n’expose aucun contrôle d’espacement entre items, alors que les modes **grille** et **slideshow** disposent déjà d’un paramètre `gap`. Les auteurs doivent actuellement passer par le CSS thème ou accepter l’espacement fixe (`0.75rem` sur `.ce-collection-list`), ce qui empêche un réglage éditorial rapide et cohérent avec les autres dispositions.

## What Changes

- Ajout d’un paramètre **`list.gap`** (nombre, même échelle Tailwind que `grid.gap`) pour le mode `display = list`.
- Contrôle **Gap** visible dans l’onglet Affichage lorsque le display est « Liste », aligné sur le contrôle existant de la grille.
- Application du gap sur le conteneur liste (`.ce-collection-list` / markup list-api) via classes Tailwind `gap-*`, comme pour la grille.
- Valeur par défaut cohérente avec l’espacement CSS actuel (équivalent ~`gap-3` / `0.75rem`).
- Persistance dans le contenu du nœud ; rétrocompatibilité : absence de `list.gap` → défaut.

## Capabilities

### New Capabilities

<!-- Aucune — extension d’un comportement existant. -->

### Modified Capabilities

- `node-collection` : le mode liste doit exposer et appliquer un paramètre d’espacement `gap` entre items, configurable depuis les settings d’affichage.

## Impact

- Affected specs: **node-collection** (delta)
- Affected code:
  - `assets/editeur/ManagerNode/NodeCollection/index.ts` (`CollectionListOptions`, default content)
  - `assets/editeur/ManagerNode/NodeCollection/CollectionDisplay.tsx` (`CollectionDisplayList`)
  - `assets/editeur/ManagerNode/NodeCollection/Settings/DisplayTab.tsx` (contrôle Gap en mode liste)
  - Tests : `View.test.tsx` / éventuels tests display
  - CSS thème : éventuel retrait du `gap` fixe sur `.ce-collection-list` pour laisser le paramètre primer (sinon conflit)
