## 1. Audit et alignement rendu

- [x] 1.1 Comparer `View/items/article/DefaultItem.tsx` avec `NodeCardApi/View.tsx` (classes, show, styles, ratio/position/align) et corriger les écarts de parité
- [x] 1.2 Vérifier que `show.description` pilote bien `ViewText` et que `show.image|title|labels` sont respectés comme côté Card API

## 2. Settings card collection

- [x] 2.1 Créer `Settings/CardStylePanel.tsx` (ou équivalent) reprenant les contrôles de `NodeCardApi/Settings/CardSettings` branchés sur `NodeCollectionType` (`container.position|align|ratio`, gap, styles `card`, toggles show)
- [x] 2.2 Ajouter les sous-panneaux Container / Image / Title / Text / Labels (miroir NodeCardApi) écrivant `content.container|image|title|text|labels`
- [x] 2.3 Brancher le panneau dans `Settings.tsx` : visible uniquement si `collectionType=article` et `view=default` ; conserver `StyleTab` simplifié pour les autres cas
- [x] 2.4 Masquer counter / like dans l’UI Style pour `view=default` ; les garder pour `view=article`

## 3. Mapping show et defaults

- [x] 3.1 Faire écrire le switch « Texte » sur `content.show.description` (pas de nouveau champ `show.text`)
- [x] 3.2 Confirmer les defaults `container` / `card` / styles dans `index.ts` alignés NodeCardApi

## 4. Tests et doc

- [x] 4.1 Étendre `View.test.tsx` : position/ratio/classes `.ce-card*`, toggle `show.description=false`
- [x] 4.2 Mettre à jour `View/README.md` pour documenter les options card de la vue article default
