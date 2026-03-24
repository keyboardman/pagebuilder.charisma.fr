# Change: Add NodeSlideshow with Swiper

## Why
Le builder a besoin d’un type de node permettant de créer facilement un diaporama (carousel) à partir d’une liste d’images. Cette fonctionnalité doit proposer une expérience d’édition fluide (ajouter, trier, supprimer, modifier les images) et offrir des réglages d’affichage (navigation, pagination, vitesse) cohérents avec l’aperçu et le rendu final.

## What Changes
- Ajouter un nouveau type de node **NodeSlideshow** (identifiant `node-slideshow`) rendu via la librairie **Swiper**.
- Permettre dans les paramètres du node d’ajouter des images, de réordonner les slides (tri), de supprimer une slide et de modifier l’image de la slide actuellement sélectionnée.
- Exposer des paramètres Swiper configurables : affichage de la navigation (prev/next), affichage de la pagination et vitesse (en millisecondes).
- Ajouter l’intégration Swiper côté frontend (dépendance, CSS, rendu des slides) et le CSS de node nécessaire.

## Impact
- Affected specs: `page-builder`
- Affected code:
  - `assets/editeur/ManagerNode/NodeRegistry.ts` (inscription du nouveau type `node-slideshow`)
  - Nouveau dossier `assets/editeur/ManagerNode/NodeSlideshow/*` (Edit/Settings/View)
  - `package.json` (dépendance `swiper`)
  - `assets/editeur/assets/themes/base/css/*` (CSS de node slideshow)

