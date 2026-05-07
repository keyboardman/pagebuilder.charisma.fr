## Context
Le service `ThemeCssGenerator` transforme des valeurs de configuration (vars + blocs de styles) en règles CSS. Certaines valeurs peuvent contenir des caractères spéciaux qui rendent la sortie invalide ou permettent d’injecter des fragments CSS inattendus.

## Goals / Non-Goals
- Goals:
  - Empêcher la rupture de CSS causée par des caractères non autorisés dans la configuration.
  - Définir une règle simple, stable et uniforme de nettoyage des valeurs.
  - Préserver les cas d’usage légitimes comme `rgb(0,0,0)`, `( )`, quotes et guillemets.
- Non-Goals:
  - Valider la sémantique complète de chaque propriété CSS.
  - Introduire un parseur CSS complet.

## Decisions
- Decision: appliquer une sanitation par whitelist sur toutes les valeurs dynamiques insérées dans le CSS généré.
- Règle de whitelist:
  - caractères alphanumériques
  - parenthèses `(` `)`
  - quotes `'` `"`
  - guillemets typographiques `«` `»`
  - tiret `-`, underscore `_`
  - deux-points `:`, slash `/`, point `.`
  - virgule `,`
  - espaces conservés pour maintenir la lisibilité
- Caractères non autorisés: supprimés silencieusement.

## Risks / Trade-offs
- Risque: certaines valeurs CSS avancées (ex. `%`, `#`) peuvent être retirées si elles ne font pas partie de la whitelist finale.
- Mitigation: couvrir les formats attendus par les tests et ajuster explicitement la whitelist si un besoin métier validé apparaît.

## Migration Plan
1. Introduire la fonction de sanitation centralisée.
2. L’appliquer aux chemins de génération CSS existants.
3. Ajouter des tests de non-régression.
4. Déployer sans migration de données.

## Open Questions
- Faut-il inclure explicitement `%` et `#` si des valeurs métier légitimes les utilisent (ex. `100%`, couleurs hex) ?
