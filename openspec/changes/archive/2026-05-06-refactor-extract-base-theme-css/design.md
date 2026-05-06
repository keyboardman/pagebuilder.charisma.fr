## Context
Le builder s'appuie sur un ensemble de fichiers CSS de base côté éditeur. En parallèle, ThemeBuilder permet déjà de gérer des variables et des styles typographiques généraux, mais il ne formalise pas encore une personnalisation structurée du socle CSS de tous les nodes.

## Goals / Non-Goals
- Goals:
  - Définir un socle CSS de référence pour le builder, explicitement pris en charge par ThemeBuilder.
  - Permettre la personnalisation de ce socle sans casser le fallback par défaut.
  - Garantir la couverture de tous les nodes enregistrés et la cohérence éditeur/preview/rendu final.
- Non-Goals:
  - Refaire le design de chaque node.
  - Introduire un nouveau moteur CSS ou un runtime de theming côté client.

## Decisions
- Decision: Composer le CSS final en deux couches ordonnées: `base` puis `overrides`.
  - Rationale: simple, prévisible et compatible avec le modèle actuel de génération CSS versionné.
- Decision: Appuyer la personnalisation node par node sur des hooks CSS stables (classes/attributs déjà présents dans le rendu).
  - Rationale: minimise le risque de régression et évite de coupler la config de thème à la structure interne des composants React.
- Decision: Exiger une couverture explicite de tous les nodes connus du registre pour la base.
  - Rationale: évite les nodes "orphelins" qui resteraient hors périmètre du ThemeBuilder.

## Risks / Trade-offs
- Risque: écarts visuels si certains nodes n'ont pas de hook CSS suffisamment stable.
  - Mitigation: inventaire initial des hooks et ajout des hooks manquants avant la bascule.
- Risque: effet de bord de spécificité CSS entre base et overrides.
  - Mitigation: conventions de sélecteurs et ordre de composition fixe.

## Migration Plan
1. Identifier le socle CSS actuel utilisé par le builder.
2. Définir la structure de données d'overrides exploitée par ThemeBuilder.
3. Adapter la génération CSS pour produire un fichier final composé et versionné.
4. Vérifier la cohérence sur un thème existant puis sur un thème modifié.

## Open Questions
- Le périmètre "tous les nodes" inclut-il uniquement les nodes enregistrés aujourd'hui dans `NodeRegistry`, ou aussi les futurs nodes via un mécanisme de fallback automatique?
