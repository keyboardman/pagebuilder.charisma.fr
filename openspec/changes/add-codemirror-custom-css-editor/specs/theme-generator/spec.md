## MODIFIED Requirements
### Requirement: Formulaire dynamique a partir du schema theme.yaml

Le systeme SHALL generer un formulaire d'edition de theme a partir de la structure du theme.yaml : sections pour `vars`, `body`, `h1`-`h6`, `div`, `p` ; types de champs adaptes (texte pour couleurs/font-family, nombre pour font-size/line-height, etc.). Le champ `font-family` SHALL pouvoir etre lie a l'entite `Font` (selection) ou accepter une chaine libre. La soumission du formulaire SHALL produire une structure de donnees ecrite dans le fichier YAML du theme (ou en base) et SHALL permettre de declencher la generation CSS.

La section `custom_css` du formulaire SHALL proposer une edition assistee du CSS via un editeur de code (CodeMirror ou equivalent) avec support syntaxique CSS, tout en preservant le meme champ de soumission (`config[custom_css]`) et la compatibilite avec la persistence existante.

#### Scenario: Affichage du formulaire avec sections vars, body, h1-h6, div, p

- **WHEN** l'utilisateur ouvre l'edition d'un Theme
- **THEN** le formulaire affiche les sections vars, body, h1-h6, div, p avec les champs definis dans le schema theme.yaml

#### Scenario: Sauvegarde et ecriture du YAML

- **WHEN** l'utilisateur soumet le formulaire avec des valeurs valides
- **THEN** les donnees sont ecrites dans le fichier theme.yaml (ou structure equivalente) a l'emplacement `generatedYamlPath` ; la generation CSS peut etre declenchee

#### Scenario: Edition assistee du custom_css
- **WHEN** l'utilisateur ouvre la section "CSS personnalise"
- **THEN** un editeur de code avec support CSS est affiche avec la valeur actuelle de `custom_css`
- **AND** la valeur soumise au backend reste mappee sur `config[custom_css]`

#### Scenario: Fallback de saisie sans editeur code
- **WHEN** l'editeur de code ne peut pas etre initialise cote client
- **THEN** l'utilisateur dispose d'un champ alternatif de type `textarea` pour editer `custom_css`
- **AND** la soumission du formulaire reste fonctionnelle
