# page-crud (MODIFIED)

## MODIFIED Requirements

### Requirement: Formulaire Page en React avec shadcn/ui

Le formulaire de création et d'édition de page SHALL être implémenté en React avec des composants shadcn/ui. Il SHALL comporter les champs : titre, slug (pré-rempli à partir du titre, éditable), choix du thème (liste des thèmes disponibles), description (SEO), content (contenu de la page). Le champ content SHALL utiliser le composant builder de page (page-builder) pour l'édition riche du contenu, et non un simple textarea. La soumission SHALL envoyer les données au backend (POST ou API) pour validation et persistance ; le backend SHALL retourner les erreurs de validation si nécessaire.

#### Scenario: Affichage du formulaire avec champs titre, slug, thème, description, content

- **WHEN** l'utilisateur ouvre la création ou l'édition d'une page
- **THEN** le formulaire React (shadcn/ui) affiche les champs titre, slug, sélecteur de thème, description et content ; le champ content affiche le builder de page (pas un textarea) ; le slug peut être pré-rempli à partir du titre

#### Scenario: Sauvegarde et persistance

- **WHEN** l'utilisateur soumet le formulaire avec des données valides
- **THEN** les données sont envoyées au serveur, la page est créée ou mise à jour, et l'utilisateur est redirigé ou reçoit une confirmation de succès
