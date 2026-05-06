## 1. Cadrage du socle CSS
- [x] 1.1 Inventorier les styles CSS de base actuels utilisés par le builder et les regrouper en socle unique.
- [x] 1.2 Définir le contrat de personnalisation ThemeBuilder (variables globales + overrides par node).
- [x] 1.3 Lister les nodes enregistrés dans le builder et associer leurs hooks CSS cibles.

## 2. Génération et composition du thème
- [x] 2.1 Mettre à jour la génération CSS pour composer le socle de base et les overrides ThemeBuilder dans un ordre déterministe.
- [x] 2.2 Versionner le fichier CSS final généré et maintenir la mise à jour de `Theme.generatedCssPath`.
- [x] 2.3 Garantir que l'absence d'override sur un node conserve le style de base (fallback non bloquant).

## 3. Intégration builder
- [x] 3.1 Vérifier que l'édition, la preview et le rendu final chargent le même CSS de thème généré.
- [x] 3.2 Vérifier que les personnalisations ThemeBuilder s'appliquent à tous les nodes pris en charge.

## 4. Validation
- [x] 4.1 Valider manuellement un jeu de nodes représentatif (container, contenu, navigation, formulaire, custom, API).
- [x] 4.2 Vérifier qu'une modification ThemeBuilder sur un node est persistée et restituée après régénération.
- [x] 4.3 Ajouter/adapter les tests de génération CSS pour couvrir la composition base + overrides.
