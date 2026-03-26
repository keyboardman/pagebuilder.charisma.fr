# Change: Ajouter source d'image et lien par slide pour NodeSlideshow

## Why
Le NodeSlideshow doit pouvoir :
- soit gérer la liste des slides manuellement (URL de l'image, alt et lien optionnel) ;
- soit déterminer automatiquement la liste des slides via la sélection d'un endpoint API image fixe (chargement depuis la collection).
Il manque aussi la notion de lien cliquable par slide.

## What Changes
- Étendre la gestion des slides de `NodeSlideshow` pour permettre un choix de mode :
  - `manual` : la liste des slides est éditée dans le panneau (URL de l'image, alt, lien optionnel)
  - `api-endpoint` : la liste des slides est chargée automatiquement depuis une API image fixe sélectionnée
- Ajouter un champ de lien optionnel par slide, configurable dans le panneau de réglages.
- Clarifier la persistance de ces nouveaux champs (source et lien) dans le contenu sérialisé du node.
- Clarifier le comportement de rendu: quand un lien est renseigné, l'image de la slide devient cliquable.

## Impact
- Affected specs: `page-builder`
- Affected code: `assets/editeur/ManagerNode/NodeSlideshow/Settings.tsx`, `assets/editeur/ManagerNode/NodeSlideshow/View.tsx`, `assets/editeur/ManagerNode/NodeSlideshow/index.ts`, intégration API image fixe côté builder
