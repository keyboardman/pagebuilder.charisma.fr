## ADDED Requirements
### Requirement: Nœud vidéos home (NodeVideoHome) en catégorie custom
Le builder MUST proposer un nœud `NodeVideoHome` dans la catégorie custom pour afficher une sélection vidéo home.

#### Scenario: Ajout du nœud depuis le panneau
- **WHEN** l'utilisateur ouvre la catégorie custom du builder
- **THEN** le nœud `NodeVideoHome` est disponible
- **AND** l'insertion crée une structure de contenu compatible avec le rendu vidéo home

### Requirement: Source de données vidéos home distante
Le nœud `NodeVideoHome` MUST récupérer les vidéos depuis `https://api.charisma.fr/api/charisma/videos/homes` et utiliser exactement 7 vidéos pour le rendu de la section.

#### Scenario: Chargement de la liste vidéos home
- **WHEN** le nœud `NodeVideoHome` effectue le chargement des données
- **THEN** la source utilisée est `https://api.charisma.fr/api/charisma/videos/homes`
- **AND** 7 vidéos sont affichées dans la grille finale

### Requirement: Rendu des vidéos home en card vidéo type API
Le nœud `NodeVideoHome` MUST afficher chaque vidéo avec le même format de card vidéo que le rendu des vidéos API.

#### Scenario: Affichage homogène avec les cards vidéo API
- **WHEN** une vidéo home est rendue dans `NodeVideoHome`
- **THEN** son rendu visuel et sa structure de card correspondent au format `card video` déjà utilisé pour les vidéos API

### Requirement: Grille responsive imposée pour 7 vidéos home
Le nœud `NodeVideoHome` MUST appliquer la grille suivante:
- desktop: 3 colonnes sur 2 lignes, puis la 7e vidéo seule sur une 3e ligne occupant toute la largeur
- tablette: 2 colonnes sur 3 lignes, puis la 7e vidéo seule sur une 4e ligne occupant toute la largeur
- mobile: 1 colonne sur 7 lignes

#### Scenario: Rendu desktop
- **WHEN** la section est affichée en viewport desktop
- **THEN** les 6 premières vidéos occupent une grille `3x2`
- **AND** la 7e vidéo occupe la ligne suivante sur toute la largeur

#### Scenario: Rendu tablette
- **WHEN** la section est affichée en viewport tablette
- **THEN** les 6 premières vidéos occupent une grille `2x3`
- **AND** la 7e vidéo occupe la ligne suivante sur toute la largeur

#### Scenario: Rendu mobile
- **WHEN** la section est affichée en viewport mobile
- **THEN** les 7 vidéos sont affichées sur une seule colonne
