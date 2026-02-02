# Design: Intégration du builder de page (sans iframe)

## Context

- Le projet `pagebuilder.charisma.fr` dispose d’un CRUD Page avec formulaire React (PageForm) et un champ `content` (texte brut via textarea).
- Le dépôt `editeur2.charisma.fr` contient un builder de page (éditeur WYSIWYG / blocs) à réutiliser.
- Contraintes : intégration native (pas d’iframe) pour éviter les problèmes de communication inter-fenêtres, de styles isolés et d’UX dégradée.

## Goals / Non-Goals

- **Goals** : porter/adapter le builder depuis editeur2.charisma.fr ; l’intégrer comme composant React dans le champ content du formulaire page ; utiliser l’API médiathèque existante pour les images ; prévisualisation conforme au thème.
- **Non-Goals** : pas de réécriture complète du builder si le code source est réutilisable ; pas d’iframe.

## Decisions

- **Source du builder** : le code du builder est à récupérer depuis `https://bitbucket.org/charismaeglisechretienne/editeur2.charisma.fr` (branche `main` ou indiquée). Si le projet utilise iframe, il SHALL être refactoré pour fonctionner en composant React embarqué.
- **Format de stockage** : `Page.content` restera un champ texte long. Le builder produira du HTML valide ou un format structuré (JSON de blocs) selon l’architecture source ; en cas de JSON, une étape de sérialisation côté client ou serveur génèrera le HTML pour la preview.
- **Intégration médiathèque** : le builder utilisera les endpoints existants (`/media/api/list`, `/media/api/upload`, `/media/file/{path}`) pour l’insertion d’images. Les URLs des médias insérés SHALL pointer vers la route `app_media_file` ou des chemins relatifs compatibles.
- **CSS du thème** : le formulaire page charge déjà le CSS du thème via `app_theme_css`. Le builder s’exécute dans le même document et hérite de ces styles ; aucune iframe donc pas de chargement séparé du thème dans le builder.
- **Dépendances** : les dépendances npm/React du builder source seront fusionnées dans le `package.json` du projet, en évitant les doublons et conflits de versions.

## Risks / Trade-offs

- **Évolution du dépôt source** : editeur2.charisma.fr peut évoluer indépendamment. Un fork ou une copie du code pertinent dans ce projet réduit la dépendance directe.
- **Format de contenu** : si le builder source produit un format propriétaire (JSON), il faudra une migration ou un parseur pour les pages existantes dont le content est déjà en HTML brut.
- **Complexité du builder** : si le code source est monolithique ou fortement couplé à iframe, le port peut être important ; une phase d’analyse du dépôt source est recommandée avant implémentation.

## Migration Plan

1. Analyser la structure du dépôt editeur2.charisma.fr et identifier les composants à porter.
2. Copier ou adapter le code du builder dans `assets/` ; créer un composant `PageBuilder` ou équivalent.
3. Remplacer le textarea content dans `PageForm.tsx` par le composant builder.
4. Adapter le format de sortie (HTML ou JSON → HTML) pour rester compatible avec `page.content|raw` en preview.
5. Tester l’insertion d’images via la médiathèque et la persistance.
6. Pour les pages existantes avec content en HTML brut : le builder SHALL accepter ce format en entrée (mode édition) ou afficher un message si le format n’est pas reconnu.

## Open Questions

- Quel est le format exact de sortie du builder dans editeur2.charisma.fr (HTML, JSON, autre) ?
- Le builder source utilise-t-il déjà React ou un autre framework ? Cela déterminera la stratégie de port (réutilisation directe vs. réécriture partielle).
