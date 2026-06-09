## Context

Le builder expose un navigateur de composants en arbre (onglet **Structure** de la sidebar gauche). L’implémentation actuelle est répartie entre :

- `assets/editeur/app/layout/Explorer.tsx` — composant principal et sous-composants inline
- `assets/editeur/app/layout/ExplorerDropZone.tsx` — zones de dépôt DnD dans l’arbre
- `assets/editeur/utils/explorerTree.ts` — construction de l’arbre, ancêtres, regroupement par zone
- `assets/editeur/utils/scrollCanvasToNode.ts` — défilement du canevas vers le nœud sélectionné

`ManagerNode` établit déjà le précédent : un dossier par domaine fonctionnel (`PanelButtons/`, `components/`, types de nœuds, etc.).

## Goals / Non-Goals

- Goals :
  - Tout le code **exclusivement** lié à l’Explorer vit sous `ManagerExplorer/`.
  - Point d’entrée public unique (`index.ts` exportant le composant `Explorer`).
  - Imports mis à jour ; build et comportement inchangés.
- Non-Goals :
  - Déplacer `nodeLabel.ts` (utilisé aussi par `ManagerNode`).
  - Déplacer `nodeMove.ts` (logique DnD générale, consommée par `useDnd`).
  - Modifier le rendu, les styles ou les scénarios utilisateur du navigateur.
  - Extraire obligatoirement chaque sous-composant si le fichier reste lisible après le déplacement.

## Decisions

- **Arborescence cible** :

```
assets/editeur/ManagerExplorer/
├── index.ts                 # export public : Explorer
├── Explorer.tsx             # orchestration (état expanded, sync selected)
├── components/
│   ├── ExplorerDropZone.tsx
│   ├── ExplorerRow.tsx      # si extrait de Explorer.tsx
│   └── ExplorerTreeNode.tsx
└── utils/
    ├── explorerTree.ts
    └── scrollCanvasToNode.ts
```

- **`nodeLabel.ts`** : reste dans `assets/editeur/utils/` ; `explorerTree.ts` l’importe depuis cet emplacement (ré-export optionnel depuis `ManagerExplorer` pour compatibilité interne uniquement, pas d’obligation de re-export public).
- **CSS** : les classes `.explorer-tree` / `.explorer-tree__inner` restent dans `builder.css` pour l’instant (pas de changement visuel) ; une extraction ultérieure vers `ManagerExplorer/explorer.css` est possible hors périmètre.
- **Import consommateur** : `Builder.tsx` importe depuis `@/editeur/ManagerExplorer` (ou chemin relatif équivalent), plus depuis `../layout/Explorer`.

## Risks / Trade-offs

- **Chemins d’import cassés** → mitigation : recherche globale `Explorer`, `explorerTree`, `scrollCanvasToNode` avant merge ; build Encore.
- **Fichier Explorer.tsx volumineux** → mitigation : extraction optionnelle de `ExplorerRow` / `ExplorerTreeNode` dans `components/` lors du déplacement.

## Migration Plan

1. Créer `ManagerExplorer/` et déplacer les fichiers (git mv).
2. Ajuster les imports relatifs internes au module.
3. Mettre à jour `Builder.tsx` et toute autre référence.
4. Supprimer les fichiers sources vides / obsolètes sous `app/layout/`.
5. Vérifier manuellement : onglet Structure, sélection arbre ↔ canevas, DnD dans l’arbre.

## Open Questions

- Aucune pour l’instant.
