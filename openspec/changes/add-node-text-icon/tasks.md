## 1. Implementation
- [x] 1.1 Ajouter `NodeTextIcon` au registre du builder avec une structure de contenu par défaut compatible avec `NodeText`.
- [x] 1.2 Implémenter le rendu du nœud avec icône optionnelle en préfixe ou suffixe du texte.
- [x] 1.3 Ajouter dans les settings les options: lien du texte, alignement horizontal, alignement vertical, taille d'icône.
- [x] 1.3b Séparer les styles dans les settings : onglet Conteneur (marge, padding, fond, bordure), onglet Icône (styles icône), onglet Texte (`Text2Settings` + fond/bordure/espacement).
- [x] 1.4 Assurer la persistance/restauration des propriétés `NodeTextIcon` dans le format de contenu de page.
- [x] 1.5 Choisir l'icône parmi les icônes du thème (liste + aperçu) ou une image (URL / médiathèque) ; injection `themeIcons` depuis le builder page.
- [ ] 1.6 Ajouter/mettre à jour les tests (unitaires et/ou intégration) couvrant création, rendu et persistance du nœud.

## 2. Validation
- [ ] 2.1 Vérifier manuellement dans l'éditeur que le lien texte fonctionne et que l'icône se place avant/après selon le réglage.
- [ ] 2.2 Vérifier que les alignements horizontal/vertical et la taille d'icône sont visibles en édition, preview et rendu final.
- [ ] 2.3 Vérifier le mode « Icône du thème » (liste + aperçu classe / image) et le mode « Image » avec la médiathèque.
