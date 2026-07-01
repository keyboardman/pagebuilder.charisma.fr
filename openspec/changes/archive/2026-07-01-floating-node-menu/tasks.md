## 1. Restructuration du wrapper d'édition

- [x] 1.1 Dans `NodeComponent.tsx`, ajouter `relative` (et `overflow-visible` si nécessaire) sur le conteneur `NodeBuilderComponent`
- [x] 1.2 Déplacer le rendu de `NodeMenu` pour qu'il soit un overlay sibling du contenu, sans réserver d'espace dans le flux (contenu seul dans le div enfant)
- [x] 1.3 Uniformiser les classes du wrapper (`rounded-sm`, retirer les styles conditionnels liés à la barre d'en-tête)

## 2. Styles du menu flottant

- [x] 2.1 Dans `NodeMenu.tsx`, bandeau compact flottant au-dessus du nœud (`absolute bottom-full left-0 mb-0.5 z-20 w-max … rounded-md border shadow-md bg-accent`)
- [x] 2.2 Conserver `handleRef` sur la poignée grip et les actions existantes (duplicate, delete, rich text)
- [x] 2.3 Supprimer la variable CSS inutilisée `--node-menu-height` de `builder.css`

## 3. Vérification NodeFlex et drag-and-drop

- [x] 3.1 Tester un enfant de `NodeFlex` sélectionné : pas de débordement attribuable au menu, alignement cohérent avec la prévisualisation
- [x] 3.2 Tester le drag-and-drop via la poignée grip : déplacement fluide vers dropzones intermédiaires et finales
- [x] 3.3 Tester la sélection par clic, les actions du menu (dupliquer, supprimer) et l'absence de régression en prévisualisation
