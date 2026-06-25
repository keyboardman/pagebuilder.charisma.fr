## ADDED Requirements

### Requirement: Duplication de thème depuis la liste

Le système SHALL permettre de dupliquer un thème existant depuis la liste d'administration (`/theme`), sur le même modèle que la duplication de pages. L'action SHALL être exposée via une route `POST /theme/duplicate/{id}` (nom de route `app_theme_duplicate` ou équivalent) protégée par un jeton CSRF. La copie SHALL recevoir une identité propre (id et slug uniques) et SHALL conserver la configuration visuelle du thème source (section `vars`, blocs typographiques, `node_overrides`, `custom_css`, icônes et références de polices).

Le nom du thème dupliqué SHALL être le nom source suffixé par « (copie) ». Le champ `nom` de la configuration SHALL être aligné sur ce nouveau nom. Les chemins `generatedYamlPath` et `generatedCssPath` du thème source SHALL NOT être recopiés : le système SHALL régénérer YAML et CSS dans `storage/themes/theme-{nouvel-id}/` après persistance.

Après duplication réussie, l'utilisateur SHALL être redirigé vers l'édition du thème dupliqué (`/theme/edit/{id}`) afin d'ajuster la variante. Le thème source SHALL rester inchangé.

#### Scenario: Duplication depuis la liste

- **WHEN** l'utilisateur déclenche l'action « Dupliquer » sur un thème existant avec un jeton CSRF valide
- **THEN** un nouveau thème est créé avec un id distinct, un nom « {nom source} (copie) », un slug unique et une configuration équivalente à celle du thème source
- **AND** le YAML et le CSS sont générés dans le répertoire du nouveau thème
- **AND** l'utilisateur est redirigé vers la page d'édition du thème dupliqué

#### Scenario: Variante indépendante du thème source

- **WHEN** l'utilisateur modifie ou prévisualise le thème dupliqué
- **THEN** les changements n'affectent pas le thème source
- **AND** le thème dupliqué possède ses propres fichiers générés sous `storage/themes/theme-{id}/`

#### Scenario: Jeton CSRF invalide

- **WHEN** une requête de duplication est soumise avec un jeton CSRF invalide ou absent
- **THEN** aucun thème n'est créé
- **AND** l'utilisateur est redirigé vers la liste des thèmes avec un message d'erreur
