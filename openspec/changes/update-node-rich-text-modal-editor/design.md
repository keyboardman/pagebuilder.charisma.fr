## Context

`NodeRichText/Edit.tsx` monte aujourd’hui `LexicalComposer`, la toolbar et `ContentEditable` directement dans le DOM du nœud lorsque `isSelected()` est vrai. La largeur utile est celle du parent dans la page (souvent une fraction de grille).

Le projet utilise déjà des modales Radix/shadcn (`Dialog`, `DialogContent`) pour le file manager, les APIs, etc.

## Goals / Non-Goals

- Goals : zone d’édition large et stable ; conserver toutes les actions Lexical actuelles ; persistance inchangée (`content.html`).
- Non-Goals : modifier le format de données, ajouter de nouvelles actions de mise en forme, changer le rendu public (`View.tsx`) hors builder.

## Decisions

- **Ouverture** : à la sélection du nœud (`isSelected()` passe à `true`), ouvrir automatiquement la modale (`open={true}`). Réouverture possible si l’utilisateur ferme la modale sans désélectionner (ex. double-clic sur l’aperçu ou bouton « Modifier le texte » sur l’aperçu — option minimale : réouverture au prochain clic sur le nœud déjà sélectionné).
- **Contenu canevas** : en mode édition builder, afficher toujours l’aperçu HTML (comme `View`) pour le nœud, y compris quand il est sélectionné ; l’édition se fait uniquement dans la modale.
- **Composant** : extraire le shell Lexical (toolbar, plugins, `OnChangePlugin`) dans un composant réutilisable monté dans `DialogContent` avec `className` du type `max-w-4xl w-[90vw] max-h-[85vh]` et zone scrollable pour le corps de l’éditeur.
- **Fermeture** : `onOpenChange(false)` ferme la modale sans annuler les modifications déjà propagées via `onChange` ; pas de brouillon séparé.
- **Focus** : au montage de la modale, focus dans `ContentEditable` pour permettre la saisie immédiate.

## Alternatives considered

- **Édition inline élargie (popover)** : ne résout pas les colonnes très étroites ni la hauteur limitée.
- **Panneau latéral fixe** : plus lourd à intégrer au layout builder existant ; la modale suit le pattern file manager / API.

## Risks / Trade-offs

- Modale à l’ouverture systématique peut surprendre → mitiger avec fermeture rapide (Échap) et aperçu visible derrière.
- Z-index / portail Dialog dans l’iframe du builder → réutiliser `Dialog` existant qui gère déjà `iframeRef` via `BuilderContext`.

## Migration Plan

- Déploiement direct : pas de migration de données.
- Rollback : restaurer l’édition inline dans `Edit.tsx`.

## Open Questions

- Faut-il un libellé explicite sur l’aperçu (« Cliquer pour modifier ») si la modale a été fermée sans désélection ? (recommandé en implémentation, non bloquant pour la spec.)
