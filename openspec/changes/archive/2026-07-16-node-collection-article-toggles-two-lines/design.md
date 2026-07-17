## Context

Dans `CardLayoutSettings` (settings Style / layout carte article de NodeCollection), les quatre switchs Image, Title, Text et Label sont placés dans un seul `flex` horizontal (`justify-between`). Dans le panneau builder (~étroit), la rangée est légèrement trop large et les contrôles se compressent ou débordent.

## Goals / Non-Goals

**Goals:**

- Afficher les quatre switchs sur **deux lignes** de deux (Image | Title, puis Text | Label).
- Conserver le même binding `content.show.*` et le même ordre logique des contrôles.

**Non-Goals:**

- Changer les labels, la logique des toggles, ou le modèle de contenu.
- Refondre le reste de `CardLayoutSettings` (position image, alignement, styles).
- Aligner NodeCardApi settings si leur layout diffère (hors scope).

## Decisions

### 1. Grille 2×2 via Tailwind

- **Choix** : remplacer le conteneur `flex … justify-between` par une grille `grid grid-cols-2 gap-2` (ou deux `flex` empilés), une cellule par switch.
- **Pourquoi** : minimal, pas de CSS dédié, tient naturellement dans le panneau.
- **Alternatives** : `flex-wrap` (ordre/espacement moins prévisibles) ; labels abrégés (perte de clarté).

### 2. Ordre des lignes

- **Choix** : ligne 1 = Image, Title ; ligne 2 = Text, Label.
- **Pourquoi** : conserve l’ordre actuel de gauche à droite, lecture naturelle.

## Risks / Trade-offs

- **[Hauteur du panneau]** deux lignes au lieu d’une → **Acceptable** : gain de lisibilité prioritaire.
- **[Incohérence NodeCardApi]** si Card API reste en une ligne → **Mitigation** : hors scope ; peut être aligné plus tard si besoin.

## Migration Plan

1. Ajuster le markup/classes dans `CardLayoutSettings.tsx`.
2. Vérifier visuellement dans le builder (collection article, settings Style / Card).
3. Rollback : restaurer le `flex` une ligne.

## Open Questions

- Aucune.
