# Change: Espace de stockage et file manager pour images, vidéo et audio

## Why
Le projet a besoin d’un espace dédié pour stocker et gérer des fichiers multimédia (images, vidéo, audio), avec une interface de type file manager pour parcourir, uploader et organiser ces médias. Aujourd’hui seul le stockage des polices custom (Flysystem) existe ; il n’y a pas d’espace ni d’UI pour les médias.

## What Changes
- Mise en place d’un stockage dédié aux médias (images, vidéo, audio) via **league/flysystem** (^3.x ou version supérieure), en cohérence avec l’existant (fonts).
- Intégration de **jolicode/media-bundle** pour la gestion des médias : bibliothèque de fichiers, upload, variations (optionnel), et interface de type file manager. L’interface du file manager est fournie par le bridge EasyAdmin du bundle ; **easycorp/easyadmin-bundle** est donc ajouté pour exposer cette UI.
- Ajout d’un **lien dans le menu** (sidebar `templates/base.html.twig`) vers le file manager / médiathèque, pour y accéder depuis l’application.

## Impact
- Affected specs: nouvelle capacité `media-filemanager` (stockage médias + file manager + lien menu).
- Affected code: `composer.json` (jolicode/media-bundle, easycorp/easyadmin-bundle si absent), configuration Flysystem/MediaBundle/EasyAdmin, `templates/base.html.twig` (lien menu), éventuellement `config/routes/`, `config/packages/`, sécurité (voter MediaBundle si besoin).
