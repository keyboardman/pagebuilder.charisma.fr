## Change: Utiliser CodeMirror pour l'edition du CSS personnalise du theme

## Why
Le champ `customCss` de `ThemeFormComponent` est actuellement un simple `textarea`, ce qui rend l'edition de CSS verbeuse (pas de coloration, indentation, ou confort de navigation). Un editeur specialise pour le CSS ameliore la productivite et reduit les erreurs de saisie dans les surcharges de theme.

## What Changes
- Integrer CodeMirror dans `ThemeFormComponent` pour editer `config[custom_css]` avec un mode CSS.
- Remplacer l'UI du `textarea` par un composant CodeMirror tout en conservant la meme valeur serialisee envoyee au backend.
- Definir un fallback de rendu en `textarea` lorsque l'editeur ne peut pas etre initialise (erreur chargement/JS desactive), afin de garder une edition fonctionnelle.
- Preserver la compatibilite avec la sanitation deja appliquee lors de la generation CSS.

## Impact
- Affected specs: `theme-generator/spec.md` (extension du comportement de l'edition de configuration de theme pour `custom_css`).
- Affected code: `assets/components/ThemeFormComponent/ThemeFormComponent.tsx`, eventuels nouveaux composants React utilitaires lies a CodeMirror, configuration front (`package.json`/bundling) et style de l'editeur.
