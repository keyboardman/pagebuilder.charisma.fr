# Change: Suppression de comptes utilisateurs dans l'admin

## Why
L'administration des comptes permet actuellement de lister, creer et modifier des utilisateurs, mais pas de les supprimer. Cette limitation complique le nettoyage des comptes obsoletes et la gestion operationnelle.

## What Changes
- Ajouter la capacite de supprimer un compte utilisateur depuis l'interface d'administration des comptes.
- Definir des garde-fous minimaux pour eviter la suppression involontaire d'un compte critique (ex. compte connecte).
- Afficher un retour utilisateur explicite en cas de suppression reussie ou refusee.

## Impact
- Affected specs: `admin-user-management` (nouvelle capacite)
- Affected code: `src/Controller/AdminController.php`, `templates/admin/user/index.html.twig`, `src/Repository/UserRepository.php` (ou service associe), tests fonctionnels admin utilisateurs
