## 1. Configuration des conventions

- [x] 1.1 Créer `config/packages/media_upload_guidelines.yaml` avec le contenu structuré (titre, sections : formats, dimensions par usage, poids, nommage, optimisation)
- [x] 1.2 Exposer le paramètre `app.media_upload_guidelines` et l'injecter comme global Twig dans `config/packages/twig.yaml`

## 2. Templates file manager

- [x] 2.1 Créer le partial `templates/filemanager/_media_guidelines.html.twig` qui rend le mémo à partir du global Twig
- [x] 2.2 Surcharger `templates/bundles/KeyboardmanFilemanagerBundle/filemanager/sidebar.html.twig` en reprenant le contenu bundle et en incluant le partial en bas de sidebar
- [x] 2.3 Ajouter le CSS minimal (classe projet ou bloc `<style>`) pour un rendu compact : petite typo, fond léger, séparation visuelle avec l'arborescence

## 3. Documentation et vérification

- [x] 3.1 Mettre à jour `AGENTS.md` : emplacement du YAML de conventions et comportement du mémo dans `/filemanager`
- [x] 3.2 Test manuel : accéder à `/filemanager` et vérifier l'affichage du mémo avec les valeurs par défaut
- [x] 3.3 Test manuel : ouvrir le picker iframe depuis le builder (ex. insertion image) et vérifier que le mémo reste visible
- [x] 3.4 Test manuel : uploader une image hors recommandations et confirmer que l'upload n'est pas bloqué
