## 1. Implémentation UI sur /theme/fonts
- [x] 1.1 Ajouter une section « Variables du thème » sous le sélecteur de polices dans l’UI React montée sur `#theme-form-2`.
- [x] 1.2 Permettre d’ajouter une variable CSS (`name`, `value`), en forçant les noms à commencer par `--`.
- [x] 1.3 Permettre d’éditer la valeur d’une variable existante.
- [x] 1.4 Permettre de supprimer une variable existante.
- [x] 1.5 Pré-remplir, lorsqu’aucune configuration existante n’est présente, la liste avec un set de variables Tailwind CSS par défaut (par ex. couleurs et tailles de police de base exposées en CSS vars).

## 2. Connexion au theme.yaml / DTO
- [x] 2.1 Relier la nouvelle section de variables au modèle utilisé pour les thèmes (DTO / champ `config[vars]` ou équivalent) afin que l’API reçoive/renvoie les `vars` du thème.
- [x] 2.2 S’assurer que les variables saisies sont persistées dans la structure alimentant `theme.yaml` (capability `theme-generator`), en cohérence avec le requirement « Format theme.yaml ».
- [x] 2.3 Vérifier que le `ThemeCssGenerator` utilise bien ces `vars` pour générer le bloc `:root { … }` et ajuster si nécessaire.

## 3. Validation et UX
- [x] 3.1 Ajouter une validation légère côté UI (nom non vide, commence par `--` ; valeur non vide).
- [x] 3.2 (Optionnel) Ajouter une aide visuelle indiquant que les variables sont inspirées des valeurs par défaut Tailwind et peuvent être personnalisées.

## 4. Tests et vérifications
- [x] 4.1 Ajouter/synchroniser des tests unitaires ou d’intégration autour du mapping des `vars` dans le `ThemeCssGenerator` si nécessaire.
- [x] 4.2 Vérifier manuellement que l’ajout, la modification et la suppression de variables sur `/theme/fonts` se reflètent bien dans le CSS généré (présence/absence des variables dans `:root`).

