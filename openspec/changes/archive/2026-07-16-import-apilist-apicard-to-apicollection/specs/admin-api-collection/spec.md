## ADDED Requirements

### Requirement: Définitions seedées éditables dans l’admin

Après application de la migration de seed, l’admin `/admin/api-collection` SHALL lister les définitions importées comme toute autre déclaration. L’administrateur SHALL pouvoir les modifier (label, mapping, enabled, etc.) sans que la re-exécution de la migration n’écrase ces modifications.

#### Scenario: Liste admin après seed

- **WHEN** un administrateur ouvre `/admin/api-collection` après la migration de seed
- **THEN** les `api_id` seedés (ex. `charisma_article_enaction_home`, `flashnews_article`) apparaissent dans la liste avec type, modes et statut enabled

#### Scenario: Édition post-seed préservée

- **WHEN** l’administrateur modifie le label d’une définition seedée puis que la migration de seed est ré-exécutée (ou un environnement déjà peuplé)
- **THEN** le label modifié est conservé (insert idempotent sans overwrite)
