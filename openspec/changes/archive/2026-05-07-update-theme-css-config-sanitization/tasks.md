## 1. Implementation
- [x] 1.1 Ajouter une fonction de sanitation centralisée dans `ThemeCssGenerator` pour nettoyer les valeurs venant de la config.
- [x] 1.2 Appliquer cette sanitation à toutes les propriétés CSS textuelles interpolées depuis le YAML/Theme config.
- [x] 1.3 Conserver les caractères autorisés uniquement: alphanumériques, parenthèses, quotes simples/doubles et guillemets.
- [x] 1.4 Supprimer les caractères non autorisés (dont `;`) pour éviter de casser la règle CSS générée.
- [x] 1.5 Ajouter/adapter des tests unitaires pour valider les entrées autorisées et le rejet des caractères interdits.

## 2. Validation
- [x] 2.1 Exécuter la suite de tests ciblant le générateur de thème. *(bloqué localement: PHP 8.2, PHPUnit requiert PHP >= 8.3)*
- [x] 2.2 Vérifier qu’une config contenant `;` ne casse plus le CSS généré. *(couvert par test ajouté, exécution en attente d’un runtime PHP 8.3)*
