## Context

- Le thème stocke des overrides par **sélecteur CSS** dans `Theme.config.node_overrides` (format objet `{ propriété: valeur }` ou chaîne CSS legacy convertie côté ThemeForm).
- Les panneaux `*2Settings` manipulent des `React.CSSProperties` (camelCase) sur le nœud ; un champ vide signifie « pas d’override local ».
- Le builder charge déjà le CSS généré du thème (`app_theme_css`) mais n’a pas accès à la configuration structurée des overrides.
- Les nœuds complexes (NodeCard, NodeFormInput, NodeVideoHome, etc.) appliquent des styles sur plusieurs sous-éléments, chacun mappé à un sélecteur d’override distinct dans ThemeBuilder.

## Goals / Non-Goals

**Goals**
- Afficher en placeholder la valeur thème configurée pour chaque propriété éditée, quand le champ nœud est vide.
- Résoudre les `var(--…)` via les `vars` du thème pour afficher la valeur concrète (ex. `#3b82f6` plutôt que `var(--color-primary)`).
- Réutiliser le mapping sélecteur ↔ classes `ce-*` déjà documenté dans ThemeBuilder.
- Centraliser la conversion kebab-case ↔ camelCase pour éviter la duplication dans chaque `*2Settings`.

**Non-Goals**
- Résoudre les valeurs via le navigateur (`getComputedStyle`) ou des variables absentes du thème.
- Modifier la persistance des styles nœud ni le pipeline `ThemeCssGenerator`.
- Couvrir les champs hors `*2Settings` (ex. placeholder HTML des champs NodeFormInput).

## Decisions

### 1. Sources des hints : `node_overrides` + `vars` du thème courant

**Décision** : lire `page.theme.config.node_overrides` (normalisé en `Record<selector, Record<cssProperty, value>>`) et `page.theme.config.vars` (`Record<--nom-variable, valeur>`).

**Alternatives**
- *Computed style sur le canevas* : reflète le rendu réel mais dépend du DOM, du breakpoint et du timing de rendu ; rejeté.
- *Fusion socle CSS de base + overrides* : plus précis mais nécessite d’embarquer ou parser le socle ; reporté si besoin ultérieur.

### 2. Propagation du contexte via prop `themeOverrideSelector`

**Décision** : ajouter une prop optionnelle `themeOverrideSelector?: string` aux `*2Settings`. Chaque panneau parent (ex. `NodeCard/TitleSettings`) fournit le sélecteur correspondant (ex. `.ce-card-position-top .ce-card-title`).

**Alternatives**
- *Context React global avec type de nœud* : insuffisant pour les sous-parties (carte, formulaire).
- *Déduction automatique depuis le type de nœud seul* : impossible pour NodeCard (position + partie).

### 3. Helper partagé `getThemeStylePlaceholder`

**Décision** : créer un helper (ex. `assets/editeur/services/themeStyleHints.ts`) qui :
- lit les overrides et les `vars` depuis `AppContext`
- prend `(selector, cssPropertyKebab, fallbackPlaceholder?)`
- récupère la valeur brute de l’override ; si elle contient `var(--…)`, la résout récursivement via la table `vars` du thème
- retourne la valeur résolue si non vide, sinon le fallback statique actuel

### 4. Format d’affichage du placeholder

**Décision** : afficher uniquement la **valeur résolue**, sans préfixe ni libellé :
- valeur littérale inchangée (ex. `1.25rem`, `#ff0000`)
- `var(--color-primary)` avec `--color-primary: #3b82f6` dans `vars` → placeholder `#3b82f6`
- si la variable est absente ou non résolvable → conserver le placeholder générique du champ

## Risks / Trade-offs

- **Sélecteurs manquants sur certains nœuds** → certains champs garderont le placeholder générique ; documenter le mapping dans les tasks et compléter progressivement.
- **Données legacy (override en chaîne CSS)** → normaliser avec `stringCssToMap` au bootstrap pour compatibilité.
- **Variables CSS imbriquées ou absentes** → résolution récursive limitée aux `vars` du thème ; si échec, fallback vers le placeholder générique.
- **Taille du payload builder** → `node_overrides` + `vars` restent bornés ; impact négligeable.

## Migration Plan

1. Ajouter `themeNodeOverrides` et `themeVars` au bootstrap sans changer le comportement existant.
2. Brancher un premier panneau pilote (ex. `Text2Settings` sur `NodeText`).
3. Étendre aux autres `*2Settings` et nœuds complexes.
4. Aucune migration de données ; rétrocompatible (prop optionnelle, fallback inchangé).

## Open Questions

- Les nœuds sans entrée ThemeBuilder explicite (ex. `node-text-icon`) : mapper vers le sélecteur le plus proche (`.ce-text-icon`, `.ce-text`) ou laisser sans hint ?
