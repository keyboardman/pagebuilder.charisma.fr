## 1. Implementation
- [x] 1.1 Ajouter une route/action de suppression de compte dans l'administration (`/admin/compte/{id}/delete`) avec methode adaptee et protection CSRF.
- [x] 1.2 Ajouter le controle metier minimal pour empecher la suppression du compte actuellement connecte.
- [x] 1.3 Ajouter l'action "Supprimer" dans la liste des comptes avec confirmation explicite cote interface.
- [x] 1.4 Ajouter des messages flash de succes et d'erreur pour les cas de suppression acceptee ou refusee.
- [x] 1.5 Ajouter/mettre a jour les tests fonctionnels couvrant: suppression reussie, suppression de soi refusee, et affichage des retours utilisateur.

## 2. Validation
- [x] 2.1 Executer la suite de tests ciblee pour l'admin utilisateurs.
- [x] 2.2 Verifier manuellement le flux complet depuis la page `/admin/comptes` (suppression + protections).
