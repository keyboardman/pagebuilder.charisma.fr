## Context

Le backend du page builder expose des API cards via des classes `ApiCard*` enregistrees dans Symfony. La classe `CharismaEvenementHomeApiCard` sert deja de reference pour une card image en mode `fixed`, avec consommation d'un endpoint API Platform externe et mapping vers le contrat standard du builder.

Le besoin est d'ajouter une variante retrospective qui lit `.../banniere/evenements/retrospective` et garde le meme contrat de sortie pour eviter toute adaptation cote frontend.

## Goals / Non-Goals

**Goals:**
- Ajouter une nouvelle classe `CharismaEvenementRetrospectiveApiCard` basee sur `AbstractApiCardImage`.
- Reprendre le meme comportement que la card home pour pagination, recherche, tolerance aux erreurs et mapping.
- Exposer la card dans le registre existant pour la rendre disponible dans l'editeur.

**Non-Goals:**
- Modifier le contrat HTTP des endpoints builder API existants.
- Changer le format de donnees des autres API cards deja en production.
- Ajouter une logique de tri ou filtres supplementaires non demandes par l'API actuelle.

## Decisions

- **Dupliquer le pattern de `CharismaEvenementHomeApiCard` avec une classe dediee**  
  Rationale: limite le risque de regression et permet d'isoler l'identifiant, le libelle et l'URL cible de la retrospective.

- **Conserver `collectionMode = fixed`**  
  Rationale: l'endpoint fournit une collection editoriale predefinie, comme la card home.

- **Conserver le mapping standard image (`id`, `title`, `image`, `link`, `raw`)**  
  Rationale: compatibilite immediate avec les composants frontend existants et les contrats du registre.

- **Conserver la strategie de fallback silencieux en cas d'erreur externe**  
  Rationale: evite de casser l'edition si l'API distante est indisponible; retourne une collection vide.

## Risks / Trade-offs

- **Evolution du payload externe** -> Mitigation: mapping defensif avec valeurs par defaut et tests unitaires sur les cas partiels.
- **Indisponibilite de l'API tierce** -> Mitigation: capture des exceptions et retour `items: []`, `total: 0`.
- **Duplication de logique entre cards home/retrospective** -> Mitigation: acceptable a court terme pour limiter la complexite; factorisation possible ulterieurement si un troisieme endpoint similaire apparait.
