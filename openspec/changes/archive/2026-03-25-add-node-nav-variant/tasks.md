# add-node-nav-variant - tasks

## 1. Spécification et validation

- [x] 1.1 Valider la proposition et les deltas (`openspec validate add-node-nav-variant --strict`)

## 2. NodeNav (frontend)

- [x] 2.1 Étendre `NodeNavOptions` avec `variant` (navbar|liste) et valeur par défaut `navbar`
- [x] 2.2 Ajouter le champ « Variante » dans `assets/editeur/ManagerNode/NodeNav/Settings.tsx`
- [x] 2.3 Ajouter les hooks DOM dans `assets/editeur/ManagerNode/NodeNav/View.tsx` (`data-ce-variant` + `ce-menu--{variant}`)
- [x] 2.4 Vérifier la persistance du champ `variant` lors de la sauvegarde/recharge

## 3. Tests manuels

- [x] 3.1 Cas `navbar` : vérifier `data-ce-variant="navbar"` et la classe `ce-menu--navbar`
- [x] 3.2 Cas `liste` : vérifier `data-ce-variant="liste"` et la classe `ce-menu--liste`
- [x] 3.3 Vérifier le rendu final (preview + export)
