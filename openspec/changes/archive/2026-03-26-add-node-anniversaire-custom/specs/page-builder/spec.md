## ADDED Requirements
### Requirement: Nœud anniversaires (NodeAnniversaire) en catégorie custom
Le builder SHALL fournir un type de nœud **NodeAnniversaire** (identifiant `node-anniversaire`) visible dans le panneau de composants sous la catégorie **custom**. Le nœud SHALL être insérable comme un nœud de contenu standard, duplicable, supprimable et persistant dans le JSON du builder.

#### Scenario: Ajout depuis la catégorie custom
- **WHEN** l'utilisateur ouvre le panneau des composants
- **THEN** une catégorie `custom` est affichée
- **AND** le bouton `NodeAnniversaire` est visible dans cette catégorie
- **AND** l'ajout crée un nœud `node-anniversaire` dans la page

#### Scenario: Persistance du NodeAnniversaire
- **WHEN** l'utilisateur sauvegarde une page contenant un `node-anniversaire`
- **THEN** le nœud est présent dans le JSON sauvegardé
- **AND** il est restauré au rechargement de la page dans l'éditeur

### Requirement: Rendu de la liste anniversaires au format de référence
Le nœud **NodeAnniversaire** SHALL afficher une liste d'anniversaires de mariage au format éditorial de référence `https://api.charisma.fr/charisma/anniversaire/mariage` : sections par date (ex. `26/03`) et lignes de couples avec ancienneté (ex. `Michael et Rita BASS - 20 ans`).

#### Scenario: Données chargées avec succès
- **WHEN** le nœud charge les données de l'endpoint de référence
- **THEN** il affiche des groupes par date
- **AND** chaque groupe affiche les couples de la date avec le libellé d'ancienneté en années
- **AND** l'ordre des groupes et des lignes respecte l'ordre fourni par la source

#### Scenario: Endpoint indisponible
- **WHEN** le chargement de la source échoue (timeout, erreur réseau, réponse invalide)
- **THEN** le nœud affiche un état de repli non bloquant
- **AND** l'éditeur reste fonctionnel sans erreur bloquante
