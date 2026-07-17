## 1. Structure du formulaire Twig

- [x] 1.1 Refondre `templates/api_collection/_form.html.twig` en cartes séparées : Identité, Source HTTP, Pagination & parsing, Mapping
- [x] 1.2 Placer `form_errors(form)` en tête du formulaire et le bouton submit hors des cartes
- [x] 1.3 Vérifier que `new.html.twig` et `edit.html.twig` restent cohérents (espacement, bloc test distinct)

## 2. Libellés et aides

- [x] 2.1 Revoir labels/helps de `ApiCollectionDefinitionType` pour les champs techniques (mapping, memberPath, itemUrlTemplate) sans changer les noms de champs
- [x] 2.2 Remplacer les libellés « Mapping → X » par des libellés humains clairs (ex. « Titre », « Image ») tout en gardant les placeholders de chemin

## 3. Vérification manuelle

- [x] 3.1 Contrôler création + édition : sections visibles, soumission valide, test mapping toujours accessible en édition
