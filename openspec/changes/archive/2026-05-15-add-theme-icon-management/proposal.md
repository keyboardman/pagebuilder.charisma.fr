# Change: Ajouter la gestion des icones de theme

## Why
La personnalisation des themes a besoin d'un catalogue d'icones reutilisables, configure depuis l'interface d'administration. Aujourd'hui, il n'existe pas de modele explicite pour definir et maintenir ces icones (nom metier, classe CSS et source SVG).

## What Changes
- Ajout d'une gestion des icones disponibles dans l'administration du theme.
- Ajout d'un formulaire de configuration d'icone avec les champs `nom`, `classe` et `lien`.
- Definition du rendu CSS attendu pour les icones basees sur `mask`/`-webkit-mask` (approche `currentColor`).
- Definition des operations de gestion minimales: ajout, edition, suppression.

## Impact
- Affected specs: `theme-generator`
- Affected code: formulaire de gestion du theme, persistance de configuration du theme (`theme.yaml` ou structure equivalente), generation CSS du theme
