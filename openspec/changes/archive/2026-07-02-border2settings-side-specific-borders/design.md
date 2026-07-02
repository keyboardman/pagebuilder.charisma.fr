## Context

`Border2Settings` permet aujourd'hui de regler la bordure d'un noeud, mais l'usage cible impose parfois une bordure asymetrique (ex. uniquement `border-bottom`). Le builder possede deja une logique similaire de mode unifie/par cote pour `Spacing2Settings`, ce qui fournit un precedent UX et technique reutilisable.

La solution doit rester compatible avec les styles existants deja persistes (shorthand global) et eviter les conflits CSS entre shorthand (`border`) et longhands (`borderTop`, `borderRight`, `borderBottom`, `borderLeft`).

## Goals / Non-Goals

**Goals:**
- Ajouter un mode unifie et un mode par cote dans `Border2Settings`.
- Permettre la persistance fiable des valeurs de bordure sans conflit entre shorthand et longhands.
- Preserver le comportement existant pour les noeuds qui utilisent deja une bordure globale.
- Garder une UX coherente avec `Spacing2Settings` (detection automatique du mode et bascule explicite).

**Non-Goals:**
- Refonte complete du systeme de styles de l'editeur.
- Introduction de nouvelles proprietes CSS hors perimetre bordure (ombres, outlines, etc.).
- Migration forcee de toutes les donnees existantes vers un nouveau format.

## Decisions

1. **Mode dual unifie/par cote**
   - Decision: introduire un switch de mode dans `Border2Settings`.
   - Rationale: couvre les cas simples (bordure uniforme) et avances (bordure par cote) sans dupliquer le composant.
   - Alternative considered: champs par cote uniquement.
   - Pourquoi non retenu: degrade l'ergonomie pour le cas majoritaire de bordure uniforme.

2. **Regle d'exclusivite shorthand vs longhands**
   - Decision: en mode unifie, persister `border` et supprimer `borderTop/Right/Bottom/Left`; en mode par cote, faire l'inverse.
   - Rationale: elimine les conflits de priorite CSS et rend le rendu deterministe.
   - Alternative considered: conserver shorthand et longhands en parallele.
   - Pourquoi non retenu: ambiguite de rendu et complexite de maintenance.

3. **Detection automatique du mode a l'ouverture**
   - Decision: ouvrir en mode unifie si la shorthand existe seule ou si les 4 cotes longhand sont egaux; sinon mode par cote.
   - Rationale: affiche immediatement l'etat le plus representatif de la configuration courante.
   - Alternative considered: toujours ouvrir en mode unifie.
   - Pourquoi non retenu: masque les configurations asymetriques et force des manipulations inutiles.

4. **Alignement comportemental avec Spacing2Settings**
   - Decision: reutiliser le meme schema de bascule, de propagation des valeurs et de placeholders.
   - Rationale: coherence d'usage dans les panneaux de style et reduction du risque d'incoherence.
   - Alternative considered: comportement specifique a Border2Settings.
   - Pourquoi non retenu: augmente la dette cognitive et les risques de regression UX.

## Risks / Trade-offs

- **[Risque]** Interactions inattendues avec des styles inline historiques melant shorthand et longhands -> **Mitigation**: appliquer une normalisation stricte a chaque changement de mode et couvrir par des tests unitaires.
- **[Risque]** Regressions UI sur les placeholders/theme overrides -> **Mitigation**: conserver la logique existante et ajouter des scenarios de validation dedies aux champs border.
- **[Trade-off]** Ajout d'un controle de mode dans l'UI augmente legerement la complexite visuelle -> **Mitigation**: reprendre les conventions deja connues de `Spacing2Settings`.
