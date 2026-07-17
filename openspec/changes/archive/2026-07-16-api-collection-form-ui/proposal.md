## Why

Le formulaire admin Api Collection regroupe tous les champs dans une seule carte plate (identité, endpoint, pagination, headers, mapping). La saisie est difficile à scanner : l’admin ne distingue pas clairement les blocs métier, et les aides contextuelles se perdent dans la liste. Il faut aligner la lisibilité sur le pattern déjà utilisé pour les pages (cartes par section).

## What Changes

- Regrouper le formulaire de création/édition en **sections visuelles distinctes** (cartes avec titre + courte description).
- Clarifier la hiérarchie des champs : identité, source HTTP, pagination / parsing, options avancées, mapping, statut.
- Améliorer les libellés / textes d’aide là où ils restent trop techniques ou ambigus, sans changer le modèle de données ni la validation métier.
- Conserver le bloc « Tester le mapping » sur l’édition, clairement séparé du formulaire principal.

## Capabilities

### New Capabilities

<!-- Aucune nouvelle capacité produit : amélioration UX d’un CRUD existant. -->

### Modified Capabilities

- `admin-api-collection`: exigences de présentation du formulaire (sections lisibles, hiérarchie visuelle) en plus du contenu métier déjà spécifié.

## Impact

- Templates Twig : `templates/api_collection/_form.html.twig` (principal), éventuellement `new.html.twig` / `edit.html.twig` pour l’espacement.
- Formulaire Symfony : ajustements mineurs de labels/help dans `ApiCollectionDefinitionType` si besoin (pas de nouveaux champs).
- Pas d’impact API runtime, catalogue builder, ni schéma DB.
