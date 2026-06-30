## Why

Le panneau `Spacing2Settings` du builder expose actuellement margin et padding uniquement via quatre champs distincts (top, right, bottom, left). Pour appliquer la même valeur sur les quatre côtés — cas très fréquent sur les conteneurs — l'éditeur doit saisir quatre fois la même valeur, ce qui est pénible et source d'erreurs. Ce besoin est déjà identifié dans le backlog produit (TODO #9).

## What Changes

- Ajouter un **mode unifié** pour margin et padding dans `Spacing2Settings` : un seul champ texte applique la valeur aux quatre côtés en une fois.
- Conserver le **mode par côté** existant (top, right, bottom, left) pour les réglages asymétriques.
- Permettre de **basculer** entre les deux modes pour chaque propriété (margin et padding indépendamment).
- Préserver le comportement des **placeholders thème** sur les champs vides, y compris en mode unifié.
- Aucun changement de modèle de données côté API ou persistance : les styles restent des propriétés CSS inline React (`margin`/`padding` shorthand ou longhand).

## Capabilities

### New Capabilities

_Aucune nouvelle capability._

### Modified Capabilities

- `page-builder` : enrichir les exigences de `Spacing2Settings` pour couvrir le mode unifié et le basculement avec le mode par côté.

## Impact

- **Frontend** : `assets/editeur/ManagerNode/Settings/Spacing2Settings.tsx` (composant principal) et éventuellement un petit helper partagé pour la détection/synchronisation des valeurs.
- **Spec** : delta `openspec/changes/spacing-unified-field/specs/page-builder/spec.md`.
- **Portée** : tous les nœuds qui utilisent déjà `Spacing2Settings` (containers, cards, text, forms, hero, grid, flex, etc.) bénéficient automatiquement du changement sans modification individuelle.
- **Rétrocompatibilité** : les styles existants avec valeurs par côté continuent de s'afficher correctement en mode par côté ; les valeurs uniformes peuvent être proposées en mode unifié.
