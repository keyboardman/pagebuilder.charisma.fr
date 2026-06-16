# Change: Indications de valeurs thème dans les placeholders des settings

## Why

Les panneaux de style du builder (`Text2Settings`, `Background2Settings`, `Border2Settings`, `Spacing2Settings`, etc.) affichent des champs vides lorsqu’aucun style inline n’est défini sur le nœud. Dans ce cas, le rendu hérite des styles du thème (socle CSS + `node_overrides`), mais l’éditeur ne montre pas quelle valeur s’applique réellement. Les éditeurs doivent deviner ou inspecter le rendu pour connaître la valeur effective.

Afficher la valeur configurée dans le thème comme **placeholder** des champs vides améliore la lisibilité des réglages et aligne l’UX du builder sur celle du formulaire ThemeBuilder (qui utilise déjà des placeholders indicatifs).

## What Changes

- Exposer les `node_overrides` et les `vars` du thème de la page au builder (bootstrap `page-builder-data`), normalisés en cartes propriété CSS → valeur.
- Résoudre les références `var(--…)` des overrides à partir des `vars` du thème avant affichage (ex. `var(--color-primary)` → `#3b82f6`).
- Introduire un mécanisme de résolution des **hints thème** par sélecteur CSS de override (ex. `.ce-text`, `.ce-card-position-top .ce-card-title`) et propriété (ex. `font-size`, `background-color`).
- Étendre les composants `*2Settings` pour accepter un sélecteur de contexte thème optionnel et afficher la valeur thème correspondante en placeholder lorsque le champ du nœud est vide.
- Propager le sélecteur de contexte depuis les panneaux de settings des nœuds (y compris sous-parties : titre/texte/image de carte, label/input de formulaire, etc.).
- Conserver les placeholders génériques actuels (ex. `ex: 1.5rem`) uniquement lorsqu’aucune valeur thème n’est définie pour la propriété.

## Impact

- Affected specs: `page-builder`
- Affected code:
  - `templates/page/builder.html.twig`, `assets/editeur/PageBuilderEmbed.tsx`, `assets/editeur/services/providers/AppProvider.tsx`
  - `src/Controller/PageController.php` (passage config thème)
  - `assets/editeur/ManagerNode/Settings/*` (Text2Settings, Background2Settings, Border2Settings, Spacing2Settings, Size2Settings, Object2Settings)
  - Panneaux de settings des nœuds consommateurs (NodeText, NodeButton, NodeCard, NodeFormInput, etc.)
  - Utilitaires partagés (`stringCssToMap` / mapping propriétés CSS existants dans `ThemeFormComponent/utils.ts`)
