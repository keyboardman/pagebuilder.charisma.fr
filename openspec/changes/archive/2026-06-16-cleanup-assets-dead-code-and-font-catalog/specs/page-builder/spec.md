## ADDED Requirements

### Requirement: Audit et retrait du code mort frontend

Le projet SHALL maintenir le dossier `assets/` exempt de modules, entrées Webpack et exports explicitement morts (fichiers non référencés par le build Encore, les templates Twig ou le code TypeScript/JavaScript actif). Toute évolution du flux polices ou des sélecteurs API du builder SHALL être précédée d’un inventaire documenté des candidats à la suppression et de la validation qu’aucun template ou entrypoint ne les référence encore.

#### Scenario: Inventaire avant modification fonts ou API

- **WHEN** une tâche vise à modifier le sélecteur de polices ou la sélection d’API d’un nœud (ex. NodeSlideshow)
- **THEN** un inventaire des fichiers et exports non référencés dans `assets/` est produit et les suppressions confirmées sont appliquées avant le changement fonctionnel

#### Scenario: Build après nettoyage

- **WHEN** des fichiers ou entrées Webpack morts sont retirés de `assets/`
- **THEN** la compilation Encore réussit et les entrypoints actifs (`pageBuilderStandalone`, `pagePreview`, `ThemeForm2`, `app`, `fileManager`) restent fonctionnels

## MODIFIED Requirements

### Requirement: Sélecteur font-family enrichi

Le composant `FontFamilySelect` SHALL proposer : (1) les polices navigateur intégrées (builtins) ; (2) les polices du thème (`themeFonts`) ; (3) les polices actives de la page (`FontUsageRegistry`). Il SHALL exposer une action pour ouvrir ManagerFont et ajouter une police du catalogue (Google ou custom via `GET /api/builder/fonts`). Il SHALL NOT charger ni lister l’intégralité du catalogue `Font` en base au démarrage. Les anciens chemins parallèles de sélection de polices (formulaire thème legacy, contrôleurs Stimulus autocomplete non branchés) SHALL NOT être requis pour accéder au catalogue une fois le nettoyage `assets/` effectué.

#### Scenario: Options limitées au boot

- **WHEN** le builder démarre sur une page sans police custom dans les nodes
- **THEN** le sélecteur `font-family` affiche uniquement les builtins et les polices du thème

#### Scenario: Options enrichies après usage

- **WHEN** une police hors thème est utilisée sur la page
- **THEN** elle apparaît dans le sélecteur en plus des builtins et des polices thème, sans que toutes les polices du catalogue aient été chargées

#### Scenario: Ajout via ManagerFont après nettoyage assets

- **WHEN** l’utilisateur ouvre « Ajouter une police… » dans un `FontFamilySelect` et que `pageBuilderApiBaseUrl` est configuré
- **THEN** la modale ManagerFont charge le catalogue paginé depuis `/api/builder/fonts` ; la police sélectionnée est enregistrée dans `FontUsageRegistry` et apparaît dans le sélecteur

### Requirement: Gestion des slides images (ajout, tri, suppression, modification)

Le nœud NodeSlideshow SHALL permettre à l’utilisateur de gérer la liste des slides images en choisissant un mode de source :
- mode `manual` : la liste des slides est éditée directement dans le panneau (ajout, suppression, tri drag-and-drop, édition `src`/`alt`)
- mode `api-endpoint` : la liste des slides est déterminée par la sélection d’un endpoint API image (collection fixe) dans le panneau ; le système charge la collection à l’affichage via `fetchCollection` et la mappe en slides, sans persister les données de la collection dans le contenu du nœud.

En mode `manual`, le nœud SHALL exposer un champ `link` optionnel par slide ; lorsque `link` est renseigné, la slide SHALL être cliquable dans la preview et le rendu final. En mode `api-endpoint`, les liens SHALL provenir du mapping ApiCard (`mapItem`) de chaque item.

Après chaque action en mode `manual`, l’ordre et le contenu SHALL être immédiatement reflétés dans la preview. En mode `api-endpoint`, la preview SHALL refléter la collection API courante (rechargée à l’affichage ou via le bouton « Recharger » du panneau).

Le changement de mode (`manual` <-> `api-endpoint`) SHALL réinitialiser la source des slides affichées (liste manuelle vide ou placeholder en mode API) et SHALL purger toute donnée de slide persistée lorsque le mode API est actif.

En mode `api-endpoint`, la sélection de l’API SHALL utiliser le composant standard `ApiManagerModal` avec filtre de type `image` et mode de collection `fixed`, de sorte que seules les APIs cards image adaptées au diaporama sont proposées (sans mélange avec le catalogue de polices servi par `/api/builder/fonts`).

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
- **AND** l’utilisateur sélectionne une API image fixe via `ApiManagerModal` (filtre type `image`, collection `fixed`)
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

#### Scenario: Sélection d’API sans mélange avec le catalogue Font

- **WHEN** l’utilisateur configure la source API d’un NodeSlideshow
- **THEN** `ApiManagerModal` n’affiche que les APIs cards de type `image` en collection `fixed` ; les endpoints du catalogue `Font` (`/api/builder/fonts`) ne figurent pas dans cette liste
