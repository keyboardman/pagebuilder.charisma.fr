## MODIFIED Requirements

### Requirement: Lien dans le menu vers le file manager

Le système SHALL fournir un lien dans le menu principal de l'application (sidebar, `templates/base.html.twig`) permettant d'accéder au file manager (médiathèque). Ce lien SHALL être visible dans la même zone de navigation que les entrées existantes (Dashboard, Pages, Thèmes, Médias, Polices, Formulaires). Le lien SHALL pointer vers la route du file manager fournie par keyboardman/filemanager-bundle (URL `/filemanager`). L'accès au file manager SHALL requérir une authentification (hors exceptions publiques globales). L'état actif du lien (classe ou style « actif ») SHALL être cohérent lorsque la route courante est celle du file manager.

#### Scenario: Accès au file manager depuis le menu

- **WHEN** un utilisateur authentifié consulte une page du back-office sous `/admin`
- **THEN** il voit dans la sidebar un lien (ex. « Médias ») qui mène au file manager ; en cliquant dessus, il accède à la médiathèque à l'URL `/filemanager`

#### Scenario: État actif du lien menu sur la médiathèque

- **WHEN** l'utilisateur est sur la route du file manager
- **THEN** le lien « Médias » dans la sidebar est marqué actif

#### Scenario: Accès refusé sans authentification

- **WHEN** un visiteur non authentifié tente d'accéder à `/filemanager`
- **THEN** il est redirigé vers `/login`
