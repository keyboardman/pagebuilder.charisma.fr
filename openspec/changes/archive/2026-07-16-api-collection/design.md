## Context

NodeCollection unifie déjà côté builder les axes `type` (`image` | `video` | `article`) et `mode` (`fixed` | `dynamic`). Le backend, lui, reste fragmenté :

| Registre actuel | Types | Mode | Endpoint |
|---|---|---|---|
| `ApiListArticle` | article | fixed | `/page-builder/lists/{apiId}/items` |
| `ApiListArticleDynamique` | article | dynamic (browse + resolve) | `/page-builder/lists/dynamic/...` |
| `ApiListImage` | image | fixed | `/page-builder/lists-image/{apiId}/items` |
| ApiCard (video, etc.) | video / article / image | card picker | `/page-builder/cards/...` |

Chaque source est une **classe PHP** avec mapping codé en dur. Il n’existe pas d’écran admin pour déclarer une nouvelle API. NodeCollection doit aujourd’hui brancher trois chemins différents et des contrats de mapping partiellement divergents (`image`-only vs article avec `counter`/`like`).

## Goals / Non-Goals

**Goals:**

- Un contrat **ApiCollection** unique : `type` + `mode`, mapping item standard (`id`, `image`, `title`, `description`, `label`/`labels`, `counter`, `like`, `link`, …).
- Endpoints unifiés consommés par NodeCollection.
- **UI admin** pour déclarer une API (URL, type, mode(s), query, mapping JSON → champs standard) sans déployer de code.
- Compatibilité : adapters vers les registres PHP existants ; NodeList* / ApiCard inchangés fonctionnellement.

**Non-Goals:**

- Remplacer ou supprimer ApiList* / ApiCard dans cette itération.
- Éditeur de mapping avec transformations avancées (scripts, pipelines).
- Auth OAuth complexe par API (v1 : headers/query statiques optionnels).
- File manager comme « API déclarée » (le picking image dynamic reste file manager côté nœud).

## Decisions

### 1. Contrat ApiCollection (runtime)

```php
interface ApiCollectionInterface {
    public function getId(): string;
    public function getLabel(): string;
    public function getType(): string;           // image|video|article
    /** @return list<'fixed'|'dynamic'> */
    public function getSupportedModes(): array;
    public function fetchItems(array $params): ApiCollectionPageResult; // page, itemsPerPage
    public function fetchItem(string $id): ?array; // requis si dynamic supporté
}
```

Item mappé (tous champs sauf `id` optionnels) :

```json
{
  "id": "…",
  "image": "https://…",
  "title": "…",
  "description": "…",
  "label": "…",
  "labels": ["…"],
  "counter": 12,
  "like": 3,
  "link": "https://…",
  "alt": "…"
}
```

**Rationale** : un seul DTO pour NodeCollection ; les champs absents sont simplement omis (comme `counter`/`like` aujourd’hui).

**Alternative rejetée** : trois interfaces typées séparées (ApiCollectionImage/Video/Article) — trop proche du morcellement actuel ; le `type` suffit pour filtrer le catalogue.

### 2. Modes fixed vs dynamic

| Mode | Rôle | API exposée |
|---|---|---|
| `fixed` | Collection curatée / paginée distante | `GET …/collections/{id}/items?page=&itemsPerPage=` |
| `dynamic` | Catalogue pour picker + resolve d’IDs | `GET …/collections/{id}/items` (browse) + `POST …/collections/resolve` avec `[{ apiId, itemId }]` |

Une déclaration admin MAY supporter **les deux modes** (`supportedModes: ['fixed','dynamic']`) si l’endpoint distant permet pagination **et** fetch par id.

Pour **image + dynamic** côté NodeCollection : le picking file manager reste hors ApiCollection (comme aujourd’hui) ; seules les sources API image (fixed, et éventuellement dynamic API si déclarée) passent par ApiCollection.

### 3. Deux origines dans le même registre

`ApiCollectionRegistry` agrège :

1. **Adapters PHP** — wrap des services existants (`ApiListArticle`, `ApiListImage`, `ApiListArticleDynamique`, ApiCard video en fixed via `fetchCollection`) pour ne pas casser les sources déjà en prod.
2. **Déclarations persistées** — entité `ApiCollectionDefinition` lue en base, exécutée par un runtime HTTP générique + moteur de mapping.

Priorité d’id : collision d’`id` → erreur au boot / validation admin (les ids PHP sont réservés).

**Alternative rejetée** : tout migrer en base dès v1 — trop risqué ; les adapters garantissent la parité immédiate.

### 4. Déclaration admin (modèle)

Entité `ApiCollectionDefinition` :

| Champ | Description |
|---|---|
| `id` (slug unique) | Identifiant builder (`apiId`) |
| `label` | Libellé UI |
| `type` | `image` \| `video` \| `article` |
| `supportedModes` | JSON list |
| `endpointUrl` | URL collection (Hydra/JSON-LD ou JSON liste) |
| `itemUrlTemplate` | Optionnel, ex. `{endpoint}/{id}` pour dynamic |
| `queryParams` | Params fixes (JSON) |
| `paginationStyle` | `hydra` (page + itemsPerPage) \| `none` \| `offset` |
| `memberPath` | Chemin vers la liste (défaut `member`) |
| `fieldMapping` | JSON : `{ "title": "titre", "image": "visuel.url", "counter": "vues", … }` |
| `enabled` | bool |
| `headers` | Optionnel (API keys en clair v1 — voir risques) |

Le formulaire admin propose des champs de mapping pour : `id`, `image`, `title`, `description`, `label`, `labels`, `counter`, `like`, `link`, `alt`.

### 5. Endpoints unifiés

```
GET  /api/page-builder/collections?type=&mode=
GET  /api/page-builder/collections/{apiId}/items?page=&itemsPerPage=
POST /api/page-builder/collections/resolve   body: { entries: [{ apiId, itemId }] }
```

Catalogue : fusion adapters + définitions `enabled=true`, filtrable par `type` et `mode`.

### 6. Intégration NodeCollection

- Mode **fixed** : un seul client → `collections/{apiId}/items` quel que soit le type.
- Mode **dynamic** (article/video) : browse via catalogue filtré `mode=dynamic` + resolve unifié ; image dynamic reste file manager.
- Settings Source : sélecteur d’API alimenté par `GET /collections?type=&mode=`.

**Alternative rejetée** : garder les trois clients frontend et seulement « documenter » le mapping — ne résout pas la dette ni l’admin.

### 7. UI admin

CRUD Symfony sous `/admin/api-collection` (liste, new, edit, delete), style existant (Pages / Formulaires) :

- Liste : id, label, type, modes, enabled
- Formulaire : métadonnées + URL + mapping (inputs nommés par champ standard)
- Lien sidebar « APIs collection »

Pas de SPA React dédiée en v1 (cohérence avec le reste de l’admin Twig).

## Risks / Trade-offs

- **[Mapping JSONPath limité]** → chemins point-separated (`visuel.url`) suffisent pour Charisma/Flashnews ; documenter ; extensions ultérieures si besoin.
- **[Secrets API en base]** → headers optionnels en clair en v1 ; mitigation : accès admin authentifié + note sécurité ; env vars plus tard.
- **[Divergence adapters vs déclarations]** → tests de contrat (shape item) partagés ; adapters couverts par tests d’enregistrement existants étendus.
- **[Double catalogue pendant transition]** → NodeCollection bascule entièrement sur `/collections` ; anciens endpoints restent pour NodeList*.
- **[Hydra vs formats custom]** → `paginationStyle` + `memberPath` configurables ; fallback « toute la réponse est un array ».

## Migration Plan

1. Ship registry + endpoints + adapters (parité catalogue avec lists/lists-image/cards video).
2. Brancher NodeCollection sur `/collections`.
3. Ship CRUD admin + runtime config-driven.
4. (Plus tard, hors scope) migrer progressivement les classes PHP vers des définitions admin équivalentes ; déprécier les endpoints lists* pour le seul NodeCollection.

Rollback : NodeCollection peut rétrolister temporairement les anciens clients si feature-flag ; les définitions admin non lues n’impactent pas les adapters.

## Open Questions

- Faut-il exposer un « test de mapping » (preview 1 page) dans l’admin dès v1 ? **Proposition : oui, minimal** (bouton « Tester » → affiche 1–3 items mappés).
- Les APIs dynamic image (hors file manager) sont-elles souhaitées en v1 ? **Proposition : supportées par le contrat si déclarées, UI NodeCollection image dynamic reste file manager.**
- Stockage des headers secrets : env-ref vs clair — trancher à l’implémentation admin si une API réelle l’exige.
