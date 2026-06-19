## Context

Le page builder a évolué en trois étapes majeures qui laissent des reliquats :

1. **Médiathèque** : migration keyboardman (`replace-filemanager-keyboardman`) — PHP et routes legacy partiellement retirés, assets React `/media` encore présents.
2. **Canevas WYSIWYG** : `NodeComponent` et `NodeChild` ne montent plus que `view` ; la propriété `edit` des registres de nœuds est devenue orpheline.
3. **Édition inline** : le contenu texte/bouton revient dans les `View.tsx` ; les `Edit.tsx` homologues sont des doublons.

La spec `page-builder` impose déjà un audit frontend (`Requirement: Audit et retrait du code mort frontend`) mais ne couvre pas le PHP, la déduplication ni la doc. Le change archivé `cleanup-assets-dead-code-and-font-catalog` a traité la phase 1 fonts/API ; ce change couvre la **phase 2**.

## Goals / Non-Goals

**Goals**

- Réduire la surface de code mort JS/TS et PHP avec preuve (inventaire + build + tests).
- Factoriser les duplications à fort impact (Card, icônes) sans refonte UI globale.
- Aligner README, `project.md` et specs sur l’état réel du dépôt.
- Introduire un outillage léger reproductible (`npm run audit:dead-code`).

**Non-Goals**

- Fusionner les deux arbres `components/ui` (ThemeForm2 vs builder) — effort trop large pour ce change.
- Refactoriser l’architecture API Platform ou les controllers existants.
- Migrer tout le rich text hors Lexical (Draft.js est déjà inutilisé, simple suppression de deps).
- Ajouter une CI GitHub complète (hors scope si aucun workflow n’existe encore).

## Decisions

### D1 — Outil JS : knip

- **Décision** : ajouter `knip` en devDependency avec config ciblant `assets/` et les entrypoints Encore.
- **Alternatives** : `ts-prune` (moins de couverture entrypoints/templates), `depcheck` seul (ne détecte pas les exports morts).
- **Rationale** : knip croise entrypoints, imports et dépendances npm ; déjà recommandé dans le change archivé phase 1.

### D2 — Outil PHP : PHPStan niveau 0–3 sans règles custom initiales

- **Décision** : ajouter `phpstan/phpstan` en require-dev, config minimale sur `src/`, exécution manuelle + CI future.
- **Alternatives** : grep seul (fragile), Rector (trop intrusif pour un premier passage).
- **Rationale** : détecte classes/services non référencés indirectement ; complète l’inventaire manuel.

### D3 — Retrait de la couche `edit` des nœuds

- **Décision** : supprimer `edit` de `NodeConfigurationType` et tous les `Edit.tsx` une fois les changes inline validés.
- **Alternatives** : garder `edit` comme alias de `view` (maintient la confusion).
- **Prérequis** : `update-builder-edit-inline-text-on-selection` mergé ou explicitement abandonné.

### D4 — Factorisation Card par extraction, pas par héritage

- **Décision** : créer un dossier partagé `ManagerNode/shared/card/` (ou `components/card/`) pour `ViewTitle`, `HasLink`, helpers communs ; NodeCard et NodeCardApi importent depuis là.
- **Alternatives** : fusionner NodeCard et NodeCardApi en un seul type (breaking, hors scope).

### D5 — Documentation : corriger plutôt que dupliquer

- **Décision** : mettre à jour `openspec/project.md` comme source de conventions ; `README.md` renvoie vers `docs/` et OpenSpec ; archiver `docs/FILEMANAGER_KEYBOARDMAN.md` (contenu obsolète) ou le réécrire en 10 lignes « historique migration ».
- **Rationale** : éviter trois docs contradictoires sur le file manager.

## Risks / Trade-offs

| Risque | Mitigation |
|--------|------------|
| Suppression d’un fichier encore référencé dynamiquement | Inventaire knip + grep + build Encore + tests PHPUnit + smoke manuel builder |
| `Edit.tsx` encore utile pour un nœud non migré | Ordre des tâches : audit par nœud avant suppression ; garder `NodeHtml/Edit.tsx` en dernier si édition HTML canevas manquante |
| `MediaStorage` utilisé en prod hors repo | Vérifier `services.yaml` et déploiement ; suppression uniquement si zéro injection |
| Factorisation Card casse les overrides CSS par type | Conserver les classes BEM / sélecteurs thème existants sur les wrappers |

## Migration Plan

1. Merger ou clôturer les changes builder en cours (inline edit, NodeGrid UX).
2. Exécuter l’audit (knip + PHPStan) → liste dans `tasks.md` ou commentaire PR.
3. Suppressions par lots (deps → Edit layer → media legacy → PHP) avec build/test entre chaque lot.
4. Refactors duplication en PR séparée ou commits isolés.
5. Mise à jour doc + spec en fin de change.
6. Archive OpenSpec avec `openspec archive cleanup-dead-code-deduplicate-docs`.

## Open Questions

- Faut-il unifier `shortid` → `nanoid` dans tout le builder (DnD, DropZone) dans ce change ou en follow-up ?
- Le template `templates/media/index.html.twig` a-t-il encore une route Symfony active à supprimer côté routing ?
- Niveau PHPStan cible : 3 ou 5 pour la CI future ?
