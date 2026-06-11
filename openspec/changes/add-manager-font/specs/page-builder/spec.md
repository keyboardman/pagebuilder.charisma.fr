## ADDED Requirements

### Requirement: ManagerFont — sélection de polices du catalogue à la demande

Le builder SHALL fournir un composant **ManagerFont** (modale de recherche et sélection) permettant à l’utilisateur de choisir une police parmi le catalogue `Font` (native, Google, custom) sans charger l’intégralité du catalogue au démarrage. La modale SHALL proposer une recherche textuelle et une pagination côté serveur. Lors de la sélection, le builder SHALL recevoir les métadonnées nécessaires au chargement (`id`, `name`, `fontFamily`, `href`) et les appliquer au champ `font-family` en cours d’édition.

#### Scenario: Ouverture de ManagerFont depuis un sélecteur font-family

- **WHEN** l’utilisateur clique sur l’action d’ajout de police dans un sélecteur `font-family` (ex. `FontFamilySelect` dans `Text2Settings`)
- **THEN** la modale ManagerFont s’ouvre ; seules les polices correspondant à la recherche et à la page courante de pagination sont chargées depuis le backend

#### Scenario: Sélection d’une police Google hors thème

- **WHEN** l’utilisateur recherche et sélectionne une police Google qui n’est pas dans les polices du thème
- **THEN** la modale se ferme ; la police est ajoutée aux polices de la page ; le champ `font-family` reçoit la valeur `fontFamily` correspondante ; la police est visible dans l’iframe d’édition

### Requirement: Registre d’usage des polices de page (FontUsageRegistry)

Le builder SHALL maintenir un registre des polices actives sur la page courante (`FontUsageRegistry`). Une police SHALL être considérée active lorsqu’au moins un node (ou une sous-partie de style d’un node) référence sa `fontFamily`, ou lorsqu’elle vient d’être sélectionnée via ManagerFont. Lorsque plus aucune référence n’existe pour une police de page, elle SHALL être retirée du registre et déchargée de la page d’édition (sans affecter les polices builtin ni les polices du thème).

#### Scenario: Ajout d’une police via ManagerFont

- **WHEN** l’utilisateur sélectionne une police via ManagerFont et l’applique à un node
- **THEN** le registre incrémente le compteur de cette police ; `registerFont` charge la feuille ou le `@font-face` dans l’iframe ; la police apparaît dans les options du sélecteur `font-family`

#### Scenario: Retrait automatique d’une police non utilisée

- **WHEN** l’utilisateur modifie ou supprime tous les nodes qui référençaient une police de page (hors thème et hors builtins)
- **THEN** le registre décrémente les compteurs ; lorsque le compteur atteint 0, la police est retirée des options et `unregisterFont` supprime son injection DOM dans l’iframe

#### Scenario: Resynchronisation au chargement d’une page existante

- **WHEN** le builder charge une page dont le JSON de nodes contient déjà des valeurs `fontFamily` correspondant à des polices du catalogue
- **THEN** un scanner parcourt les nodes, résout les polices via l’API backend et initialise le registre ; seules ces polices sont chargées en plus du thème et des builtins

### Requirement: Sélecteur font-family enrichi

Le composant `FontFamilySelect` SHALL proposer : (1) les polices navigateur intégrées (builtins) ; (2) les polices du thème (`themeFonts`) ; (3) les polices actives de la page (`FontUsageRegistry`). Il SHALL exposer une action pour ouvrir ManagerFont et ajouter une police du catalogue. Il SHALL NOT charger ni lister l’intégralité du catalogue `Font` en base.

#### Scenario: Options limitées au boot

- **WHEN** le builder démarre sur une page sans police custom dans les nodes
- **THEN** le sélecteur `font-family` affiche uniquement les builtins et les polices du thème

#### Scenario: Options enrichies après usage

- **WHEN** une police hors thème est utilisée sur la page
- **THEN** elle apparaît dans le sélecteur en plus des builtins et des polices thème, sans que toutes les polices du catalogue aient été chargées

### Requirement: Chargement des polices de page en preview et rendu public

Lors de la preview ou du rendu public d’une page, le système SHALL charger les polices référencées dans le contenu JSON de la page mais absentes du CSS de thème, afin que le rendu corresponde à l’éditeur. Le chargement SHALL être limité aux polices effectivement utilisées dans le contenu.

#### Scenario: Preview avec police hors thème

- **WHEN** une page contient un node dont le style utilise une police Google non incluse dans le thème
- **THEN** la preview injecte la feuille ou le `@font-face` de cette police ; le texte s’affiche avec la bonne famille typographique
