# Change : édition NodeRichText en modale

## Why

L’éditeur WYSIWYG de **NodeRichText** (`node-rich-text`) s’affiche aujourd’hui en ligne dans le canevas du builder dès que le nœud est sélectionné. Dans des colonnes étroites ou des grilles serrées, la zone d’édition est trop petite pour travailler confortablement (barre d’outils, listes, liens).

## What Changes

- Lors de la **sélection** d’un `NodeRichText`, le builder ouvre une **fenêtre modale** dédiée contenant l’éditeur Lexical complet (barre d’outils + zone de saisie).
- Dans le canevas, le nœud sélectionné affiche un **aperçu lecture seule** du contenu (même rendu que hors édition), sans éditeur inline contraint par la largeur du bloc.
- Fermeture de la modale (bouton, overlay, Échap) : le contenu est **conservé** dans le nœud ; le nœud peut rester sélectionné pour accéder aux paramètres.
- Les capacités de mise en forme et la persistance existantes (**Requirement: Mise en forme riche de base**, **Requirement: Persistance du contenu riche**) restent inchangées ; seul le **conteneur** d’édition change.

## Impact

- Specs : `page-builder` (exigence **Nœud texte riche (NodeRichText)** modifiée ; précision sur la modale).
- Code : `assets/editeur/ManagerNode/NodeRichText/Edit.tsx` (refactor éditeur → modale), éventuel composant partagé `RichTextEditorShell.tsx`, réutilisation de `Dialog` (`assets/editeur/components/ui/dialog.tsx`), styles `node-rich-text.css` si besoin d’ajustement hauteur modale.
