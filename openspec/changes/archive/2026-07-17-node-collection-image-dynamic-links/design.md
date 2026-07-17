## Context

NodeCollection image en `mode=dynamic` stocke déjà `link` (et `alt`) sur chaque `CollectionImageMediaEntry`. Le mapping (`mapMediaEntriesToCollectionImageItems`) et le rendu (`ImageDefaultItem`) propagent et affichent le lien quand il est non vide. Le trou est uniquement côté réglages : `CollectionImageDynamicItemsSettings` initialise `link: ""` à l’ajout et n’expose aucun champ pour le modifier.

Référence UX proche : édition `link` par slide dans NodeSlideshow (champ « Lien (optionnel) »).

## Goals / Non-Goals

**Goals:**

- Permettre de saisir / modifier un URL de lien par image dans la liste dynamique
- Persister `dynamicItems[].link` et voir le rendu cliquable immédiatement en preview
- Conserver la compatibilité des nœuds existants sans `link` (comportement inchangé)

**Non-Goals:**

- Mode fixe image (`apiId` / endpoint) — les liens viennent déjà du mapping API
- Types `article` / `video` (déjà résolus via leurs sources)
- Attribut `target` / `rel` avancés (hors scope ; alignement minimal avec le rendu actuel `<a href>`)
- Refonte complète de la liste (drag & drop, médiathèque) — seulement ajout du champ lien

## Decisions

1. **Édition inline dans la liste des items**  
   Ajouter un champ texte « Lien (optionnel) » sous chaque entrée de `CollectionImageDynamicItemsSettings`, plutôt qu’une modale ou un onglet séparé.  
   *Rationale* : peu d’items typiquement ; pattern simple ; pas de sélection d’item requise.  
   *Alternative* : panneau détail comme Slideshow — plus lourd pour une seule propriété.

2. **Réutiliser le champ `link` existant**  
   Pas de nouveau nom (`href`, `url`). Aligné modèle, mapping et rendu déjà en place.  
   *Alternative* : introduire `href` comme NodeImage — créerait une dualité inutile dans Collection.

3. **Pas de validation URL stricte**  
   Accepter toute chaîne non vide (relatifs `/…`, absolus `https://…`) ; trim à la persistance / mapping comme aujourd’hui.  
   *Alternative* : regex http(s) only — trop restrictif pour les liens internes.

4. **Rendu inchangé**  
   `ImageDefaultItem` garde le `<a href>` conditionnel ; vérifier list / grid / slideshow (même renderer d’item). Tests unitaires sur mapping + éventuellement snapshot/settings si déjà couverts.

## Risks / Trade-offs

- **[UX densité]** Liste plus haute avec un input par item → Mitigation : input compact (`h-7`), label court « Lien », placeholder `https://...`
- **[Clics builder]** Lien cliquable en preview peut interférer avec la sélection du nœud → Mitigation : comportement déjà accepté pour articles / NodeImage ; pas de changement spécifique
- **[Oublier alt]** On n’ajoute que le lien demandé ; `alt` reste non éditable dans cette UI → Acceptable (hors demande) ; peut être un follow-up

## Migration Plan

- Aucune migration de données : les entrées sans `link` restent valides
- Déploiement frontend uniquement
- Rollback : retirer le champ UI ; les `link` déjà saisis restent inoffensifs dans le JSON

## Open Questions

- Aucun bloquant : le champ `alt` n’est pas demandé dans ce change
