## 1. Spécification
- [x] 1.1 Mettre à jour le contrat `ApiCardInterface` pour formaliser la coexistence des modes normal et collection fixe pour `article`, `video` et `image`.
- [x] 1.2 Vérifier/adapter les interfaces typées (`ApiCardArticleInterface`, `ApiCardVideoInterface`, `ApiCardImageInterface`) pour garantir un comportement cohérent en mode collection fixe.
- [x] 1.3 Définir que la variante de rendu image (`list`, `slider`) est gérée côté éditeur, et préciser les formats minimaux d'items mappés pour les trois types.

## 2. Backend Symfony
- [x] 2.1 Adapter le registre des API cards pour exposer les capacités de collection fixe des APIs `article`, `video` et `image`.
- [x] 2.2 Vérifier les endpoints de liste/collection/item pour préserver la compatibilité et transporter les champs nécessaires aux trois types en mode collection fixe.
- [x] 2.3 Ajouter ou adapter des implémentations concrètes d'API en collection fixe pour chaque type concerné.

## 3. Builder (frontend)
- [x] 3.1 Consommer les APIs en mode normal et en collection fixe pour `article`, `video` et `image`.
- [x] 3.2 Appliquer la variante de rendu image (`list`/`slider`) uniquement selon la configuration de l’éditeur (sans dépendance à une métadonnée `ApiCard`).
- [x] 3.3 Garantir la persistance/restitution de la configuration des blocs utilisant ces APIs.

## 4. Validation
- [x] 4.1 Ajouter/mettre à jour les tests unitaires/intégration côté backend (contrat, registre, endpoint).
- [x] 4.2 Ajouter/mettre à jour les tests frontend (collections fixes article/video/image, et rendu image list vs slider piloté par l’éditeur).
- [x] 4.3 Exécuter les validations projet (tests + lint) avant livraison.
