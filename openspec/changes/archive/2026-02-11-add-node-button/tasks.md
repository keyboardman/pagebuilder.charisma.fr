## 1. Implémentation

- [x] 1.1 Créer le nœud NodeButton : `assets/editeur2/ManagerNode/NodeButton/index.ts` (type `node-button`, interface avec `content` : `buttonType` = button | submit | link, `label`, et si link `href`, `target`)
- [x] 1.2 Créer `NodeButton/View.tsx` : rendu `<button>`, `<button type="submit">` ou `<a>` selon le type, avec libellé et styles (attributes.style) ; pour link, utiliser href et target depuis content
- [x] 1.3 Créer `NodeButton/Edit.tsx` : même rendu avec édition du libellé en mode sélection (pattern proche NodeText)
- [x] 1.4 Créer `NodeButton/Settings.tsx` : Base2Settings, Background2Settings, Border2Settings, Text2Settings ; champ type (button / submit / link) ; si type link, champs href et target
- [x] 1.5 Enregistrer NodeButton dans `NodeRegistry.ts` et s’assurer qu’il apparaît dans le panneau des composants (catégorie `content`)
- [x] 1.6 Vérifier que la sérialisation HTML du builder inclut le bon élément et les attributs (type, href, target) pour preview / export

## 2. Validation

- [x] 2.1 Test manuel : ajouter un NodeButton en type button, submit et link ; configurer href/target pour un link ; modifier fond, bordure, texte ; sauvegarder et vérifier le rendu
- [x] 2.2 Vérifier qu’aucun test existant ne casse (builder, nœuds)
