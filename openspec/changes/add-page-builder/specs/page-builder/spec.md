# page-builder (ADDED capability)

## ADDED Requirements

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

Le builder SHALL permettre l'insertion d'images et de médias provenant de la médiathèque existante. Il SHALL utiliser les endpoints API : `/media/api/list`, `/media/api/upload`, et la route de lecture des fichiers `/media/file/{path}`.

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
