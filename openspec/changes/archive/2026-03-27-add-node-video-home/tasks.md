## 1. Specification
- [x] 1.1 Ajouter le delta OpenSpec `page-builder` pour définir `NodeVideoHome`, la source de données distante et les règles de grille responsive.
- [x] 1.2 Valider le change avec `openspec validate add-node-video-home --strict`.

## 2. Implementation
- [x] 2.1 Créer le type de nœud `NodeVideoHome` dans l'éditeur (catégorie, registration, structure de contenu).
- [x] 2.2 Implémenter la récupération des vidéos depuis `https://api.charisma.fr/api/charisma/videos/homes` et le mapping des 7 items.
- [x] 2.3 Implémenter le rendu responsive:
  - desktop `3x2 + 1 full width`
  - tablette `2x3 + 1 full width`
  - mobile `1x7`
- [x] 2.4 Ajouter/adapter les tests et la vérification manuelle de rendu (desktop/tablette/mobile).
