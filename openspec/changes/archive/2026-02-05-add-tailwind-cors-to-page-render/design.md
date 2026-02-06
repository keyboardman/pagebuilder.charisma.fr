# Design: Assets et CORS pour l’API render

## Context

- L’API GET du champ `render` renvoie aujourd’hui le HTML brut stocké en base (`Content-Type: text/html`).
- La page builder charge Tailwind et le bundle via l’entry Encore `pageBuilderStandalone` (CSS + JS). Le HTML sauvegardé dans `render` peut déjà contenir des liens vers le CSS du thème et `pagePreview`, mais pas nécessairement les mêmes URLs absolues ni le bundle builder lorsqu’on consomme l’API depuis un autre domaine.
- Pour un rendu identique au builder et utilisable en iframe / autre origine, il faut injecter côté serveur les mêmes assets (Tailwind + builder) et ouvrir CORS.

## Goals / Non-Goals

- **Goals** : (1) Réponse GET render = document HTML avec Tailwind et builder injectés (même rendu que le builder). (2) CORS autorisant toute origine et tout port sur les réponses render.
- **Non-Goals** : Changer le format du HTML stocké en base ; ajouter CORS sur d’autres API que le render.

## Decisions

- **Injection des assets** : Lors de la réponse GET du contenu render, le contrôleur ne renvoie pas le brut de `page.getRender()`. Il injecte dans le document HTML stocké :
  - Avant `</head>` : les balises `<link>` correspondant à l’entry `pageBuilderStandalone` (via Twig `encore_entry_link_tags('pageBuilderStandalone')` rendu en chaîne), pour inclure Tailwind et le CSS du builder.
  - Avant `</body>` : les balises `<script>` correspondant à `encore_entry_script_tags('pageBuilderStandalone')`.
  Réalisation : fragment Twig (ex. `page/_render_assets.html.twig`) qui produit uniquement ces tags ; le contrôleur rend ce fragment, récupère la chaîne, puis fait deux `str_replace` (ou équivalent) sur le HTML stocké pour insérer les blocs avant `</head>` et `</body>`. Les URLs des assets restent relatives au domaine du serveur (ou en absolu via `request.getSchemeAndHttpHost()` si besoin).
- **Titre et meta description** : Avant ou après l’injection des assets, le contrôleur SHALL mettre à jour dans le HTML renvoyé : (1) la balise `<title>` du `<head>` avec la valeur de `Page.getTitle()` (échappée pour le HTML) ; (2) la balise `<meta name="description" content="...">` avec la valeur de `Page.getDescription()` (échappée), en l’insérant si elle n’existe pas ou en remplaçant l’attribut `content` si la balise existe. Cela permet d’exposer le titre et la description SEO de la page dans le document servi.
- **CORS** : Utiliser la configuration CORS du framework Symfony (si disponible) ou un bundle dédié (ex. NelmioCorsBundle). Règle : pour les routes GET exposant le contenu render (ex. `app_page_render`, `app_page_render_by_id`), autoriser toute origine (`*` ou liste dynamique selon la config). Autoriser tous les ports en n’imposant pas de restriction sur le port dans l’origine.

## Risks / Trade-offs

- **Sécurité CORS** : Accepter toute origine augmente la surface d’usage (iframe, scripts externes). Conserver uniquement sur les routes en lecture (GET render), pas sur les routes d’écriture (PATCH/PUT).
- **Performance** : L’injection par remplacement de chaîne est légère ; pas d’impact notable attendu.

## Migration Plan

- Aucune migration de données. Déploiement puis vérification que GET `/page/render/{id}` et GET `/page/{id}/render` renvoient un document avec styles/scripts corrects et que les en-têtes CORS sont présents pour une requête cross-origin.

## Open Questions

- Aucune.
