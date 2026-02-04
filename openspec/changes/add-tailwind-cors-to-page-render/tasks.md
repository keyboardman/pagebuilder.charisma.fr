## 1. Injection Tailwind et builder dans la réponse render

- [x] 1.1 Créer un fragment Twig (ex. `templates/page/_render_assets.html.twig`) qui affiche `encore_entry_link_tags('pageBuilderStandalone')` et `encore_entry_script_tags('pageBuilderStandalone')` pour obtenir les balises CSS/JS en chaîne.
- [x] 1.2 Dans `PageController`, modifier la logique de réponse GET du contenu render : récupérer le HTML stocké, rendre le fragment d’assets, injecter le bloc CSS avant `</head>` et le bloc JS avant `</body>` dans le document, puis renvoyer ce document avec `Content-Type: text/html`.
- [x] 1.3 S’assurer que les URLs des assets sont utilisables (base URL du serveur si nécessaire pour chemins absolus).
- [x] 1.4 Mettre à jour dans le document HTML servi la balise `<title>` avec le titre de la page (`Page.title`) et la balise `<meta name="description" content="...">` avec la description de la page (`Page.description`), en échappant le contenu et en insérant la meta description si elle est absente.

## 2. CORS pour l’API render

- [x] 2.1 Configurer CORS pour les routes GET exposant le contenu render (`app_page_render`, `app_page_render_by_id`) afin d’accepter toute origine et tout port (header `Access-Control-Allow-Origin: *` ou équivalent pour toute origine).
- [x] 2.2 Utiliser la config Symfony (framework) ou un bundle CORS (ex. NelmioCorsBundle) ; ne pas appliquer CORS permissif aux routes PATCH/PUT d’écriture du render.

## 3. Validation

- [ ] 3.1 Vérifier en dev que GET `/page/render/{id}` renvoie un document HTML contenant les link/script du builder et que les styles Tailwind s’appliquent.
- [ ] 3.2 Vérifier que le document contient `<title>` avec le titre de la page et `<meta name="description" content="...">` avec la description.
- [ ] 3.3 Vérifier qu’une requête GET cross-origin vers l’URL render reçoit bien les en-têtes CORS attendus (origine et port quelconques acceptés).
