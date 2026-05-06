## MODIFIED Requirements

### Requirement: Génération du CSS et versioning

Le système SHALL fournir un service (ex. `ThemeCssGenerator`) qui lit le theme.yaml (contenu ou chemin), génère un fichier CSS contenant : (1) des variables `:root` à partir de `vars` ; (2) des règles pour `body`, `h1`–`h6`, `div`, `p` à partir des blocs correspondants.

Le système SHALL aussi composer le CSS final du thème à partir d'un **socle CSS de base du builder** et des personnalisations ThemeBuilder (overrides), dans un ordre déterministe **base puis overrides**.

Le socle CSS SHALL couvrir tous les nodes enregistrés dans le builder (via le registre des nodes) afin que chaque node dispose d'un style de base modifiable. Lorsqu'un node n'a pas d'override spécifique, le style de base SHALL rester applicable comme fallback.

Le fichier CSS généré SHALL être versionné : le nom du fichier SHALL inclure une version (hash ou timestamp) pour permettre le cache-busting (ex. `theme.abc123.css` ou `theme.v1737700000.css`). À chaque génération, le nouveau fichier est écrit et `Theme.generatedCssPath` SHALL être mis à jour pour refléter le chemin du fichier courant.

#### Scenario: Génération CSS composée base + overrides
- **WHEN** le `ThemeCssGenerator` est invoqué avec un theme.yaml valide et une configuration ThemeBuilder contenant des overrides
- **THEN** le CSS final inclut le socle de base du builder puis les overrides du thème dans cet ordre
- **AND** le fichier de sortie est versionné

#### Scenario: Fallback du style de base sans override
- **WHEN** un node du builder ne possède pas d'override dans la configuration du thème
- **THEN** le style provenant du socle CSS de base reste appliqué pour ce node dans le CSS final

#### Scenario: Mise à jour de generatedCssPath après génération
- **WHEN** une nouvelle version du CSS est générée pour un Theme
- **THEN** `Theme.generatedCssPath` est mis à jour avec le chemin du nouveau fichier ; l’ancien fichier peut être supprimé ou conservé selon la politique configurée
