## 1. Contrat backend ApiCard `list`

- [x] 1.1 Créer `ApiCardListInterface` (`getType()` → `"list"`) dans `src/PageBuilder/ApiCard/`
- [x] 1.2 Mettre à jour `ApiCardInterface` (docblock des types supportés) et les tests du registre si nécessaire
- [x] 1.3 Ajouter au moins une implémentation de référence taguée `app.builder_api_card` (stub ou source Charisma convenue)
- [x] 1.4 Vérifier `GET /page-builder/api/cards` et `/items` pour une API `list`

## 2. Frontend — registre API

- [x] 2.1 Étendre `ApiAdapterType` avec `"list"` dans `ApiAdapter.ts`
- [x] 2.2 Adapter `createBackendApiAdapter` pour accepter `type: "list"`
- [x] 2.3 Exposer un helper ou filtre `apiRegistry.listByType("list")` pour les réglages du nœud

## 3. Nœud NodeNavApi

- [x] 3.1 Créer `ManagerNode/NodeNavApi/` (index, View, Settings) avec identifiant `node-nav-api`
- [x] 3.2 Implémenter le chargement de collection via `apiId` et le rendu `<nav>` + liens (options NodeNav : direction, variant, burger)
- [x] 3.3 Enregistrer le nœud dans `NodeRegistry` (catégorie `nav` ou `api`, ordre cohérent)
- [x] 3.4 Ajouter les styles de base (`node-nav-api.css`) en réutilisant les hooks `ce-menu` / `ce-menu--{variant}`

## 4. Documentation et validation

- [x] 4.1 Mettre à jour `docs/ajout-api-card.md` (type `list`, usage NodeNavApi)
- [x] 4.2 Test manuel : ajout NodeNavApi, choix API list, rendu éditeur + export HTML
- [x] 4.3 Test(s) unitaire(s) PHP sur le mapping minimal d’une ApiCard list si implémentation livrée
