## Context

Le builder stocke les nœuds dans un dictionnaire `NodesType` (`Record<NodeID, NodeType>`). La hiérarchie est portée par `node.parent` (`id`, `order`, `zone`). La sélection est centralisée dans `BuilderProvider` (`selected`, `setSelected`, `nodeSelected`) et le panneau de réglages (`NodeSettings`) réagit déjà à `nodeSelected`.

Un composant `Explorer.tsx` a été amorcé mais non branché : il lit un ID fixe et n’appelle pas `setSelected`.

## Goals / Non-Goals

- Goals :
  - Arbre DOM-like navigable en mode édition.
  - Clic arbre → sélection + panneau settings.
  - Sélection canevas → entrée active dans l’arbre.
  - Support des conteneurs multi-zones (`main`, `cell-*`, etc.).
- Non-Goals :
  - Réordonnancement par drag-and-drop dans l’arbre (le DnD existant sur le canevas reste la source de vérité).
  - Renommage libre des nœuds dans l’arbre (hors libellé de type).
  - Affichage du navigateur en mode prévisualisation.

## Decisions

- **Emplacement UI** : onglets dans la sidebar gauche (`Blocs` | `Structure`) pour ne pas réduire l’espace du canevas ni dupliquer une troisième colonne.
- **Construction de l’arbre** : partir du nœud `node-root` (même racine que `NodeWrapper`) ; pour chaque nœud parent, lister les enfants via `Object.values(nodes).filter(n => n.parent?.id === parentId)`, triés par `zone` puis `parent.order`. Si un parent a des enfants dans plusieurs zones, afficher un niveau intermédiaire optionnel portant le nom de la zone (ex. `cell-0-1`) avant les nœuds enfants.
- **Libellé affiché** : `NodeRegistry[type].button.label` si disponible, sinon le type sans préfixe `node-`.
- **Sélection** : clic sur une ligne → `setSelected(id)` (sans toggle désélection : un clic sur le nœud déjà sélectionné le garde actif, aligné sur l’usage « navigateur »).
- **Sync canevas → arbre** : `useEffect` sur `selected` pour déplier les ancêtres et `scrollIntoView` sur l’entrée active.
- **Composant** : enrichir `Explorer.tsx` plutôt que créer un second module parallèle.

## Risks / Trade-offs

- Pages très profondes / nombreuses entrées → risque de liste longue. Mitigation : conteneurs repliés par défaut sauf branche du nœud sélectionné ; zone scrollable dans la sidebar.
- Conteneurs avec zones dynamiques (`NodeGrid`) → l’arbre doit recalculer les zones à chaque changement de `nodes` (acceptable, `nodes` est déjà réactif).

## Migration Plan

- Aucune migration de données : fonctionnalité UI uniquement.
- Déploiement : intégration progressive dans `Builder.tsx` ; le stub non utilisé est remplacé sans impact sur le JSON des pages.

## Open Questions

- Aucune pour l’instant ; l’emplacement onglets gauche et le libellé registre couvrent le besoin exprimé.
