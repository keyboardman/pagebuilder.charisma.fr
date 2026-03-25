## Context

Le builder applique déjà des contraintes parent/enfant dans `useDnd.ts` (ex. `node-nav` / `node-nav-item`). Les formulaires nécessitent une règle analogue : champs réservés au sous-arbre d’un `node-form`, tout en autorisant des conteneurs de mise en page à l’intérieur du formulaire.

## Goals / Non-Goals

- Goals : composition visuelle de formulaires, attributs `method` / `action`, champs standards, persistance et rendu HTML côté page.
- Non-Goals (initiale) : génération de jeton CSRF Symfony, validation serveur du builder, envoi AJAX ou upload de fichiers (hors simple `input type=file` si ajouté plus tard).

## Decisions

- **Composition** : NodeForm est un conteneur droppable unique (zone `main`, comme les autres conteneurs). Les conteneurs enfants restent droppables ; la contrainte « sous NodeForm » s’applique par ancêtre, pas seulement par parent direct.
- **Liste des conteneurs autorisés dans NodeForm** : réutiliser la notion `category: 'container'` du registre pour éviter une liste manuelle longue ; documenter dans la spec que tout nœud enregistré comme conteneur dans le builder est autorisé sauf exclusion explicite future.
- **NodeFormRadio** : un seul nœud représente le groupe (plusieurs options dans le contenu), rendu en `<input type="radio">` partageant le même `name`.
- Alternatives : nœud par option radio — rejeté pour simplifier l’édition et la persistance.

## Risks / Trade-offs

- Soumission vers une URL tierce ou même origine sans CSRF peut échouer ou poser des questions de sécurité → documenté en non-goal ; l’éditeur choisit l’URL.
- Imbriquer un second NodeForm : par défaut **déconseillé** ; l’implémentation peut interdire `node-form` comme enfant de `node-form` pour éviter HTML invalide.

## Migration Plan

Aucune migration de données : nouveaux types uniquement.

## Open Questions

- Faut-il un type `hidden` ou champs `textarea` dans la même livraison ou phase suivante ?
- Faut-il lier le bouton submit à NodeButton existant (`type submit`) uniquement par documentation ou validation explicite ?
