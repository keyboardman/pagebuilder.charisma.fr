## 1. Modele de donnees et logique de style

- [x] 1.1 Ajouter/adapter les types et helpers de `Border2Settings` pour representer les modes unifie et par cote.
- [x] 1.2 Implementer la normalisation shorthand/longhands (mode unifie => `border`, mode par cote => `borderTop/Right/Bottom/Left`).
- [x] 1.3 Implementer la detection automatique du mode a partir des styles existants du noeud.

## 2. Interface Border2Settings

- [x] 2.1 Ajouter un controle de bascule de mode dans la section `Border` du panneau de settings.
- [x] 2.2 Implementer les champs de saisie pour le mode unifie et pour le mode par cote avec propagation correcte des valeurs.
- [x] 2.3 Gerer les transitions de mode (copie des valeurs utiles, champs vides en cas d'asymetrie, aucune suppression silencieuse).

## 3. Integration et placeholders

- [x] 3.1 Verifier l'integration de `Border2Settings` dans les noeuds utilisant deja les reglages de bordure.
- [x] 3.2 Preserver la compatibilite des placeholders/theme overrides selon le mode actif.
- [x] 3.3 Verifier le rendu preview/public pour les cas bordure uniforme et bordure uniquement en bas.

## 4. Tests et validation

- [x] 4.1 Ajouter des tests unitaires pour la normalisation shorthand/longhands et la detection de mode.
- [x] 4.2 Ajouter des tests de composant pour la bascule de mode et la saisie par cote dans `Border2Settings`.
- [x] 4.3 Valider les non-regressions sur les configurations de bordure existantes.
