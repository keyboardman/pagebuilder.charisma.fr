## ADDED Requirements
### Requirement: Nœud PureMusic Top Semaine (NodePureMusicTopSemaine) en catégorie custom
Le builder MUST proposer un nœud `NodePureMusicTopSemaine` dans la catégorie `custom` afin d'afficher le classement hebdomadaire PureMusic.

Le nœud MUST être insérable, duplicable, supprimable et persistant dans le JSON du builder.

#### Scenario: Ajout du nœud depuis le panneau
- **WHEN** l'utilisateur ouvre la catégorie `custom` du builder
- **THEN** le nœud `NodePureMusicTopSemaine` est disponible
- **AND** l'insertion crée une structure de contenu compatible avec le rendu "top semaine"

### Requirement: Source de données hebdomadaire PureMusic distante
Le nœud `NodePureMusicTopSemaine` MUST charger les données depuis l'endpoint `https://api.charisma.fr/api/puremusic/musiques/tops/semaine`.

Le nœud MUST consommer la collection renvoyée dans `member` et utiliser les champs nécessaires au rendu (au minimum: `titre`, `album.name`, `album.artiste.nom`, `album.vignette`, `source`).

#### Scenario: Chargement de la liste hebdomadaire
- **WHEN** le nœud `NodePureMusicTopSemaine` effectue le chargement des données
- **THEN** la source utilisée est `https://api.charisma.fr/api/puremusic/musiques/tops/semaine`
- **AND** les éléments de `member` sont mappés dans la liste rendue du nœud

### Requirement: Rendu conforme à la page de référence PureMusic Top Semaine
Le nœud `NodePureMusicTopSemaine` MUST reproduire la structure visuelle et éditoriale de référence de `https://api.charisma.fr/puremusic/tops/semaine` (section "top semaine"), en utilisant les données de l'endpoint API hebdomadaire.

Le rendu MUST conserver l'ordre de la collection retournée par l'API.

#### Scenario: Affichage de la liste au format de référence
- **WHEN** les données hebdomadaires sont chargées avec succès
- **THEN** chaque entrée est affichée avec le même format de card/liste que la page de référence "top semaine"
- **AND** l'ordre des entrées respecte l'ordre renvoyé par l'API

### Requirement: Résilience en cas d'indisponibilité de l'API PureMusic
Le nœud `NodePureMusicTopSemaine` MUST afficher un état de repli non bloquant en cas d'échec de chargement (erreur réseau, timeout, réponse invalide).

L'éditeur MUST rester utilisable sans erreur bloquante.

#### Scenario: Endpoint indisponible
- **WHEN** le chargement de `https://api.charisma.fr/api/puremusic/musiques/tops/semaine` échoue
- **THEN** le nœud affiche un état de repli
- **AND** le reste de l'éditeur continue de fonctionner normalement
