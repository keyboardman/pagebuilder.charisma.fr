## ADDED Requirements

### Requirement: Nœud bouton (NodeButton)

Le builder SHALL fournir un type de nœud **NodeButton** (identifiant `node-button`) affichant un bouton ou un lien stylisé. Le nœud SHALL supporter trois types : **button**, **submit** et **link**. Pour le type **link**, le nœud SHALL exposer les champs **href** et **target** (ex. `_blank`, `_self`). Le nœud SHALL exposer dans ses paramètres les panneaux **Background2Settings**, **Border2Settings** et **Text2Settings** (et Base2Settings pour id/className), de la même façon que les autres nœuds de contenu (ex. NodeText).

#### Scenario: Ajout d’un NodeButton depuis le panneau

- **WHEN** l’utilisateur ajoute un bloc depuis le panneau des composants et choisit le bouton (NodeButton)
- **THEN** un nœud NodeButton est inséré dans la page avec un libellé par défaut ; l’utilisateur peut modifier le type (button / submit / link), le libellé et les styles (fond, bordure, texte)

#### Scenario: Type link avec href et target

- **WHEN** l’utilisateur définit le type du NodeButton sur « link »
- **THEN** les champs href et target sont affichés dans les paramètres ; le rendu produit un élément `<a>` avec les attributs href et target appropriés

#### Scenario: Paramètres visuels (fond, bordure, texte)

- **WHEN** l’utilisateur modifie les options du NodeButton via Background2Settings, Border2Settings ou Text2Settings
- **THEN** les styles sont appliqués immédiatement sur le bouton ou le lien dans l’éditeur ; le rendu en prévisualisation et à l’export reflète ces styles

#### Scenario: Persistance du NodeButton

- **WHEN** l’utilisateur sauvegarde une page contenant un ou plusieurs NodeButton (button, submit ou link avec href/target)
- **THEN** le contenu sérialisé conserve le type, le libellé, href/target si link, et les attributs/styles nécessaires pour reproduire le rendu à l’affichage
