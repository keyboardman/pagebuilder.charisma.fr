# Change: Ajouter NodeAnniversaire (catégorie custom)

## Why
Le builder ne propose pas encore de composant dédié pour afficher les anniversaires de mariage Charisma sous forme de liste prête à l'emploi. Les équipes ont besoin d'un node simple à insérer qui reproduit exactement le format de la liste de référence.

## What Changes
- Ajouter un nouveau type de node `NodeAnniversaire` dans le builder.
- Classer ce node dans une nouvelle catégorie de panneau `custom`.
- Définir un rendu en liste groupée par date, aligné sur la référence `https://api.charisma.fr/charisma/anniversaire/mariage`.
- Spécifier la récupération des données depuis l'endpoint de référence et le comportement de repli en cas d'échec.

## Impact
- Affected specs: `page-builder`
- Affected code: `assets/editeur/ManagerNode/*`, `assets/editeur/ManagerNode/PanelButtons/index.tsx`, styles du thème éditeur, éventuels adaptateurs API côté backend/frontend pour la récupération des anniversaires.
