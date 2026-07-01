## Why

Lors de la construction de pages complexes, les éditeurs ont parfois besoin de **masquer temporairement** un bloc (et tout son sous-arbre) sans le supprimer — par exemple pour tester une mise en page, préparer une variante saisonnière ou conserver du contenu en réserve. Aujourd’hui, la seule option est de supprimer le nœud, ce qui est destructif et pénible à annuler.

Le navigateur de composants (onglet **Structure**) offre déjà une vue hiérarchique idéale pour piloter cette visibilité au niveau de chaque nœud.

## What Changes

- Ajouter une propriété de visibilité sur les nœuds (`hidden`, booléen optionnel, `false` par défaut) persistée dans le JSON de la page.
- Ajouter une **icône œil** sur chaque ligne du navigateur de composants (Structure) pour activer/désactiver la visibilité du nœud.
- Lorsqu’un nœud est désactivé, **lui et tous ses descendants** ne sont plus rendus sur la page en modes **prévisualisation**, **vue** et **rendu public**.
- En mode **édition**, les nœuds masqués restent visibles dans l’arbre Structure (avec icône œil barré) et apparaissent sur le canevas avec un style atténué (opacité réduite) pour permettre leur réactivation ; ils ne sont pas supprimés de la structure.
- Le nœud racine (`node-root`) ne peut pas être masqué.
- La visibilité est prise en compte à la sauvegarde et au rechargement de la page.

## Capabilities

### New Capabilities

_Aucune nouvelle capacité — extension du builder existant._

### Modified Capabilities

- `page-builder` : ajout d’un requirement « Visibilité des nœuds » (toggle dans le navigateur Structure, masquage en cascade des descendants, non-rendu en preview/vue/public, persistance) ; extension du requirement « Navigateur de composants en arbre » pour l’icône œil.

## Impact

- **Types** : `assets/editeur/types/NodeType.ts` — champ `hidden?: boolean`.
- **Explorer** : `assets/editeur/ManagerExplorer/components/ExplorerRow.tsx` (icône œil, toggle).
- **Rendu** : `assets/editeur/ManagerNode/components/NodeComponent.tsx`, `NodeChild.tsx`, `NodeCollection.tsx` — filtrage ou style atténué selon le mode.
- **Utilitaires** : helper de visibilité effective (ancêtre masqué → descendant masqué).
- **Specs** : delta `openspec/changes/add-node-visibility-toggle/specs/page-builder/spec.md`.
- **Hors scope** : suppression de nœuds, conditions dynamiques (affichage selon date/utilisateur), API backend.
