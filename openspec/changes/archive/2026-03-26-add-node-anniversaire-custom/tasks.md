## 1. Implementation
- [x] 1.1 Créer `NodeAnniversaire` (type `node-anniversaire`) avec vue, édition et valeurs par défaut.
- [x] 1.2 Ajouter la catégorie `custom` dans le panneau des composants et y enregistrer `NodeAnniversaire`.
- [x] 1.3 Implémenter la récupération de données depuis `https://api.charisma.fr/charisma/anniversaire/mariage` avec gestion d'erreur (état vide/de secours).
- [x] 1.4 Implémenter le rendu strict de la liste: groupement par date, nom complet des couples, ancienneté au format `N ans`.
- [x] 1.5 Ajouter/ajuster le CSS thème pour la présentation du bloc anniversaire sans casser les nodes existants.

## 2. Validation
- [ ] 2.1 Vérifier dans l'éditeur que `NodeAnniversaire` apparaît dans la catégorie `custom` et peut être ajouté/supprimé/dupliqué.
- [ ] 2.2 Vérifier la persistance du node dans le JSON du builder (save/reload).
- [ ] 2.3 Vérifier que le rendu affiché correspond au format de référence (ordre des jours et lignes).
- [ ] 2.4 Vérifier le comportement en cas d'échec de chargement (message explicite non bloquant).
