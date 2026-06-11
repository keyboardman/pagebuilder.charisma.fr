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

#### Scenario: Persistance de la configuration du node en mode manuel
- **WHEN** l’utilisateur sauvegarde la page contenant un NodeSlideshow en mode `manual`
- **THEN** les images (dans leur ordre), leurs métadonnées de slide (dont `alt`, source d'image et lien éventuel), ainsi que les options d’affichage Swiper définies, sont sérialisées et restituées lors d’un rechargement

#### Scenario: Persistance de la configuration du node en mode API
- **WHEN** l’utilisateur sauvegarde la page contenant un NodeSlideshow en mode `api-endpoint`
- **THEN** le contenu sérialisé conserve `slidesMode`, `apiId` et les options d’affichage Swiper
- **AND** le contenu sérialisé ne conserve pas le tableau `slides` issu de l’API (snapshot)
- **AND** les slides sont rechargées depuis l’API à l’affichage ultérieur

### Requirement: Gestion des slides images (ajout, tri, suppression, modification)
Le nœud NodeSlideshow SHALL permettre à l’utilisateur de gérer la liste des slides images en choisissant un mode de source :
- mode `manual` : la liste des slides est éditée directement dans le panneau (ajout, suppression, tri drag-and-drop, édition `src`/`alt`)
- mode `api-endpoint` : la liste des slides est déterminée par la sélection d’un endpoint API image (collection fixe) dans le panneau ; le système charge la collection à l’affichage via `fetchCollection` et la mappe en slides, sans persister les données de la collection dans le contenu du nœud.

En mode `manual`, le nœud SHALL exposer un champ `link` optionnel par slide ; lorsque `link` est renseigné, la slide SHALL être cliquable dans la preview et le rendu final. En mode `api-endpoint`, les liens SHALL provenir du mapping ApiCard (`mapItem`) de chaque item.

Après chaque action en mode `manual`, l’ordre et le contenu SHALL être immédiatement reflétés dans la preview. En mode `api-endpoint`, la preview SHALL refléter la collection API courante (rechargée à l’affichage ou via le bouton « Recharger » du panneau).

Le changement de mode (`manual` <-> `api-endpoint`) SHALL réinitialiser la source des slides affichées (liste manuelle vide ou placeholder en mode API) et SHALL purger toute donnée de slide persistée lorsque le mode API est actif.

#### Scenario: Tri par drag-and-drop en mode manuel
- **WHEN** l’utilisateur est en mode `manual`
- **AND** l’utilisateur réordonne les slides par drag-and-drop
- **THEN** l’ordre Swiper correspond à l’ordre visuel dans la liste

#### Scenario: Ajout de slide en mode manuel (saisie d’URL)
- **WHEN** l’utilisateur est en mode `manual`
- **AND** l’utilisateur clique sur “Ajouter une slide”
- **AND** l’utilisateur renseigne une URL dans le champ “Source (URL)”
- **THEN** une nouvelle slide apparaît dans la liste et la preview est mise à jour

#### Scenario: Suppression de la slide sélectionnée
- **WHEN** l’utilisateur est en mode `manual`
- **AND** l’utilisateur sélectionne une slide puis clique “Supprimer”
- **THEN** la slide est retirée de la liste et la preview est mise à jour

#### Scenario: Sélection d’un endpoint API pour afficher les slides
- **WHEN** l’utilisateur passe en mode `api-endpoint`
- **AND** l’utilisateur sélectionne une API image fixe dans le sélecteur “Endpoint API (image fixed)”
- **THEN** les slides sont chargées depuis la collection de l’API sélectionnée pour la preview
- **AND** seuls `slidesMode` et `apiId` sont persistés dans le contenu du nœud

#### Scenario: Données API fraîches à l’affichage
- **WHEN** un NodeSlideshow en mode `api-endpoint` avec un `apiId` valide est affiché (éditeur, preview ou rendu final)
- **THEN** le système appelle `fetchCollection` sur l’API référencée et mappe les items en slides
- **AND** le rendu reflète la collection courante de l’API, indépendamment d’un éventuel snapshot `slides` présent dans d’anciennes sauvegardes

#### Scenario: Rechargement manuel dans le panneau
- **WHEN** l’utilisateur clique sur “Recharger” en mode `api-endpoint`
- **THEN** la preview des vignettes est rafraîchie depuis l’API sans écrire les slides dans le contenu persisté du nœud

#### Scenario: Lien optionnel par slide en mode manuel
- **WHEN** l’utilisateur est en mode `manual`
- **AND** l’utilisateur renseigne une URL de lien sur une slide
- **THEN** la slide devient cliquable dans le rendu
- **WHEN** l’utilisateur vide le champ de lien
- **THEN** la slide redevient non cliquable

#### Scenario: API indisponible ou collection vide en mode API
- **WHEN** l’API sélectionnée ne répond pas, retourne une erreur ou une collection vide en mode `api-endpoint`
- **THEN** le NodeSlideshow affiche un état dégradé (placeholder ou message discret) sans empêcher la sauvegarde de la page
