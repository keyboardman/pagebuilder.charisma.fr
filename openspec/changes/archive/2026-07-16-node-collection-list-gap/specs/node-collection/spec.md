## MODIFIED Requirements

### Requirement: Disposition list

Lorsque `display=list`, le NodeCollection SHALL afficher les items dans une disposition verticale empilée (liste). Le conteneur SHALL utiliser le hook CSS `ce-collection` et chaque item `ce-collection-item`. Le nœud SHALL exposer un paramètre **`content.list.gap`** (entier ≥ 0, défaut `3`, même échelle Tailwind que `grid.gap`) pour contrôler l’espacement vertical entre items. Ce gap SHALL s’appliquer au conteneur liste (y compris le markup `ce-list-api-items` lorsque la vue article list-api est active). Les réglages Affichage SHALL proposer un contrôle Gap lorsque `display=list`.

#### Scenario: Affichage en liste

- **WHEN** l'utilisateur configure `display=list` avec des items chargés
- **THEN** les items sont rendus les uns sous les autres dans un conteneur `ce-collection`

#### Scenario: Gap liste configurable

- **WHEN** l'utilisateur configure `display=list` avec `list.gap=6`
- **THEN** le conteneur liste applique un espacement équivalent à la classe Tailwind `gap-6` entre les items

#### Scenario: Défaut gap liste sans valeur persistée

- **WHEN** un nœud existant a `display=list` sans `list.gap` défini
- **THEN** le rendu utilise le défaut `3` (équivalent à l’espacement historique ~0.75rem)

#### Scenario: Contrôle Gap visible en mode liste

- **WHEN** l'utilisateur ouvre l’onglet Affichage avec `display=list`
- **THEN** un contrôle Gap est disponible et met à jour `content.list.gap`
