## ADDED Requirements

### Requirement: Indépendance de NodeCollection vis-à-vis des nœuds list legacy

Le module `NodeCollection` SHALL ne pas importer de types, utilitaires ni composants depuis `NodeListApi` ou `NodeListImage`. Les types d’entrées dynamiques (article / image), les helpers de visibilité (`show`), le mapping média et les réglages de source (pagination, picker image) SHALL être définis dans le périmètre NodeCollection (ou un module partagé hors des packages dépréciés).

#### Scenario: Aucun import NodeList* dans NodeCollection

- **WHEN** un audit statique des imports de `assets/editeur/ManagerNode/NodeCollection/**` est effectué
- **THEN** aucun chemin d’import ne référence `NodeListApi` ni `NodeListImage`

#### Scenario: Types locaux pour les items dynamiques

- **WHEN** un NodeCollection article ou image est configuré en mode `dynamic`
- **THEN** les entrées sont typées et persistées via des types propres à NodeCollection (`dynamicArticleItems` / `dynamicImageItems`), sans dépendance aux interfaces exportées par les nœuds list legacy

### Requirement: Contenu cible compatible avec la migration list → collection

Un nœud `node-collection` issu de la migration depuis `node-list-api` ou `node-list-image` SHALL être éditable et rendable avec le même `apiId`, mode, pagination et items dynamiques que le nœud d’origine, en `display=list`.

#### Scenario: Édition post-migration article

- **WHEN** l’éditeur ouvre une page dont un ancien `node-list-api` a été migré
- **THEN** le panneau Source affiche `collectionType=article`, le mode et l’`apiId` d’origine, et le chargement des items fonctionne

#### Scenario: Édition post-migration image

- **WHEN** l’éditeur ouvre une page dont un ancien `node-list-image` a été migré
- **THEN** le panneau Source affiche `collectionType=image`, le mode et les `dynamicImageItems` ou `apiId` d’origine, et le rendu liste fonctionne
