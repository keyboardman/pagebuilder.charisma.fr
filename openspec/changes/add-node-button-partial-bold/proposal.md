# Change : gras partiel sur le libellé NodeButton

## Why

Le libellé de **NodeButton** est aujourd'hui une chaîne de texte brut. L'édition inline via `contentEditable` ne conserve pas le formatage au blur (`textContent` uniquement). Les éditeurs ont besoin de mettre en **gras une partie seulement** du libellé (ex. « **Offre** limitée ») sans ouvrir un éditeur riche complet comme **NodeRichText**, ni appliquer le gras à tout le bouton via **Text2Settings**.

## What Changes

- Le champ `content.label` de **NodeButton** accepte un libellé avec balises inline limitées (`<strong>`, `<b>`) pour le gras partiel.
- L'édition inline du libellé (canevas) expose une action **Gras** (raccourci clavier **Ctrl/Cmd+B**) sur la sélection courante.
- Le rendu édition, preview et export interprète le libellé formaté ; les libellés texte brut existants restent valides.
- Sanitisation à l'enregistrement : seules les balises de gras autorisées sont conservées.
- Ajustement CSS pour rendre le contraste gras / normal visible malgré le `font-weight: bold` par défaut de `.ce-button`.

## Impact

- Affected specs: `page-builder`
- Affected code: `assets/editeur/ManagerNode/NodeButton/` (`TagNameEditable.tsx`, `Edit.tsx`, `View.tsx`, éventuel utilitaire de sanitisation), `assets/editeur/assets/themes/base/css/node-button.css`
