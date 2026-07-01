## Context

Les interfaces typées `ApiCard*Interface` dans `src/PageBuilder/ApiCard/` étendent `ApiCardInterface` et redéclarent `getType(): string` avec un commentaire indiquant la valeur attendue (`// retourne "image"`). Chaque classe concrète (8 implémentations) réimplémente cette méthode avec la même valeur constante.

Le projet cible PHP >= 8.4, qui supporte les méthodes avec corps dans les interfaces (depuis PHP 8.0).

## Goals / Non-Goals

**Goals:**

- Centraliser la valeur de `getType()` dans l'interface typée correspondante.
- Supprimer le boilerplate `getType()` dans toutes les implémentations existantes.
- Conserver le comportement runtime identique (registre, endpoints API Platform, builder JS).

**Non-Goals:**

- Modifier le contrat JSON exposé au builder.
- Introduire des traits ou classes abstraites intermédiaires.
- Changer la hiérarchie d'interfaces ou ajouter de nouveaux types.

## Decisions

### 1. Classes abstraites par type (retenu)

PHP n'autorise pas de corps de méthode dans les interfaces. Chaque type dispose d'une classe abstraite (`AbstractApiCardArticle`, `AbstractApiCardVideo`, `AbstractApiCardImage`, `AbstractApiCardList`) qui implémente l'interface typée et fournit `getType()`. Les classes concrètes étendent la classe abstraite correspondante.

```php
abstract class AbstractApiCardImage implements ApiCardImageInterface
{
    public function getType(): string
    {
        return 'image';
    }
}

final class CharismaEvenementApiCard extends AbstractApiCardImage implements ApiCardBehaviorInterface
```

**Alternatives considérées :**

| Approche | Avantage | Inconvénient |
|---|---|---|
| **Méthode par défaut dans l'interface** | Zéro boilerplate | **Impossible en PHP** — les interfaces ne peuvent pas contenir de corps de méthode |
| **Classe abstraite par type** (retenue) | Zéro boilerplate `getType()` dans les classes concrètes, compatible multi-interfaces via `implements` | Les classes concrètes `extends` au lieu de `implements` l'interface typée |

### 2. Suppression systématique des `getType()` redondants

Toutes les classes qui implémentent une interface typée et retournent la valeur attendue suppriment leur méthode `getType()`. Aucune classe existante ne surcharge avec une valeur différente.

### 3. `ApiCardInterface` inchangée

`getType()` reste déclarée (abstraite) sur l'interface de base pour les implémentations directes éventuelles. Les interfaces typées la redéfinissent avec un corps.

## Risks / Trade-offs

- **[Surcharge accidentelle]** → Une classe pourrait redéfinir `getType()` avec une mauvaise valeur. Mitigation : PHPStan / revue de code ; le type est implicite dans l'interface implémentée.
- **[Compatibilité]** → Aucun impact : le comportement externe est identique, seul le code interne change.

## Migration Plan

1. Ajouter les corps par défaut dans les 4 interfaces typées.
2. Supprimer `getType()` des 8 implémentations concrètes.
3. Vérifier que les tests existants passent (`phpunit` sur le namespace ApiCard si présent).

Rollback : restaurer les méthodes dans les classes et retirer les corps des interfaces.

## Open Questions

_(aucune)_
