## Context

Le dossier `assets/` cumule plusieurs générations de code : formulaire thème v1 (`themeForm` + `ThemeFontPicker`), builder React (`editeur/`), ManagerFont récent, et un premier `ApiManager` remplacé par `ApiManagerModal`. Un inventaire préliminaire (grep / entrées Encore) identifie des candidats au retrait sans référence active.

Les polices du catalogue (`Font` en base) sont exposées via `GET /api/builder/fonts` et consommées par `ManagerFontModal`. Les APIs cards (article, vidéo, image, list) passent par `GET /api/builder/cards` et `apiRegistry`. Ces deux registres sont distincts ; la confusion UX vient surtout de code legacy et de sélecteurs API ad hoc (ex. NodeSlideshow).

## Goals / Non-Goals

- Goals :
  - Réduire la surface morte dans `assets/` avant toute évolution fonts/API.
  - Garantir que l’utilisateur peut ajouter une police du catalogue (Google/custom) via ManagerFont et la voir dans le sélecteur.
  - Unifier la sélection d’API image fixe du NodeSlideshow sur `ApiManagerModal`.
- Non-Goals :
  - Charger tout le catalogue `Font` au démarrage du builder.
  - Fusionner les endpoints backend `fonts` et `cards` en une seule API.
  - Refonte complète de l’UI ApiManager (hors filtres nécessaires au slideshow).

## Decisions

- **Ordre d’exécution** : audit code mort → corrections fonts → NodeSlideshow API picker. Aucune feature fonts tant que l’inventaire n’est pas validé.
- **Méthode d’audit** : combiner `rg`/grep (imports, `encore_entry_*` dans templates), exports `@deprecated`, et si disponible un outil type `knip` ou `ts-prune` sur `assets/editeur`. Chaque suppression exige zéro référence dans le repo (templates inclus).
- **Polices** : conserver le modèle actuel (builtins + thème + page via `FontUsageRegistry` ; catalogue via modale). Supprimer les chemins parallèles (Tom Select Stimulus, `ThemeFontPicker` legacy).
- **NodeSlideshow** : remplacer le `Form.Select` alimenté par `apiRegistry.list().filter(...)` par `ApiManagerModal` avec filtres explicites, sans changer le contrat de persistance (`slidesMode`, `apiId` uniquement en mode API).

## Candidats code mort (inventaire initial — à confirmer à l’audit)

| Élément | Indice |
|--------|--------|
| `assets/editeur/ManagerApi/ApiManager.tsx` | Aucun import ; remplacé par `ApiManagerModal` |
| `assets/themeForm.jsx` + entrée Webpack `themeForm` | Templates utilisent `ThemeForm2` uniquement |
| `assets/components/ThemeFontPicker.jsx` | Importé uniquement par `themeForm.jsx` |
| `assets/pageFormWithBuilder.jsx`, `assets/pageBuilder.jsx` | Absents de `webpack.config.js` |
| `sanitizeSlideshowContentForPersistence` | `@deprecated`, aucun appelant |
| `getNodeLabel` dans `explorerTree.ts` | `@deprecated`, aucun appelant |
| `fetchFontById`, `clearFontResolveCache` | Définis, non importés ailleurs |
| `assets/controllers/font_family_autocomplete_controller.js` | Non déclaré dans `controllers.json` |
| Alias `@editeur` → `assets/editeur2` | Dossier inexistant ; imports réels via `@/editeur` |

## Risks / Trade-offs

- Suppression trop agressive → Mitigation : vérifier templates Twig, `webpack.config.js`, et tests manuels builder/preview après chaque lot.
- ManagerFont déjà spec’d mais non perçu côté utilisateur → Mitigation : phase 2 inclut test E2E manuel et correction de `pageBuilderApiBaseUrl` si manquant.

## Migration Plan

1. Produire la liste validée des suppressions (PR dédiée ou première tâche).
2. Retirer fichiers/exports morts ; retirer entrée Webpack `themeForm` si confirmée inutile.
3. Valider build Encore + ouverture builder + `/theme/fonts`.
4. Corriger fonts si régression détectée.
5. Migrer NodeSlideshow vers `ApiManagerModal`.

## Open Questions

- Faut-il conserver `pageFormWithBuilder.jsx` pour un usage futur hors Encore, ou le archiver ?
- `hello_controller.js` / `Hello.jsx` (scaffold Symfony UX) : suppression ou conservation documentée ?
