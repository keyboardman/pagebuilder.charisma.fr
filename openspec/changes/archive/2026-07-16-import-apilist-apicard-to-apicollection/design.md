## Context

`api_collection_definition` existe (migrations schéma) mais est vide. Les ~20 sources production sont des classes PHP taguées (`ApiListArticle`, `ApiListArticleDynamique`, `ApiListImage`, `ApiCard`). `ApiCollectionRegistry` wrappe déjà ces classes via adapters ; NodeCollection consomme `/api/page-builder/collections`.

Objectif : peupler la table SQL avec les configs extraites des classes, puis retirer les adapters redondants pour que l’admin soit la source de vérité.

## Goals / Non-Goals

**Goals:**

- Seed Doctrine idempotent des APIs exprimables en `ApiCollectionDefinition` (hydra / none + DotPath).
- Préserver les `api_id` historiques utilisés dans le builder (pas de rename silencieux).
- Fusionner en une seule ligne uniquement lorsque plusieurs registres partagent déjà le même `api_id`.
- Désenregistrer les services PHP couverts pour éviter collision `getReservedAdapterIds()`.
- Documenter clairement ce qui reste en PHP (runtime insuffisant).

**Non-Goals:**

- Étendre le runtime (`ConfigurableApiCollection`) pour search, catégories, `itemPerPage`, probe multi-pages, `hydra:totalItems` (sauf si un gap bloque un seed prioritaire — hors scope v1).
- Migrer les stubs.
- Supprimer le code PHP des classes (garder les fichiers pour référence / rollback ; seuls les tags services sont retirés).
- Réécrire les pages existantes du builder.

## Decisions

### 1. Stratégie d’identifiants : conserver les ids historiques

**Décision** : chaque `api_id` PHP production devient une ligne (ou une ligne fusionnée si id déjà partagé). Pas de rename `*_home` → sans suffixe dans cette migration.

**Rationale** : les nœuds NodeCollection / NodeList* stockent `apiId` dans le JSON de page. Un merge d’ids casserait le rendu publié.

**Alternative rejetée** : fusion dual-mode sous l’id dynamique seul — plus propre à long terme, mais **BREAKING** sans script de rewrite des pages.

### 2. Libellés : suffixe « Collection »

**Décision** : chaque définition seedée porte un `label` égal au libellé historique PHP suivi du suffixe **` — Collection`** (ex. `En Action (home) — Collection`).

**Rationale** : distinguer clairement dans l’admin et le sélecteur builder les sources ApiCollection des éventuelles entrées legacy ApiList / ApiCard (pendant la transition ou en rollback).

### 3. Contenu du seed (v1 exprimable)

| api_id | label | type | modes | pagination | Notes |
|--------|-------|------|-------|------------|-------|
| `charisma_article_enaction_home` | En Action (home) — Collection | article | fixed | hydra | endpoint `/enactions` |
| `charisma_article_expression_home` | Expressions (home) — Collection | article | fixed | hydra | `/expressions` |
| `charisma_temoignage_home` | Témoignages (home) — Collection | article | fixed | hydra | + `image` ← `thumbnails.normal` |
| `flashnews_article_home` | Flashnews (home) — Collection | article | fixed | hydra | query `order[publication]=desc` |
| `flashnews-themes` | Flashnews thèmes — Collection | article | fixed | none | query `pagination=false` |
| `charisma_article_enaction` | En Action — Collection | article | dynamic | hydra | `item_url_template={endpoint}/{id}` |
| `charisma_article_expression` | Expressions — Collection | article | dynamic | hydra | idem |
| `charisma_temoignage` | Témoignages — Collection | article | dynamic | hydra | + image thumbnails |
| `flashnews_article` | Flashnews — Collection | article | dynamic | hydra | order + item template |
| `charisma_article_auteur` | Articles Auteur — Collection | article | dynamic | hydra | id partagé ApiCard/Dynamique ; mapping list (sans labels tableau) |
| `flashnews` | Flashnews — Collection | article | dynamic | hydra | ApiCard ; `image_prefix=https://www.flashnews.fr` ; mapping image/link relatifs |
| `charisma_article_temoignage` | Articles Témoignage — Collection | article | dynamic | hydra | ApiCard (id distinct de `charisma_temoignage`) |
| `charisma_evenement` | Evènements — Collection | image | dynamic | hydra | ApiCard `/evenements` |

Mappings standards :

- Charisma article : `id, title←titre, description←resume, link←url, counter←vues, like←likes`
- Flashnews article list/dyn : `description←viewResume, link←link, counter←compteur, like←likes`
- Flashnews card (`flashnews`) : `image←image` + prefix, `link←viewUrl` + prefix, `labels←tags.member` si DotPath le permet
- Thèmes : `title←nom, link←link`

### 4. Hors seed v1 (rester adapters PHP)

| api_id | Raison |
|--------|--------|
| `charisma_evenement_home` | Pagination custom `itemPerPage` + probe total |
| `charisma_evenement_retrospective` | Idem |
| `videos` | `hydra:member` / `hydra:totalItems`, search, catégories |
| Labels `classements[].nom` (auteur card) | Non exprimable en DotPath simple — mapping list sans labels |

### 5. Format migration

**Décision** : migration Doctrine PHP (`VersionYYYYMMDDHHMMSS`) avec `INSERT … ON CONFLICT (api_id) DO NOTHING` (PostgreSQL) ou équivalent Doctrine DBAL, pour être ré-exécutable / safe sur environnements déjà peuplés manuellement.

Colonnes JSON sérialisées en JSON valide (`supported_modes`, `query_params`, `field_mapping`, `headers`).

**Alternative rejetée** : fixtures Symfony — moins adaptées au déploiement prod via `doctrine:migrations:migrate`.

### 6. Retrait des tags services

Après seed validé (catalogue + smoke fetch items) :

1. Commenter / retirer les tags `app.api_list_*` / `app.api_card` des classes seedées dans `config/services.yaml`.
2. Laisser les classes PHP en place (tests unitaires éventuels, rollback).
3. Conserver tags pour bannières + `videos` + stubs nav si encore utilisés.

Ordre strict : seed d’abord, puis retrait tags — sinon trou dans le catalogue entre deux déploiements.

### 7. Idempotence et admin

Les lignes seedées sont **éditables** dans `/admin/api-collection` comme toute définition. La migration ne réécrit pas une ligne déjà présente (DO NOTHING) pour ne pas écraser les ajustements admin.

## Risks / Trade-offs

- **[Collision id seed vs adapter]** → Retirer les tags dans la même release, après migrate ; smoke test catalogue.
- **[Parité mapping imperfecte]** → ApiCard auteur sans labels array ; flashnews card vs list légèrement différents — acceptable, documenté.
- **[Pages utilisant un id hors seed]** → Bannières / videos restent PHP → pas de régression.
- **[PostgreSQL ON CONFLICT]** → Vérifier le driver (MySQL/SQLite en test) ; adapter la syntaxe ou utiliser un check `SELECT` + insert conditionnel portable.
- **[Duplication home/dynamic]** → Dette d’ids ; consolidation future possible via rewrite pages + merge SQL.

## Migration Plan

1. Ajouter migration seed (INSERT idempotent) pour le tableau §2.
2. `doctrine:migrations:migrate` en local ; vérifier `/admin/api-collection` et `GET /api/page-builder/collections`.
3. Smoke : items fixed + resolve dynamic pour 2–3 APIs Charisma/Flashnews.
4. Retirer tags services des classes seedées.
5. Relancer smoke ; confirmer absence de doublons / erreurs boot.
6. Rollback : re-taguer les services + `DELETE FROM api_collection_definition WHERE api_id IN (…)`.

## Open Questions

- Faut-il aussi seeder `charisma_evenement_home` / retrospective en `pagination_style=none` (approximation) plutôt que les laisser en PHP ? → **Non en v1** (comportement pagination divergeraient).
- Unifier plus tard `*_home` et dynamic sous un seul id ? → Change OpenSpec séparé + rewrite contenu pages.
