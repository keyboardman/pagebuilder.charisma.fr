## Why

Les sources ApiList* et ApiCard existent aujourd’hui uniquement comme classes PHP hardcodées, alors que `api_collection_definition` est prête à les héberger en base. Sans seed SQL, l’admin ApiCollection reste vide et NodeCollection dépend encore des adapters PHP. Il faut importer les APIs production en définitions persistées pour unifier le catalogue et permettre la maintenance sans déploiement.

## What Changes

- Ajouter une **migration Doctrine de seed** qui insère dans `api_collection_definition` les ApiList / ApiCard production exprimables en configuration (URL, mapping, modes, pagination).
- Suffixer chaque **libellé** seedé par ` — Collection` pour les distinguer des sources legacy ApiList / ApiCard.
- **Fusionner** les variantes fixed (`*_home`) et dynamic d’une même source en une seule définition dual-mode lorsque l’endpoint et le mapping le permettent (hors scope ids distincts — voir design).
- Exclure les stubs et documenter les APIs **non exprimables** en v1 (bannières avec pagination custom, vidéos Hydra avancé, catégories) — elles restent via adapters PHP.
- Après seed, **désactiver les tags services** des adapters PHP dont l’`api_id` est désormais couvert par une définition enabled, pour éviter les collisions d’id dans le registre.
- Pas de changement de contrat runtime NodeCollection / endpoints `/collections` (hors éventuels ajustements mineurs de mapping déjà supportés).

## Capabilities

### New Capabilities

- `api-collection-seed`: Import SQL des sources ApiList/ApiCard production vers `api_collection_definition`, règles de fusion fixed/dynamic, et retrait progressif des adapters PHP redondants.

### Modified Capabilities

- `api-collection`: Préciser que le catalogue peut être alimenté par des définitions seedées (parité avec les sources PHP historiques) et que les ids seedés sont réservés côté admin/adapters.
- `admin-api-collection`: Après migration, la liste admin doit afficher les définitions seedées (éditables) ; les ids des adapters PHP restants restent non collidables.

## Impact

- Migration Doctrine (INSERT idempotent ou data migration) sur `api_collection_definition`.
- `config/services.yaml` : retrait/commentaire des tags des ApiList*/ApiCard couverts par le seed.
- Registre `ApiCollectionRegistry` : moins d’adapters PHP, plus de définitions DB.
- NodeCollection / NodeList* : comportement inchangé si les `api_id` seedés reprennent les ids canonicaux (éventuel **BREAKING** si on unifie `*_home` → id sans suffixe — à traiter via mapping d’alias ou conservation des ids historiques dans le design).
- Stubs (`StubApiCard`, `StubNavListApiCard`) non importés.
