## 1. Implémentation

- [x] 1.1 Créer le nœud NodeFlex : `assets/editeur2/ManagerNode/NodeFlex/index.ts` (type `node-flex`, interface avec `attributes.options` pour les propriétés flex : direction, justify, align, gap, wrap)
- [x] 1.2 Créer `NodeFlex/View.tsx` : conteneur droppable (zone `main`) avec styles flex dérivés des options (display flex + direction, justifyContent, alignItems, gap, flexWrap)
- [x] 1.3 Créer `NodeFlex/Settings.tsx` : formulaire ou contrôles pour modifier direction, justify-content, align-items, gap, flex-wrap (réutiliser les patterns de NodeGrid/NodeContainer pour Base2Settings, Background2Settings, etc.)
- [x] 1.4 Enregistrer NodeFlex dans `NodeRegistry.ts` et s’assurer qu’il apparaît dans le panneau des composants (catégorie `container`)
- [x] 1.5 Vérifier que la sérialisation HTML du builder inclut les styles ou classes nécessaires pour le rendu Flex en preview / export

## 2. Validation

- [x] 2.1 Test manuel : ajouter un NodeFlex, y déposer des blocs, modifier les options flex et vérifier l’alignement en édition et après sauvegarde
- [x] 2.2 Vérifier qu’aucun test existant ne casse (builder, nœuds)
