## Context

`Spacing2Settings` (`assets/editeur/ManagerNode/Settings/Spacing2Settings.tsx`) est le panneau partagé de margin/padding du builder. Il expose aujourd'hui 4 champs longhand par propriété (top, right, bottom, left) et est réutilisé par une trentaine de nœuds (containers, cards, text, forms, hero, etc.).

Les styles sont stockés comme `React.CSSProperties` inline sur les nœuds et rendus via `styleForView()`. Le thème fournit des placeholders via `useThemeStylePlaceholder(selector, property)`.

## Goals / Non-Goals

**Goals:**

- Permettre la saisie margin/padding en un seul champ (quatre côtés identiques) ou en quatre champs distincts.
- Basculer explicitement entre les deux modes pour margin et padding indépendamment.
- Conserver la rétrocompatibilité des styles existants et des placeholders thème.
- Centraliser la logique dans `Spacing2Settings` sans modifier chaque nœud consommateur.

**Non-Goals:**

- Support de la syntaxe CSS shorthand à 2 ou 3 valeurs (ex. `1rem 2rem`) dans le mode unifié — une seule valeur pour les quatre côtés.
- Modification du formulaire thème (`ThemeFormComponent`) qui utilise déjà des champs shorthand `margin`/`padding`.
- Changement du modèle de persistance API ou migration de données.

## Decisions

### 1. Persistance : shorthand en mode unifié, longhand en mode par côté

**Choix** : en mode unifié, écrire `margin` / `padding` (shorthand) et supprimer les longhands ; en mode par côté, écrire les longhands et supprimer le shorthand.

**Alternatives** :
- _Toujours écrire les 4 longhands en mode unifié_ : plus simple à lire mais alourdit le JSON et complique la détection du mode.
- _Toujours utiliser le shorthand_ : incompatible avec les réglages asymétriques.

**Rationale** : aligné sur CSS natif, évite les conflits shorthand/longhand, et le rendu React gère les deux formes.

### 2. État du mode : dérivé du style + override local au basculement

**Choix** : détecter le mode initial à partir du style (`margin`/`padding` présent → unifié ; longhands différents → par côté ; longhands égaux → unifié). Conserver un état local `marginMode` / `paddingMode` pour le basculement utilisateur, initialisé par la détection.

**Alternatives** :
- _Persister le mode dans le nœud_ : inutile, le style suffit à déduire l'intention.
- _Toujours afficher les deux UIs_ : encombre le panneau.

### 3. Contrôle de basculement : bouton icône à côté du titre de section

**Choix** : ajouter un petit bouton toggle (icône « lien » / « délier » ou équivalent) à droite du `SettingsSectionTitle` pour chaque section Margin et Padding.

**Alternatives** :
- _Segmented control « Tous / Côtés »_ : plus explicite mais plus large dans le panneau étroit.
- _Champ unifié toujours visible au-dessus des 4 champs_ : risque de confusion sur quelle valeur prime.

**Rationale** : pattern familier des outils de design (Figma, etc.), compact, réutilisable.

### 4. Helper partagé `spacingModeHelper.ts`

**Choix** : extraire dans `assets/editeur/ManagerNode/Settings/spacingModeHelper.ts` :
- `detectSpacingMode(style, property)` → `'unified' | 'per-side'`
- `getUnifiedValue(style, property)` → string
- `applyUnifiedValue(style, property, value)` → CSSProperties
- `applyPerSideValue(style, property, side, value)` → CSSProperties
- `expandUnifiedToPerSide(style, property)` → CSSProperties
- `collapsePerSideToUnified(style, property)` → CSSProperties (si les 4 côtés sont égaux)

**Rationale** : logique testable, composant UI allégé, réutilisable si d'autres panneaux adoptent le même pattern.

### 5. Placeholders thème

**Choix** : en mode unifié, utiliser `useThemeStylePlaceholder(selector, 'margin')` ou `'padding'`. En mode par côté, conserver les hooks existants par côté.

**Rationale** : cohérent avec `ThemeFormComponent` qui définit souvent `margin`/`padding` en shorthand dans les overrides thème.

## Risks / Trade-offs

- **[Conflit shorthand + longhand résiduel]** → À chaque `onChange`, nettoyer systématiquement la forme opposée (helper centralisé).
- **[Basculement avec valeurs asymétriques vers unifié]** → Le champ unifié reste vide ; l'utilisateur doit ressaisir. Acceptable : évite d'écraser silencieusement des réglages fins.
- **[Valeurs longhand égales mais shorthand aussi présent]** → Prioriser le shorthand pour le mode unifié ; ignorer les longhands à l'affichage.
- **[Panneau étroit]** → Le toggle icône + un champ ou une grille 2×2 reste dans les contraintes actuelles du panneau droit.

## Migration Plan

Aucune migration de données. Déploiement frontend uniquement via Encore. Les styles existants (longhand ou shorthand) sont interprétés à l'ouverture du panneau. Rollback = revert du commit.

## Open Questions

_Aucune pour l'instant._
