## ADDED Requirements

### Requirement: Menu de navigation piloté par API (NodeNavApi)

Le builder SHALL fournir un type de nœud **NodeNavApi** (identifiant `node-nav-api`) qui affiche un menu de navigation alimenté par une **ApiCard** de type `list` (voir capacité `builder-api-registry`). Le nœud SHALL exposer un champ **apiId** pour sélectionner la source. Le nœud SHALL charger la collection via les endpoints Symfony (`fetchCollection`) et SHALL rendre chaque item mappé comme un lien (`title` → libellé, `link` → `href`). Le nœud SHALL exposer une option **target** (`_self` ou `_blank`) appliquée à tous les liens du menu ; cette option SHALL être configurée côté **NodeNavApi** et ne SHALL pas dépendre du mapping ApiCard `list`. Le nœud SHALL **ne pas** être droppable et SHALL **ne pas** accepter d’enfants **NodeNavItem** : les entrées proviennent uniquement de l’API.

Le NodeNavApi SHALL réutiliser les options de présentation du **NodeNav** : **direction** (horizontal, vertical), **variante** (`navbar`, `liste`) avec hooks DOM (`data-ce-variant`, classe `ce-menu--{variant}` sur le conteneur `<nav>`), **icône burger** (booléen) pour regrouper les liens sur petit viewport, ainsi que les réglages d’alignement et d’espacement équivalents (ex. `justify`, `gap`) lorsqu’ils sont supportés par **NodeNav**. Le NodeNavApi SHALL exposer une option **scrollWithoutScrollbar** (défilement sans barre visible) : lorsqu’elle est activée, les liens dépassant la largeur (ou la hauteur en mode vertical) SHALL être scrollables à la souris (molette, trackpad) et au tactile, sans afficher de barre de défilement.

#### Scenario: Ajout d’un NodeNavApi depuis le panneau

- **WHEN** l’utilisateur ajoute un bloc menu API (NodeNavApi) depuis le panneau des composants
- **THEN** un nœud `node-nav-api` est inséré ; l’utilisateur peut choisir une API de type `list` dans les réglages ; aucun enfant manuel n’est attendu

#### Scenario: Sélection d’une API list

- **WHEN** l’utilisateur ouvre les réglages du NodeNavApi et choisit une API
- **THEN** seules les APIs enregistrées avec le type `list` sont proposées ; après validation, `apiId` est persisté dans le contenu du nœud

#### Scenario: Rendu des liens depuis la collection

- **WHEN** le NodeNavApi a un `apiId` valide et que l’endpoint collection retourne des items mappés
- **THEN** le builder affiche un `<nav>` contenant un lien par item (`<a href="…">` avec le libellé `title`) dans l’éditeur, la prévisualisation et le rendu exporté

#### Scenario: Option target appliquée à tous les liens

- **WHEN** l’utilisateur configure l’option **target** du NodeNavApi sur `_blank`
- **THEN** tous les liens rendus depuis la collection API utilisent `target="_blank"` (et `rel="noopener noreferrer"`) quel que soit le contenu mappé par l’ApiCard `list`

#### Scenario: Options direction et variante

- **WHEN** l’utilisateur modifie la direction ou la variante (`navbar` / `liste`) du NodeNavApi
- **THEN** le rendu applique les mêmes conventions DOM que **NodeNav** (`data-ce-variant`, `ce-menu--{variant}`) pour permettre le styling CSS thème

#### Scenario: Défilement sans barre de scroll

- **WHEN** l’utilisateur active l’option de défilement sans barre sur un NodeNavApi horizontal contenant plus de liens que la largeur disponible
- **THEN** le menu permet de faire défiler les liens à la molette ou au glissement tactile sans afficher de scrollbar ; en mode vertical, le défilement suit l’axe vertical

#### Scenario: Menu burger sur petit viewport

- **WHEN** l’utilisateur active l’option burger sur un NodeNavApi
- **THEN** sur viewport tablette/mobile (selon les mêmes règles que **NodeNav**), une icône burger permet d’afficher ou masquer la liste des liens issus de l’API

#### Scenario: API indisponible ou vide

- **WHEN** l’API sélectionnée ne répond pas, retourne une erreur ou une collection vide
- **THEN** le NodeNavApi affiche un état dégradé (menu vide ou message discret) sans empêcher la sauvegarde de la page

#### Scenario: Persistance du NodeNavApi

- **WHEN** l’utilisateur sauvegarde une page contenant un NodeNavApi configuré
- **THEN** le contenu sérialisé conserve `apiId`, les options de présentation (direction, variante, burger, etc.) et permet de recharger le menu à l’affichage
