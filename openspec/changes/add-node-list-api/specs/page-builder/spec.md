## ADDED Requirements

### Requirement: Liste d’items pilotée par API (NodeListApi)

Le builder SHALL fournir un type de nœud **NodeListApi** (identifiant `node-list-api`) qui affiche une liste d’items alimentée par une **ApiCard** de type **`list`** (`AbstractApiCardList`, voir capacité `builder-api-registry`). Le nœud SHALL exposer un champ **apiId** pour sélectionner la source. Le nœud SHALL charger la collection via les endpoints Symfony (`fetchCollection`) et SHALL rendre chaque item mappé dans une structure de liste. Le nœud SHALL **ne pas** être droppable et SHALL **ne pas** accepter d’enfants : les entrées proviennent uniquement de l’API.

Pour chaque item, le nœud SHALL pouvoir afficher optionnellement **image**, **titre**, **description** et **compteur**, contrôlés par `content.show.image`, `content.show.title`, `content.show.description` et `content.show.counter`. Lorsqu’un toggle `show` est activé mais que le champ correspondant est absent dans l’item mappé, le nœud SHALL omettre cet élément sans réserver d’espace vide. Lorsqu’un toggle `show` est désactivé, le nœud SHALL ne pas rendre cet élément quel que soit le contenu mappé.

Le NodeListApi SHALL exposer des réglages de style par sous-partie (conteneur liste, item, image, titre, description, compteur) et SHALL utiliser des hooks DOM (`ce-list-api`, `ce-list-api-item`, et classes dérivées par sous-partie) pour le ciblage CSS thème. Si l’item mappé fournit un `link`, le nœud SHALL permettre une navigation vers cette URL (comportement aligné sur **NodeCardApi** pour les zones cliquables).

#### Scenario: Ajout d’un NodeListApi depuis le panneau

- **WHEN** l’utilisateur ajoute un bloc liste API (NodeListApi) depuis le panneau des composants
- **THEN** un nœud `node-list-api` est inséré ; l’utilisateur peut choisir une API de type `list` dans les réglages ; aucun enfant manuel n’est attendu

#### Scenario: Sélection d’une API éligible

- **WHEN** l’utilisateur ouvre les réglages du NodeListApi et choisit une API
- **THEN** seules les APIs enregistrées avec le type `list` sont proposées ; après validation, `apiId` est persisté dans le contenu du nœud

#### Scenario: Rendu des items depuis la collection

- **WHEN** le NodeListApi a un `apiId` valide et que l’endpoint collection retourne des items mappés
- **THEN** le builder affiche une liste contenant un item par entrée de la collection dans l’éditeur, la prévisualisation et le rendu exporté

#### Scenario: Affichage conditionnel image, titre, description et compteur

- **WHEN** l’utilisateur active `show.image`, `show.title`, `show.description` et `show.counter` et que l’item mappé contient ces champs
- **THEN** chaque item de la liste affiche l’image, le titre, la description et le compteur correspondants

#### Scenario: Champ absent dans l’item mappé

- **WHEN** `show.counter` est activé mais que l’item mappé ne fournit pas de `counter`
- **THEN** le compteur n’est pas rendu pour cet item et aucun placeholder vide n’est affiché

#### Scenario: Toggle show désactivé

- **WHEN** l’utilisateur désactive `show.description`
- **THEN** la description n’est pas rendue pour aucun item de la liste, même si présente dans le mapping ApiCard

#### Scenario: Lien sur item

- **WHEN** un item mappé fournit un `link` valide
- **THEN** le rendu expose une zone ou un wrapper cliquable menant vers cette URL (comportement cohérent avec les cards API existantes)

#### Scenario: API indisponible ou collection vide

- **WHEN** l’API sélectionnée ne répond pas, retourne une erreur ou une collection vide
- **THEN** le NodeListApi affiche un état dégradé (liste vide ou message discret) sans empêcher la sauvegarde de la page

#### Scenario: Persistance du NodeListApi

- **WHEN** l’utilisateur sauvegarde une page contenant un NodeListApi configuré
- **THEN** le contenu sérialisé conserve `apiId`, les toggles `show` et les styles configurés, et permet de recharger la liste à l’affichage
