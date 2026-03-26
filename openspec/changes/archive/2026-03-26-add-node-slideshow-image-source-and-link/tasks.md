## 1. Implementation
- [x] 1.1 Étendre le modèle `NodeSlideshow` (slides mode) + `NodeSlideshowSlide` pour porter la source (manuel vs endpoint API) et un lien optionnel.
- [x] 1.2 Mettre à jour `NodeSlideshow/Settings.tsx` pour ajouter un mode `manual` (liste éditée) et un mode `api-endpoint` (liste chargée depuis une API image fixe).
- [x] 1.3 Ajouter l'édition du lien de slide dans les réglages (URL optionnelle, persistance dans `content.slides`).
- [x] 1.4 Mettre à jour `NodeSlideshow/View.tsx` pour rendre la slide cliquable lorsque le lien est défini.
- [x] 1.5 Conserver la compatibilité des slides existantes sans `source` ni `link`.

## 2. Validation
- [x] 2.1 Vérifier dans l'éditeur l’ajout de slides en mode `manual` via saisie de l’URL (sans picker).
- [x] 2.2 Vérifier dans l'éditeur le chargement automatique des slides en mode `api-endpoint` après sélection de l’endpoint API.
- [x] 2.3 Vérifier le rendu cliquable/non cliquable selon la présence du lien.
- [x] 2.4 Vérifier la persistance après sauvegarde/rechargement (ordre, mode, src/alt, lien).
