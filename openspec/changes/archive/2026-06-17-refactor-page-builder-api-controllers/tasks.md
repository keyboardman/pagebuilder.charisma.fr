## 1. Implementation
- [x] 1.1 Creer le repertoire `src/Controller/Api/` et deplacer la logique API builder en plusieurs controllers focalises (cards, fonts, forms catalog).
- [x] 1.2 Conserver les memes routes publiques (`/page-builder/api/*`), signatures de query params et payloads JSON pour garantir la compatibilite frontend.
- [x] 1.3 Extraire les traitements transverses (validation/normalisation de params, mapping d'items) dans des services ou composants reutilisables afin d'eviter la duplication.
- [x] 1.4 Supprimer le controller monolithique une fois la migration terminee et verifier le cablage Symfony (autowiring, attributs de routes).

## 2. Validation
- [x] 2.1 Executer les tests fonctionnels/API existants lies au builder (ou en ajouter si absents) pour couvrir cards, item detail, categories, fonts et forms catalog.
- [x] 2.2 Verifier manuellement dans l'editeur de page que la recuperation des APIs/cards et du catalogue de polices fonctionne sans changement de comportement.
