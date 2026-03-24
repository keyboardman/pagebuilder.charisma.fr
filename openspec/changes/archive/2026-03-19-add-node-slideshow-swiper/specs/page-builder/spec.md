## ADDED Requirements
### Requirement: Nœud diaporama Swiper (NodeSlideshow)
Le builder SHALL fournir un type de nœud **NodeSlideshow** (identifiant `node-slideshow`) permettant de créer un diaporama/carrousel basé sur une liste ordonnée d’images.

Le nœud SHALL être éditable dans le panneau de propriétés du builder et SHALL produire un rendu en preview et dans le rendu final en s’appuyant sur la librairie **Swiper**.

#### Scenario: Ajout d’un NodeSlideshow depuis le panneau
- **WHEN** l’utilisateur ajoute un bloc NodeSlideshow dans la page
- **THEN** un node `node-slideshow` apparaît dans l’éditeur et un panneau de réglages est disponible

#### Scenario: Rendu Swiper depuis la liste d’images
- **WHEN** l’utilisateur configure une liste de slides avec des images
- **THEN** la preview affiche un carrousel Swiper avec une slide par image

#### Scenario: Persistance de la configuration du node
- **WHEN** l’utilisateur sauvegarde la page contenant un NodeSlideshow
- **THEN** les images (dans leur ordre), ainsi que les options d’affichage Swiper définies, sont sérialisées et restituées lors d’un rechargement

### Requirement: Gestion des slides images (ajout, tri, suppression, modification)
Le nœud NodeSlideshow SHALL permettre à l’utilisateur de gérer la liste des slides images dans le panneau de propriétés, avec les actions suivantes :
- ajouter une slide via le file manager de médiathèque existant
- réordonner les slides (tri) via un mécanisme de drag-and-drop
- supprimer une slide
- sélectionner une slide et modifier son image (remplacement)

Après chaque action, l’ordre et le contenu SHALL être immédiatement reflétés dans la preview.

#### Scenario: Ajout d’une image à la fin du diaporama
- **WHEN** l’utilisateur clique sur “Ajouter une image” dans le NodeSlideshow
- **THEN** il choisit une image via le file manager et celle-ci est ajoutée à la liste des slides

#### Scenario: Tri par drag-and-drop
- **WHEN** l’utilisateur réordonne les slides par drag-and-drop
- **THEN** l’ordre Swiper correspond à l’ordre visuel dans la liste

#### Scenario: Suppression et modification de la slide sélectionnée
- **WHEN** l’utilisateur sélectionne une slide puis clique “Supprimer”
- **THEN** la slide est retirée de la liste et la preview est mise à jour
- **WHEN** l’utilisateur sélectionne une slide puis utilise “Modifier” pour remplacer l’image
- **THEN** la slide affiche la nouvelle image dans la preview

### Requirement: Réglages d’affichage Swiper (navigation, pagination, vitesse)
Le nœud NodeSlideshow SHALL exposer des paramètres permettant de configurer :
- l’affichage de la navigation prev/next
- l’affichage de la pagination
- la vitesse de transition (en millisecondes)

Ces paramètres SHALL être appliqués au carrousel Swiper utilisé par le nœud et SHALL être visibles en preview.

#### Scenario: Activation/désactivation de la navigation
- **WHEN** l’utilisateur désactive la navigation dans le panneau du NodeSlideshow
- **THEN** les boutons prev/next ne sont plus affichés dans la preview
- **WHEN** l’utilisateur réactive la navigation
- **THEN** les boutons prev/next réapparaissent

#### Scenario: Activation/désactivation de la pagination
- **WHEN** l’utilisateur désactive la pagination dans le panneau du NodeSlideshow
- **THEN** les indicateurs de pagination ne sont plus affichés dans la preview
- **WHEN** l’utilisateur réactive la pagination
- **THEN** les indicateurs de pagination réapparaissent

#### Scenario: Modification de la vitesse de transition
- **WHEN** l’utilisateur définit la vitesse de transition à une valeur en millisecondes (ex. 300)
- **THEN** Swiper utilise cette vitesse pour les transitions entre slides dans la preview

### Requirement: Autoplay Swiper
Le nœud NodeSlideshow SHALL exposer des paramètres permettant de configurer l’autoplay Swiper :
- l’activation/désactivation de l’autoplay
- le délai d’autoplay en millisecondes

Ces paramètres SHALL contrôler le défilement automatique des slides dans la preview lorsque l’autoplay est activé.

#### Scenario: Activation de l’autoplay
- **WHEN** l’utilisateur active l’option Autoplay sur le NodeSlideshow
- **THEN** les slides défilent automatiquement après le délai configuré

#### Scenario: Désactivation de l’autoplay
- **WHEN** l’utilisateur désactive l’option Autoplay sur le NodeSlideshow
- **THEN** les slides ne défilent plus automatiquement

### Requirement: Slides visibles par breakpoint
Le nœud NodeSlideshow SHALL exposer une configuration du nombre de slides visibles selon le breakpoint courant :
- `desktop` (nombre entier >= 1)
- `tablet` (nombre entier >= 1)
- `mobile` (nombre entier >= 1)

Le nœud SHALL appliquer la valeur correspondant au breakpoint courant pour déterminer `slidesPerView` Swiper.

#### Scenario: Changement de breakpoint
- **WHEN** l’utilisateur sélectionne le breakpoint `mobile` dans l’interface du builder
- **THEN** Swiper affiche le nombre de slides configuré pour `mobile`

#### Scenario: Valeurs configurées persistantes
- **WHEN** l’utilisateur configure un nombre de slides visibles par breakpoint puis sauvegarde la page
- **THEN** les valeurs configurées sont restituées après rechargement et le rendu affiche le bon `slidesPerView` pour chaque breakpoint

### Requirement: Aspect ratio des images du diaporama
Le nœud NodeSlideshow SHALL exposer un champ `aspect-ratio` permettant d’influencer le ratio d’affichage des images.

Le nœud SHALL appliquer cet aspect ratio au conteneur de l’image afin que la hauteur du visuel suive le ratio choisi (sauf en mode `auto`).

#### Scenario: Aspect ratio preset
- **WHEN** l’utilisateur sélectionne un aspect ratio comme `16/9` ou `4/3`
- **THEN** la hauteur des slides s’ajuste pour respecter le ratio choisi et l’image remplit le conteneur via `object-fit: cover`

#### Scenario: Mode auto
- **WHEN** l’utilisateur sélectionne l’option `auto` pour `aspect-ratio`
- **THEN** le conteneur ne force pas un ratio fixe et le rendu suit la hauteur native (comportement par défaut)

