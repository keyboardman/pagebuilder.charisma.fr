## ADDED Requirements

### Requirement: Édition du lien des images dynamiques

Lorsque `collectionType=image` et `mode=dynamic`, le panneau Source du NodeCollection SHALL permettre de saisir et modifier un champ **lien (URL) optionnel** pour chaque entrée de `dynamicItems`. La valeur SHALL être persistée dans `dynamicItems[].link`. Une chaîne vide ou absente SHALL être traitée comme « pas de lien ».

#### Scenario: Saisie d’un lien sur une image dynamique

- **WHEN** l’utilisateur a ajouté une image via la médiathèque en mode dynamique image et saisit une URL dans le champ Lien de cette entrée
- **THEN** `dynamicItems` pour cette entrée contient `link` égal à l’URL saisie (après trim si applicable) et la valeur est conservée à la sauvegarde de la page

#### Scenario: Lien vide reste non cliquable

- **WHEN** l’utilisateur laisse le champ Lien vide (ou le vide après l’avoir renseigné)
- **THEN** l’entrée n’a pas de lien effectif et l’image n’est pas enveloppée dans une ancre cliquable

#### Scenario: Nœuds existants sans champ link

- **WHEN** un NodeCollection image dynamique existant n’a pas de propriété `link` sur ses entrées `dynamicItems`
- **THEN** le panneau affiche le champ Lien vide et le rendu reste non cliquable, sans erreur

### Requirement: Rendu cliquable des images dynamiques liées

Lorsque `collectionType=image`, `mode=dynamic` et qu’une entrée résolue a un `link` non vide, le NodeCollection SHALL rendre l’image cliquable (ancre vers ce lien) pour les dispositions `list`, `grid` et `slideshow`, en vue `default`, de façon alignée sur le comportement NodeImage (hooks `.ce-image` / `.ce-image-link` selon le renderer).

#### Scenario: Image dynamique cliquable en liste

- **WHEN** l’utilisateur configure `collectionType=image`, `mode=dynamic`, `display=list` avec au moins une image dont `link` est renseigné
- **THEN** cette image est rendue à l’intérieur d’un lien pointant vers l’URL configurée

#### Scenario: Image dynamique cliquable en grille et slideshow

- **WHEN** la même entrée liée est affichée avec `display=grid` ou `display=slideshow`
- **THEN** l’image reste cliquable vers le même `link`
