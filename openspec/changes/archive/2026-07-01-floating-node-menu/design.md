## Context

En mode édition, chaque nœud est enveloppé par `NodeBuilderComponent` (`NodeComponent.tsx`). Lorsqu'il est sélectionné, un `NodeMenu` est rendu **avant** le contenu du nœud dans le DOM :

```tsx
{selected ? <NodeMenu /> : null}
<div>{children}</div>
```

Le menu utilise `w-full`, une bordure inférieure et un fond accent — il se comporte comme une barre d'en-tête intégrée au bloc. La variable CSS `--node-menu-height: 2.25rem` est déclarée sur `.admin-layout[data-mode=edit]` mais n'est pas consommée ailleurs ; le décalage provient surtout du flux DOM et du padding du wrapper (`p-1`, `m-1`).

Le drag-and-drop repose sur `@dnd-kit/react` : `drag.ref` sur le conteneur du nœud, `drag.handleRef` sur la poignée grip du `NodeMenu` (`NodeBuilderProvider.tsx`, `feedback: "clone"`).

Le problème est particulièrement visible dans `NodeFlex` : les enfants sont des items flex ; l'ajout d'une barre au-dessus du contenu d'un enfant sélectionné modifie sa hauteur intrinsèque et peut provoquer un débordement du conteneur, alors qu'en prévisualisation (sans menu) le rendu est correct.

## Goals / Non-Goals

**Goals:**

- Positionner le `NodeMenu` en overlay flottant **au-dessus** du wrapper du nœud (aligné en haut à gauche), hors flux, **sans recouvrir** le contenu du bloc.
- Conserver l'affichage du menu uniquement pour le nœud sélectionné.
- Aligner l'emprise du contenu en édition sur celle de la prévisualisation.
- Maintenir le drag-and-drop via la poignée grip, sans régression sur les dropzones.
- Garantir la lisibilité du menu (fond opaque, ombre, z-index) sur tout fond.

**Non-Goals:**

- Modifier le rendu en prévisualisation ou à l'export HTML.
- Changer le contenu ou les actions du menu (duplicate, delete, rich text pencil).
- Repenser l'architecture drag-and-drop (`@dnd-kit`) ou le `DragOverlay`.
- Ajouter un menu aux nœuds rendus via `NodeChild` (composant non utilisé actuellement dans les collections).

## Decisions

### 1. Overlay `position: absolute` sur le wrapper `relative`

**Choix** : rendre le conteneur `NodeBuilderComponent` `position: relative` et positionner `NodeMenu` en `absolute bottom-full left-0 mb-0.5` avec un `z-index` élevé (ex. `z-20`). Le menu flotte **au-dessus** du bord supérieur du nœud, sans recouvrir son contenu.

**Alternatives écartées** :
- **Portal React** vers le body : complexité inutile, gestion du positionnement lors du scroll du canevas.
- **Menu fixe au viewport** : perd le rattachement visuel au nœud lors du défilement interne.
- **`top-0 left-0` en overlay sur le contenu** : masque le contenu du nœud ; rejeté après retour utilisateur.

**Rationale** : solution CSS minimale, le menu reste ancré au coin supérieur gauche du wrapper sans empiéter sur le contenu du bloc.

### 2. Menu compact, largeur intrinsèque (pas `w-full`)

**Choix** : remplacer `w-full` par `w-max max-w-[calc(100%-0.5rem)]` (ou équivalent) pour un bandeau compact en haut à gauche, avec `rounded-md`, `shadow-md`, `border` et fond opaque (`bg-accent`).

**Rationale** : un menu pleine largeur en overlay masquerait une partie significative du contenu ; l'objectif est une pastille de contrôle toujours visible sans occuper toute la largeur.

### 3. Conserver `handleRef` sur la poignée grip

**Choix** : ne pas déplacer `handleRef` ; le drag reste initié uniquement depuis le grip (comportement actuel).

**Rationale** : `@dnd-kit` est déjà configuré avec `handleRef` ; aucun changement de provider nécessaire si la poignée reste dans le DOM du nœud draggable.

### 4. `pointer-events` : menu interactif, pas de blocage global

**Choix** : le menu garde `pointer-events: auto` (défaut). Ne pas mettre `pointer-events-none` sur le wrapper entier. Si le menu chevauche une dropzone, accepter un léger chevauchement en haut à gauche — la majorité des dropzones (intermédiaires, trailing) restent accessibles.

**Mitigation** : menu compact ; les dropzones ont une zone de collision `@dnd-kit` plus large que le visuel (`p-5` au hover).

### 5. Supprimer les styles « barre d'en-tête » du wrapper

**Choix** : retirer `rounded-b-sm` conditionnel lié au menu ; utiliser `rounded-sm` uniforme sur le wrapper. Le menu n'a plus `border-b` ni `rounded-t-md` (styles de header).

### 6. Variable `--node-menu-height`

**Choix** : supprimer la déclaration inutilisée de `builder.css` pour éviter toute future réutilisation erronée.

## Risks / Trade-offs

| Risque | Mitigation |
|--------|------------|
| Menu masque le contenu en haut à gauche du bloc | Menu compact ; acceptable pour l'édition (WYSIWYG sur le reste du bloc) |
| Ancêtre `overflow: hidden` clippe le menu | Vérifier `NodeFlex`, grilles ; ajouter `overflow-visible` sur le wrapper d'édition si nécessaire |
| Menu illisible sur fond sombre/clair | Fond opaque + ombre + bordure ; tokens `accent` existants |
| Régression drag-and-drop | Tester déplacement depuis grip dans flex, nav, root ; `handleRef` inchangé |
| Chevauchement menu / dropzone adjacente | Dropzones conservent priorité de collision ; menu petit en coin |

## Migration Plan

1. Modifier `NodeComponent.tsx` et `NodeMenu.tsx` (structure + classes Tailwind).
2. Ajuster `builder.css` si besoin (`overflow`, suppression `--node-menu-height`).
3. Vérification manuelle : enfant `NodeFlex` sélectionné, drag grip, drop entre enfants, prévisualisation inchangée.
4. Pas de migration de données ni déploiement backend.

## Open Questions

_Aucune — le positionnement top-left flottant est validé par la demande utilisateur._
