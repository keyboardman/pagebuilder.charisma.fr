# Change: ManagerFont — polices à la demande dans le builder

## Why

Dans le builder, les sélecteurs `font-family` (ex. `Text2Settings`, `NodeRoot`) ne proposent aujourd’hui que les polices du thème (`themeFonts`) et les polices navigateur intégrées (`typography.ts`). L’utilisateur ne peut pas choisir une autre police du catalogue (`Font` en base) sans charger l’ensemble du catalogue au démarrage, ce qui serait coûteux en performance et en réseau.

Il faut permettre d’ajouter des polices du catalogue à la demande, tout en ne chargeant que celles réellement utilisées dans la page en cours.

## What Changes

- Introduction de **ManagerFont** (`assets/editeur/ManagerFont/`), sur le modèle de `ManagerApi` : modale de recherche et sélection d’une police du catalogue (native, Google, custom).
- Introduction d’un **registre d’usage des polices de page** (`FontUsageRegistry`) qui suit les polices actives sur la page : enregistrement à la sélection ou à la détection dans les nodes, retrait lorsque plus aucun node ne référence la police.
- Extension de `typography.ts` avec `unregisterFont` et synchronisation pilotée par le registre d’usage (chargement / déchargement des feuilles et `@font-face` dans l’iframe d’édition).
- Endpoint Symfony paginé pour lister et rechercher les polices du catalogue (`GET /api/builder/fonts`) et résoudre une police par id (`GET /api/builder/fonts/{id}`), sans exposer tout le catalogue au chargement initial.
- Adaptation de `FontFamilySelect` : options = polices navigateur + thème + polices de la page ; bouton pour ouvrir ManagerFont et ajouter une police au catalogue de la page.
- Scanner des nodes pour détecter les `fontFamily` utilisés (y compris dans les sous-parties de style) et resynchroniser le registre au chargement et à chaque modification des nodes.
- Chargement des polices de page hors thème en preview/rendu public (injection des feuilles nécessaires à partir du contenu JSON de la page).

## Impact

- Affected specs: `page-builder`, `font`
- Affected code:
  - `assets/editeur/ManagerFont/` (nouveau)
  - `assets/editeur/services/typography.ts`
  - `assets/editeur/components/form/FontFamilySelect.tsx`
  - `assets/editeur/services/providers/BuilderProvider.tsx`
  - `src/Controller/` (nouveau contrôleur ou routes builder fonts)
  - `src/Service/ThemeFontBuilderService.php` (factorisation partagée avec résolution police)
  - `templates/page/builder.html.twig`, `templates/page/render_view.html.twig` (URL API fonts)
  - Preview standalone si applicable
