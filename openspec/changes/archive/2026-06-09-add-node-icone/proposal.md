# Change: Ajouter le nœud NodeIcone dans le page builder

## Why
Le builder dispose déjà de **NodeTextIcon** pour combiner texte et icône, mais il manque un composant dédié à l'affichage d'une **icône seule** (sans bloc texte éditable). Ce besoin revient pour les pictogrammes, liens iconiques, marqueurs visuels ou éléments décoratifs sans surcharge éditoriale.

## What Changes
- Ajout d'un nouveau nœud **NodeIcone** (identifiant `node-icone`), version simplifiée de **NodeTextIcon** sans texte.
- Réutilisation du rendu d'icône existant (presets intégrés, icône du thème, image URL / médiathèque) et des classes `ce-icon`.
- Paramètres : source d'icône, taille, alignements horizontal/vertical, lien optionnel, styles conteneur et icône.
- Enregistrement dans le registre des nœuds et le panneau des composants (catégorie `content`).

## Impact
- Affected specs: `page-builder`
- Affected code: `assets/editeur/ManagerNode/NodeIcone/`, `NodeRegistry.ts`, CSS thème de base (`ce-icon` partagé avec NodeTextIcon)
