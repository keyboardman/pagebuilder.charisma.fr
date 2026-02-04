# page-builder Specification

## Purpose
TBD - created by archiving change add-page-builder. Update Purpose after archive.
## Requirements
### Requirement: Composant builder de page intégré (sans iframe)

Le système SHALL fournir un composant builder de page, porté ou adapté depuis le dépôt `editeur2.charisma.fr`, qui s'intègre nativement dans le formulaire d'édition de page. Le builder SHALL fonctionner comme composant React embarqué dans le DOM de la page, sans utilisation d'iframe.

#### Scenario: Affichage du builder à la place du textarea content

- **WHEN** l'utilisateur ouvre la création ou l'édition d'une page
- **THEN** le champ « Contenu » affiche le composant builder (drag-and-drop, blocs, éditeur riche) au lieu du textarea brut

#### Scenario: Édition sans iframe

- **WHEN** l'utilisateur interagit avec le builder (ajout de blocs, modification de texte, insertion d'images)
- **THEN** toutes les interactions ont lieu dans le même document ; aucun iframe n'est utilisé pour l'édition du contenu

### Requirement: Format de contenu et persistance

Le builder SHALL produire un contenu compatible avec le stockage dans `Page.content` et le rendu actuel en preview (`page.content|raw`). Le format SHALL être du HTML valide ou un format structuré (ex. JSON de blocs) converti en HTML avant stockage ou à l'affichage.

#### Scenario: Sauvegarde du contenu édité

- **WHEN** l'utilisateur soumet le formulaire page avec du contenu édité dans le builder
- **THEN** le contenu est sérialisé (HTML ou JSON selon l'architecture) et envoyé au serveur ; il est stocké dans `Page.content` et reste compatible avec la prévisualisation

#### Scenario: Chargement du contenu existant

- **WHEN** l'utilisateur ouvre l'édition d'une page ayant déjà du contenu
- **THEN** le builder charge et affiche ce contenu de manière éditable ; les pages avec contenu HTML brut existant sont gérées (affichage ou message si format non reconnu)

### Requirement: Intégration avec la médiathèque

Le builder SHALL permettre l'insertion d'images et de médias provenant de la médiathèque existante. Il SHALL utiliser les endpoints API : `/media/api/list`, `/media/api/upload`, et l'accès direct aux fichiers via `/media/{path}` (stockage dans `public/media`).

#### Scenario: Insertion d'une image depuis la médiathèque

- **WHEN** l'utilisateur insère une image dans le builder (ex. bouton « Insérer image »)
- **THEN** il peut parcourir la médiathèque (via l'API list) et sélectionner une image ; l'URL insérée pointe vers la route de lecture des fichiers médias

#### Scenario: Upload depuis le builder

- **WHEN** l'utilisateur uploade un fichier depuis l'interface du builder
- **THEN** le fichier est envoyé via `/media/api/upload` et le chemin résultant est utilisé dans le contenu

### Requirement: Chargement du CSS du thème dans le contexte d'édition

Lors de l'édition d'une page, le builder SHALL bénéficier du CSS du thème associé à la page (chargé via `app_theme_css`), afin que le rendu dans l'éditeur reflète les styles du thème choisi.

#### Scenario: Édition avec styles du thème

- **WHEN** l'utilisateur édite une page avec un thème ayant un fichier CSS généré
- **THEN** la feuille de style du thème est chargée dans la page d'édition et le contenu affiché dans le builder utilise ces styles

### Requirement: APIs card fournies par Symfony et disponibles dans le builder

Le builder SHALL consommer les APIs « card » exposées par Symfony (voir capacité `builder-api-registry`) plutôt que de dépendre uniquement d’un enregistrement côté JavaScript. Au chargement du builder (page standalone ou formulaire d’édition), la liste des APIs disponibles SHALL être obtenue depuis le backend (injection dans les données de la page ou appel à l’endpoint de liste). Le builder SHALL utiliser les endpoints backend pour récupérer les collections et les items (fetchCollection, fetchItem) lorsqu’un utilisateur choisit une API et sélectionne un contenu pour un bloc card API.

#### Scenario: Affichage des APIs enregistrées en PHP dans le sélecteur du builder

- **WHEN** l’utilisateur ouvre le sélecteur d’API (ex. modale pour choisir une card API) dans le builder
- **THEN** les APIs listées sont celles exposées par le registre Symfony (liste fournie par le backend) ; l’utilisateur peut en choisir une sans avoir appelé `CharismaPageBuilder.registerApi()` en JS

#### Scenario: Sélection d’un item depuis une API backend

- **WHEN** l’utilisateur sélectionne une API puis recherche ou parcourt les items (collection) et choisit un item
- **THEN** les appels de liste (collection) et de détail (item) sont effectués vers les endpoints Symfony ; le résultat mappé est utilisé pour remplir la card dans le builder

### Requirement: Conteneur Flex (NodeFlex)

Le builder SHALL fournir un type de nœud conteneur **NodeFlex** (identifiant `node-flex`) dans lequel les composants enfants sont alignés à l’aide des propriétés CSS Flexbox. Le nœud SHALL être droppable (une zone unique, par ex. `main`) et SHALL exposer des options configurables pour la disposition flex : direction (row, column, row-reverse, column-reverse), justify-content, align-items, gap et flex-wrap.

#### Scenario: Ajout d’un conteneur Flex depuis le panneau

- **WHEN** l’utilisateur ajoute un bloc depuis le panneau des composants et choisit le conteneur Flex (NodeFlex)
- **THEN** un nœud NodeFlex est inséré dans la page ; l’utilisateur peut y déposer d’autres blocs (cartes, texte, etc.) qui sont disposés selon les propriétés flex du conteneur

#### Scenario: Alignement des enfants selon les options flex

- **WHEN** l’utilisateur modifie les options du NodeFlex (direction, justify, align, gap, wrap) dans les paramètres du nœud
- **THEN** les enfants du conteneur sont réalignés immédiatement dans l’éditeur selon ces propriétés ; le rendu en prévisualisation et à l’export reflète le même alignement

#### Scenario: Persistance du conteneur Flex

- **WHEN** l’utilisateur sauvegarde une page contenant un ou plusieurs NodeFlex avec des options flex définies
- **THEN** le contenu sérialisé (HTML ou JSON) conserve la structure et les styles/attributs nécessaires pour reproduire la disposition flex à l’affichage

