# Change: Ajouter un nœud NodeTopButton (retour en haut)

## Why
Le builder ne propose pas encore de composant natif pour remonter rapidement en haut de page. Les éditeurs ont besoin d'un bouton "retour en haut" configurable visuellement pour l'intégrer à différentes chartes.

## What Changes
- Ajout d'un nouveau type de nœud `NodeTopButton` (identifiant `node-top-button`) dans le builder.
- Le nœud déclenche un retour en haut de page au clic.
- Le nœud expose des réglages de style pour la couleur de fond, la couleur de l'icône et la bordure.
- Le nœud est ajoutable uniquement comme enfant direct de `NodeRoot`.
- Le rendu et la persistance du nœud couvrent l'éditeur, la preview et le rendu final.

## Impact
- Affected specs: `page-builder`
- Affected code: `assets/editeur/ManagerNode/NodeTopButton/*`, registre des nodes du builder, sérialisation/rendu des nodes
