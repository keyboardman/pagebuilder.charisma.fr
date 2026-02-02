**À faire après implémentation** : exécuter `composer update` avec PHP 8.4+ pour installer `jolicode/media-bundle` et `easycorp/easyadmin-bundle`. Si la config `joli_media.libraries` ne correspond pas au schéma du bundle, adapter selon la doc (mediabundle.jolicode.com). Puis tester manuellement (4.2).

## 1. Dépendances et configuration Flysystem
- [x] 1.1 S’assurer que `league/flysystem` est en ^3.x (ou version supérieure) dans `composer.json` (déjà présent en ^3.31).
- [x] 1.2 Installer `jolicode/media-bundle` et, pour l’UI file manager, `easycorp/easyadmin-bundle` (et le bridge JoliCode MediaBundle pour EasyAdmin si fourni séparément).
- [x] 1.3 Créer un stockage Flysystem dédié aux médias (ex. `storage/media`), distinct du stockage fonts : adapter `config/services.yaml` ou utiliser `league/flysystem-bundle` si le MediaBundle l’attend, et configurer une library MediaBundle pointant vers ce stockage (OriginalStorage ; CacheStorage optionnel).
- [x] 1.4 Configurer les types MIME autorisés pour la library (images, vidéo, audio) et les options d’upload (taille max, etc.) selon la doc MediaBundle.

## 2. File manager (EasyAdmin + MediaBundle)
- [x] 2.1 Activer et configurer EasyAdmin (dashboard minimal si besoin) et enregistrer les routes du MediaBundle (media library) selon la doc du bundle.
- [x] 2.2 S’assurer que la médiathèque est accessible via une URL dédiée (ex. `/admin/media` ou équivalent) et que l’on peut uploader, lister, organiser en dossiers, supprimer des médias (image, vidéo, audio).

## 3. Lien dans le menu
- [x] 3.1 Dans `templates/base.html.twig`, ajouter un lien (ex. « Médias » ou « Fichiers ») dans la `<nav>` de la sidebar, pointant vers la route du file manager / media library, avec classe `nav-link` et état actif lorsque la route courante est celle de la médiathèque.

## 4. Sécurité et validation
- [x] 4.1 Vérifier que l’accès au file manager est cohérent avec la politique de sécurité de l’app (authentification, éventuellement rôles). Adapter le Voter MediaBundle si nécessaire.
- [ ] 4.2 Tester en local : upload d’un fichier image, vidéo et audio ; navigation dans la médiathèque ; accès via le lien du menu.

## 5. Tests et documentation
- [x] 5.1 Ajouter ou mettre à jour les tests (unitaire ou intégration) si un service métier dédié aux médias est introduit ; sinon vérification manuelle du flux upload + affichage.
- [x] 5.2 Documenter brièvement dans le projet (README ou AGENTS.md) l’existence du stockage médias et du lien « Médias » vers le file manager.
