## Context

Le CRUD Api Collection (`/admin/api-collection`) est en place. Le partial `templates/api_collection/_form.html.twig` affiche tous les champs dans **une seule** `card`, avec seulement un sous-titre pour le mapping. Les écrans Page utilisent déjà plusieurs cartes (`Page`, `SEO`) — pattern à réutiliser.

Aucun changement de modèle (`ApiCollectionDefinition`), de validation métier, ni d’API runtime.

## Goals / Non-Goals

**Goals:**

- Rendre le formulaire scannable en sections métier claires.
- Aligner le markup sur les conventions admin existantes (Tailwind / shadcn-like : `card`, titres `h2`, textes d’aide `text-muted-foreground`).
- Améliorer légèrement les libellés / helps sans renommer les propriétés du formulaire Symfony.

**Non-Goals:**

- Wizard multi-étapes, accordéons JS, ou preview live dans le formulaire.
- Refonte de la liste ou du test de mapping (hors séparation visuelle déjà présente).
- Nouveaux champs, migration DB, ou logique `ConfigurableApiCollection`.

## Decisions

### 1. Sections en cartes multiples (comme Pages)

Regrouper `_form.html.twig` en cartes séparées :

| Section | Champs |
|---|---|
| Identité | `apiId`, `label`, `type`, `supportedModes`, `enabled` |
| Source HTTP | `endpointUrl`, `itemUrlTemplate`, `imagePrefix`, `queryParamsText`, `headersText` |
| Pagination & parsing | `paginationStyle`, `memberPath` |
| Mapping des champs | tous les `map_*` (grille 2 colonnes conservée) |

Rationale : une carte = un job (comme Page/SEO). Alternatives écartées : fieldsets HTML seuls (moins visibles dans ce design system), accordéons (complexité JS inutile).

### 2. Contenu des aides, pas de nouveaux widgets

Ajuster labels/helps dans `ApiCollectionDefinitionType` uniquement si un libellé est opaque (`Mapping → title` → libellé humain + placeholder inchangé). Pas de `CollectionType` dynamique ni d’éditeur JSON.

### 3. Erreurs globales en tête

Garder `form_errors(form)` une fois en haut du formulaire (hors carte ou dans une alerte discrète), pour ne pas les perdre entre sections.

### 4. Bouton submit hors cartes

Conserver le bouton principal sous les cartes, hors d’une section métier.

## Risks / Trade-offs

- [Formulaire plus long verticalement] → Mitigation : sections courtes + grille mapping ; largeur `max-w-4xl` déjà en place.
- [Régression visuelle si classes inconsistantes] → Mitigation : copier le pattern exact de `templates/page/edit.html.twig`.

## Migration Plan

Déploiement purement frontend Twig (+ éventuels labels PHP). Rollback = restaurer l’ancien `_form.html.twig`. Aucune migration données.

## Open Questions

Aucune — le découpage de sections ci-dessus est figé pour l’implémentation.
