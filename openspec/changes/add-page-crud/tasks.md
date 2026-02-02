## 1. Backend

- [x] 1.1 Créer l'entité `Page` : champs `title`, `slug` (unique), relation ManyToOne vers `Theme`, `description`, `content` ; contrainte d'unicité sur `slug`
- [x] 1.2 Générer et appliquer la migration Doctrine pour la table `page`
- [x] 1.3 Créer `PageController` : routes index, new, edit, delete ; logique slug (SluggerInterface, minuscule) à la création/mise à jour
- [x] 1.4 Exposer les données nécessaires au formulaire React (liste des thèmes, page courante pour édition) et accepter la soumission (POST ou endpoint API) avec validation et persistance
- [x] 1.5 Créer les vues Twig : `page/index.html.twig` (liste), `page/new.html.twig` et `page/edit.html.twig` (conteneur pour le formulaire React) ; inclure le chargement du CSS du thème sur edit/show

## 2. Frontend (React + shadcn/ui)

- [x] 2.1 Ajouter l'entry Webpack pour le formulaire page (ex. `pageForm.jsx` ou `pageForm.tsx`)
- [x] 2.2 Créer le composant React du formulaire page (titre, slug, select thème, description, content) avec shadcn/ui (Input, Label, Select, Textarea, Button)
- [x] 2.3 Brancher le formulaire sur l'URL de soumission et la pré-remplissage (slug à partir du titre, données page en édition) ; gérer les erreurs de validation renvoyées par le backend
- [x] 2.4 Inclure le script du formulaire dans les templates `page/new.html.twig` et `page/edit.html.twig`

## 3. Navigation et finition

- [x] 3.1 Ajouter le lien « Pages » dans `templates/base.html.twig` (sidebar) vers la liste des pages, avec classe active sur les routes `app_page_*`
- [x] 3.2 Vérifier la suppression (CSRF, redirection), l'unicité du slug et le chargement du CSS du thème sur la page d'édition

## 4. Validation

- [x] 4.1 Ajouter des tests (PHPUnit) pour l'entité Page et le contrôleur (création, mise à jour, contrainte slug, suppression) si le projet le prévoit
