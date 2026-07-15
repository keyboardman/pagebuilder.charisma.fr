## MODIFIED Requirements

### Requirement: Menu de navigation piloté par API (NodeNavApi)

Le builder SHALL fournir un type de nœud **NodeNavApi** (identifiant `node-nav-api`) qui affiche un menu de navigation alimenté par une **ApiListArticle** (voir capacité `node-list-api-apilist-base`). Le nœud SHALL exposer un champ **apiId** pour sélectionner la source. Le nœud SHALL charger la collection complète via `GET /api/page-builder/lists/{apiId}/items` (sans paramètres de pagination) et SHALL rendre chaque item mappé comme un lien (`title` → libellé, `link` → `href`). Le nœud SHALL exposer une option **target** (`_self` ou `_blank`) appliquée à tous les liens du menu ; cette option SHALL être configurée côté **NodeNavApi** et ne SHALL pas dépendre du mapping ApiListArticle. Le nœud SHALL **ne pas** être droppable et SHALL **ne pas** accepter d'enfants **NodeNavItem** : les entrées proviennent uniquement de l'API.

Le NodeNavApi SHALL exposer dans ses réglages **page** (entier ≥ 1) et **itemsPerPage** (10, 20 ou 30) pour limiter le nombre de liens **affichés** à partir de la collection chargée. Lorsque `itemsPerPage` est absent, le nœud SHALL afficher tous les items de la collection (rétrocompatibilité). Le découpage SHALL s'appliquer localement : `items affichés = collection.slice((page - 1) * itemsPerPage, page * itemsPerPage)`.

Le NodeNavApi SHALL réutiliser les options de présentation du **NodeNav** : **direction** (horizontal, vertical), **variante** (`navbar`, `liste`) avec hooks DOM (`data-ce-variant`, classe `ce-menu--{variant}` sur le conteneur `<nav>`), **icône burger** (booléen) pour regrouper les liens sur petit viewport, ainsi que les réglages d'alignement et d'espacement équivalents (ex. `justify`, `gap`) lorsqu'ils sont supportés par **NodeNav**. Le NodeNavApi SHALL exposer une option **scrollWithoutScrollbar** (défilement sans barre visible) : lorsqu'elle est activée, les liens dépassant la largeur (ou la hauteur en mode vertical) SHALL être scrollables à la souris (molette, trackpad) et au tactile, sans afficher de barre de défilement.

#### Scenario: Ajout d'un NodeNavApi depuis le panneau

- **WHEN** l'utilisateur ajoute un bloc menu API (NodeNavApi) depuis le panneau des composants
- **THEN** un nœud `node-nav-api` est inséré ; l'utilisateur peut choisir une ApiListArticle dans les réglages ; aucun enfant manuel n'est attendu

#### Scenario: Sélection d'une API list

- **WHEN** l'utilisateur ouvre les réglages du NodeNavApi et choisit une API
- **THEN** les sources exposées par `/api/page-builder/lists` sont proposées ; après validation, `apiId` est persisté dans le contenu du nœud

#### Scenario: Rendu des liens depuis la collection

- **WHEN** le NodeNavApi a un `apiId` valide et que l'endpoint collection retourne des items mappés
- **THEN** le builder affiche un `<nav>` contenant un lien par item (`<a href="…">` avec le libellé `title`) dans l'éditeur, la prévisualisation et le rendu exporté

#### Scenario: Limitation d'affichage par page et itemsPerPage

- **WHEN** l'utilisateur configure `page = 2` et `itemsPerPage = 10` sur un NodeNavApi dont la collection contient 25 items
- **THEN** le nœud affiche uniquement les items 11 à 20, sans nouvel appel backend

#### Scenario: Rétrocompatibilité sans itemsPerPage

- **WHEN** un NodeNavApi existant n'a pas de `content.itemsPerPage` persisté
- **THEN** le nœud affiche tous les items de la collection, comme avant ce changement

#### Scenario: Option target appliquée à tous les liens

- **WHEN** l'utilisateur configure l'option **target** du NodeNavApi sur `_blank`
- **THEN** tous les liens rendus depuis la collection API utilisent `target="_blank"` (et `rel="noopener noreferrer"`) quel que soit le contenu mappé par l'ApiListArticle

#### Scenario: Options direction et variante

- **WHEN** l'utilisateur modifie la direction ou la variante (`navbar` / `liste`) du NodeNavApi
- **THEN** le rendu applique les mêmes conventions DOM que **NodeNav** (`data-ce-variant`, `ce-menu--{variant}`) pour permettre le styling CSS thème

#### Scenario: Défilement sans barre de scroll

- **WHEN** l'utilisateur active l'option de défilement sans barre sur un NodeNavApi horizontal contenant plus de liens que la largeur disponible
- **THEN** le menu permet de faire défiler les liens à la molette ou au glissement tactile sans afficher de scrollbar ; en mode vertical, le défilement suit l'axe vertical

#### Scenario: Menu burger sur petit viewport

- **WHEN** l'utilisateur active l'option burger sur un NodeNavApi
- **THEN** sur viewport tablette/mobile (selon les mêmes règles que **NodeNav**), une icône burger permet d'afficher ou masquer la liste des liens issus de l'API

#### Scenario: API indisponible ou vide

- **WHEN** l'API sélectionnée ne répond pas, retourne une erreur ou une collection vide
- **THEN** le NodeNavApi affiche un état dégradé (menu vide ou message discret) sans empêcher la sauvegarde de la page

#### Scenario: Persistance du NodeNavApi

- **WHEN** l'utilisateur sauvegarde une page contenant un NodeNavApi configuré
- **THEN** le contenu sérialisé conserve `apiId`, `page`, `itemsPerPage`, les options de présentation (direction, variante, burger, etc.) et permet de recharger le menu à l'affichage

### Requirement: Liste d'items pilotée par API (NodeListApi)

Le builder SHALL fournir un type de nœud **NodeListApi** (identifiant `node-list-api`) qui affiche une liste d'items alimentée par une **ApiListArticle** (voir capacité `node-list-api-apilist-base`). Le nœud SHALL exposer un champ **apiId** pour sélectionner la source. Le nœud SHALL charger la collection complète via `GET /api/page-builder/lists/{apiId}/items` (sans paramètres de pagination) et SHALL rendre chaque item mappé dans une structure de liste. Le nœud SHALL **ne pas** être droppable et SHALL **ne pas** accepter d'enfants : les entrées proviennent uniquement de l'API.

Le NodeListApi SHALL exposer dans ses réglages **page** (entier ≥ 1) et **itemsPerPage** (10, 20 ou 30) pour limiter le nombre d'éléments **affichés** à partir de la collection chargée. Lorsque `itemsPerPage` est absent, le nœud SHALL afficher tous les items de la collection (rétrocompatibilité). Le découpage SHALL s'appliquer localement : `items affichés = collection.slice((page - 1) * itemsPerPage, page * itemsPerPage)`.

Pour chaque item, le nœud SHALL pouvoir afficher optionnellement **titre**, **description**, **compteur** et **like**, contrôlés par `content.show.title`, `content.show.description`, `content.show.counter` et `content.show.like`. Le nœud SHALL **ne pas** afficher d'image, y compris via le champ `image` du mapping ApiListArticle ou des balises `<img>` dans le contenu HTML. Lorsqu'un toggle `show` est activé mais que le champ correspondant est absent dans l'item mappé, le nœud SHALL omettre cet élément sans réserver d'espace vide. Lorsqu'un toggle `show` est désactivé, le nœud SHALL ne pas rendre cet élément quel que soit le contenu mappé.

Le NodeListApi SHALL exposer des réglages de style par sous-partie (conteneur liste, item, titre, description, compteur, like) et SHALL utiliser des hooks DOM (`ce-list-api`, `ce-list-api-item`, et classes dérivées par sous-partie) pour le ciblage CSS thème. Si l'item mappé fournit un `link`, le nœud SHALL permettre une navigation vers cette URL (comportement aligné sur **NodeCardApi** pour les zones cliquables).

#### Scenario: Ajout d'un NodeListApi depuis le panneau

- **WHEN** l'utilisateur ajoute un bloc liste API (NodeListApi) depuis le panneau des composants
- **THEN** un nœud `node-list-api` est inséré ; l'utilisateur peut choisir une ApiListArticle dans les réglages ; aucun enfant manuel n'est attendu

#### Scenario: Sélection d'une API éligible

- **WHEN** l'utilisateur ouvre les réglages du NodeListApi et choisit une API
- **THEN** les sources exposées par `/api/page-builder/lists` sont proposées ; après validation, `apiId` est persisté dans le contenu du nœud

#### Scenario: Rendu des items depuis la collection

- **WHEN** le NodeListApi a un `apiId` valide et que l'endpoint collection retourne des items mappés
- **THEN** le builder affiche une liste contenant un item par entrée de la collection dans l'éditeur, la prévisualisation et le rendu exporté

#### Scenario: Limitation d'affichage par page et itemsPerPage

- **WHEN** l'utilisateur configure `page = 1` et `itemsPerPage = 20` sur un NodeListApi dont la collection contient 50 items
- **THEN** le nœud affiche uniquement les 20 premiers items, sans nouvel appel backend

#### Scenario: Rétrocompatibilité sans itemsPerPage

- **WHEN** un NodeListApi existant n'a pas de `content.itemsPerPage` persisté
- **THEN** le nœud affiche tous les items de la collection, comme avant ce changement

#### Scenario: Affichage conditionnel titre, description, compteur et like

- **WHEN** l'utilisateur active `show.title`, `show.description`, `show.counter` et `show.like` et que l'item mappé contient ces champs
- **THEN** chaque item de la liste affiche le titre, la description, le compteur et le like correspondants, sans image

#### Scenario: Champ absent dans l'item mappé

- **WHEN** `show.counter` est activé mais que l'item mappé ne fournit pas de `counter`
- **THEN** le compteur n'est pas rendu pour cet item et aucun placeholder vide n'est affiché

#### Scenario: Toggle show désactivé

- **WHEN** l'utilisateur désactive `show.description`
- **THEN** la description n'est pas rendue pour aucun item de la liste, même si présente dans le mapping ApiListArticle

#### Scenario: Lien sur item

- **WHEN** un item mappé fournit un `link` valide
- **THEN** le rendu expose une zone ou un wrapper cliquable menant vers cette URL (comportement cohérent avec les cards API existantes)

#### Scenario: API indisponible ou collection vide

- **WHEN** l'API sélectionnée ne répond pas, retourne une erreur ou une collection vide
- **THEN** le NodeListApi affiche un état dégradé (liste vide ou message discret) sans empêcher la sauvegarde de la page

#### Scenario: Persistance du NodeListApi

- **WHEN** l'utilisateur sauvegarde une page contenant un NodeListApi configuré
- **THEN** le contenu sérialisé conserve `apiId`, `page`, `itemsPerPage`, les toggles `show` et les styles configurés, et permet de recharger la liste à l'affichage
