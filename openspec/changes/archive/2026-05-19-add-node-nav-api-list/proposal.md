# Change: Menu de navigation piloté par API (NodeNavApi + ApiCard type list)

## Why

Le builder propose déjà un menu manuel (**NodeNav** / **NodeNavItem**), mais certaines navigations (rubriques, liens éditoriaux Charisma, etc.) doivent être alimentées dynamiquement depuis une source distante. Le TODO projet mentionne « Api List » : il manque un contrat backend de type `list` et un nœud dédié qui réutilise le rendu et les options du menu existant sans imposer la saisie item par item.

## What Changes

- Ajout de **`ApiCardListInterface`** (type `list`) étendant `ApiCardInterface`, enregistrable dans `ApiCardRegistry` comme les types `article`, `video` et `image`.
- Définition du format minimal d’un item `list` pour la navigation : `id`, `title` (libellé), `link` (href). La cible des liens (`target`) est gérée par **NodeNavApi**, pas par l’ApiCard.
- Ajout du nœud **`NodeNavApi`** (identifiant `node-nav-api`) dans le builder : sélection d’une API de type `list`, chargement de la collection, rendu d’un `<nav>` avec liens (options alignées sur **NodeNav** : direction, variante `navbar`/`liste`, burger).
- Extension du contrat frontend (`ApiAdapter`, `backendApiAdapter`) pour reconnaître le type `list`.
- Mise à jour de la documentation `docs/ajout-api-card.md`.

## Impact

- Affected specs: **page-builder**, **builder-api-registry**
- Affected code:
  - `src/PageBuilder/ApiCard/` (`ApiCardListInterface`, éventuelle implémentation de référence)
  - `config/services.yaml` (tag `app.builder_api_card`)
  - `assets/editeur/ManagerNode/NodeNavApi/` (nouveau nœud)
  - `assets/editeur/ManagerApi/` (`ApiAdapter.ts`, `backendApiAdapter.ts`)
  - `assets/editeur/ManagerNode/components/NodeRegistry.ts`
  - thème de base (`node-nav-api.css` si nécessaire)
  - `docs/ajout-api-card.md`

## Non-Goals (cette proposition)

- Sous-menus imbriqués ou méga-menu.
- Remplacement de **NodeNav** manuel (les deux coexistent).
- Items image/bouton dans le menu API (uniquement des liens texte issus du mapping `list`).
