## 1. Templates Twig

- [x] 1.1 Factoriser la variable `builder_api_base` absolue (`absolute_url` sur le chemin `/api/page-builder`) dans les templates page.
- [x] 1.2 Mettre à jour `render_view.html.twig` : `data-api-cards-base-url` avec URL absolue.
- [x] 1.3 Mettre à jour `preview.html.twig` : même correction.
- [x] 1.4 Mettre à jour `builder.html.twig` : `apiCardsBaseUrl` / `pageBuilderApiBaseUrl` en absolu pour cohérence.

## 2. Post-traitement serveur

- [x] 2.1 Étendre `PageController::renderPageContent` pour absolutiser `data-api-cards-base-url` (et éventuellement les autres `data-*` avec chemins relatifs commençant par `/`).

## 3. Validation

- [x] 3.1 Test fonctionnel : GET `/page/render/{slug}` contient `data-api-cards-base-url="https://…/api/page-builder"` (ou schéma http en test).
- [x] 3.2 Vérification manuelle : page avec NodeCardApi ou NodeNavApi affichée depuis un iframe sur un autre domaine ; les requêtes réseau ciblent l’hôte du page builder.
