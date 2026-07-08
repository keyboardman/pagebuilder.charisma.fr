## 1. Extension backend du contrat ApiCard (counter)

- [x] 1.1 Ajouter `counter` optionnel au docblock et au format de retour de `ApiCardInterface::mapItem`
- [x] 1.2 Propager `counter` dans `BuilderApiCardItem`, `BuilderApiCardItemData` et `BuilderApiResourceFactory::mapItemData`
- [x] 1.3 Mettre à jour `backendApiAdapter.mapItem` et `ApiAdapter` TypeScript pour exposer `counter`
- [x] 1.4 Ajouter ou adapter un test PHPUnit vérifiant la sérialisation JSON d’un item avec et sans `counter`

## 2. Nœud NodeListApi (structure et registre)

- [x] 2.1 Créer `assets/editeur/ManagerNode/NodeListApi/index.ts` (type `node-list-api`, contenu `apiId`, `show`, styles par sous-partie, defaults)
- [x] 2.2 Enregistrer le nœud dans `NodeRegistry.ts` (catégorie `api`, bouton panneau)
- [x] 2.3 Créer les utilitaires de chargement collection (`fetchCollection` via `apiRegistry`, gestion mode `fixed`)

## 3. Vue et rendu NodeListApi

- [x] 3.1 Implémenter `View.tsx` : chargement collection, états loading/erreur/vide, liste d’items
- [x] 3.2 Rendu conditionnel image, titre, description, compteur selon `content.show` et données mappées
- [x] 3.3 Gérer le lien optionnel par item (wrapper cliquable aligné NodeCardApi)
- [x] 3.4 Appliquer les hooks CSS (`ce-list-api`, `ce-list-api-item`, sous-classes par champ)
- [x] 3.5 Réutiliser les composants partagés `ManagerNode/shared/card/` lorsque pertinent

## 4. Réglages NodeListApi

- [x] 4.1 Implémenter `Settings.tsx` : sélecteur d’API (type `list` / `AbstractApiCardList` uniquement)
- [x] 4.2 Ajouter les toggles `show.image`, `show.title`, `show.description`, `show.counter`
- [x] 4.3 Ajouter les panneaux de style par sous-partie (liste, item, image, titre, description, compteur)

## 5. Thème et documentation

- [x] 5.1 Ajouter les styles de base `node-list-api` au thème (ou feuille dédiée)
- [x] 5.2 Enregistrer le sélecteur thème dans `ThemeFormComponent/utils.ts` si applicable
- [x] 5.3 Documenter le champ `counter` et l’usage NodeListApi dans `docs/ajout-api-card.md`

## 6. Validation

- [x] 6.1 Vérifier manuellement : insertion nœud, sélection API, affichage collection avec toggles show
- [x] 6.2 Vérifier manuellement : item sans `counter` / sans `image` → pas de placeholder vide
- [x] 6.3 Vérifier manuellement : API indisponible → état dégradé, sauvegarde page OK
- [x] 6.4 Vérifier manuellement : persistance et rechargement après sauvegarde
