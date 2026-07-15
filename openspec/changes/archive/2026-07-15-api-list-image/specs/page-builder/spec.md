## MODIFIED Requirements

### Requirement: Gestion des slides images (ajout, tri, suppression, modification)

Le nœud NodeSlideshow SHALL permettre à l'utilisateur de gérer la liste des slides images en choisissant un mode de source :
- mode `manual` : la liste des slides est éditée directement dans le panneau (ajout, suppression, tri drag-and-drop, édition `src`/`alt`)
- mode `api-endpoint` : la liste des slides est déterminée par la sélection d'une **ApiListImage** (collection fixe) dans le panneau ; le système charge la collection à l'affichage via `GET /api/page-builder/lists-image/{apiId}/items` et la mappe en slides, sans persister les données de la collection dans le contenu du nœud.

En mode `manual`, le nœud SHALL exposer un champ `link` optionnel par slide ; lorsque `link` est renseigné, la slide SHALL être cliquable dans la preview et le rendu final. En mode `api-endpoint`, les liens SHALL provenir du champ `link` du mapping ApiListImage de chaque item ; le texte alternatif SHALL provenir du champ `alt` (ou être vide si absent).

Après chaque action en mode `manual`, l'ordre et le contenu SHALL être immédiatement reflétés dans la preview. En mode `api-endpoint`, la preview SHALL refléter la collection API courante (rechargée à l'affichage ou via le bouton « Recharger » du panneau).

Le changement de mode (`manual` <-> `api-endpoint`) SHALL réinitialiser la source des slides affichées (liste manuelle vide ou placeholder en mode API) et SHALL purger toute donnée de slide persistée lorsque le mode API est actif.

En mode `api-endpoint`, la sélection de l'API SHALL utiliser le catalogue `GET /api/page-builder/lists-image` (et non `ApiManagerModal` / `/api/page-builder/cards`).

#### Scenario: Tri par drag-and-drop en mode manuel

- **WHEN** l'utilisateur réordonne les slides en mode `manual` par glisser-déposer
- **THEN** l'ordre des slides dans le contenu persisté et la preview SHALL être mis à jour immédiatement

#### Scenario: Ajout d'une slide en mode manuel

- **WHEN** l'utilisateur ajoute une slide en mode `manual` (via médiathèque ou URL)
- **THEN** la slide apparaît dans la liste et la preview

#### Scenario: Suppression d'une slide en mode manuel

- **WHEN** l'utilisateur supprime une slide en mode `manual`
- **THEN** la slide disparaît de la liste et de la preview

#### Scenario: Sélection d'un endpoint API pour afficher les slides

- **WHEN** l'utilisateur passe en mode `api-endpoint`
- **AND** l'utilisateur sélectionne une ApiListImage via le catalogue `/api/page-builder/lists-image`
- **THEN** les slides sont chargées depuis la collection de l'API sélectionnée pour la preview
- **AND** seuls `slidesMode` et `apiId` sont persistés dans le contenu du nœud

#### Scenario: Données API fraîches à l'affichage

- **WHEN** un NodeSlideshow en mode `api-endpoint` avec un `apiId` valide est affiché (éditeur, preview ou rendu final)
- **THEN** le système appelle `GET /api/page-builder/lists-image/{apiId}/items` et mappe les items en slides (`src` ← `image`, `alt` ← `alt`, `link` ← `link`)
- **AND** le rendu reflète la collection courante de l'API, indépendamment d'un éventuel snapshot `slides` présent dans d'anciennes sauvegardes

#### Scenario: Rechargement manuel dans le panneau

- **WHEN** l'utilisateur clique sur "Recharger" en mode `api-endpoint`
- **THEN** la preview des vignettes est rafraîchie depuis l'API sans écrire les slides dans le contenu persisté du nœud

#### Scenario: Lien optionnel par slide en mode manuel

- **WHEN** l'utilisateur renseigne un champ `link` sur une slide en mode `manual`
- **THEN** la slide est cliquable dans la preview et le rendu final avec l'URL configurée

#### Scenario: API indisponible ou collection vide en mode API

- **WHEN** l'API sélectionnée ne répond pas, retourne une erreur ou une collection vide en mode `api-endpoint`
- **THEN** le NodeSlideshow affiche un état dégradé (placeholder ou message discret) sans empêcher la sauvegarde de la page

#### Scenario: Sélection d'API sans mélange avec le catalogue Font

- **WHEN** l'utilisateur configure la source API d'un NodeSlideshow
- **THEN** le sélecteur n'affiche que les sources `ApiListImage` du catalogue `/api/page-builder/lists-image` ; les endpoints du catalogue `Font` (`/api/builder/fonts`) et les `ApiCard` (`/api/page-builder/cards`) ne figurent pas dans cette liste
