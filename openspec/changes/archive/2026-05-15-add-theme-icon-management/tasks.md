## 1. Implementation
- [x] 1.1 Ajouter une section "Icones" dans la gestion d'un theme avec une liste editable.
- [x] 1.2 Ajouter un formulaire d'icone avec les champs `nom`, `classe` et `lien`.
- [x] 1.3 Persister la collection d'icones dans la configuration du theme (`theme.yaml` ou structure equivalente).
- [x] 1.4 Integrer les icones configurees dans la generation CSS du theme en appliquant le motif `mask`/`-webkit-mask`.
- [x] 1.5 Permettre suppression et edition d'une icone existante dans l'interface.
- [x] 1.6 Afficher un apercu image du SVG (champ lien) a cote de chaque ligne d'icone dans le formulaire theme.

## 2. Validation
- [x] 2.1 Verifier qu'une icone ajoutee est retrouvee apres sauvegarde et reouverture du theme.
- [x] 2.2 Verifier que le CSS genere applique `background: currentColor` et `mask`/`-webkit-mask` avec le lien configure.
- [x] 2.3 Verifier qu'une icone renommee ou supprimee est correctement refletee dans la configuration et le CSS genere.
