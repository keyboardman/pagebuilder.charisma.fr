## 1. Migration seed

- [x] 1.1 Créer une migration Doctrine qui insère de façon idempotente les définitions v1 listées dans design.md (§3) dans `api_collection_definition`
- [x] 1.2 Seed ApiListArticle fixed : `charisma_article_enaction_home`, `charisma_article_expression_home`, `charisma_temoignage_home`, `flashnews_article_home`, `flashnews-themes` (endpoints, query, mapping, pagination) avec labels `… — Collection`
- [x] 1.3 Seed ApiListArticleDynamique : `charisma_article_enaction`, `charisma_article_expression`, `charisma_temoignage`, `flashnews_article`, `charisma_article_auteur` avec `item_url_template`, modes `dynamic` et labels `… — Collection`
- [x] 1.4 Seed ApiCard exprimables : `flashnews` (avec `image_prefix`), `charisma_article_temoignage`, `charisma_evenement` avec labels `… — Collection`
- [x] 1.5 Vérifier que tous les labels seedés se terminent par ` — Collection`
- [x] 1.6 Vérifier que bannières (`charisma_evenement_home`, `charisma_evenement_retrospective`) et `videos` ne sont pas seedées

## 2. Validation seed

- [x] 2.1 Exécuter la migration en local et confirmer les lignes dans `/admin/api-collection`
- [x] 2.2 Smoke `GET /api/page-builder/collections` : présence des api_id seedés avec type/modes corrects
- [x] 2.3 Smoke items fixed + resolve dynamic sur au moins une API Charisma et une Flashnews

## 3. Retrait adapters PHP redondants

- [x] 3.1 Retirer / commenter dans `config/services.yaml` les tags DI des classes dont l’`api_id` est seedé
- [x] 3.2 Conserver les tags pour bannières ApiListImage, `CharismaVideosApiCard`, et stubs non seedés
- [x] 3.3 Relancer le catalogue : aucun doublon d’`api_id`, pas d’erreur au boot du registre

## 4. Tests et finalisation

- [x] 4.1 Ajouter un test (unitaire ou migration) vérifiant l’idempotence du seed (re-run sans overwrite)
- [x] 4.2 Documenter dans un commentaire de migration ou README court la liste hors scope (bannières, videos) et la stratégie de rollback
