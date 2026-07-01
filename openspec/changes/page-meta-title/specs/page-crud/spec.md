## ADDED Requirements

### Requirement: Champ metaTitle pour le SEO

Le système SHALL fournir sur l'entité `Page` un champ `metaTitle` (string, nullable) distinct de `title`, permettant de définir un titre dédié aux balises `<title>` et aux moteurs de recherche. Si `metaTitle` est null ou vide, le rendu public SHALL utiliser `title` comme valeur de repli.

#### Scenario: Page avec metaTitle renseigné

- **WHEN** une page possède un `metaTitle` non vide
- **THEN** la balise `<title>` des rendus publics affiche la valeur de `metaTitle` et non `title`

#### Scenario: Page sans metaTitle

- **WHEN** une page a `metaTitle` null ou vide
- **THEN** la balise `<title>` des rendus publics affiche la valeur de `title`

#### Scenario: Duplication copie le metaTitle

- **WHEN** l'utilisateur duplique une page ayant un `metaTitle` renseigné
- **THEN** la page dupliquée possède le même `metaTitle` que la page source

## MODIFIED Requirements

### Requirement: Entité Page (titre, slug, thème, description, content)

Le système SHALL fournir une entité `Page` avec : `title` (string, obligatoire), `slug` (string, dérivé du titre en minuscule, unique), une relation ManyToOne vers `Theme` (choix du thème pour charger le fichier CSS correspondant), `metaTitle` (string, nullable, pour le titre SEO), `description` (string, pour le SEO), `content` (texte long). Le slug SHALL être généré à partir du titre (normalisation minuscule / Slugger) et SHALL être unique.

#### Scenario: Création d'une Page avec titre et thème

- **WHEN** une Page est créée avec un titre et un thème choisi
- **THEN** le slug est dérivé du titre en minuscule et enregistré ; la relation vers le Theme est persistée ; metaTitle, description et content peuvent être vides

#### Scenario: Unicité du slug

- **WHEN** une Page est créée ou mise à jour avec un slug déjà utilisé par une autre page
- **THEN** la validation échoue (contrainte unique ou message d'erreur) ; l'utilisateur peut corriger le titre ou le slug

### Requirement: Formulaire Page en React avec shadcn/ui

Le formulaire de création et d'édition de page SHALL comporter les champs : titre, slug (pré-rempli à partir du titre, éditable), choix du thème (liste des thèmes disponibles), metaTitle (titre SEO, optionnel), description (SEO), content (contenu de la page). Le champ metaTitle SHALL apparaître dans la section SEO du formulaire, avec un libellé explicite (ex. « Titre SEO ») et une aide indiquant qu'il remplace le titre dans la balise `<title>` si renseigné. Le champ content SHALL utiliser le composant builder de page (page-builder) pour l'édition riche du contenu, et non un simple textarea. La soumission SHALL envoyer les données au backend (POST ou API) pour validation et persistance ; le backend SHALL retourner les erreurs de validation si nécessaire.

#### Scenario: Affichage du formulaire avec champs titre, slug, thème, description, content

- **WHEN** l'utilisateur ouvre la création ou l'édition d'une page
- **THEN** le formulaire affiche les champs titre, slug, sélecteur de thème, metaTitle (section SEO), description et content ; le champ content affiche le builder de page (pas un textarea) ; le slug peut être pré-rempli à partir du titre

#### Scenario: Sauvegarde et persistance

- **WHEN** l'utilisateur soumet le formulaire avec des données valides
- **THEN** les données sont envoyées au serveur, la page est créée ou mise à jour, et l'utilisateur est redirigé ou reçoit une confirmation de succès

### Requirement: API de récupération du contenu render

Le système SHALL exposer une API HTTP GET permettant de récupérer le contenu du champ `render` d'une page. La route SHALL accepter l'identifiant de la page (id numérique ou slug). La réponse SHALL avoir le corps égal au document HTML stocké dans `render` dans lequel sont injectés, côté serveur, les assets Tailwind et le bundle builder (mêmes entry points que la page builder, ex. `pageBuilderStandalone` : CSS avant `</head>` et JS avant `</body>`), afin que le rendu soit identique au builder. De plus, le document renvoyé SHALL avoir la balise `<title>` du `<head>` contenant le titre SEO de la page (`Page.metaTitle` si renseigné, sinon `Page.title`) et une balise `<meta name="description" content="...">` contenant la description de la page (`Page.description`), le contenu étant échappé pour le HTML. Le header SHALL être `Content-Type: text/html`. Si la page n'existe pas ou si `render` est null ou vide, la réponse SHALL être 404.

#### Scenario: Récupération du rendu par id

- **WHEN** un client envoie une requête GET vers l'endpoint de contenu render avec l'id d'une page ayant un `render` renseigné
- **THEN** la réponse a le statut 200, le corps contient le document HTML avec les assets Tailwind et builder injectés (link/script) et `Content-Type` est `text/html`

#### Scenario: Titre et meta description dans le head

- **WHEN** un client récupère le contenu render d'une page ayant un titre, un metaTitle et une description
- **THEN** le document HTML renvoyé contient une balise `<title>` avec le metaTitle (ou le titre si metaTitle est vide) et une balise `<meta name="description" content="...">` avec la description de la page (contenu échappé)

#### Scenario: 404 lorsque le rendu est absent

- **WHEN** un client envoie une requête GET vers l'endpoint de contenu render pour une page dont `render` est null ou vide
- **THEN** la réponse a le statut 404

#### Scenario: 404 lorsque la page n'existe pas

- **WHEN** un client envoie une requête GET vers l'endpoint de contenu render avec un id ou slug ne correspondant à aucune page
- **THEN** la réponse a le statut 404
