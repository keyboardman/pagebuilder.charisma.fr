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

- **WHEN** l'utilisateur sélectionne un `NodeText`, `NodeButton`, `NodeTextIcon` ou `NodeNavItem` (via le canevas ou le navigateur de composants)
- **THEN** le canevas affiche une zone **contentEditable** sur le texte ou le libellé du nœud, avec les mêmes balises, classes et styles que le rendu final
- **AND** l'utilisateur peut modifier le contenu directement dans le nœud
- **AND** le contenu est persisté dans le modèle du nœud à la perte de focus (**blur**) ou à la validation équivalente

#### Scenario: Aperçu non éditable hors sélection

- **WHEN** un `NodeText`, `NodeButton`, `NodeTextIcon` ou `NodeNavItem` n'est pas le nœud sélectionné en mode édition
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

### Requirement: Gras partiel du libellé NodeButton

Le nœud **NodeButton** SHALL permettre de mettre en **gras une partie seulement** de son libellé (`content.label`), sans appliquer le gras à l'intégralité du bouton via **Text2Settings**. L'édition du libellé et du gras partiel SHALL s'effectuer **sur le canevas lorsque le nœud est sélectionné** (édition inline) **ou** dans le panneau **NodeSettings** du nœud sélectionné. Le libellé SHALL être persisté avec des balises inline limitées (`<strong>` ou `<b>`) ; toute autre balise SHALL être supprimée à l'enregistrement. Le rendu en édition, en prévisualisation et à l'export SHALL afficher le gras partiel. Les libellés texte brut existants (sans balises HTML) SHALL rester valides et inchangés visuellement.

#### Scenario: Gras sur une portion du libellé

- **WHEN** l'utilisateur modifie le libellé d'un NodeButton sélectionné sur le canevas ou dans NodeSettings et y applique du gras sur une portion du texte
- **THEN** seule la portion concernée est rendue en gras dans le canevas ; le reste du libellé conserve son apparence normale

#### Scenario: Rendu preview et export

- **WHEN** un NodeButton possède un libellé avec une partie en gras
- **THEN** la prévisualisation et le rendu HTML final affichent le même gras partiel sur le bouton ou le lien

#### Scenario: Persistance du libellé formaté

- **WHEN** l'utilisateur sauvegarde une page contenant un NodeButton dont le libellé comporte du gras partiel
- **THEN** le contenu sérialisé conserve les balises de gras autorisées ; à la réouverture de la page, le libellé et le formatage partiel sont restaurés à l'identique

#### Scenario: Rétrocompatibilité libellé texte brut

- **WHEN** une page contient un NodeButton avec un libellé texte brut sans balises HTML (contenu existant avant cette évolution)
- **THEN** le libellé s'affiche sans erreur ni altération du rendu

#### Scenario: Sanitisation des balises non autorisées

- **WHEN** le libellé d'un NodeButton contient ou reçoit du HTML avec des balises autres que `strong` ou `b` (ex. collage ou contenu malveillant)
- **THEN** seules les balises de gras autorisées sont conservées ; les autres balises sont supprimées tout en préservant le texte
