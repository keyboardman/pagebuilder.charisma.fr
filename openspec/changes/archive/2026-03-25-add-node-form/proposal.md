# Change: Nœuds de formulaire dans le page builder

## Why

Les éditeurs doivent pouvoir composer des formulaires (contact, newsletter, etc.) directement dans le builder sans passer uniquement par du HTML brut ou des conteneurs génériques, avec une structure sémantique `<form>` et des champs configurables.

## What Changes

- Ajout d’un conteneur **NodeForm** (`node-form`) configurable avec **method** (HTTP) et **action** (URL de soumission), zone de dépôt pour composer le contenu du formulaire.
- Ajout des champs **NodeFormInput** (`node-form-input`), **NodeFormSelect** (`node-form-select`) et **NodeFormRadio** (`node-form-radio`) avec propriétés éditoriales (nom, libellé, options de liste, etc.).
- Règles de composition : NodeForm accepte les nœuds « champs formulaire » ci‑dessus et les nœuds **conteneur** existants (ex. Flex, Grid, Container) pour la mise en page ; les champs formulaire ne sont acceptés que sous NodeForm (ou sous un conteneur imbriqué à l’intérieur d’un NodeForm), aligné sur le motif NodeNav / NodeNavItem.
- Persistance et rendu preview / page : HTML (ou structure sérialisée équivalente) cohérent avec le format de page existant.

## Impact

- Specs affectées : `page-builder`
- Code typique : `assets/editeur/ManagerNode/NodeForm/*`, `NodeFormInput`, `NodeFormSelect`, `NodeFormRadio`, `NodeRegistry.ts`, `useDnd.ts`, éventuellement CSS thème `base`, sérialisation / rendu HTML si centralisé
