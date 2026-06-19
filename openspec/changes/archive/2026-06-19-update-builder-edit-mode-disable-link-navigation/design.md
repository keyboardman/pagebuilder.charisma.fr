## Context

Le canevas d’édition WYSIWYG rend les composants `view` pour tous les nœuds. Plusieurs types exposent des `<a href>` ou du HTML riche contenant des liens. `NodeButton` neutralise déjà la navigation en édition via `preventDefault` ; d’autres nœuds (`NodeNavItem`, `NodeCard`, `NodeSlideshow`, etc.) ne le font pas. `NodeRichText` injecte des liens via `dangerouslySetInnerHTML`, ce qui rend une approche nœud-par-nœud fragile.

`NodeYoutube` utilise `react-youtube`, qui insère une iframe capturant tous les événements pointeur.

Le layout expose déjà `data-mode={mode}` sur `.admin-layout` (`Builder.tsx`).

## Goals / Non-Goals

- Goals :
  - Aucune navigation hors builder depuis le canevas en mode édition.
  - Sélection de nœud fiable (canevas ou Explorer) même sur des blocs avec liens ou iframes.
  - Rendu visuel WYSIWYG inchangé (les liens restent visibles, seule l’interaction change).
- Non-Goals :
  - Désactiver les boutons d’interface du builder (toggle Édition/Prévisualisation, menus latéraux).
  - Bloquer la soumission AJAX des `NodeForm` en édition (comportement existant conservé).
  - Modifier le rendu public (`view`) ou la prévisualisation.

## Decisions

- **Décision** : appliquer `pointer-events: none` en CSS sur les liens (`a[href]`) **uniquement** dans `.admin-layout[data-mode=edit] .admin-layout__main`, afin de couvrir tous les nœuds y expandables HTML (RichText) sans duplication.
- **Décision** : appliquer la même neutralisation aux iframes des lecteurs embarqués en édition (`.ce-youtube-player iframe`, et autres embeds identifiés si nécessaire).
- **Décision** : conserver les handlers `preventDefault` existants sur `NodeButton` / `NodeVideoApi` comme filet de sécurité ; ne pas les retirer.
- **Alternative écartée** : interception globale `click` en capture sur le canevas — plus complexe à maintenir et risque de conflits avec DnD / NodeMenu.
- **Alternative écartée** : retirer les `<a>` en édition et les remplacer par `<span>` — casse le WYSIWYG.

## Risks / Trade-offs

- **Liens dans le canevas non cliquables en édition** → attendu ; la prévisualisation permet de tester la navigation.
- **`pointer-events: none` sur iframe YouTube** → le lecteur ne se lance pas en édition → acceptable, cohérent avec l’objectif édition structurelle.
- **Boutons burger NodeNav** (éléments `<button>`) → non concernés, restent utilisables pour tester le menu mobile en édition.

## Migration Plan

Changement front-end uniquement, sans migration de données. Déploiement transparent pour les pages existantes.

## Open Questions

- Faut-il étendre la neutralisation aux iframes `NodeVideoHome` ou autres embeds vidéo dès cette itération, ou seulement `NodeYoutube` signalé par l’équipe ?
