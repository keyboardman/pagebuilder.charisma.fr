# Change: Ajout de l'entité Page et CRUD (formulaire React + shadcn/ui)

## Why

Il faut pouvoir créer et gérer des pages web dans l'application : titre, slug dérivé du titre (minuscule), choix du thème pour charger le CSS correspondant, description pour le SEO et contenu. Le CRUD doit suivre le même modèle que celui des Thèmes, avec un formulaire en React et shadcn/ui.

## What Changes

- Nouvelle entité `Page` : `title`, `slug` (généré en minuscule à partir du titre), relation vers `Theme` (choix du thème), `description` (SEO), `content`.
- CRUD complet : liste (`/page`), création (`/page/new`), édition (`/page/edit/{id}`), suppression ; même structure que le CRUD Thème.
- Chargement du fichier CSS du thème associé lors de l’affichage ou de l’édition d’une page.
- Formulaire d’édition/création de page en React avec composants shadcn/ui (champs titre, slug, thème, description, content).
- Lien « Pages » dans la sidebar (`base.html.twig`) vers la liste des pages.

## Impact

- Affected specs: nouvelle capacité `page-crud`.
- Affected code: `src/Entity/Page.php`, `src/Controller/PageController.php`, `src/Form/PageType.php` (ou API pour React), `templates/page/`, `templates/base.html.twig`, entrée Webpack + composant React pour le formulaire page, migration Doctrine.
