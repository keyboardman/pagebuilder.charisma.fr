## 1. Refactor éditeur

- [x] 1.1 Extraire le shell Lexical (config, toolbar, plugins, `OnChangePlugin`) depuis `NodeRichText/Edit.tsx` vers un composant dédié (ex. `RichTextEditorShell.tsx`) acceptant `html`, `onHtmlChange`, `namespace` / `nodeId`.
- [x] 1.2 Créer `NodeRichTextEditorModal.tsx` (ou équivalent) utilisant `Dialog` / `DialogContent` / `DialogTitle` avec largeur confortable (`max-w-4xl`, hauteur max ~85vh, zone éditable scrollable).

## 2. Intégration Edit

- [x] 2.1 Dans `Edit.tsx`, afficher l’aperçu HTML (rendu aligné sur `View`) dans le canevas, y compris lorsque le nœud est sélectionné.
- [x] 2.2 Ouvrir la modale automatiquement quand le nœud devient sélectionné ; propager les changements HTML vers `onChange` comme aujourd’hui.
- [x] 2.3 Gérer la fermeture de la modale (overlay, croix, Échap) sans perdre le contenu déjà enregistré sur le nœud.
- [x] 2.4 (Optionnel) Permettre de rouvrir la modale depuis l’aperçu si le nœud reste sélectionné après fermeture (clic ou bouton discret).

## 3. Styles et UX

- [x] 3.1 Ajuster `node-rich-text.css` si nécessaire pour la modale (toolbar, hauteur `ContentEditable`, scroll).
- [x] 3.2 Vérifier le focus clavier et l’accessibilité (`DialogTitle`, pas de piège de focus).

## 4. Validation

- [x] 4.1 Tester dans une colonne étroite : sélection → modale large → mise en forme (gras, liste, lien) → fermeture → aperçu à jour dans le canevas.
- [x] 4.2 Tester sauvegarde / rechargement de page : contenu riche inchangé.
- [x] 4.3 Vérifier qu’aucune régression sur `View.tsx` et le rendu public de la page.
