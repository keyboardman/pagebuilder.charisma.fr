# Change: Ajouter le builder de page depuis editeur2.charisma.fr

## Why

Le formulaire d'édition des pages utilise actuellement un simple textarea pour le champ `content`. L'éditeur existant dans le dépôt [editeur2.charisma.fr](https://bitbucket.org/charismaeglisechretienne/editeur2.charisma.fr) offre un builder de page plus riche (drag-and-drop, blocs, prévisualisation). L'intégrer directement dans le formulaire page, sans iframe, permettra une édition WYSIWYG fluide et une meilleure expérience utilisateur.

## What Changes

- Port ou adaptation du builder de page depuis le dépôt `editeur2.charisma.fr` dans le projet `pagebuilder.charisma.fr`
- Remplacement du textarea « Contenu » par le builder intégré dans le formulaire React PageForm (composant natif, pas d'iframe)
- Format du contenu : HTML structuré (ou JSON de blocs selon le format source) stocké dans `Page.content` ; compatibilité avec le rendu actuel en preview (`page.content|raw`)
- Intégration avec la médiathèque existante (`/media/api/*`) pour l’insertion d’images et médias dans le builder
- Chargement du CSS du thème associé à la page lors de l’édition, pour un rendu conforme au thème choisi

## Impact

- Affected specs: `page-crud`, nouvelle spec `page-builder`
- Affected code: `assets/components/PageForm.tsx`, `pageForm.jsx`, templates `page/edit.html.twig`, `page/new.html.twig`, éventuellement nouveaux composants React pour le builder
- Dépôt source: https://bitbucket.org/charismaeglisechretienne/editeur2.charisma.fr
