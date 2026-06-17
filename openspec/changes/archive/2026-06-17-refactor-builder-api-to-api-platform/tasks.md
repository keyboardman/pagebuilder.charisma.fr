## 1. Preparation et cadrage
- [x] 1.1 Inventorier les endpoints actuels `/page-builder/api/*` et leurs consommateurs frontend (NodeCard, NodeNavApi, NodeYoutube, selecteurs API).
- [x] 1.2 Definir la matrice de compatibilite entre endpoints legacy et operations API Platform (routes, params, payloads, statuts).

## 2. Backend API Platform
- [x] 2.1 Introduire les ressources/DTO API Platform pour la liste des APIs, les collections et les items.
- [x] 2.2 Implementer les providers/processors en reutilisant le registre `ApiCard` et la normalisation existante.
- [x] 2.3 ~~Faire deleguer les endpoints legacy~~ — routes legacy `/page-builder/api/*` supprimees (migration validee, pas de prod).
- [x] 2.4 Harmoniser la gestion des query params (page, limit, search, sort, category) et des erreurs.
- [x] 2.5 Exposer formulaires et polices via API Platform (`/api/page-builder/forms/*`, `/api/page-builder/fonts/*`).

## 3. Adaptation des interfaces builder
- [x] 3.1 Adapter la couche d'acces HTTP frontend pour supporter les operations API Platform et la compatibilite legacy.
- [x] 3.2 Mettre a jour les points d'integration des noeuds consommateurs d'API (NodeCard, NodeNavApi, NodeYoutube si concerne).
- [x] 3.3 Verifier le comportement des placeholders/settings impactes par la source des donnees API.

## 4. Validation
- [x] 4.1 Ajouter/mettre a jour les tests backend (unitaires + integration) sur les contrats d'endpoints.
- [x] 4.2 Ajouter/mettre a jour les tests frontend ou scenarios de validation manuelle des interfaces.
- [x] 4.3 Valider la non-regression fonctionnelle et retirer les routes legacy (`docs/builder-api.md`).
