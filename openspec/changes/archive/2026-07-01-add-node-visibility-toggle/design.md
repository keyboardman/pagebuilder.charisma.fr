## Context

Le builder stocke la page sous forme d’un graphe de `NodesType` (`Record<NodeID, NodeType>`). Chaque nœud possède déjà un `editorLabel` pour l’affichage dans le navigateur Structure (`ManagerExplorer`). Le rendu passe par `NodeComponent` / `NodeChild` / `NodeCollection`, avec trois modes applicatifs (`edit`, `preview`, `view`) via `AppContext`.

Il n’existe aujourd’hui aucun mécanisme de visibilité : masquer un bloc implique de le supprimer. Le navigateur Structure (`ExplorerRow`) affiche chaque nœud avec des actions de sélection, renommage et déplacement.

## Goals / Non-Goals

**Goals :**

- Permettre de basculer la visibilité d’un nœud (et implicitement de ses descendants) depuis l’onglet Structure via une icône œil.
- Ne pas rendre les nœuds masqués en prévisualisation, vue et rendu public.
- Conserver les nœuds masqués dans le JSON sauvegardé (`hidden: true`).
- En mode édition, garder les nœuds masqués repérables sur le canevas (style atténué) et dans l’arbre Structure.
- Empêcher le masquage du nœud racine (`node-root`).

**Non-Goals :**

- Visibilité conditionnelle (date, rôle utilisateur, breakpoint).
- Masquage individuel des enfants lorsque le parent reste visible (le masquage parent suffit ; un enfant peut toutefois être masqué individuellement).
- Modification backend ou export HTML côté serveur (le JSON est déjà la source de vérité ; le rendu React filtre côté client).
- Icône œil sur le canevas ou dans `NodeMenu` (uniquement dans Structure pour ce changement).

## Decisions

### 1. Champ `hidden?: boolean` sur `NodeType`

- **Choix** : propriété optionnelle au niveau du nœud, `undefined` ou `false` = visible.
- **Alternatives** : `visible` (inversion logique) — rejeté car `hidden` est plus explicite pour le cas d’usage « masquer sans supprimer » ; `attributes.hidden` — rejeté car mélange éditeur / rendu public et risque de fuite HTML.

### 2. Visibilité effective en cascade (lecture seule)

- **Choix** : un nœud est effectivement masqué si `node.hidden === true` **ou** si un ancêtre possède `hidden: true`. La cascade est calculée à la volée via un utilitaire `isNodeEffectivelyHidden(nodeId, nodes)`.
- **Alternatives** : propager `hidden: true` sur tous les descendants au toggle — rejeté car perte de l’état individuel des enfants lors de la réactivation du parent.
- **Implémentation** : `assets/editeur/utils/nodeVisibility.ts` avec remontée des ancêtres via `node.parent.id`.

### 3. Toggle depuis `ExplorerRow`

- **Choix** : bouton icône à droite de la ligne (`Eye` visible / `EyeOff` masqué, lucide-react). Clic appelle `updateNode({ ...node, hidden: !node.hidden })` via `BuilderContext`. Le clic ne déclenche pas la sélection (`stopPropagation`).
- **Protection** : pas de bouton pour `node-root` ; désactivé ou absent.
- **Style arbre** : ligne avec opacité réduite (`opacity-50`) quand le nœud est effectivement masqué.

### 4. Rendu selon le mode

| Mode | Comportement |
|------|-------------|
| `preview`, `view` | `NodeComponent` / `NodeChild` retournent `null` si effectivement masqué |
| `edit` | Rendu conservé avec classes `opacity-40` + indicateur visuel optionnel ; sélection et édition toujours possibles via Structure ou clic canevas |

- **Point central** : le filtrage se fait dans `NodeComponent.tsx` et `NodeChild.tsx` (point d’entrée unique du rendu de chaque nœud), pas dans chaque `View.tsx` de type de nœud.
- **Dropzones** : en mode édition, les dropzones des conteneurs masqués restent fonctionnelles (le conteneur est toujours rendu, seulement atténué).

### 5. Persistance

- Aucun changement backend : `hidden` est sérialisé naturellement dans le JSON `Page.content` existant.
- Pages existantes sans `hidden` : comportement inchangé (tout visible).

## Risks / Trade-offs

- **[Risque] Nœud masqué mais sélectionné** → Si le nœud sélectionné est masqué, le panneau NodeSettings reste accessible ; pas de désélection automatique (comportement acceptable).
- **[Risque] Enfants masqués par ancêtre mais `hidden: false` en base** → Documenté : la visibilité effective prime ; réactiver un enfant dont le parent est masqué n’a aucun effet tant que le parent reste masqué.
- **[Risque] Tests existants** → Ajouter des tests unitaires sur `nodeVisibility.ts` et sur `ExplorerRow` (toggle) ; adapter les snapshots si nécessaire.
- **[Trade-off] Canevas en édition** → Les nœuds masqués restent visibles (atténués) pour faciliter la réactivation ; seule la « page » (preview/public) les exclut totalement.

## Migration Plan

1. Déployer le frontend (pas de migration de données).
2. Les pages existantes fonctionnent sans modification.
3. Rollback : retirer le champ `hidden` ignoré par les anciennes versions (inoffensif).

## Open Questions

- Aucune pour l’instant.
