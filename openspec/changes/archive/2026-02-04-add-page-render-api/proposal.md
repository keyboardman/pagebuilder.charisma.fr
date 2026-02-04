# Change: Stockage du rendu HTML complet et API de contenu

## Why

Permettre de persister le rendu complet d'une page (document HTML avec head, body et JavaScript) et d'exposer ce contenu via une API, pour intégration externe, export ou affichage sans repasser par le builder (ex. iframe, SSR, cache).

## What Changes

- Ajout d'un champ `render` (texte long, nullable) sur l'entité `Page` pour stocker le document HTML complet (head, body, scripts).
- Création d'une API HTTP (GET) pour récupérer le contenu du champ `render` d'une page (par id ou slug), avec réponse `text/html` et 404 si aucun rendu n'est stocké.

## Impact

- Affected specs: `page-crud`
- Affected code: `src/Entity/Page.php`, `src/Controller/PageController.php` (ou contrôleur dédié), migrations Doctrine, éventuellement le frontend builder pour envoyer le rendu lors de la sauvegarde.
