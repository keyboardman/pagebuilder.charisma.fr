## MODIFIED Requirements

### Requirement: Canevas d'édition WYSIWYG

En mode **édition** du builder, le canevas SHALL afficher chaque nœud avec le **même composant de rendu** qu'en mode **prévisualisation** (composant `view` du registre de nœuds). Le rendu visuel du contenu (disposition, styles, texte affiché) SHALL être **identique** entre édition et prévisualisation pour un même breakpoint sélectionné, **sauf** lorsqu'un nœud à contenu texte court est **sélectionné** et bascule en édition inline (voir scénario dédié).

Le mode édition SHALL conserver les capacités structurelles : **zones de dépôt** (`DropZone`), **glisser-déposer** et **sélection** de nœuds. Ces interactions SHALL être superposées au rendu WYSIWYG sans modifier l'apparence des nœuds eux-mêmes (pas de bordures de cellules d'édition, pas de composants `edit` dédiés sur le canevas).

L'édition du **contenu** des nœuds texte SHALL s'effectuer **directement sur le canevas lorsque le nœud est sélectionné** (édition inline), **ou** via le panneau **NodeSettings** (sidebar droite), **ou** via les modales déjà prévues (ex. `NodeRichText`). Hors sélection, le canevas SHALL afficher un aperçu non éditable identique à la prévisualisation.

#### Scenario: Rendu identique édition et prévisualisation

- **WHEN** l'utilisateur consulte une page contenant plusieurs types de nœuds (texte, bouton, flex, grille, etc.)
- **AND** l'utilisateur bascule entre le mode édition et le mode prévisualisation avec le même breakpoint actif
- **AND** aucun nœud texte court n'est en cours d'édition inline (non sélectionné ou prévisualisation)
- **THEN** la disposition et l'apparence du contenu restent visuellement identiques
- **AND** seul le chrome d'édition (menus, dropzones, bordures de survol) apparaît ou disparaît

#### Scenario: Édition inline à la sélection sur le canevas

- **WHEN** l'utilisateur sélectionne un `NodeText`, `NodeHeader`, `NodeButton`, `NodeTextIcon` ou `NodeNavItem` (via le canevas ou le navigateur de composants)
- **THEN** le canevas affiche une zone **contentEditable** sur le texte ou le libellé du nœud, avec les mêmes balises, classes et styles que le rendu final
- **AND** l'utilisateur peut modifier le contenu directement dans le nœud
- **AND** le contenu est persisté dans le modèle du nœud à la perte de focus (**blur**) ou à la validation équivalente

#### Scenario: Aperçu non éditable hors sélection

- **WHEN** un `NodeText`, `NodeHeader`, `NodeButton`, `NodeTextIcon` ou `NodeNavItem` n'est pas le nœud sélectionné en mode édition
- **THEN** le canevas affiche le rendu final (aperçu) sans zone éditable
- **AND** l'apparence est identique à la prévisualisation pour ce nœud

#### Scenario: Édition complémentaire via NodeSettings

- **WHEN** l'utilisateur sélectionne un nœud à contenu texte et modifie le texte dans le panneau **NodeSettings**
- **THEN** le canevas reflète immédiatement la modification
- **AND** l'édition inline sur le canevas reste disponible lorsque le nœud est sélectionné

#### Scenario: NodeRichText inchangé

- **WHEN** l'utilisateur sélectionne un `NodeRichText`
- **THEN** le canevas affiche l'aperçu du contenu sans éditeur inline sur le bloc
- **AND** la modale WYSIWYG s'ouvre pour l'édition, comme en prévisualisation

#### Scenario: Retour à la ligne en édition inline NodeText et NodeHeader

- **WHEN** l'utilisateur sélectionne un `NodeText` ou un `NodeHeader` en mode édition
- **AND** il place le curseur dans la zone contentEditable et appuie sur **Entrée** pour insérer un saut de ligne
- **THEN** le canevas affiche le texte sur plusieurs lignes
- **AND** après blur et sauvegarde, le contenu persisté dans `content.html` conserve le saut de ligne (balises HTML équivalentes, ex. `<br>`)
- **AND** le rendu en prévisualisation et à l'export affiche le même contenu multi-lignes

#### Scenario: NodeHeader rendu HTML cohérent

- **WHEN** un `NodeHeader` contient du HTML avec sauts de ligne dans `content.html`
- **AND** le nœud n'est pas en édition inline (prévisualisation ou non sélectionné en édition)
- **THEN** le titre est rendu via le HTML persisté (et non en texte brut échappé)
- **AND** les sauts de ligne sont visibles comme dans `NodeText`
