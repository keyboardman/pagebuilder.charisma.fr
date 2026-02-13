# Ajouter une API (ApiCard) au Page Builder

Ce guide décrit comment exposer une nouvelle source de contenu (articles, vidéos, etc.) dans l’éditeur de pages, afin que les utilisateurs puissent choisir des éléments depuis cette API dans les blocs du builder.

## Vue d’ensemble

Une **ApiCard** est un service PHP qui :

- implémente `ApiCardInterface` (ou `ApiCardArticleInterface` / `ApiCardVideoInterface`) ;
- est **tagué** `app.builder_api_card` dans `config/services.yaml` ;
- est automatiquement enregistré dans `ApiCardRegistry` et exposé à l’éditeur via `/page-builder/api/cards`.

L’éditeur récupère la liste des cartes via cette API et propose chaque carte comme source dans l’interface.

---

## Étapes

### 1. Choisir l’interface

- **Articles** (actualités, blog, témoignages…) → `ApiCardArticleInterface` → `getType()` retourne `"article"`.
- **Vidéos** → `ApiCardVideoInterface` → `getType()` retourne `"video"`.

Types supportés côté builder : `article`, `video`, `image`.

### 2. Créer la classe

Créer un fichier dans `src/PageBuilder/ApiCard/`, par exemple `MaSourceApiCard.php` :

```php
<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCard;

use Symfony\Contracts\HttpClient\HttpClientInterface;

final class MaSourceApiCard implements ApiCardArticleInterface
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

    public function getType(): string
    {
        return 'article';  // ou "video"
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

| Clé           | Type   | Obligatoire | Description                          |
|---------------|--------|-------------|--------------------------------------|
| `id`          | string | oui         | Identifiant unique de l’élément      |
| `title`       | string | oui         | Titre affiché                        |
| `description` | string | non         | Sous-titre / description courte     |
| `image`       | string | non         | URL de l’image (aperçu)              |
| `labels`      | array  | non         | Liste de libellés (tags, thèmes…)    |
| `link`        | string | non         | URL de la page détail                |
| `text`        | string | non         | Extrait / résumé texte               |
| `raw`         | object | oui         | Objet brut (pour usage avancé)       |

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

- L’API liste les cartes : `GET /page-builder/api/cards` → la nouvelle carte doit apparaître avec son `id`, `label`, `type`, `category`.
- Liste d’éléments : `GET /page-builder/api/cards/{id}/items?page=1&limit=20`.
- Détail d’un élément : `GET /page-builder/api/cards/{id}/items/{itemId}`.

Recharger la page de l’éditeur (ou vider le cache Symfony si besoin) pour voir la nouvelle source dans l’interface.

---

## Fichiers de référence

- **Contrat** : `src/PageBuilder/ApiCard/ApiCardInterface.php`
- **Types** : `ApiCardArticleInterface`, `ApiCardVideoInterface`
- **Exemples** : `CharismaArticleAuteurApiCard.php`, `CharismaTemoignageApiCard.php`, `FlashnewsApiCard.php`, `CharismaVideosApiCard.php`
- **Registre** : `src/PageBuilder/ApiCard/ApiCardRegistry.php`
- **API HTTP** : `src/Controller/PageBuilderApiController.php`
