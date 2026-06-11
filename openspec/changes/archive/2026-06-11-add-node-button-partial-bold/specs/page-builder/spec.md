## ADDED Requirements

### Requirement: Gras partiel du libellé NodeButton

Le nœud **NodeButton** SHALL permettre de mettre en **gras une partie seulement** de son libellé (`content.label`), sans appliquer le gras à l'intégralité du bouton via **Text2Settings**. L'édition SHALL s'effectuer en **inline** dans le canevas lorsque l'utilisateur modifie le libellé du bouton ou du lien. Le système SHALL exposer une action **Gras** (et le raccourci **Ctrl/Cmd+B**) applicable à la sélection courante dans le libellé. Le libellé SHALL être persisté avec des balises inline limitées (`<strong>` ou `<b>`) ; toute autre balise SHALL être supprimée à l'enregistrement. Le rendu en édition, en prévisualisation et à l'export SHALL afficher le gras partiel. Les libellés texte brut existants (sans balises HTML) SHALL rester valides et inchangés visuellement.

#### Scenario: Gras sur une sélection du libellé
- **WHEN** l'utilisateur sélectionne une portion du libellé d'un NodeButton en édition inline et active l'action Gras (bouton ou Ctrl/Cmd+B)
- **THEN** seule la portion sélectionnée est rendue en gras dans le canevas ; le reste du libellé conserve son apparence normale

#### Scenario: Rendu preview et export
- **WHEN** un NodeButton possède un libellé avec une partie en gras
- **THEN** la prévisualisation et le rendu HTML final affichent le même gras partiel sur le bouton ou le lien

#### Scenario: Persistance du libellé formaté
- **WHEN** l'utilisateur sauvegarde une page contenant un NodeButton dont le libellé comporte du gras partiel
- **THEN** le contenu sérialisé conserve les balises de gras autorisées ; à la réouverture de la page, le libellé et le formatage partiel sont restaurés à l'identique

#### Scenario: Rétrocompatibilité libellé texte brut
- **WHEN** une page contient un NodeButton avec un libellé texte brut sans balises HTML (contenu existant avant cette évolution)
- **THEN** le libellé s'affiche et s'édite comme auparavant, sans erreur ni altération du rendu

#### Scenario: Sanitisation des balises non autorisées
- **WHEN** le libellé d'un NodeButton contient ou reçoit du HTML avec des balises autres que `strong` ou `b` (ex. collage ou contenu malveillant)
- **THEN** seules les balises de gras autorisées sont conservées ; les autres balises sont supprimées tout en préservant le texte

## MODIFIED Requirements

### Requirement: Nœud bouton (NodeButton)

Le builder SHALL fournir un type de nœud **NodeButton** (identifiant `node-button`) affichant un bouton ou un lien stylisé. Le nœud SHALL supporter trois types : **button**, **submit** et **link**. Pour le type **link**, le nœud SHALL exposer les champs **href** et **target** (ex. `_blank`, `_self`). Le nœud SHALL exposer dans ses paramètres les panneaux **Background2Settings**, **Border2Settings** et **Text2Settings** (et Base2Settings pour id/className), de la même façon que les autres nœuds de contenu (ex. NodeText). Le libellé (`content.label`) SHALL être éditable en inline dans le canevas et SHALL supporter le **gras partiel** conformément à l'exigence **Gras partiel du libellé NodeButton**.

#### Scenario: Ajout d’un NodeButton depuis le panneau

- **WHEN** l’utilisateur ajoute un bloc depuis le panneau des composants et choisit le bouton (NodeButton)
- **THEN** un nœud NodeButton est inséré dans la page avec un libellé par défaut ; l’utilisateur peut modifier le type (button / submit / link), le libellé (y compris gras partiel) et les styles (fond, bordure, texte)

#### Scenario: Type link avec href et target

- **WHEN** l’utilisateur définit le type du NodeButton sur « link »
- **THEN** les champs href et target sont affichés dans les paramètres ; le rendu produit un élément `<a>` avec les attributs href et target appropriés

#### Scenario: Paramètres visuels (fond, bordure, texte)

- **WHEN** l’utilisateur modifie les options du NodeButton via Background2Settings, Border2Settings ou Text2Settings
- **THEN** les styles sont appliqués immédiatement sur le bouton ou le lien dans l’éditeur ; le rendu en prévisualisation et à l’export reflète ces styles

#### Scenario: Persistance du NodeButton

- **WHEN** l’utilisateur sauvegarde une page contenant un ou plusieurs NodeButton (button, submit ou link avec href/target)
- **THEN** le contenu sérialisé conserve le type, le libellé (texte brut ou HTML inline de gras autorisé), href/target si link, et les attributs/styles nécessaires pour reproduire le rendu à l’affichage
