## 1. Neutralisation globale des liens en édition

- [x] 1.1 Ajouter dans `builder.css` des règles `[data-mode=edit] .admin-layout__main a[href] { pointer-events: none; }` (et variantes `area[href]` si utilisées).
- [x] 1.2 Vérifier que le chrome du builder (header, sidebars, NodeMenu) n’est pas affecté par ces sélecteurs.

## 2. Lecteurs embarqués (NodeYoutube)

- [x] 2.1 Neutraliser les clics sur l’iframe YouTube en mode édition (CSS sur `.ce-youtube-player iframe` ou overlay / prop dans `NodeYoutube/View.tsx`).
- [x] 2.2 Confirmer qu’un clic sur un `NodeYoutube` sélectionne le nœud via le conteneur de bloc.

## 3. Audit et cohérence

- [x] 3.1 Parcourir les `View.tsx` avec liens (`NodeNavItem`, `NodeNav` burger, `NodeNavApi`, `NodeCard/HasLink`, `NodeSlideshow`, `NodeTextIcon`, `NodeIcone`, `NodeButton`) et valider le comportement avec la règle CSS globale.
- [x] 3.2 Identifier les autres iframes interactives du canevas (`NodeVideoHome`, etc.) et appliquer la même neutralisation si elles bloquent la sélection.

## 4. Validation

- [x] 4.1 QA manuelle : en mode édition, cliquer sur un lien de menu, une slide avec lien, une carte, un RichText avec lien — aucune navigation ; sélection du nœud OK.
- [x] 4.2 QA manuelle : en mode prévisualisation, les mêmes liens naviguent normalement.
- [x] 4.3 QA manuelle : `NodeYoutube` sélectionnable en édition ; lecteur utilisable en prévisualisation.
