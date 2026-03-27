## 1. Specification
- [x] 1.1 Completer et faire valider la proposition OpenSpec `update-node-anniversaire-style-settings`.

## 2. Builder NodeAnniversaire
- [x] 2.1 Mettre a jour la structure par defaut de `node.content` pour inclure `container`, `title`, `day`, `anniversaires`.
- [x] 2.2 Ajouter 4 onglets dans les settings du node: `general`, `titre`, `date`, `anniversaires`.
- [x] 2.3 Implementer les controles de style `general` (background, margin, padding) appliques au conteneur racine.
- [x] 2.4 Implementer les controles de style `titre` (background, margin, padding + text settings) et le champ de modification du titre.
- [x] 2.5 Implementer les controles de style `date` (background, margin, padding + text settings).
- [x] 2.6 Implementer les controles de style `anniversaires` (background, margin, padding + text settings).
- [x] 2.7 Appliquer les styles dans le rendu (`View`) et assurer la persistance/restauration correcte.

## 3. Validation
- [ ] 3.1 Verifier manuellement dans l'editeur que chaque onglet modifie la bonne zone visuelle.
- [ ] 3.2 Verifier sauvegarde/rechargement du JSON avec conservation des styles et du titre.
- [x] 3.3 Executer les verifications projet pertinentes (build/tests/lint) pour s'assurer qu'il n'y a pas de regression.
