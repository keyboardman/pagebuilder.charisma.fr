## Context

La médiathèque est fournie par `keyboardman/filemanager-bundle` à l'URL `/filemanager`. L'interface est rendue via des templates Twig du bundle (`layout`, `sidebar`, `upload_dropzone`, etc.) sans mécanisme natif de « help text » ou de guidelines d'upload.

Les contributeurs n'ont aujourd'hui aucune référence in-app sur les tailles, formats et conventions attendus pour optimiser les images du site Charisma. La demande utilisateur vise un **petit mémo permanent**, lisible en un coup d'œil, pour se souvenir des attentes même après plusieurs mois.

Le bundle ne propose pas de hook de configuration pour ce type de contenu ; la personnalisation se fait par **surcharge de templates Twig** Symfony (`templates/bundles/KeyboardmanFilemanagerBundle/...`).

## Goals / Non-Goals

**Goals:**

- Afficher un panneau « Conventions médias » discret et toujours visible dans `/filemanager`.
- Centraliser le contenu dans un fichier de configuration versionné (YAML) modifiable sans toucher au code Twig.
- Couvrir formats, dimensions cibles par usage, poids conseillé, nommage et rappels d'optimisation.
- Fonctionner en mode standalone et en mode iframe (picker du builder), sans modifier le bundle vendor.

**Non-Goals:**

- Validation ou rejet automatique des uploads (pas de blocage si l'image dépasse les recommandations).
- Redimensionnement ou compression serveur à l'upload (hors scope optimisation images).
- Modification du bundle `keyboardman/filemanager-bundle` en amont.
- Guidelines vidéo/audio détaillées au-delà d'un rappel minimal (focus images).

## Decisions

### 1. Contenu configurable via paramètre Symfony

**Décision** : définir `config/packages/media_upload_guidelines.yaml` avec une structure structurée (titre, sections, puces) et l'exposer comme paramètre `app.media_upload_guidelines`, injecté en **global Twig** via `config/packages/twig.yaml`.

**Alternatives considérées** :
- *Texte en dur dans le template Twig* — rejeté : difficile à maintenir, pas de source de vérité unique.
- *Extension du bundle keyboardman* — rejeté : dépendance externe, délai de release.
- *Page d'aide séparée* — rejeté : ne répond pas au besoin « mémo visible pendant l'upload ».

### 2. Emplacement UI : bas de la sidebar

**Décision** : surcharger `filemanager/sidebar.html.twig` pour inclure, sous l'arborescence des dossiers, un encart compact (`aside` footer) avec titre, sections courtes et puces. Style discret : petite typo, fond léger, icône info, pas de modale.

**Alternatives considérées** :
- *Sous la dropzone uniquement* — rejeté : moins visible quand on scroll la grille de fichiers.
- *Header* — rejeté : encombre la barre d'outils déjà dense.
- *Panneau repliable* — optionnel en phase 2 ; v1 = toujours visible pour maximiser la mémorisation.

### 3. Surcharge Twig sans toucher au controller bundle

**Décision** : copier le template `sidebar.html.twig` du bundle dans `templates/bundles/KeyboardmanFilemanagerBundle/filemanager/sidebar.html.twig`, y inclure un partial `_media_guidelines.html.twig` projet qui lit le global Twig `media_upload_guidelines`.

Le controller bundle continue de passer `directories`, `filter`, etc. ; le mémo ne dépend que du global Twig.

### 4. Contenu par défaut (valeurs initiales Charisma)

**Décision** : peupler le YAML avec des conventions raisonnables et ajustables :

| Usage | Dimensions cibles | Poids max conseillé |
|-------|-------------------|---------------------|
| Hero / bannière | 1920 × 800 px (ratio ~2,4:1) | ≤ 300 Ko |
| Carte / vignette | 800 × 600 px | ≤ 150 Ko |
| Image pleine largeur contenu | 1200 × 675 px (16:9) | ≤ 200 Ko |
| Logo / icône | SVG ou PNG, fond transparent | ≤ 100 Ko |

Formats : **WebP** en priorité pour les photos ; **JPEG** acceptable ; **PNG** pour transparence ou logos ; éviter PNG pour photos. Nommage : minuscules, tirets, pas d'espaces ni d'accents (ex. `evenement-2026-hero.webp`). Optimiser avant upload (compression, redimensionnement à la taille d'affichage réelle).

Ces valeurs sont **indicatives** (mémo), pas des contraintes techniques.

## Risks / Trade-offs

- **[Risque] Contenu obsolète si non maintenu** → Mitigation : fichier YAML unique, documenté dans `AGENTS.md`, facile à éditer.
- **[Risque] Surcharge Twig cassée lors d'une mise à jour du bundle** → Mitigation : diff minimal (ajout du partial en bas de sidebar), test manuel après upgrade bundle.
- **[Risque] Encombrement sidebar en iframe (picker étroit)** → Mitigation : style compact, scroll interne si besoin ; la sidebar fait déjà 250px.
- **[Trade-off] Pas de validation serveur** → Les guidelines restent un aide-mémoire ; l'upload reste permissif.

## Migration Plan

1. Ajouter le YAML de guidelines et le global Twig.
2. Créer les templates surchargés.
3. Vérifier rendu sur `/filemanager` et depuis le picker iframe du builder.
4. Documenter l'emplacement de la config dans `AGENTS.md`.
5. Rollback : supprimer les surcharges Twig et le paramètre (retour à l'UI bundle d'origine).

## Open Questions

- Les dimensions cibles par défaut ci-dessus conviennent-elles au design Charisma actuel, ou faut-il les ajuster avant implémentation ? (Le YAML permet de les modifier sans code.)
- Faut-il un panneau repliable en v1 ou le mémo toujours visible suffit ? (Proposition : toujours visible en v1.)
