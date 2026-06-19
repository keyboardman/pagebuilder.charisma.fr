## Context

`NodeRoot` (`node-root`) est le nœud unique racine de chaque page. Son `Settings.tsx` actuel expose uniquement le titre et huit blocs de typographie (h1–h6, div, p) sans structure par onglets. Le rendu (`Content.tsx`) applique des classes Tailwind fixes (`bg-background`) sur la colonne centrale, sans couche d’arrière-plan configurable.

Les autres nœuds s’appuient sur `Background2Settings` pour couleur, image et position CSS. Il n’existe pas encore de pattern « vidéo de fond pleine page » dans le builder ; les nœuds vidéo existants (`NodeVideo`, `NodeVideoApi`) gèrent une vidéo interactive avec poster et overlay play, ce qui diffère d’un fond décoratif en boucle.

## Goals / Non-Goals

- Goals :
  - Permettre de choisir un arrière-plan de page parmi : thème par défaut, couleur, image, vidéo en boucle.
  - Afficher le résultat de façon fidèle en édition, preview et rendu final.
  - Réorganiser les settings NodeRoot en onglets pour une UX alignée sur les nœuds récents (`NodeSlideshow`, `NodeIcone`).
  - Persister la configuration dans `node.content.background` sans migration destructive.
- Non-Goals :
  - Arrière-plan par breakpoint (mobile/tablette/desktop) — une seule configuration globale pour l’instant.
  - Vidéo YouTube ou iframe embarquée en fond (uniquement fichier vidéo hébergé / URL directe).
  - Contrôles utilisateur sur la vidéo de fond (play/pause, volume) — fond décoratif uniquement.
  - Refonte du conteneur interne (largeur max, breakpoint preview) — hors scope sauf retrait du `bg-background` fixe si nécessaire pour laisser voir le fond.

## Decisions

- **Modèle de données** — ajouter `node.content.background` :

```ts
type NodeRootBackground =
  | { type: 'default' }
  | { type: 'color'; color: string }
  | {
      type: 'image';
      url: string;
      position?: string;   // ex. center, top, bottom…
      size?: string;       // cover | contain
      repeat?: string;     // no-repeat | repeat…
      color?: string;      // fallback / sous-couche
    }
  | {
      type: 'video';
      url: string;
      poster?: string;
      objectFit?: string;  // cover | contain
      objectPosition?: string;
      color?: string;      // fallback pendant le chargement
    };
```

  Absence de clé `background` ou `type: 'default'` → comportement actuel (thème).

- **UI Settings** — trois onglets via `NodeSettingsWrapper` + `Tabs` :
  1. **Général** : titre de la page ;
  2. **Arrière-plan** : sélecteur de type + champs contextuels (réutiliser `Background2Settings` partiellement ou en extraire les contrôles image/couleur ; picker médiathèque `type="video"` pour la vidéo) ;
  3. **Typographie** : contenu actuel des `defaultStyles`.

- **Rendu DOM** — sur le wrapper externe `.node-root-content` :
  - **Couleur / image** : styles inline ou classe dédiée sur le wrapper ;
  - **Vidéo** : élément `<video>` en position absolue/fixed couvrant le wrapper (`object-fit: cover` par défaut), attributs `autoplay muted loop playsInline`, `pointer-events: none` pour ne pas bloquer l’édition du canevas ;
  - **Fallback couleur** : `background-color` sur le wrapper même en mode image/vidéo.

- **Colonne interne** — retirer ou rendre transparent le `bg-background` fixe de la colonne centrale lorsqu’un arrière-plan personnalisé est actif, afin que le fond soit visible sur toute la largeur du viewport.

- **Édition vs preview** — même rendu visuel ; en mode édition la vidéo reste muette et non interactive. Pas de pastille play (contrairement aux nœuds vidéo interactifs).

## Risks / Trade-offs

- **Autoplay navigateur** → imposer `muted` + `playsInline` ; documenter que la vidéo sans son est requise pour l’autoplay.
- **Performance** → une vidéo lourde en fond peut impacter l’éditeur ; acceptable pour un usage décoratif ponctuel ; pas de préchargement agressif au-delà de `preload="auto"` par défaut.
- **Lisibilité du contenu** → pas de calque d’assombrissement dans cette itération ; l’utilisateur gère le contraste via le contenu ou une couleur de fallback.
- **Compatibilité JSON existant** → pages sans `background` inchangées.

## Migration Plan

1. Déployer le nouveau schéma en lecture seule (fallback `default`).
2. Aucune migration backend : le JSON page est schemaless côté contenu nœuds.
3. Rollback : ignorer `content.background` si absent du code déployé.

## Open Questions

- Faut-il exposer un réglage d’**opacité** ou de **overlay** sur l’arrière-plan dans une itération ultérieure ?
- Le fond doit-il s’appliquer aussi derrière le **NodeTopButton** (fixe) — comportement attendu : oui, fond viewport pleine page.
