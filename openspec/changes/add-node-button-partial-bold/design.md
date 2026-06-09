## Context

- **NodeButton** stocke `content.label` comme `string` et l'édite via `TagNameEditable` (`contentEditable` + `dangerouslySetInnerHTML` à l'affichage, mais `textContent` au blur).
- **Text2Settings** applique `font-weight` sur l'élément bouton entier ; ce n'est pas du gras partiel.
- **NodeRichText** offre un éditeur Lexical complet — disproportionné pour un simple gras sur un bouton.
- **InputEditor** (`components/form/InputEditor.tsx`) persiste déjà `innerHTML` au blur ; pattern réutilisable.

## Goals / Non-Goals

- Goals :
  - Gras partiel sur une sélection du libellé NodeButton, en édition inline.
  - Persistance et rendu identiques en preview / page publique.
  - Rétrocompatibilité des libellés texte brut existants.
- Non-Goals :
  - Italique, souligné, liens ou autres formats inline sur NodeButton.
  - Éditeur modale ou barre d'outils complète.
  - Étendre le formatage partiel aux autres nœuds (NodeText, NodeNavItem, etc.).

## Decisions

- **Stockage** : conserver `content.label` en `string`, avec HTML inline minimal (`<strong>` / `<b>`). Pas de nouveau champ ni de format JSON structuré.
- **Édition** : `document.execCommand('bold')` (ou équivalent `Selection`/`Range`) sur la zone `contentEditable` du libellé ; bouton « Gras » affiché lorsque le libellé a le focus (barre légère au-dessus ou dans le panneau settings, selon l'UX la plus simple).
- **Persistance au blur** : remplacer `textContent` par `innerHTML` puis passer par une fonction `sanitizeButtonLabelHtml` qui ne garde que `strong` et `b` (normalisation vers `<strong>`).
- **Rendu View** : `dangerouslySetInnerHTML` sur le libellé (comme l'éditeur), après la même sanitisation à la lecture si nécessaire.
- **CSS** : `.ce-button` a `font-weight: bold` par défaut. Pour un contraste visible, les segments en gras partiel utilisent `font-weight: 900` (ou `bolder`) ; le texte non balisé hérite du poids du bouton. Alternative documentée : passer `.ce-button` en `font-weight: normal` et laisser `<strong>` porter le gras — rejetée car elle change l'apparence des boutons existants.
- **Collage** : conserver le comportement actuel (texte brut uniquement) pour éviter l'injection de HTML non contrôlé.

## Risks / Trade-offs

- **HTML dans un champ string** → Mitigation : whitelist stricte à l'enregistrement ; pas d'autres balises.
- **Contraste gras faible** si le bouton est déjà en gras → Mitigation : règle CSS dédiée sur `strong`/`b` à l'intérieur de `.ce-button`.
- **`execCommand` déprécié** → Acceptable pour un seul format inline ; migration vers `Selection` API si besoin ultérieur.

## Migration Plan

- Aucune migration de données : les libellés sans balises HTML restent inchangés.
- Déploiement : mise à jour front uniquement.

## Open Questions

- Aucune pour l'instant ; le périmètre est limité au gras partiel.
