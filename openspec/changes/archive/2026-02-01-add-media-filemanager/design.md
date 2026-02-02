# Design: Espace stockage médias et file manager

## Context
- Le projet utilise déjà **league/flysystem** (^3.x) pour les polices custom (`storage/fonts`, service `font_storage.filesystem`). Il n’existe pas de stockage ni d’interface pour les médias (images, vidéo, audio).
- **JoliCode MediaBundle** fournit gestion des médias, stockage abstrait (Flysystem), processeurs/variations, et une interface file manager (liste/grille, dossiers, CRUD) via son **bridge EasyAdmin**. Sans EasyAdmin, le bundle n’expose pas d’UI prête à l’emploi.
- Contrainte : un lien dans le menu principal de l’app (sidebar) doit permettre d’accéder au file manager.

## Goals / Non-Goals
- **Goals** : stockage image/vidéo/audio via Flysystem ; file manager utilisable (upload, navigation, organisation) ; lien dans le menu de l’app vers cette interface.
- **Non-Goals** : DAM complet ; remplacement du stockage fonts ; intégration média dans d’autres entités (optionnel ultérieur).

## Decisions
- **Flysystem** : réutiliser `league/flysystem` (^3.x ou version supérieure), déjà présent. Créer un **stockage dédié** pour les médias (ex. `storage/media`), distinct de `storage/fonts`, pour éviter tout mélange et permettre une config MediaBundle dédiée.
- **JoliCode MediaBundle** : utilisé pour la couche « médias » (bibliothèque, variations, résolution). Une **library** MediaBundle est configurée avec un OriginalStorage (et optionnellement CacheStorage) pointant vers ce stockage Flysystem. Les types MIME autorisés incluent image/*, video/*, audio/*.
- **Interface file manager** : l’UI fournie par le bundle est celle du **bridge EasyAdmin** (media library, grid/list, dossiers, upload). Donc **EasyAdmin** est ajouté au projet pour exposer cette interface. Une entrée de menu dans la sidebar de l’application (base.html.twig) pointe vers la route de la médiathèque EasyAdmin (ou le dashboard EasyAdmin avec accès à la médiathèque).
- **Lien menu** : ajout d’un lien « Médias » (ou « Fichiers ») dans la nav existante (`templates/base.html.twig`), ciblant la route du file manager / media library (définie par le bundle ou EasyAdmin). Le style du lien reste aligné sur les autres entrées (nav-link, état actif si on est sur la médiathèque).
- **Sécurité** : conserver la politique d’accès actuelle (ex. tout utilisateur authentifié ou selon rôles). Le MediaBundle utilise un Voter pour les actions sur la médiathèque ; on peut garder le voter par défaut ou en fournir un minimal pour restreindre l’accès si besoin.

## Alternatives considered
- **Sans EasyAdmin** : le MediaBundle ne fournit pas d’UI standalone ; il faudrait construire un contrôleur + vues custom qui utilisent les services du bundle. Plus de travail pour un résultat similaire ; on retient EasyAdmin + bridge pour livrer rapidement le file manager.
- **Autre bundle (ex. FMElfinderBundle)** : le besoin est « stockage + file manager » avec images/vidéo/audio ; JoliCode MediaBundle + Flysystem correspond et s’intègre bien avec l’écosystème Symfony et le stockage déjà prévu (Flysystem).

## Risks / Trade-offs
- **Ajout d’EasyAdmin** : introduit un sous-ensemble d’UI admin (dashboard, médiathèque). On limite l’usage à la médiathèque et au lien depuis notre menu pour ne pas surcharger l’UX.
- **Deux usages Flysystem** : fonts (existant) et médias (nouveau). Risque de confusion si les configs se croisent → stockages bien séparés (deux adapters/filesystems ou config bundle distincte).

## Migration Plan
- Pas de migration de données : nouveau répertoire `storage/media` et nouvelle config. Aucun déplacement des fonts.
- Rollback : retirer le lien menu, désactiver/supprimer les routes MediaBundle/EasyAdmin, retirer les paquets ; les fichiers déjà uploadés restent dans `storage/media` (à conserver ou supprimer manuellement selon besoin).

## Open Questions
- Aucun pour le périmètre minimal (stockage + file manager + lien menu). Extension future : intégration des médias dans les entités (ex. champs image dans Theme) via le media selector du bundle.
