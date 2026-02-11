# Change: Ajouter le nœud bouton (NodeButton)

## Why

Le builder ne dispose pas d’un bloc dédié pour les boutons (action, soumission de formulaire ou lien stylisé). Un nœud **NodeButton** permet d’ajouter un bouton ou un lien avec un libellé éditable et des réglages visuels cohérents avec les autres nœuds (fond, bordure, texte).

## What Changes

- Ajout d’un type de nœud **NodeButton** (identifiant `node-button`) dans le builder :
  - **Type** : `button`, `submit` ou `link`. En type `link`, le nœud expose les champs **href** et **target** (ex. `_blank`, `_self`).
  - **Paramètres** : réutilisation de **Background2Settings**, **Border2Settings** et **Text2Settings** (et Base2Settings pour id/className), sur le même modèle que NodeText.
  - Rendu : élément `<button>`, `<button type="submit">` ou `<a>` selon le type, avec libellé éditable et styles issus des paramètres.
- Enregistrement de NodeButton dans le registre des nœuds et dans le panneau des composants (catégorie content).
- Persistance : le contenu (type, libellé, href/target si link) et les attributs/styles sont conservés dans le contenu sérialisé.

## Impact

- **Specs impactées** : `page-builder`
- **Code impacté** : `assets/editeur2/ManagerNode/` (nouveau dossier NodeButton, `NodeRegistry.ts`, panneau des composants), sérialisation HTML du builder si elle dépend des types de nœuds
