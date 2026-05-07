## ADDED Requirements
### Requirement: Sanitation des valeurs de configuration avant génération CSS
Le système SHALL nettoyer toute valeur de configuration interpolée dans le CSS généré en n’autorisant que les caractères alphanumériques, les parenthèses, les quotes simples/doubles, les guillemets, le tiret, l’underscore, les deux-points, le slash, le point, la virgule et les espaces. Les caractères non autorisés SHALL être supprimés avant l’écriture des règles CSS afin d’éviter qu’un caractère de séparation (par exemple `;`) casse la sortie CSS.

#### Scenario: Valeur valide conservée
- **WHEN** une valeur de configuration contient uniquement des caractères autorisés
- **THEN** la valeur est conservée telle quelle dans le CSS généré

#### Scenario: Point-virgule supprimé
- **WHEN** une valeur de configuration contient un `;`
- **THEN** ce caractère est supprimé avant interpolation dans la règle CSS générée
- **AND** la règle CSS finale reste syntaxiquement valide

#### Scenario: Caractères non autorisés neutralisés
- **WHEN** une valeur de configuration contient des caractères hors whitelist
- **THEN** ces caractères sont supprimés
- **AND** seule la sous-chaîne autorisée est utilisée dans le CSS généré

#### Scenario: Valeur var() conservée
- **WHEN** une valeur de configuration est `var(--color-red)`
- **THEN** la valeur est conservée et interpolée sans altération

#### Scenario: Valeur url() conservée
- **WHEN** une valeur de configuration est `url("https://www.google.com")`
- **THEN** la valeur est conservée et interpolée sans altération
