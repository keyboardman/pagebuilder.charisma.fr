## MODIFIED Requirements
### Requirement: Nœud anniversaires (NodeAnniversaire) en catégorie custom
Le builder SHALL fournir un type de nœud **NodeAnniversaire** (identifiant `node-anniversaire`) visible dans le panneau de composants sous la catégorie **custom**. Le nœud SHALL être insérable comme un nœud de contenu standard, duplicable, supprimable et persistant dans le JSON du builder.

Le nœud SHALL exposer un panneau de configuration composé de quatre onglets:
- `general`
- `titre`
- `date`
- `anniversaires`

La structure persistée dans `node.content` SHALL suivre le contrat suivant:
- `node.content.container` (styles de la zone globale)
- `node.content.title` (texte et styles du titre)
- `node.content.day` (styles du bloc date)
- `node.content.anniversaires` (styles des lignes anniversaires)

L'onglet `general` SHALL permettre au minimum de styliser le `background`, la `margin` et le `padding` du conteneur global.

Les onglets `titre`, `date` et `anniversaires` SHALL permettre au minimum de styliser le `background`, la `margin`, le `padding` et les styles de texte de leur section respective.

Le titre SHALL être modifiable par l'utilisateur via l'onglet `titre` et sa valeur SHALL être persistée dans `node.content.title`.

#### Scenario: Ajout depuis la catégorie custom
- **WHEN** l'utilisateur ouvre le panneau des composants
- **THEN** une catégorie `custom` est affichée
- **AND** le bouton `NodeAnniversaire` est visible dans cette catégorie
- **AND** l'ajout crée un nœud `node-anniversaire` dans la page

#### Scenario: Affichage des onglets de settings
- **WHEN** l'utilisateur sélectionne un `node-anniversaire`
- **THEN** les onglets `general`, `titre`, `date`, `anniversaires` sont disponibles dans le panneau de settings
- **AND** chaque onglet expose les controles attendus pour sa section

#### Scenario: Persistance de la structure node.content
- **WHEN** l'utilisateur sauvegarde une page contenant un `node-anniversaire`
- **THEN** le JSON sauvegardé contient `node.content.container`, `node.content.title`, `node.content.day` et `node.content.anniversaires`
- **AND** ces donnees sont restaurees au rechargement de la page

### Requirement: Rendu de la liste anniversaires au format de référence
Le nœud **NodeAnniversaire** SHALL afficher une liste d'anniversaires de mariage au format éditorial de référence `https://api.charisma.fr/charisma/anniversaire/mariage` : sections par date (ex. `26/03`) et lignes de couples avec ancienneté (ex. `Michael et Rita BASS - 20 ans`).

Le rendu SHALL appliquer les styles configurés dans les onglets de settings:
- styles de `node.content.container` sur le conteneur global
- styles de `node.content.title` sur le bloc titre
- styles de `node.content.day` sur les libellés de date
- styles de `node.content.anniversaires` sur les lignes de personnes

Le rendu du titre SHALL utiliser la valeur éditée par l'utilisateur lorsqu'elle est renseignée.

#### Scenario: Données chargées avec succès
- **WHEN** le nœud charge les données de l'endpoint de référence
- **THEN** il affiche des groupes par date
- **AND** chaque groupe affiche les couples de la date avec le libellé d'ancienneté en années
- **AND** l'ordre des groupes et des lignes respecte l'ordre fourni par la source

#### Scenario: Application des styles configurés
- **WHEN** l'utilisateur modifie les styles dans un des onglets (`general`, `titre`, `date`, `anniversaires`)
- **THEN** la section correspondante est mise a jour dans le rendu du nœud
- **AND** la mise en forme est conservee en previsualisation et apres sauvegarde/rechargement

#### Scenario: Endpoint indisponible
- **WHEN** le chargement de la source échoue (timeout, erreur réseau, réponse invalide)
- **THEN** le nœud affiche un état de repli non bloquant
- **AND** l'éditeur reste fonctionnel sans erreur bloquante
