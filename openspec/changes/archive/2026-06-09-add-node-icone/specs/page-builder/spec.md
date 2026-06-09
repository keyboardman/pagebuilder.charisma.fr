## ADDED Requirements
### Requirement: Nœud icône seule (NodeIcone)
Le builder SHALL fournir un type de nœud **NodeIcone** (identifiant `node-icone`) affichant une icône seule, sans bloc texte éditable. Le nœud SHALL réutiliser le même modèle de rendu d'icône que **NodeTextIcon** (balise `<i>` avec classes `ce-icon`, presets intégrés, icône du thème ou image).

Le nœud SHALL permettre de configurer:
- la source de l'icône (**preset**, **theme** ou **image**),
- la taille de l'icône (`default`, `small`, `large`),
- l'alignement horizontal et vertical de l'icône dans son conteneur,
- un lien cliquable optionnel appliqué à l'icône,
- les styles du conteneur et de l'élément icône (marge, padding, fond, bordure, couleur).

Le nœud SHALL **ne pas** exposer d'édition de texte HTML ni les options propres au couplage texte+icône (balise de texte, position avant/après le texte, styles texte).

#### Scenario: Ajout d'un NodeIcone depuis le panneau
- **WHEN** l'utilisateur ajoute un bloc depuis le panneau des composants et choisit `NodeIcone`
- **THEN** un nœud `node-icone` est inséré avec une icône preset par défaut
- **AND** aucun champ texte éditable n'est affiché dans le canvas

#### Scenario: Source d'icône preset, thème ou image
- **WHEN** l'utilisateur configure la source sur `preset` et choisit une icône intégrée
- **THEN** l'icône preset est rendue via les classes `ce-icon` et `ce-icon-preset-*`
- **WHEN** l'utilisateur configure la source sur `theme` et sélectionne une icône du thème de la page
- **THEN** l'icône du thème est rendue via la classe CSS du thème ou l'URL associée
- **WHEN** l'utilisateur configure la source sur `image` et renseigne une URL (ou sélectionne via la médiathèque)
- **THEN** l'icône est rendue en `background-image` sur l'élément `<i>`

#### Scenario: Alignements horizontal et vertical
- **WHEN** l'utilisateur modifie l'alignement horizontal et/ou vertical dans les paramètres du `NodeIcone`
- **THEN** l'icône s'aligne selon les valeurs choisies dans l'éditeur, la preview et le rendu final

#### Scenario: Taille de l'icône
- **WHEN** l'utilisateur modifie la taille de l'icône dans les paramètres du `NodeIcone`
- **THEN** l'icône est rendue à la taille configurée (`ce-icon`, `ce-icon-small` ou `ce-icon-large`)

#### Scenario: Lien cliquable optionnel
- **WHEN** l'utilisateur renseigne une URL de lien dans les paramètres du `NodeIcone`
- **THEN** l'icône est rendue comme un élément cliquable pointant vers cette URL
- **AND** le comportement est visible en preview et dans le rendu final

#### Scenario: Persistance du NodeIcone
- **WHEN** l'utilisateur sauvegarde une page contenant un ou plusieurs `NodeIcone`
- **THEN** les propriétés du nœud (source, icône, taille, lien, alignements, styles conteneur et icône) sont sérialisées et restaurées à l'identique lors du rechargement
