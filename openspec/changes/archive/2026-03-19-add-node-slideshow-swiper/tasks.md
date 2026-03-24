# 1. Implementation

- [x] 1.1 Ajouter la dépendance `swiper` (package.json) et vérifier la résolution dans le build webpack
- [x] 1.2 Importer les CSS Swiper nécessaires (navigation/pagination) dans le bundle frontend
- [x] 1.3 Créer le node `node-slideshow` (frontend) dans `assets/editeur/ManagerNode/NodeSlideshow/`
  - [x] 1.3.1 Implémenter `View.tsx` (rendu Swiper en mode preview/view)
  - [x] 1.3.2 Implémenter `Edit/Settings` (panneau de paramètres)
  - [x] 1.3.3 Implémenter la gestion de la liste des slides dans les paramètres
- [x] 1.4 Ajouter `node-slideshow` au registre `assets/editeur/ManagerNode/NodeRegistry.ts`
- [x] 1.5 Définir et persister la structure de données du node (liste d’images + options navigation/pagination/vitesse)
- [x] 1.6 Implémenter l’édition des slides dans les paramètres :
  - [x] 1.6.1 Ajouter une image (via le file manager existant)
  - [x] 1.6.2 Réordonner les slides (drag-and-drop)
  - [x] 1.6.3 Supprimer la slide sélectionnée
  - [x] 1.6.4 Modifier la slide sélectionnée (remplacer l’image)
- [x] 1.7 Implémenter la configuration Swiper :
  - [x] 1.7.1 Navigation prev/next activable/désactivable
  - [x] 1.7.2 Pagination activable/désactivable
  - [x] 1.7.3 Vitesse (option Swiper `speed`, en ms)
- [x] 1.8 Vérifier la compatibilité rendu preview et export (persistance dans `Page.content`)

## 2. Validation

- [x] 2.1 Exécuter `openspec validate add-node-slideshow-swiper --strict`
- [ ] 2.2 QA manuelle : vérifier add/reorder/remove/edit + navigation/pagination/speed dans l’éditeur et dans la preview
