## 1. Modèle de données

- [x] 1.1 Ajouter la propriété `metaTitle` (nullable, `length: 255`) et les accesseurs `getMetaTitle` / `setMetaTitle` sur `src/Entity/Page.php`
- [x] 1.2 Ajouter la méthode `getEffectiveMetaTitle(): string` (repli sur `title` si `metaTitle` vide)
- [x] 1.3 Générer et vérifier la migration Doctrine (`meta_title` nullable sur `page`)

## 2. Formulaire admin

- [x] 2.1 Ajouter le champ `metaTitle` dans `AdminPageFormType` (label « Titre SEO », optionnel, placeholder et aide)
- [x] 2.2 Afficher le champ dans la section SEO de `templates/page/new.html.twig` et `templates/page/edit.html.twig` (avant `description`)

## 3. Rendu public et builder

- [x] 3.1 Utiliser `page.effectiveMetaTitle` pour `<title>` dans `templates/page/render_view.html.twig` et `templates/page/preview.html.twig`
- [x] 3.2 Passer `pageMetaTitle` (valeur effective) depuis `templates/page/builder.html.twig` vers le JS
- [x] 3.3 Mettre à jour `assets/pageBuilderStandalone.jsx` : prop `pageMetaTitle`, utilisation dans `buildFullDocument` pour la balise `<title>` (le libellé header du builder reste `pageTitle`)

## 4. Duplication et persistance

- [x] 4.1 Copier `metaTitle` dans `PageController::duplicate`

## 5. Tests

- [x] 5.1 Test unitaire : `getEffectiveMetaTitle` avec metaTitle renseigné, vide et null (`tests/Entity/PageTest.php`)
- [x] 5.2 Test fonctionnel : création/édition de page avec `metaTitle` via le formulaire admin
- [x] 5.3 Test fonctionnel : duplication copie le `metaTitle`
- [x] 5.4 Test fonctionnel : rendu public contient le `metaTitle` dans `<title>` (et repli sur `title` si absent)
