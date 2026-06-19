## ADDED Requirements

### Requirement: Liens inactifs en mode édition du canevas

En mode **édition** du builder, les éléments du **canevas** (`admin-layout__main`) capables de provoquer une **navigation** (liens `<a href>`, ancres équivalentes dans le contenu riche, boutons-lien des nœuds) SHALL **ne pas déclencher de navigation** ni quitter le builder. Un clic sur ces éléments SHALL permettre la **sélection** du nœud parent via le chrome d’édition (conteneur de bloc, navigateur de composants).

En mode **prévisualisation** et en **view** (rendu public), ces liens SHALL conserver leur comportement de navigation habituel.

Les **iframes** et lecteurs embarqués (ex. `NodeYoutube`) qui interceptent les clics SHALL être neutralisés en mode édition afin de ne pas empêcher la sélection du nœud.

Cette règle SHALL s’appliquer au contenu rendu dans le canevas uniquement ; elle SHALL **exclure** le chrome du builder (header, sidebars, contrôles hors canevas).

#### Scenario: Lien de menu sans navigation en édition

- **WHEN** le builder est en mode édition
- **AND** un `NodeNavItem` ou un lien de `NodeNavApi` affiche un `href` valide
- **AND** l’utilisateur clique sur ce lien dans le canevas
- **THEN** aucune navigation n’est déclenchée et l’utilisateur reste dans le builder
- **AND** le nœud menu ou l’élément ciblé peut être sélectionné

#### Scenario: Lien actif en prévisualisation

- **WHEN** le builder est en mode prévisualisation
- **AND** un nœud affiche un lien cliquable dans le canevas
- **AND** l’utilisateur clique sur ce lien
- **THEN** la navigation vers l’URL configurée est déclenchée selon le `target` du lien

#### Scenario: Lien dans NodeRichText en édition

- **WHEN** le builder est en mode édition
- **AND** un `NodeRichText` contient un lien inséré via l’éditeur riche
- **AND** l’utilisateur clique sur ce lien dans l’aperçu du canevas
- **THEN** aucune navigation n’est déclenchée
- **AND** l’utilisateur peut sélectionner le `NodeRichText` (via le conteneur ou l’Explorer)

#### Scenario: Slide NodeSlideshow avec lien en édition

- **WHEN** le builder est en mode édition
- **AND** une slide de `NodeSlideshow` a un champ `link` renseigné
- **AND** l’utilisateur clique sur l’image ou le lien de la slide
- **THEN** aucune navigation n’est déclenchée

#### Scenario: NodeYoutube sélectionnable en édition

- **WHEN** le builder est en mode édition
- **AND** un `NodeYoutube` affiche un lecteur embarqué avec un `videoId` valide
- **AND** l’utilisateur clique sur la zone du lecteur dans le canevas
- **THEN** le nœud `NodeYoutube` peut être sélectionné
- **AND** le lecteur ne capture pas le clic pour lancer la lecture ou ouvrir YouTube

#### Scenario: NodeYoutube interactif en prévisualisation

- **WHEN** le builder est en mode prévisualisation
- **AND** un `NodeYoutube` affiche un lecteur embarqué
- **THEN** l’utilisateur peut interagir avec le lecteur YouTube normalement
