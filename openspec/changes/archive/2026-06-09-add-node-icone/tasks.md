## 1. Implementation
- [x] 1.1 Créer le module `NodeIcone` (`index.ts`, `View.tsx`, `Edit.tsx`, `Settings.tsx`) avec le type `node-icone` et une structure de contenu par défaut (icône preset, alignements, styles conteneur/icône).
- [x] 1.2 Réutiliser `NodeTextIconMedia` et les utilitaires partagés de `NodeTextIcon` (`shared.ts`, classes `ce-icon`) pour le rendu de l'icône.
- [x] 1.3 Implémenter les settings : source d'icône (preset / thème / image), taille, alignements horizontal et vertical, lien optionnel, onglets Conteneur et Icône (styles).
- [x] 1.4 Enregistrer `NodeIcone` dans `NodeRegistry` et le panneau des composants (label « Icône », catégorie `content`).
- [x] 1.5 Ajouter la classe wrapper `ce-icone` si nécessaire pour le style de base (marge, flex) sans dupliquer les règles `ce-icon`.
- [x] 1.6 Assurer la persistance/restauration des propriétés `NodeIcone` dans le format de contenu de page.

## 2. Validation
- [x] 2.1 Vérifier manuellement l'ajout depuis le panneau, la sélection des trois sources d'icône et l'aperçu en édition / preview / rendu final.
- [x] 2.2 Vérifier les alignements horizontal/vertical, la taille d'icône et le lien cliquable optionnel.
- [x] 2.3 Vérifier la sauvegarde et le rechargement d'une page contenant un ou plusieurs `NodeIcone`.
