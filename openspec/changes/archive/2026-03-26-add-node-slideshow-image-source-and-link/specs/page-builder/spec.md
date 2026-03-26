## MODIFIED Requirements
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
- **THEN** les images (dans leur ordre), leurs métadonnées de slide (dont `alt`, source d'image et lien éventuel), ainsi que les options d’affichage Swiper définies, sont sérialisées et restituées lors d’un rechargement

### Requirement: Gestion des slides images (ajout, tri, suppression, modification)
Le nœud NodeSlideshow SHALL permettre à l’utilisateur de gérer la liste des slides images en choisissant un mode de source :
- mode `manual` : la liste des slides est éditée directement dans le panneau (ajout, suppression, tri drag-and-drop, édition `src`/`alt`)
- mode `api-endpoint` : la liste des slides est déterminée par la sélection d’un endpoint API image (collection fixe) dans le panneau ; le système charge automatiquement la collection et la mappe en slides.

Dans les deux modes, le nœud SHALL exposer un champ `link` optionnel par slide ; lorsque `link` est renseigné, la slide SHALL être cliquable dans la preview et le rendu final.

Après chaque action, l’ordre et le contenu SHALL être immédiatement reflétés dans la preview.

Le changement de mode (`manual` <-> `api-endpoint`) SHALL réinitialiser la liste des slides affichée (et recharger depuis l’API lorsque `api-endpoint` est sélectionné).

#### Scenario: Tri par drag-and-drop
- **WHEN** l’utilisateur réordonne les slides par drag-and-drop
- **THEN** l’ordre Swiper correspond à l’ordre visuel dans la liste

#### Scenario: Ajout de slide en mode manuel (saisie d’URL)
- **WHEN** l’utilisateur est en mode `manual`
- **AND** l’utilisateur clique sur “Ajouter une slide”
- **AND** l’utilisateur renseigne une URL dans le champ “Source (URL)”
- **THEN** une nouvelle slide apparaît dans la liste et la preview est mise à jour

#### Scenario: Suppression de la slide sélectionnée
- **WHEN** l’utilisateur sélectionne une slide puis clique “Supprimer”
- **THEN** la slide est retirée de la liste et la preview est mise à jour

#### Scenario: Sélection d’un endpoint API pour charger les slides
- **WHEN** l’utilisateur passe en mode `api-endpoint`
- **AND** l’utilisateur sélectionne une API image fixe dans le sélecteur “Endpoint API (image fixed)”
- **THEN** les slides sont chargées automatiquement depuis la collection de l’API sélectionnée

#### Scenario: Lien optionnel par slide
- **WHEN** l’utilisateur renseigne une URL de lien sur une slide
- **THEN** la slide devient cliquable dans le rendu
- **WHEN** l’utilisateur vide le champ de lien
- **THEN** la slide redevient non cliquable
