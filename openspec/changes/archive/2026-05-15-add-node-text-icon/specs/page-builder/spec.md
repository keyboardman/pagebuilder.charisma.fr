## ADDED Requirements
### Requirement: Nœud texte avec icône (NodeTextIcon)
Le builder SHALL fournir un type de nœud **NodeTextIcon** (identifiant `node-text-icon`) fonctionnellement aligné avec **NodeText** pour l'édition du texte, et enrichi par une icône optionnelle associée au texte.

Le nœud SHALL permettre de configurer:
- la présence d'une icône optionnelle,
- la position de l'icône **avant** ou **après** le texte,
- un lien cliquable appliqué au texte,
- l'alignement horizontal et vertical du contenu du nœud,
- la taille de l'icône.

#### Scenario: Ajout d'un NodeTextIcon depuis le panneau
- **WHEN** l'utilisateur ajoute un bloc depuis le panneau des composants et choisit `NodeTextIcon`
- **THEN** un nœud `node-text-icon` est inséré avec un texte éditable par défaut, similaire à `NodeText`
- **AND** l'icône est optionnelle et non bloquante si non configurée

#### Scenario: Positionnement de l'icône avant ou après le texte
- **WHEN** l'utilisateur configure la position de l'icône sur `before`
- **THEN** l'icône est rendue avant le texte
- **WHEN** l'utilisateur configure la position de l'icône sur `after`
- **THEN** l'icône est rendue après le texte

#### Scenario: Lien cliquable sur le texte
- **WHEN** l'utilisateur renseigne une URL de lien dans les paramètres du `NodeTextIcon`
- **THEN** le texte est rendu comme un élément cliquable pointant vers cette URL
- **AND** le comportement est visible en preview et dans le rendu final

#### Scenario: Alignements horizontal et vertical
- **WHEN** l'utilisateur modifie l'alignement horizontal et/ou vertical dans les paramètres du `NodeTextIcon`
- **THEN** le contenu texte+icône s'aligne selon les valeurs choisies dans l'éditeur, la preview et le rendu final

#### Scenario: Taille de l'icône
- **WHEN** l'utilisateur modifie la taille de l'icône dans les paramètres du `NodeTextIcon`
- **THEN** l'icône est rendue à la taille configurée, sans altérer l'éditabilité du texte

#### Scenario: Persistance du NodeTextIcon
- **WHEN** l'utilisateur sauvegarde une page contenant un ou plusieurs `NodeTextIcon`
- **THEN** les propriétés du nœud (texte, icône, position avant/après, lien, alignements, taille d'icône) sont sérialisées et restaurées à l'identique lors du rechargement
