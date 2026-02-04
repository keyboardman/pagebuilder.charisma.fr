## 1. Modèle et persistance

- [x] 1.1 Ajouter la propriété `render` (string nullable, type text) à l'entité `Page` avec getters/setters.
- [x] 1.2 Créer une migration Doctrine pour la colonne `render` sur la table `page`.

## 2. API de contenu

- [x] 2.1 Ajouter une route GET pour récupérer le contenu du champ `render` (par id ou slug), nom de route cohérent (ex. `app_page_render`).
- [x] 2.2 Réponse : corps = contenu brut de `render`, `Content-Type: text/html` ; 404 si page inexistante ou `render` null/vide.

## 3. Mise à jour du rendu (optionnel dans ce change)

- [x] 3.1 Exposer un moyen de mettre à jour `render` (endpoint PATCH/PUT ou inclusion dans l’endpoint content existant) lorsque le client envoie le HTML complet ; documenter le contrat dans la spec.

## 4. Validation

- [x] 4.1 Vérifier que l’API retourne bien du HTML et 404 lorsque `render` est absent.
- [x] 4.2 Tester la migration en dev et en env de test.
