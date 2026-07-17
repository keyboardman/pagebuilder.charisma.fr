## Context

NodeCollection propose déjà pour `collectionType=article` une vue `default` rendue via `View/items/article/DefaultItem.tsx` avec les classes `.ce-card` (position / align / ratio issus de `content.container`). Le schéma `content` contient déjà `card`, `container`, `image`, `title`, `text`, `labels` et `show`.

En revanche, l’UI settings (`Settings.tsx` → onglet Style → `StyleTab`) n’expose que des toggles génériques (`image`, `title`, `description`, `counter`, `like`, `labels`). Les options spécifiques Card API — position image, alignement, ratio, gap, styles background/border/spacing par sous-partie — restent inaccessibles, alors qu’elles existent dans `NodeCardApi/Settings/CardSettings.tsx` et les onglets associés.

Contrainte : la vue étendue `article` (`.ce-list-api`) et les types `image` / `video` ne doivent pas être impactés.

## Goals / Non-Goals

**Goals:**

- Donner aux éditeurs, pour article + `view=default`, la **même palette d’options** que NodeCardApi (layout + styles).
- Garantir que `DefaultItem` consomme bien ces options (déjà largement le cas) et que `show.description` pilote le texte comme `show.text` côté Card API.
- Réutiliser au maximum les patterns / composants settings de NodeCardApi pour éviter la dérive.

**Non-Goals:**

- Refondre NodeCardApi ou extraire une lib partagée générique hors du nécessaire.
- Ajouter counter / like à la vue card (réservés à la vue étendue `article`).
- Appliquer ces options card aux types image / video.
- Changer le registre de vues (`default` / `article`) ni la migration `card` → `default`.

## Decisions

### 1. Conditionner l’UI card aux réglages article + view=default

**Choix :** dans l’onglet Style (ou un sous-onglet Card), n’afficher les contrôles NodeCardApi que si `collectionType === "article"` et `normalizeCollectionView(...) === "default"`. Sinon, conserver le StyleTab actuel (toggles show adaptés au type / vue).

**Alternatives :** toujours afficher les options card → confusion pour image/video et pour la vue liste API. Onglet settings dédié « Card » permanent → bruit UI.

### 2. Réutiliser les contrôles Card API sans coupler au NodeCardApiType

**Choix :** créer des sous-composants settings collection (ex. `Settings/CardStyleTab.tsx`) qui reprennent la structure de `CardSettings` / `ContainerSettings` / `ImageSettings` / `TitleSettings` / `TextSettings` / `LabelsSettings`, mais branchés sur `NodeCollectionType` via `useNodeBuilderContext` + `onChange` sur `content.card|container|image|title|text|labels|show`.

**Alternatives :** importer directement les composants NodeCardApi → ils castent en `NodeCardApiType` et écrivent `show.text` ; risque de pollution du schéma collection. Extraire immédiatement un module `shared/card-settings` → hors scope si on peut dupliquer minimalement / factoriser légèrement.

**Rationale :** le schéma collection utilise `show.description` (héritage NodeListApi) ; l’UI card peut libeller « Texte » tout en écrivant `show.description` (et éventuellement synchroniser `show` sans introduire `show.text` dans le type collection).

### 3. Mapping show text / description

**Choix :** dans DefaultItem, continuer à lire `show.description` (déjà le cas). Dans l’UI card, le switch « Text » met à jour `show.description`. Ne pas ajouter `show.text` au type `CollectionShow` pour cette change.

**Alternative :** alias `show.text` → complexité migration / double source de vérité.

### 4. Parité de rendu DefaultItem ↔ NodeCardApi View

**Choix :** audit rapide et alignement si écarts (ex. ratio défaut `full` vs `1_3`, affichage image conditionné par `show.image`, `styleForView` sur card). Objectif : même classes CSS et mêmes toggles effectifs.

**Alternative :** wrapper littéral du View NodeCardApi → impossible tel quel (item unique + apiId/itemId vs item de collection).

### 5. Toggles counter / like

**Choix :** les masquer dans l’UI Style lorsque `view=default` (article card) ; les conserver pour `view=article`.

## Risks / Trade-offs

- **[Duplication settings]** → Mitigation : structure miroir de NodeCardApi ; commenter le lien ; factoriser plus tard si un 3e consommateur apparaît.
- **[Dérive show.description vs show.text]** → Mitigation : un seul champ persisté (`description`) ; labels UI « Texte » uniquement.
- **[Surcharge de l’onglet Style]** → Mitigation : sous-onglets (Card / Container / Image / Title / Text / Labels) uniquement en mode card, comme NodeCardApi.
- **[Thème override selectors]** → Mitigation : réutiliser `getCardApiThemeSelector(position, part)` pour les Background2/Border2/Spacing2 afin que les overrides thème ciblent `.ce-card` correctement.

## Migration Plan

- Aucune migration de données : champs `card` / `container` / styles déjà présents dans les defaults NodeCollection.
- Nœuds existants avec `view=default` gagnent les contrôles UI sans changement de rendu tant que les valeurs restent aux défauts.
- Rollback : retirer les onglets settings ; le rendu card existant continue de fonctionner.

## Open Questions

- Faut-il exposer aussi un toggle « Image » dans le bloc card (NodeCardApi CardSettings ne l’a pas dans la rangée Title/Text/Label, mais `show.image` existe) ? **Décision proposée :** oui, conserver le toggle image déjà présent dans StyleTab collection.
- Factoriser immédiatement les settings Card dans `shared/` ? **Décision proposée :** non pour cette change ; duplication ciblée acceptable.
