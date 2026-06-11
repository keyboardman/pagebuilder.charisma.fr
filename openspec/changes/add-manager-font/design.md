## Context

Le builder charge au démarrage les polices du thème via `ThemeFontBuilderService` → `themeFonts` → `registerFont()`. Le service `typography.ts` maintient une liste globale de polices enregistrées et les injecte dans l’iframe d’édition. Les nodes stockent des valeurs CSS `fontFamily` (chaîne) dans leurs attributs de style ; il n’existe pas aujourd’hui de référence explicite à l’entité `Font`.

Le catalogue complet peut contenir des dizaines de polices Google et custom ; tout charger au boot du builder est inacceptable.

## Goals / Non-Goals

- Goals:
  - Permettre de choisir n’importe quelle police du catalogue via une UI dédiée (ManagerFont).
  - Ne charger (stylesheet / `@font-face`) que les polices effectivement utilisées sur la page courante.
  - Retirer automatiquement une police de la page lorsqu’elle n’est plus référencée par aucun node.
  - Conserver la compatibilité avec les polices thème et navigateur existantes.
- Non-Goals:
  - Refonte de l’admin `/font` (CRUD inchangé).
  - Onglet « Polices » dans la sidebar gauche du builder (l’accès passe uniquement par `FontFamilySelect`).
  - Gestion fine des variantes (poids, italique) au-delà de ce que `ThemeFontBuilderService` fournit déjà pour la variante par défaut custom.
  - Persistance d’un champ `fontId` séparé dans chaque node (le `fontFamily` CSS reste la source de vérité affichée).

## Decisions

### Decision: FontUsageRegistry dérivé des nodes + sélection explicite

Un module `FontUsageRegistry` maintient un compteur de références par `fontId` (entité `Font`). Les sources de référence sont :
1. **Sélection via ManagerFont** : incrémente immédiatement le compteur et appelle `registerFont`.
2. **Scanner de nodes** : parcourt récursivement tous les nodes et leurs attributs de style (`fontFamily`, blocs `Text2Settings`, `NodeRoot` typography, etc.) ; pour chaque valeur non vide, tente de résoudre l’id via l’API backend (`resolve` par nom primaire de la famille). Met à jour les compteurs.

Lorsqu’un compteur retombe à 0, la police est retirée du registre de page et `unregisterFont` est appelé (sans toucher aux polices thème ni aux builtins).

**Alternatives considérées** :
- Stocker `fontId` dans chaque node → rejeté (migration lourde, redondant avec `fontFamily`).
- Charger tout le catalogue en mémoire côté client → rejeté (performance).

### Decision: ManagerFont calqué sur ManagerApi

`ManagerFontModal` expose recherche textuelle, pagination et aperçu du type (native / Google / custom). La sélection retourne `{ id, name, fontFamily, href }` au format déjà consommé par `registerFont`.

L’API backend réutilise la logique de `ThemeFontBuilderService` pour produire `href` et `fontFamily` à partir d’une entité `Font`.

### Decision: Séparation polices immuables vs polices de page

| Catégorie | Source | Retirable ? |
|-----------|--------|-------------|
| Builtin navigateur | `typography.ts` DEFAULT_FONTS | Non |
| Thème | `themeFonts` au boot | Non |
| Page | FontUsageRegistry | Oui (compteur à 0) |

`getFontOptions()` retourne l’union builtin + thème + polices de page actives.

### Decision: Preview et rendu public

Un service PHP `PageFontResolverService` scanne le JSON `Page.content`, extrait les `fontFamily`, résout les polices correspondantes et injecte les balises `<link>` / styles nécessaires dans `render_view.html.twig` et la preview, en complément du CSS de thème.

## Risks / Trade-offs

- **Résolution ambiguë par nom** : deux polices avec le même `name` → mitiger en priorisant l’id si le node a été configuré via ManagerFont (mémorisation locale optionnelle `fontId` dans le registre uniquement, pas dans le JSON node) ; documenter que le `name` doit rester unique.
- **Race au chargement** : le scanner peut s’exécuter avant la fin d’un fetch API → le registre rejoue la sync après résolution.
- **unregisterFont et DOM** : retirer un `<link>` déjà chargé ne décharge pas la police du cache navigateur ; acceptable car l’objectif est de ne pas charger inutilement, pas de libérer la mémoire à chaud.

## Migration Plan

1. Déployer l’API et le registre ; les pages existantes continuent de fonctionner (polices thème + builtins).
2. Au premier chargement builder, le scanner détecte les `fontFamily` custom déjà présents et les résout via l’API.
3. Aucune migration de données en base.

## Open Questions

- _(aucune — l’accès aux polices se fait uniquement via `FontFamilySelect` + ManagerFontModal, sans onglet sidebar dédié)_
