## Why

Le titre interne d'une page (`title`) sert aujourd'hui à la fois à l'administration (liste, builder, slug) et à la balise `<title>` du rendu public. Pour le SEO, il faut pouvoir définir un titre distinct, optimisé pour les moteurs de recherche et les onglets navigateur, sans modifier le libellé métier de la page.

## What Changes

- Ajout d'un champ `metaTitle` (string, nullable) sur l'entité `Page`, distinct de `title`
- Champ « Titre SEO » dans la section SEO des formulaires de création et d'édition de page
- Utilisation de `metaTitle` (avec repli sur `title` si vide) pour la balise `<title>` dans tous les rendus publics : prévisualisation, rendu Twig, export HTML du builder (`pageBuilderStandalone`), et API render
- Persistance et duplication : `metaTitle` est copié lors de la duplication d'une page
- Migration Doctrine pour ajouter la colonne en base

## Capabilities

### New Capabilities

_Aucune — extension du modèle Page existant._

### Modified Capabilities

- `page-crud` : ajout du champ `metaTitle` sur l'entité, formulaires admin, rendus publics et export builder ; mise à jour des exigences SEO (balise `<title>`)

## Impact

- **Entité** : `src/Entity/Page.php` — nouveau champ `metaTitle`
- **Migration** : nouvelle migration Doctrine
- **Formulaire** : `src/Form/AdminPageFormType.php`, templates `page/new.html.twig` et `page/edit.html.twig`
- **Rendu public** : `templates/page/render_view.html.twig`, `templates/page/preview.html.twig`, `templates/page/builder.html.twig`
- **Builder** : `assets/pageBuilderStandalone.jsx` (`buildFullDocument`, props `pageMetaTitle`)
- **Contrôleur** : `PageController` (duplication)
- **Tests** : `tests/Entity/PageTest.php`, `tests/Controller/PageControllerTest.php`
