# Tests frontend (React / TypeScript)

Guide pour écrire et lancer les tests unitaires du builder (`assets/editeur/`).

## Stack

- **Vitest** — runner de tests (TypeScript natif, rapide)
- **React Testing Library** — rendu et requêtes orientées utilisateur
- **jsdom** — environnement DOM minimal

Les tests frontend sont **indépendants** du build Webpack Encore.

## Commandes

```bash
npm run test:frontend          # mode watch (développement)
npm run test:frontend:run      # exécution unique (CI)
npm run test:frontend:coverage # rapport de couverture
```

`composer test` exécute aussi `npm run test:frontend:run` après PHPUnit.

## Convention de fichiers

Placer le test **à côté** du code testé :

```
assets/editeur/utils/nodeLabel.ts
assets/editeur/utils/nodeLabel.test.ts
```

Patterns reconnus : `*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx` sous `assets/`.

## Niveaux de test (par difficulté croissante)

### 1. Fonctions pures

Pas de React, pas de contexte. Exemple : `assets/editeur/utils/nodeLabel.test.ts`.

```typescript
import { describe, expect, it } from "vitest";
import { getNodeDisplayLabel } from "./nodeLabel";
import { createTestNode } from "../../test/nodeFixtures";

it("priorise editorLabel", () => {
  const node = createTestNode({ editorLabel: "Mon bloc" });
  expect(getNodeDisplayLabel(node)).toBe("Mon bloc");
});
```

### 2. Hooks avec contexte mocké

Utiliser `renderHook` et un wrapper qui fournit le contexte minimal.

Exemple : `assets/editeur/hooks/useCanvasNavigation.test.tsx` avec `AppContext.Provider`.

### 3. Composants avec `NodeBuilderContext`

Utiliser le helper `renderWithNodeBuilder` (`assets/test/renderWithNodeBuilder.tsx`) :

```typescript
import { screen } from "@testing-library/react";
import { createTestNode } from "../../../test/nodeFixtures";
import { renderWithNodeBuilder } from "../../../test/renderWithNodeBuilder";
import MyNodeSettings from "../NodeText/Settings";

const node = createTestNode({ type: "node-text" });
renderWithNodeBuilder(<MyNodeSettings />, node);
```

### 4. Composants complexes (à reporter)

Lexical (RichText), drag & drop (`@dnd-kit`), file manager (iframe + `postMessage`) : coût de mock élevé. Préférer des tests manuels ou E2E (Playwright) dans un second temps.

## Helpers partagés

| Fichier | Rôle |
|---------|------|
| `assets/test/setup.ts` | Configuration globale (jest-dom, cleanup) |
| `assets/test/nodeFixtures.ts` | `createTestNode()` — fabrique un `NodeType` minimal |
| `assets/test/renderWithNodeBuilder.tsx` | Rendu avec `NodeBuilderContext` mocké |

## Pièges courants

### Debounce des champs `Form.Input`

Les inputs du formulaire builder utilisent un debounce de 500 ms. Dans les tests :

```typescript
vi.useFakeTimers({ shouldAdvanceTime: true });
const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
// ... saisie ...
await waitFor(() => expect(onChange).toHaveBeenCalled());
vi.useRealTimers();
```

### Alias TypeScript

Vitest reprend les alias Webpack : `@/` → `assets/`, `@editeur/` → `assets/editeur/` (voir `vitest.config.mts`).

### Imports lourds (NodeRegistry, nœuds)

Importer un `ManagerNode/Node*/index.ts` charge souvent View, Settings et dépendances (Swiper, dnd-kit…). Dans les tests de composants, **mocker les modules lourds** avec `vi.mock` :

```typescript
vi.mock("../NodeImage", () => ({ NODE_IMAGE_TYPE: "node-image" }));
vi.mock("../ManagerNode/components/NodeRegistry", () => ({
  default: { "node-image": { button: { label: "Image" } } },
  isKnownNode: (node: { type: string }) => node.type === "node-image",
}));
```

Voir les exemples dans `nodeLabel.test.ts` et `useCanvasNavigation.test.tsx`.

### Imports CSS / Tailwind

`css: true` dans `vitest.config.mts` permet d'importer les feuilles de style sans erreur (avertissements jsdom sur le CSS moderne de Swiper : sans impact sur les tests).

### Exclusion du build Encore

Les fichiers `*.test.ts(x)` et le dossier `assets/test/` sont exclus de `tsconfig.json` pour ne pas être compilés par Webpack Encore.

## Configuration

- `vitest.config.mts` — racine du projet (format ESM ; Vitest 2 + jsdom 24 pour compatibilité Node 20.12)
- `assets/test/setup.ts` — exécuté avant chaque fichier de test (jest-dom, `ResizeObserver` stub)

## Exemples existants

- `assets/editeur/utils/nodeLabel.test.ts`
- `assets/editeur/hooks/useCanvasNavigation.test.tsx`
