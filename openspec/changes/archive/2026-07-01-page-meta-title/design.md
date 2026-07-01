## Context

L'entité `Page` possède aujourd'hui un champ `title` (obligatoire, utilisé pour le slug et l'admin) et un champ `description` (SEO). La balise `<title>` des rendus publics (`render_view.html.twig`, `preview.html.twig`, export `pageBuilderStandalone.jsx`) utilise directement `page.title`. Il n'existe pas de moyen de découpler le libellé interne du titre affiché dans les onglets navigateur et les résultats de recherche.

## Goals / Non-Goals

**Goals:**

- Ajouter `metaTitle` (nullable) sur `Page` pour un titre SEO distinct
- Exposer le champ dans les formulaires admin (section SEO)
- Utiliser `metaTitle` avec repli sur `title` dans tous les points de rendu `<title>`
- Copier `metaTitle` lors de la duplication de page
- Couvrir par des tests unitaires et fonctionnels

**Non-Goals:**

- Modifier le comportement du slug (reste dérivé de `title`)
- Ajouter d'autres balises SEO (Open Graph, canonical, robots)
- Changer le titre affiché dans le builder ou l'admin (reste `title`)
- Modifier le contenu du node-root (`content.title`) dans le builder

## Decisions

### 1. Nom du champ : `metaTitle`

**Choix** : propriété Doctrine `metaTitle` (colonne `meta_title` en base).

**Alternatives** : `seoTitle` — rejeté car le besoin utilisateur mentionne explicitement `metaTitle`.

### 2. Repli sur `title` si vide

**Choix** : méthode `Page::getEffectiveMetaTitle(): string` retournant `metaTitle` non vide, sinon `title`. Utilisée dans les templates Twig et passée au builder.

**Alternatives** : logique dupliquée dans chaque template — rejeté pour éviter les incohérences.

### 3. Champ optionnel dans le formulaire

**Choix** : `metaTitle` nullable, non requis, placé en tête de la section SEO (avant `description`), avec texte d'aide.

**Alternatives** : pré-remplir avec `title` à la création — rejeté car cela masquerait l'intention (laisser vide = utiliser `title`).

### 4. Points de rendu à mettre à jour

| Point | Changement |
|-------|-----------|
| `render_view.html.twig` | `<title>{{ page.effectiveMetaTitle }}</title>` via accesseur ou filtre |
| `preview.html.twig` | idem |
| `builder.html.twig` | passer `pageMetaTitle: page.effectiveMetaTitle` au JS |
| `pageBuilderStandalone.jsx` | prop `pageMetaTitle` utilisée dans `buildFullDocument` à la place de `pageTitle` pour `<title>` |
| `PageController::duplicate` | `$copy->setMetaTitle($page->getMetaTitle())` |

Le header du builder (`pageTitle` affiché dans la barre) reste `page.title` — seul le `<title>` HTML exporté change.

### 5. Migration

**Choix** : migration Doctrine ajoutant `meta_title VARCHAR(255) DEFAULT NULL` sur la table `page`. Pas de backfill : les pages existantes utilisent automatiquement le repli sur `title`.

## Risks / Trade-offs

- **[Risque] Incohérence render stocké vs metaTitle** → Le champ `render` peut contenir un `<title>` obsolète. Le rendu via `render_view.html.twig` régénère le head à partir de l'entité, donc pas d'impact. L'export builder régénère aussi le document complet à la sauvegarde.
- **[Risque] Longueur du metaTitle** → Limiter à 255 caractères (même contrainte que `title`), suffisant pour le SEO.
- **[Trade-off] Pas de validation SEO** → Pas de limite stricte à 60 caractères ; l'utilisateur reste libre.

## Migration Plan

1. Déployer la migration Doctrine (`meta_title` nullable)
2. Déployer le code (entité, formulaire, templates, builder)
3. Rollback : supprimer la colonne via migration inverse si nécessaire ; le repli sur `title` garantit l'absence de régression fonctionnelle

## Open Questions

_Aucune — le périmètre est clair._
