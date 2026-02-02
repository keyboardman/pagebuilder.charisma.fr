## 1. Analyse du dépôt source

- [x] 1.1 Cloner ou consulter le dépôt `https://bitbucket.org/charismaeglisechretienne/editeur2.charisma.fr`
- [x] 1.2 Identifier la structure du builder (composants, format de sortie, dépendances npm)
- [x] 1.3 Documenter le format de contenu produit (HTML, JSON, autre) et les API utilisées

## 2. Port / adaptation du builder

- [x] 2.1 Copier ou adapter les composants du builder dans `assets/` (ex. `assets/editeur2/`)
- [x] 2.2 Réfacter le code pour supprimer toute utilisation d'iframe (BuilderInline)
- [x] 2.3 Intégrer les dépendances nécessaires dans `package.json` sans conflit
- [x] 2.4 Créer un composant `PageBuilderEmbed` exposant une interface (value, onChange) compatible avec le formulaire

## 3. Intégration dans le formulaire Page

- [x] 3.1 Remplacer le textarea content dans PageForm par le composant PageBuilder
- [x] 3.2 Assurer le passage des props (value initiale, onChange, contexte thème)
- [x] 3.3 Vérifier que la soumission du formulaire envoie le contenu correctement (champ hidden content)

## 4. Médiathèque et médias

- [x] 4.1 Connecter le builder à `/media/api/list` pour la sélection d'images
- [x] 4.2 Connecter le builder à `/media/api/upload` pour l'upload depuis l'éditeur
- [x] 4.3 Utiliser la route `app_media_file` pour les URLs des images insérées
- [x] 4.4 Adapter l'API média (list, upload, rename, delete) au format FileItem

## 5. Compatibilité et tests

- [x] 5.1 Tester la sauvegarde et le chargement du contenu (nouvelle page, page existante)
- [x] 5.2 Vérifier que la preview (`page/preview`) affiche correctement le contenu produit par le builder
- [x] 5.3 Vérifier le chargement du CSS du thème sur la page d'édition
- [ ] 5.4 Ajouter ou mettre à jour les tests (PHPUnit, tests manuels) si pertinent

## 6. Validation

- [x] 6.1 Exécuter `npm run build` pour s'assurer de l'absence d'erreurs de compilation
- [ ] 6.2 Valider manuellement le flux complet : création page → édition avec builder → sauvegarde → preview
