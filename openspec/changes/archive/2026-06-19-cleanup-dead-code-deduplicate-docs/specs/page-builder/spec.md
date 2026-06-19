## MODIFIED Requirements

### Requirement: Audit et retrait du code mort frontend

Le projet SHALL maintenir le dossier `assets/` exempt de modules, entrées Webpack, composants de nœuds (`Edit.tsx`, dossiers `Edits/`) et exports explicitement morts (fichiers non référencés par le build Encore, les templates Twig ou le code TypeScript/JavaScript actif). La propriété `edit` des configurations de nœuds (`NodeConfigurationType`) SHALL NOT exister lorsque le canevas ne monte que le composant `view`. Toute évolution du builder (polices, APIs, édition inline) SHALL être précédée d’un inventaire documenté des candidats à la suppression, idéalement via le script `audit:dead-code` (knip + revue manuelle des templates Twig).

#### Scenario: Inventaire avant modification du builder

- **WHEN** une tâche vise à modifier le sélecteur de polices, la sélection d’API d’un nœud ou la couche d’édition du canevas
- **THEN** un inventaire des fichiers, exports et dépendances npm non référencés dans `assets/` est produit et les suppressions confirmées sont appliquées avant le changement fonctionnel

#### Scenario: Build après nettoyage frontend

- **WHEN** des fichiers morts, la couche `Edit.tsx` ou des dépendances npm inutilisées sont retirés de `assets/`
- **THEN** la compilation Encore réussit et les entrypoints actifs (`pageBuilderStandalone`, `pagePreview`, `ThemeForm2`, `app`) restent fonctionnels

#### Scenario: Absence de reliquats médiathèque legacy

- **WHEN** le nettoyage frontend est terminé
- **THEN** l’entrypoint Webpack `fileManager`, `assets/fileManager.jsx`, `assets/components/FileManager.tsx` et le template `templates/media/index.html.twig` ne sont plus présents dans le dépôt

## ADDED Requirements

### Requirement: Audit et retrait du code mort backend PHP

Le projet SHALL maintenir `src/` exempt de services, factories et blocs de configuration Symfony explicitement morts (classes non injectées, paramètres `services.yaml` sans consommateur, listeners référençant des routes supprimées). L’audit SHALL combiner PHPStan (niveau bas minimal) et revue manuelle des `services.yaml` avant suppression.

#### Scenario: Services legacy média retirés

- **WHEN** le stockage média est entièrement délégué à keyboardman/filesystem-bundle
- **THEN** `MediaStorage`, `S3ClientFactory` et le bloc `media_storage.*` de `config/services.yaml` sont absents ou documentés comme exception justifiée

#### Scenario: Tests après nettoyage PHP

- **WHEN** des classes ou paramètres morts sont retirés de `src/` ou `config/`
- **THEN** `composer test` réussit et les routes `/filemanager` et `/api/filesystem/*` restent opérationnelles

### Requirement: Factorisation des composants dupliqués du builder

Les paires de nœuds ou settings partageant la même structure de rendu SHALL utiliser des modules partagés plutôt que des copies locales, lorsque la duplication est confirmée par l’audit (ex. vues Card entre `NodeCard` et `NodeCardApi`, settings icône entre `NodeIcone` et `NodeTextIcon`). Les classes CSS, sélecteurs d’override thème et contrats de contenu JSON des nœuds SHALL être préservés après factorisation.

#### Scenario: Vues Card partagées

- **WHEN** `NodeCard` et `NodeCardApi` exposent des composants de vue identiques (titre, lien, image)
- **THEN** ces composants résident dans un module partagé sous `assets/editeur/ManagerNode/` et sont importés par les deux nœuds sans duplication de fichier

#### Scenario: Settings icône partagés

- **WHEN** `NodeIcone` et `NodeTextIcon` partagent la même logique de réglages d’icône et de conteneur
- **THEN** un composant ou factory de settings partagé est utilisé par les deux panneaux Settings

#### Scenario: Rendu inchangé après factorisation

- **WHEN** l’utilisateur édite une page contenant des nœuds Card, CardApi, Icone ou TextIcon avant et après la factorisation
- **THEN** le rendu preview et public reste visuellement et structurellement identique

### Requirement: Documentation technique alignée sur l’implémentation

La documentation du dépôt SHALL refléter l’état réel du code : stack, commandes de développement, intégration file manager keyboardman, et entrypoints Webpack actifs. `openspec/project.md` SHALL documenter le purpose du projet, la stack et les conventions de test. `README.md` SHALL fournir une vue d’ensemble et les commandes essentielles (Docker, Encore, PHPUnit). Les documents obsolètes contredisant l’implémentation (ex. file manager non installé, entrypoint `fileManager` actif) SHALL être corrigés ou archivés.

#### Scenario: project.md exploitable

- **WHEN** un contributeur ouvre `openspec/project.md`
- **THEN** il trouve le purpose du projet, la stack technique, l’architecture du page builder et la procédure d’initialisation de la base de données

#### Scenario: README et AGENTS cohérents avec le file manager

- **WHEN** un contributeur suit `README.md` ou `AGENTS.md` pour accéder aux médias
- **THEN** la documentation indique `/filemanager` (keyboardman) et l’intégration iframe du builder, sans référence à une page `/media` React legacy ni à l’entrypoint `fileManager`

#### Scenario: Script d’audit documenté

- **WHEN** un contributeur exécute `npm run audit:dead-code`
- **THEN** un rapport liste les exports et dépendances candidates à la suppression dans `assets/`, documenté dans `openspec/project.md` ou `README.md`
