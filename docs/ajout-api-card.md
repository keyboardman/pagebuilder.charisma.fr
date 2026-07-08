# Ajouter une API (ApiCard) au Page Builder

Ce guide décrit comment exposer une nouvelle source de contenu (articles, vidéos, etc.) dans l’éditeur de pages, afin que les utilisateurs puissent choisir des éléments depuis cette API dans les blocs du builder.

## Vue d’ensemble

Une **ApiCard** est un service PHP qui :

- **étend** la classe abstraite correspondant à son type (`AbstractApiCardArticle`, `AbstractApiCardVideo`, `AbstractApiCardImage`, `AbstractApiCardList`) — ou implémente directement `ApiCardInterface` pour un cas exceptionnel ;
- est **tagué** `app.builder_api_card` dans `config/services.yaml` ;
- est automatiquement enregistré dans `ApiCardRegistry` et exposé à l’éditeur via l’API builder (`GET /api/page-builder/cards`).

Les classes abstraites fournissent `getType()` automatiquement (`article`, `video`, `image` ou `list`) : inutile de le redéclarer dans chaque implémentation.

L’éditeur récupère la liste des cartes via cette API (base `/api/page-builder`) et propose chaque carte comme source dans l’interface.

> Voir aussi [builder-api.md](builder-api.md) pour le détail des endpoints API Platform (cards, formulaires, polices).

> Note: les variantes d’affichage visuel image (ex. `list` / `slider`) sont gérées uniquement dans l’éditeur page builder. Elles ne font pas partie du contrat `ApiCard` backend.

---

## Étapes

### 1. Choisir le type

Chaque type dispose d’une **interface marqueur** et d’une **classe abstraite** qui fournit `getType()` :

| Type | Interface | Classe abstraite | `getType()` |
|------|-----------|------------------|-------------|
| Articles (actualités, blog, témoignages…) | `ApiCardArticleInterface` | `AbstractApiCardArticle` | `article` |
| Vidéos | `ApiCardVideoInterface` | `AbstractApiCardVideo` | `video` |
| Images | `ApiCardImageInterface` | `AbstractApiCardImage` | `image` |
| Listes (`AbstractApiCardList`, type `list`) | `ApiCardListInterface` | `AbstractApiCardList` | `list` |

Les APIs de type `list` alimentent **NodeNavApi** (menu de liens) et **NodeListApi** (liste riche : image, titre, description, compteur optionnels).

La classe concrète **étend** la classe abstraite (`extends AbstractApiCardArticle`, etc.). Pour combiner un type avec `ApiCardBehaviorInterface`, utiliser `extends` + `implements` :

```php
final class MaSourceApiCard extends AbstractApiCardImage implements ApiCardBehaviorInterface
```

Types supportés côté builder : `article`, `video`, `image`, `list`.

### 2. Créer la classe

Créer un fichier dans `src/PageBuilder/ApiCard/`, par exemple `MaSourceApiCard.php` :

```php
<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

use Symfony\Contracts\HttpClient\HttpClientInterface;

final class MaSourceApiCard extends AbstractApiCardArticle
{
    private const BASE_URL = 'https://api.example.com';

    public function __construct(
        private readonly HttpClientInterface $httpClient,
    ) {
    }

    public function getId(): string
    {
        return 'ma_source';  // identifiant unique, snake_case
    }

    public function getLabel(): string
    {
        return 'Ma source';  // libellé affiché dans l’éditeur
    }

    public function getCategory(): ?string
    {
        return null;  // ou ex: "news", "cms" pour regroupement
    }

    public function fetchCollection(array $params): array
    {
        // Voir section « fetchCollection » ci-dessous
        return ['items' => [], 'total' => 0];
    }

    public function fetchItem(string $id): object
    {
        // Voir section « fetchItem » ci-dessous
        return (object) [];
    }

    public function mapItem(object $item): array
    {
        // Voir section « mapItem » ci-dessous
        return [
            'id' => '',
            'title' => '',
            'description' => null,
            'image' => null,
            'labels' => null,
            'link' => null,
            'text' => null,
            'raw' => $item,
        ];
    }

    public function fetchCategories(): ?array
    {
        return null;  // ou liste de catégories pour filtrage
    }

    public function getCategoryQueryParam(): string
    {
        return 'category';
    }
}
```

### 3. Implémenter les méthodes

#### `fetchCollection(array $params): array`

Récupère une liste paginée (et optionnellement filtrée) d’éléments.

- **Paramètres reçus** (exemples) : `page`, `limit`, `search`, `sort`, `category` (ou autre selon `getCategoryQueryParam()`).
- **Retour attendu** :
  - `items` : liste d’objets (stdClass ou équivalent), un par élément ;
  - `total` : nombre total d’éléments (pour la pagination).

Exemple :

```php
$response = $this->httpClient->request('GET', self::BASE_URL . '/api/items', [
    'query' => [
        'page' => (string) max(1, (int) ($params['page'] ?? 1)),
        'itemsPerPage' => (string) max(1, min(100, (int) ($params['limit'] ?? 50))),
        'titre' => $params['search'] ?? '',
        // ...
    ],
]);
$data = $response->toArray();
$member = $data['member'] ?? [];
$totalItems = (int) ($data['totalItems'] ?? 0);
$items = array_map(static fn (mixed $item): object => (object) (is_array($item) ? $item : []), $member);

return ['items' => $items, 'total' => $totalItems];
```

#### `fetchItem(string $id): object`

Récupère un seul élément par son identifiant. Retourner un objet (stdClass) dont la structure sera passée à `mapItem()`.

#### `mapItem(object $item): array`

Transforme un objet brut (réponse API) en format standard utilisé par le builder.

**Clés attendues :**


| Clé           | Type   | Obligatoire | Description                       |
| ------------- | ------ | ----------- | --------------------------------- |
| `id`          | string | oui         | Identifiant unique de l’élément   |
| `title`       | string | oui         | Titre affiché                     |
| `description` | string | non         | Sous-titre / description courte   |
| `image`       | string | non         | URL de l’image (aperçu)           |
| `labels`      | array  | non         | Liste de libellés (tags, thèmes…) |
| `link`        | string | non         | URL de la page détail             |
| `text`        | string | non         | Extrait / résumé texte            |
| `counter`     | string/int | non     | Compteur affichable (ex. vues) |
| `like`        | string/int | non     | Nombre de likes |
| `raw`         | object | oui         | Objet brut (pour usage avancé)    |

Pour une API de type **`list`**, le mapping SHALL fournir au minimum `id`, `title` et `link`. La cible des liens (`target`, ex. `_self` / `_blank`) est configurée dans le nœud **NodeNavApi** (`node-nav-api`), pas dans l’ApiCard. Le nœud charge toute la collection et affiche un lien par item (sans sélection item par item).

Pour le nœud **NodeListApi** (`node-list-api`), les APIs éligibles sont les types **`list`** (`AbstractApiCardList`). Le nœud charge toute la collection et affiche pour chaque item les champs **image**, **titre**, **description**, **compteur** et **like** selon les toggles `show` configurés dans le builder. Les champs `description`, `image`, `counter` et `like` du mapping restent optionnels : s’ils sont absents, ils ne sont pas rendus pour cet item.

Chaque implémentation `list` SHALL définir son propre `mapItem()` : le mapping des champs distants vers le contrat builder dépend de l’endpoint (ex. En Action home : `vues` → `counter`, `likes` → `like`).


Exemple :

```php
return [
    'id' => (string) ($item->id ?? ''),
    'title' => (string) ($item->titre ?? ''),
    'description' => isset($item->resume) ? (string) $item->resume : null,
    'image' => $item->thumbnails['normal'] ?? null,
    'labels' => $labels ?: null,  // tableau de strings
    'link' => $item->url ?? null,
    'text' => $item->resume ?? null,
    'raw' => $item,
];
```

#### Catégories (optionnel)

- `fetchCategories(): ?array` : si la source a des catégories, retourner une liste de `['id' => string, 'label' => string]`, sinon `null`.
- `getCategoryQueryParam(): string` : nom du paramètre envoyé à l’API pour filtrer par catégorie (souvent `'category'`).

#### `ApiCardBehaviorInterface` (optionnel)

`ApiCardBehaviorInterface` permet de déclarer le mode de collection attendu par l’éditeur:

- `normal` : comportement standard (recherche/pagination activées côté UI).
- `fixed` : collection éditoriale fixe (UI simplifiée, sans recherche/pagination côté sélection).

Si votre classe **n’implémente pas** `ApiCardBehaviorInterface`, le registre applique `collectionMode = "normal"` par défaut.

Exemple:

```php
<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

final class MaSourceApiCard extends AbstractApiCardImage implements ApiCardBehaviorInterface
{
    // ... autres méthodes ApiCardInterface (getId, getLabel, fetchCollection, etc.)

    public function getCollectionMode(): string
    {
        return 'fixed'; // ou 'normal'
    }
}
```

Dans la réponse `GET /api/page-builder/cards`, ce mode est exposé via le champ `collectionMode`.

---

### 4. Enregistrer le service

Dans `config/services.yaml`, ajouter la définition du service avec le tag `app.builder_api_card` :

```yaml
    App\PageBuilder\ApiCard\MaSourceApiCard:
        tags: [app.builder_api_card]
```

Sans ce tag, la carte ne sera pas injectée dans `ApiCardRegistry` et n’apparaîtra pas dans l’éditeur.

---

### 5. Vérifier

Endpoints **API Platform** (utilisés par le builder) :

- Liste des cartes : `GET /api/page-builder/cards` → la nouvelle carte doit apparaître avec son `id`, `label`, `type`, `category` (et éventuellement `collectionMode`).
- Collection : `GET /api/page-builder/cards/{apiId}/items?page=1&limit=20`.
- Détail : `GET /api/page-builder/cards/{apiId}/items/{itemId}`.
- Catégories (si implémentées) : `GET /api/page-builder/cards/{apiId}/categories`.

Recharger la page de l’éditeur (ou vider le cache Symfony si besoin) pour voir la nouvelle source dans l’interface.

---

## Fichiers de référence

- **Contrat** : `src/PageBuilder/ApiCard/ApiCardInterface.php`
- **Comportement optionnel** : `src/PageBuilder/ApiCard/ApiCardBehaviorInterface.php`
- **Types (interfaces)** : `ApiCardArticleInterface`, `ApiCardVideoInterface`, `ApiCardImageInterface`, `ApiCardListInterface`
- **Types (classes abstraites, `getType()` inclus)** : `AbstractApiCardArticle`, `AbstractApiCardVideo`, `AbstractApiCardImage`, `AbstractApiCardList`
- **Exemple list** : `StubNavListApiCard.php` (menu de démonstration), `FlashnewsThemeApiList.php` (thèmes Flashnews pour NodeNavApi), `CharismaArticleEnactionHomeApiList.php` et `CharismaArticleExpressionHomeApiList.php` (articles home pour NodeListApi)
- **Exemples** : `CharismaArticleAuteurApiCard.php`, `CharismaTemoignageApiCard.php`, `FlashnewsApiCard.php`, `CharismaVideosApiCard.php`
- **Registre** : `src/PageBuilder/ApiCard/ApiCardRegistry.php`
- **Logique HTTP partagée** : `src/PageBuilder/Api/ApiCardEndpointProvider.php`
- **API Platform** : `src/ApiResource/BuilderApiCard*.php`, `src/State/BuilderApiCard*Provider.php`
- **Vue d’ensemble API** : [builder-api.md](builder-api.md)

