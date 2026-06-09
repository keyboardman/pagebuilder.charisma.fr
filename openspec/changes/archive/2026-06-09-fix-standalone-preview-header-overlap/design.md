## Context

La page standalone (`templates/page/builder.html.twig`) monte `PageBuilderStandalone` dans un conteneur `h-full`. Ce composant ajoute un en-tête fixe (Retour / Enregistrer) puis un bloc `flex-1 overflow-auto` contenant `PageBuilderEmbed` → `Builder`.

Le `Builder` utilise `admin-layout` avec `h-screen` et, en mode preview, la règle CSS :

```css
.admin-layout[data-mode=preview] {
    overflow-y: scroll;
}
```

Cela fait défiler l’intégralité du layout builder (y compris `Layout.Header`) dans un parent qui défile déjà. L’en-tête standalone, ancré en haut du viewport, recouvre `Layout.Header` lors du défilement.

## Goals / Non-Goals

- Goals :
  - Les deux barres (standalone + builder) restent visibles et utilisables en mode prévisualisation.
  - Une seule zone de défilement verticale pour le contenu de la page en preview.
  - Comportement cohérent sur une page longue (scroll jusqu’en bas).
- Non-Goals :
  - Refonte du design des en-têtes.
  - Changement du comportement plein écran (hors correction d’un éventuel chevauchement identique).

## Decisions

- **Décision : défilement confiné au canevas en preview** — Retirer `overflow-y: scroll` sur `.admin-layout[data-mode=preview]` et s’appuyer sur `overflow-y-auto` déjà présent sur `.admin-layout__main`. Le header builder reste hors de la zone scrollable.
- **Décision : hauteur relative en contexte embarqué** — Remplacer `h-screen` par `h-full` (ou `min-h-0 flex-1`) sur `admin-layout` lorsque le builder est monté via `PageBuilderEmbed` / `BuilderInline`, afin de respecter l’espace sous l’en-tête standalone.
- **Décision : header builder sticky en preview** — Appliquer `position: sticky; top: 0; z-index` approprié sur `.admin-layout__header` en mode preview pour garantir sa visibilité si un conteneur parent conserve un scroll résiduel.
- **Alternative écartée : fusionner les deux en-têtes** — Trop invasive ; les responsabilités (navigation app vs outils builder) restent séparées.

## Risks / Trade-offs

- Le `NodeTopButton` en preview cible `.admin-layout__main` comme conteneur de scroll : confiner le scroll au canevas renforce ce comportement (aligné avec l’intention actuelle).
- Le mode plein écran (`useFullscreen`) peut nécessiter un test de non-régression sur le positionnement des barres.

## Migration Plan

Correction CSS/JS uniquement, sans migration de données. Déploiement avec rebuild Encore (`pageBuilderStandalone`).

## Open Questions

- Aucune pour l’instant ; le formulaire d’édition intégré (sans en-tête standalone) ne devrait pas être impacté si la hauteur relative est limitée au contexte embarqué standalone.
