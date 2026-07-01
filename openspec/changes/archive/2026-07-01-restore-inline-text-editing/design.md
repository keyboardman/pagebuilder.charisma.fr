## Context

Le changement `update-builder-edit-inline-text-on-selection` a restauré l'édition inline dans les composants `View` pour `NodeText`, `NodeButton`, `NodeTextIcon` et `NodeNavItem`, en s'appuyant sur `InputEditor` et `TagNameEditable`. **`NodeHeader` n'a jamais reçu cette bascule** : son `View.tsx` affiche le texte en contenu texte brut (`children`) au lieu d'interpréter `content.html`, et ne propose aucune zone `contentEditable` à la sélection.

`NodeText` utilise déjà `InputEditor` à la sélection, mais l'expérience n'est pas alignée avec `NodeNavItem` (référence « menu item ») : focus après sélection, retours à la ligne non couverts par les specs, et rendu `NodeHeader` incohérent avec le champ HTML persisté.

Les composants `InputEditor` et `TagNameEditable` existent ; `NodeBuilderProvider` expose `isSelected()` et `onChange()` via `useOptionalNodeBuilderContext()`.

## Goals / Non-Goals

**Goals:**

- Restaurer l'édition inline sur le canevas pour **`NodeText`** et **`NodeHeader`** lorsque le nœud est sélectionné en mode édition.
- Aligner le comportement sur **`NodeNavItem`** : même balise, classes, styles ; propagation des clics stoppée sur la zone éditable ; persistance au **blur**.
- Permettre les **retours à la ligne** (touche Entrée) dans `NodeText` et `NodeHeader` ; persister le HTML (`<br>` ou blocs équivalents) et l'afficher à l'identique hors édition.
- Corriger le rendu aperçu de `NodeHeader` pour utiliser `dangerouslySetInnerHTML` sur `content.html`.

**Non-Goals:**

- Édition inline pour `NodeRichText` (modale uniquement).
- Gras partiel ou formatage riche au-delà des sauts de ligne (`NodeButton` conserve `TagNameEditable` / gras partiel).
- Édition inline hors sélection ou en mode prévisualisation.
- Modification du modèle de données backend (le champ `content.html` existant suffit).

## Decisions

- **`NodeHeader/View.tsx` — bascule conditionnelle comme `NodeText`** : lorsque `mode === edit` et `builder.isSelected()`, monter `InputEditor` avec `tagName` = `content.tag` (h1–h6), `value` = `content.html`, classes `ce-header` / `ce-header-h*`, et `onBlur` → `builder.onChange`. Hors sélection, rendu via `React.createElement(tag, { dangerouslySetInnerHTML: { __html: html } })`, identique à `NodeText/View.tsx`.

- **`NodeText/View.tsx` — vérification, pas de refonte** : conserver `InputEditor` ; corriger uniquement si un bug empêche l'activation (contexte builder, focus). Pas de retour aux composants `Edit.tsx` sur le canevas.

- **Retours à la ligne via `InputEditor`** : ne pas bloquer la touche **Entrée** (`preventDefault`) dans `InputEditor` — comportement natif `contentEditable`. Au **blur**, persister `innerHTML` tel quel (comme aujourd'hui pour `NodeText`). Normaliser optionnellement les `<div>` insérés par certains navigateurs en `<br>` à la persistance si nécessaire pour un rendu cohérent à l'export.

- **Référence `NodeNavItem`, pas `TagNameEditable` pour les titres** : `TagNameEditable` force une ligne unique (espaces → NBSP, `textContent` au blur). `NodeText` et `NodeHeader` nécessitent du HTML multiligne → **`InputEditor`** uniquement.

- **Focus après sélection (option UX)** : si le premier clic sélectionne le nœud sans placer le curseur, un second clic sur le texte SHALL suffire (comportement actuel de `NodeNavItem`). Pas d'auto-focus agressif au changement de sélection pour éviter de voler le focus depuis NodeSettings.

- **Interaction canevas** : conserver `stopPropagation` sur `mousedown` / `click` dans `InputEditor` pour ne pas désélectionner le nœud ni déclencher le `onClick` du wrapper `NodeBuilderComponent`.

## Risks / Trade-offs

- **[HTML arbitraire via collage]** → `InputEditor` intercepte déjà le collage en texte brut ; conserver ce comportement pour limiter les balises indésirables.
- **[Sémantique h1–h6 avec sauts de ligne]** → les titres multi-lignes sont atypiques pour le SEO mais demandés explicitement ; pas de restriction supplémentaire côté builder.
- **[Divergence navigateur sur Entrée]** → tests manuels Chrome/Firefox ; normalisation légère au blur si `<div><br></div>` apparaît.

## Migration Plan

1. Mettre à jour `NodeHeader/View.tsx` (rendu HTML + branche inline).
2. Ajuster `InputEditor` si besoin (Entrée, normalisation blur).
3. Vérifier `NodeText/View.tsx` en conditions réelles (sélection, blur, NodeSettings).
4. Rollback : retirer la branche inline de `NodeHeader` et restaurer le rendu texte brut (comportement actuel).

## Open Questions

_Aucune — le périmètre est couvert par la proposition._
