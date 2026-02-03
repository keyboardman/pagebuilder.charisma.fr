## 1. Contrat PHP et registre

- [x] 1.1 Définir l’interface de base `ApiCardInterface` (getId, getLabel, getType, fetchCollection, fetchItem, mapItem ; fetchCategories et categoryQueryParam optionnels)
- [x] 1.2 Définir `ApiCardArticleInterface` et `ApiCardVideoInterface` étendant la base (type fixé à `article` / `video`)
- [x] 1.3 Créer le service registre (ex. `ApiCardRegistry`) injectant les implémentations taguées `app.builder_api_card`, avec méthode `list()` et `get(string $id)`
- [x] 1.4 Enregistrer le registre et un exemple d’implémentation (stub ou première API) dans `config/services.yaml`

## 2. Endpoints HTTP

- [x] 2.1 Ajouter les routes : liste des cards, collection par API, item par ID, (optionnel) catégories
- [x] 2.2 Implémenter le contrôleur (ou actions dédiées) qui délègue au registre et aux services ApiCard ; réponses JSON
- [x] 2.3 Protéger les routes (même politique d’accès que l’édition de pages)

## 3. Intégration builder (frontend)

- [x] 3.1 Exposer la liste des APIs au builder : soit dans les données injectées (ex. `page-builder-data`), soit appel à `GET /page-builder/api/cards` au chargement
- [x] 3.2 Implémenter l’adapteur JS « backend » qui appelle les endpoints Symfony (collection, item) pour un `apiId` donné
- [x] 3.3 Au démarrage du builder (standalone et formulaire), enregistrer les APIs fournies par le backend (via le registre exposé) pour que NodeCardApi / ApiManagerModal les utilisent

## 4. Validation et tests

- [x] 4.1 Ajouter des tests unitaires ou d’intégration pour le registre et au moins un endpoint
- [x] 4.2 Vérifier en manuel : liste des APIs visible dans le builder, sélection d’une API et d’un item, affichage dans une card
