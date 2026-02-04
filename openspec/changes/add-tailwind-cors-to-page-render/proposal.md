# Change: Tailwind et builder dans le rendu render + CORS toutes origines

## Why

Le contenu renvoyé par l’API GET du champ `render` doit afficher la page avec les mêmes styles et le même bundle que dans le builder (Tailwind + builder, comme avec Vite/Encore). Par ailleurs, les réponses de l’API render doivent être accessibles depuis n’importe quelle origine et port (CORS ouvert) pour intégration en iframe ou depuis un autre domaine.

## What Changes

- **Réponse GET render** : au lieu de renvoyer uniquement le HTML brut stocké, le serveur injecte dans le document les assets Tailwind et builder (mêmes entry points que la page builder : CSS et JS de `pageBuilderStandalone`), afin que le rendu soit visuellement et fonctionnellement aligné avec le builder. De plus, le serveur SHALL mettre à jour la balise `<title>` du `<head>` avec le titre de la page (`Page.title`) et la balise `<meta name="description" content="...">` avec la description de la page (`Page.description`), si présents.
- **CORS** : configuration pour que les routes exposant le contenu render (GET) acceptent toutes les origines et tous les ports (en-têtes `Access-Control-Allow-Origin: *` ou équivalent pour toute origine).

## Impact

- Affected specs: `page-crud`
- Affected code: `src/Controller/PageController.php` (logique de réponse render, éventuellement passage par un template Twig pour les assets), configuration CORS (packages Symfony ou NelmioCorsBundle), éventuellement `templates/page/` pour un fragment d’assets.
