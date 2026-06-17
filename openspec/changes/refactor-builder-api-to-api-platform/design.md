## Context
Le projet expose deja des endpoints `/page-builder/api/*` utilises par les interfaces du builder pour lister les APIs disponibles et recuperer des collections/items. La migration vers API Platform doit apporter un contrat plus explicite (operations, metadata, formats) sans casser les integrations existantes.

## Goals / Non-Goals
- Goals:
  - Exposer les operations builder API via API Platform avec des ressources dediees.
  - Maintenir la compatibilite fonctionnelle des interfaces existantes pendant la migration.
  - Unifier le parsing des query params et la normalisation des payloads.
- Non-Goals:
  - Refaire les composants UX du builder.
  - Changer le mapping metier des ApiCard au-dela des besoins de compatibilite.
  - Imposer une migration immediate des consommateurs externes hors builder.

## Decisions
- Decision: Introduire des operations API Platform dediees au domaine builder API.
  - Rationale: permet de centraliser le contrat HTTP, la documentation et la serialisation.
- Decision: Conserver les endpoints `/page-builder/api/*` via une couche de compatibilite deleguant vers les providers/processors API Platform.
  - Rationale: evite une rupture pour les interfaces deja deployeees.
- Decision: Uniformiser les DTO de reponse (`ApiList`, `ApiCollection`, `ApiItem`) et les objets de parametres.
  - Rationale: limite les divergences entre controllers legacy et nouvelles operations.
- Alternatives considered:
  - Basculer uniquement vers de nouvelles routes `/api/*` sans compatibilite: refuse car breaking change immediat.
  - Garder uniquement des controllers custom: refuse car n'atteint pas l'objectif API Platform.

## Risks / Trade-offs
- Risque: duplication temporaire de routes et de logique pendant la phase de transition.
  - Mitigation: factoriser la logique dans des services partages, puis supprimer progressivement les points d'entree legacy.
- Risque: ecarts de payloads entre legacy et API Platform.
  - Mitigation: tests contractuels sur les endpoints critiques consommes par le builder.
- Risque: adaptation partielle des interfaces (front) si certains noeuds utilisent des hypotheses implicites.
  - Mitigation: inventorier les noeuds consommateurs et definir une check-list de validation par noeud.

## Migration Plan
1. Introduire les ressources/operations API Platform et les DTO communs.
2. Faire deleguer les routes legacy vers la nouvelle couche applicative.
3. Adapter les interfaces du builder pour supporter les endpoints API Platform et/ou la couche de compatibilite.
4. Valider la parite de comportement (payloads, statuts, pagination, erreurs).
5. Planifier la deprecation des endpoints legacy une fois les consommateurs migrés.

## Open Questions
- Le chemin final cible des endpoints API Platform doit-il rester sous `/page-builder/api/*` ou adopter un prefixe `/api/*` avec alias legacy?
- Quelle politique de versionning API doit etre appliquee pour les contrats du builder?
