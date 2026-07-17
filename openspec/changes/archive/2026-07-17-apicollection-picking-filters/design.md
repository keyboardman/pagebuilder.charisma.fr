## Context

La migration ApiList/ApiCard → ApiCollection a unifié catalogue, items et resolve, mais a volontairement laissé hors scope v1 la **recherche** et les **catégories** (cf. design d’import). Conséquences actuelles :

| Couche | État |
|--------|------|
| `CollectionItemPickerModal` | Champ recherche UI présent ; **pas** de sélecteur catégorie (contrairement à `ApiManagerModal`) |
| `GET …/collections/{id}/items` | Accepte `search` via `ApiRequestParamHelper` ; **ignore** `category` |
| `ConfigurableApiCollection` | Ignore `search` / `category` — n’envoie que `queryParams` fixes + pagination |
| `ApiCardCollectionAdapter` | Transmet `search` ; **pas** `category` ; pas de `fetchCategories` |
| Définitions seedées | Pas de `searchQueryParam` / `categoryQueryParam` / URL catégories |

Les sources PHP historiques mappaient déjà ces filtres (`search` → `titre`, `category` → `themes` / `viewCategorie`, etc.).

## Goals / Non-Goals

**Goals:**

- Parité picking dynamique avec l’ancien ApiManager : **recherche textuelle** + **filtre catégorie** quand la source le permet.
- Runtime configurable capable de mapper `search` / `category` vers les query params distants déclarés.
- Endpoint catégories ApiCollection pour alimenter le picker.
- Adapters PHP restants (ex. `videos`) exposent les mêmes capacités.
- Seed / admin mis à jour pour les sources concernées (au minimum Flashnews articles, Charisma articles dynamic, et adapters vidéo).

**Non-Goals:**

- Filtres avancés hors search/catégorie (tri multi-champs, facettes, dates).
- Changer le contrat de resolve (`POST …/resolve`) — les filtres ne s’appliquent qu’au browse du picker / `fetchItems`.
- Refonte visuelle du picker au-delà des contrôles search + catégorie.
- Migrer `videos` en définition seedée (reste adapter PHP ; on branche seulement les filtres).

## Decisions

### 1. Params canoniques côté builder : `search` + `category`

**Décision** : l’API builder continue d’exposer des noms stables :

```
GET /collections/{apiId}/items?page=&itemsPerPage=&search=&category=
```

Le runtime / adapter traduit vers les noms distants (`titre`, `themes`, `viewCategorie`, …).

**Rationale** : le frontend (`collectionApiUtils`, picker) reste simple ; la diversité des APIs Charisma/Flashnews reste côté définition.

**Alternative rejetée** : laisser le client envoyer le nom distant (`titre=…`) — casse l’uniformité du contrat ApiCollection.

### 2. Métadonnées sur la définition (et catalogue)

**Décision** : étendre `ApiCollectionDefinition` avec :

| Champ | Rôle |
|-------|------|
| `searchQueryParam` | nullable string — si non null/vide, `search` est mappé vers ce query param distant |
| `categoryQueryParam` | nullable string — idem pour `category` |
| `categoriesUrl` | nullable URL — endpoint pour lister les catégories `{ id, label }` |
| `categoriesMemberPath` | string, défaut `member` — chemin liste dans la réponse catégories |
| `categoriesIdPath` / `categoriesLabelPath` | chemins DotPath vers id / label (défauts `id` / `label` ou `nom`) |

Le catalogue `GET /collections` MAY exposer des flags dérivés (`supportsSearch`, `supportsCategory`) pour que le picker masque les contrôles inutiles. Sinon le picker peut tenter `/categories` et n’afficher le select que si non vide.

**Alternative rejetée** : hardcoder les mappings par `api_id` dans le PHP — contredit l’objectif admin/seed.

### 3. `ConfigurableApiCollection::fetchItems`

**Décision** : après construction de `$query` (params fixes + pagination), si `search` non vide et `searchQueryParam` défini → `$query[$searchQueryParam] = $search`. Idem pour `category` / `categoryQueryParam`.

Si le param n’est pas configuré, le filtre est **ignoré silencieusement** (pas d’erreur 400) pour ne pas casser les sources sans filtre.

### 4. Endpoint catégories

**Décision** :

```
GET /api/page-builder/collections/{apiId}/categories
→ { categories: [{ id, label }, ...] }
```

- Définition : fetch HTTP sur `categoriesUrl` + mapping DotPath.
- Adapter ApiCard : délègue à `fetchCategories()` existant.
- Autres adapters sans catégories : tableau vide (200).

**Alternative rejetée** : réutiliser `/cards/{apiId}/categories` depuis NodeCollection — maintient la dépendance au registre legacy.

### 5. Adapters PHP

**Décision** :

- `ApiCardCollectionAdapter` : transmettre aussi `category` (et aliases éventuels déjà gérés côté card) ; exposer `fetchCategories` via une méthode optionnelle sur l’interface ApiCollection **ou** un service registry dédié categories (provider lit registry + interface étendue).
- Préférence : ajouter à `ApiCollectionInterface` une méthode optionnelle via interface séparée `ApiCollectionCategoriesAwareInterface` (évite de forcer toutes les implémentations) **ou** méthode `fetchCategories(): ?array` avec défaut empty sur une classe abstraite / trait. Choix retenu : **`fetchCategories(): array`** sur l’interface avec défaut documenté « retourne [] » implémenté partout (adapters list → `[]`, card → délègue, configurable → HTTP).

### 6. Frontend picker

**Décision** : aligner `CollectionItemPickerModal` sur le comportement `ApiManagerModal` :

1. Au changement de source : charger `/collections/{apiId}/categories`.
2. Si catégories non vides → select « Catégorie » (valeur `Toutes` = pas de param).
3. Recherche debounce 300 ms → `search` query.
4. Changement catégorie / search → reset `page` à 1.
5. `buildItemsUrl` accepte `category` en plus de `search`.

Le champ recherche reste toujours visible (comme aujourd’hui) ; s’il n’est pas supporté côté source, les résultats ne changent simplement pas (acceptable) — optionnel plus tard : masquer via `supportsSearch` du catalogue.

### 7. Seed / admin

**Décision** : mettre à jour le seeder + formulaire admin pour les `api_id` qui avaient déjà ces filtres en PHP :

| api_id (ex.) | searchQueryParam | categoryQueryParam | categoriesUrl |
|--------------|------------------|--------------------|---------------|
| `flashnews`, `flashnews_article`, … | `titre` | `themes` | `…/api/themes` (ou équivalent flashnews) |
| Charisma articles dynamic | `titre` | — | — |
| Adapter `videos` | selon PHP existant | selon PHP | `…/categories.json` |

Migration Doctrine : `UPDATE` des lignes seedées existantes **ou** data migration dédiée (les DO NOTHING du seed initial ne réécrivent pas les lignes).

## Risks / Trade-offs

- **[Lignes seed déjà en base non mises à jour]** → Fournir une migration data `UPDATE` ciblée sur les `api_id` connus ; documenter les champs admin pour les defs custom.
- **[Sources sans searchQueryParam : UI search trompeuse]** → Acceptable v1 ; flags catalogue en amélioration optionnelle.
- **[Shape catégories hétérogène]** → DotPath + défauts ; adapter video/card garde le mapping PHP éprouvé.
- **[Double chemin cards vs collections]** → NodeCollection n’utilise plus cards ; cards categories restent pour nœuds legacy non migrés.

## Migration Plan

1. Schéma + entité + form admin (nouveaux champs).
2. Runtime `ConfigurableApiCollection` + helper request (`category`).
3. Endpoint categories + adapters.
4. Frontend picker + `collectionApiUtils`.
5. Data migration seed des params pour les `api_id` prioritaires.
6. Tests unitaires runtime + smoke fonctionnel items?search=&category= + categories.

Rollback : champs nullable ; si absents, comportement actuel (pas de filtre distant).

## Open Questions

- Faut-il exposer `supportsSearch` / `supportsCategory` dans le catalogue dès v1, ou uniquement masquer le select catégorie quand `/categories` est vide ?
  - **Proposition par défaut** : masquer catégorie si liste vide ; laisser le champ search toujours visible.
