## 1. Implémentation
- [x] 1.1 Vérifier que l’interface `/filemanager` expose l’action de création de sous-dossier dans le répertoire courant.
- [x] 1.2 Vérifier que l’interface `/filemanager` expose l’action de renommage d’un dossier existant.
- [x] 1.3 S’assurer que les opérations de création et renommage appellent les endpoints `create-directory` et `rename` de l’API filesystem.
- [ ] 1.4 Ajouter/adapter les tests d’intégration ou de bout-en-bout couvrant ces deux opérations.

## 2. Validation
- [ ] 2.1 Valider manuellement dans la médiathèque la création d’un sous-dossier puis son renommage.
- [ ] 2.2 Vérifier qu’aucune régression n’est introduite sur l’upload, le déplacement et la suppression.
