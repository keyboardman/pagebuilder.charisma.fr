## Why

En mode dynamique image, NodeCollection permet déjà de sélectionner des médias et le rendu sait envelopper une image dans un lien quand `link` est renseigné — mais le panneau Source n’offre aucun champ pour saisir ce lien. Les éditeurs ne peuvent donc pas rendre les images de la liste cliquables sans éditer le JSON à la main.

## What Changes

- Ajouter dans les réglages Source (`collectionType=image`, `mode=dynamic`) un champ **Lien (URL)** éditable par image sélectionnée
- Persister la valeur dans `dynamicItems[].link` (champ déjà prévu sur `CollectionImageMediaEntry`)
- Conserver le comportement de rendu existant : si `link` est non vide, l’image est cliquable ; sinon affichage inchangé
- Pas de changement d’API backend ni de schéma de mode fixe

## Capabilities

### New Capabilities

<!-- aucune — extension d’une capacité existante -->

### Modified Capabilities

- `node-collection`: les entrées image dynamiques SHALL pouvoir être configurées avec un lien optionnel depuis le panneau de réglages, et ce lien SHALL être rendu cliquable dans la liste (et les autres dispositions)

## Impact

- UI : `CollectionImageDynamicItemsSettings.tsx` (édition du lien par item)
- Données : `CollectionImageMediaEntry.link` déjà typé ; mapping `mapMediaEntriesToCollectionImageItems` déjà en place
- Rendu : `View/items/image/DefaultItem.tsx` déjà conditional sur `item.link` — à vérifier / tests
- Specs : delta `openspec/specs/node-collection`
