# Change: Sécuriser la génération CSS via sanitation des valeurs

## Why
La génération CSS actuelle peut être cassée par des caractères de contrôle non attendus (ex. `;`) injectés dans la configuration de thème.
Une sanitation explicite est nécessaire pour réduire les risques de CSS invalide et limiter les vecteurs d’injection dans les propriétés générées.

## What Changes
- Ajout d’une règle de sanitation des valeurs textuelles issues de la configuration avant interpolation dans le CSS.
- Restriction des caractères autorisés à une whitelist compatible avec les fonctions CSS usuelles (ex. `var(--color-red)`, `url("https://www.google.com")`) : alphanumériques, parenthèses, quotes simples/doubles, guillemets, tiret, underscore, deux-points, slash, point, virgule et espaces.
- Définition d’un comportement déterministe pour les caractères non autorisés (suppression) avant génération du CSS final.
- Ajout de tests unitaires ciblant les cas valides, invalides et les cas limites de nettoyage.

## Impact
- Affected specs: `theme-generator`
- Affected code: `src/Service/ThemeCssGenerator.php` et tests associés
