## 1. API card backend retrospective

- [x] 1.1 Creer `CharismaEvenementRetrospectiveApiCard` dans `src/PageBuilder/ApiCard/` sur le pattern de `CharismaEvenementHomeApiCard`.
- [x] 1.2 Configurer l'identifiant (`charisma_evenement_retrospective`), le libelle et le type `image` en collection `fixed`.
- [x] 1.3 Implementer `fetchCollection` avec appel HTTP sur `/api/charisma/banniere/evenements/retrospective`, pagination (`page`, `itemsPerPage`) et filtre `search` sur `titre`.

## 2. Mapping et robustesse

- [x] 2.1 Implementer `mapItem` vers le contrat builder (`id`, `title`, `image`, `link`, `raw`) a partir des champs distants (`id`, `titre`, `source`, `link`).
- [x] 2.2 Gerer les erreurs d'appel distant avec fallback `items: []` et `total: 0`.
- [x] 2.3 Verifier que la card reste compatible avec les endpoints builder API existants sans changement de contrat.

## 3. Verification

- [x] 3.1 Ajouter/mettre a jour les tests unitaires de la nouvelle card (cas nominal, recherche, erreur API, mapping partiel).
- [x] 3.2 Verifier que la card apparait dans la liste des APIs builder et qu'elle est selectionnable dans l'editeur.
