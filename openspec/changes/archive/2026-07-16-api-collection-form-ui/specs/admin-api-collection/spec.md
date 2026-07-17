## ADDED Requirements

### Requirement: Formulaire structuré en sections lisibles

Le formulaire de création/édition d’une API collection SHALL présenter les champs en **sections distinctes**, chacune avec un titre visible et une courte description si utile. Les sections SHALL au minimum couvrir :

1. **Identité** — apiId, libellé, type, modes supportés, activation ;
2. **Source HTTP** — URL collection, template item, préfixe image, query params, headers ;
3. **Pagination & parsing** — style de pagination, chemin liste (memberPath) ;
4. **Mapping des champs** — chemins pointés vers les champs standard ApiCollection.

Le rendu SHALL suivre le pattern admin existant (cartes / blocs séparés), et non une liste plate unique de tous les champs.

#### Scenario: Création — sections visibles

- **WHEN** un administrateur ouvre `/admin/api-collection/new`
- **THEN** le formulaire affiche au moins les quatre sections ci-dessus avec leurs titres, et les champs d’identité ne sont pas mélangés visuellement avec le mapping

#### Scenario: Édition — même structure

- **WHEN** un administrateur ouvre l’édition d’une définition existante
- **THEN** le formulaire conserve la même structure en sections, et le bloc « Tester le mapping » reste distinct du formulaire principal

#### Scenario: Contenu métier inchangé

- **WHEN** l’administrateur remplit et soumet un formulaire valide après la refonte UI
- **THEN** tous les champs existants (identité, endpoint, pagination, mapping, enabled) restent disponibles et persistés comme avant
