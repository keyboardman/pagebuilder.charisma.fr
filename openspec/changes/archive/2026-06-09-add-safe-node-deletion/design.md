## Context

Le builder stocke la page sous forme de dictionnaire `NodesType` (clé = id). Chaque nœud référence son parent via `parent.id`. La suppression passe par `nodeHelper.removeNode`, qui supprime déjà récursivement les descendants — mais sans confirmation utilisateur.

Les nœuds de type inconnu (`!(type in NodeRegistry)`) sont ignorés au rendu (`NodeComponent` retourne une vue vide) : ils ne peuvent pas être sélectionnés ni supprimés via l’UI, tandis que leurs enfants restent dans le JSON et deviennent difficiles à atteindre.

## Goals / Non-Goals

- Goals :
  - Éviter les suppressions accidentelles.
  - Garantir qu’aucun descendant ne survit à la suppression d’un ancêtre.
  - Nettoyer automatiquement le JSON au chargement (types obsolètes + orphelins).
- Non-Goals :
  - Migration backend / script SQL sur les pages existantes (le nettoyage se fait côté builder à l’ouverture).
  - Suppression du nœud racine `node-root`.
  - Journalisation persistante des nœuds épurtés (un `console.warn` en dev suffit).

## Decisions

- **Confirmation via `Dialog` existant** (Radix/shadcn) plutôt que `window.confirm`, cohérent avec les autres modales du builder.
- **Utilitaire `sanitizeNodes(nodes)`** dans `nodeHelper.ts`, appelé depuis `AppProvider.parseJsonToNodes` :
  1. Identifier les nœuds à retirer : type inconnu OU `parent.id` absent du dictionnaire (sauf racine).
  2. Pour chaque nœud retiré, supprimer récursivement tous les descendants (même algorithme que `removeNode`).
  3. Réindexer les `order` des frères par zone parente.
  4. Itérer jusqu’à stabilisation si des orphelins en cascade apparaissent.
- **Réutiliser `removeNode` / logique récursive partagée** pour éviter deux implémentations divergentes.
- **Comptage descendants** via parcours récursif pour le message de confirmation (« Ce bloc et N sous-blocs seront supprimés »).

## Risks / Trade-offs

- Épuration silencieuse au chargement → l’utilisateur ne voit pas explicitement ce qui a été retiré. Mitigation : log dev + sauvegarde ultérieure persiste le JSON nettoyé.
- Faux positif « orphelin » si le JSON est partiellement corrompu → on préfère retirer plutôt que conserver des données incohérentes.

## Migration Plan

1. Déployer l’utilitaire `sanitizeNodes` et l’appeler au parse.
2. Ajouter la modale de confirmation sur `onDelete`.
3. Ouvrir une page connue pour contenir des types obsolètes : vérifier que le JSON sauvegardé ne contient plus les entrées fantômes.

## Open Questions

- Faut-il un toast utilisateur lors de l’épuration au chargement ? (Hors scope initial ; à trancher si demandé.)
