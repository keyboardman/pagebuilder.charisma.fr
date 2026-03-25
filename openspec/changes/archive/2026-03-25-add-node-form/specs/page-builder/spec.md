## ADDED Requirements

### Requirement: Conteneur formulaire (NodeForm)

Le builder SHALL fournir un type de nœud conteneur **NodeForm** (identifiant `node-form`) représentant un élément HTML `<form>`. Le nœud SHALL être droppable (une zone unique, ex. `main`). Le NodeForm SHALL exposer au minimum les propriétés configurables **method** (méthode HTTP, ex. `GET` ou `POST`) et **action** (URL absolue ou relative de soumission). Le NodeForm SHALL autoriser comme descendants directs ou indirects : les nœuds **NodeFormInput**, **NodeFormSelect**, **NodeFormRadio**, et les nœuds du builder dont la catégorie d’enregistrement est **container** (ex. NodeFlex, NodeGrid, NodeContainer), afin de permettre la mise en page à l’intérieur du formulaire. Le NodeForm SHALL refuser l’imbrication d’un second NodeForm en tant qu’enfant (formulaires non imbriqués).

#### Scenario: Ajout d’un NodeForm depuis le panneau

- **WHEN** l’utilisateur ajoute un bloc depuis le panneau des composants et choisit le conteneur formulaire (NodeForm)
- **THEN** un nœud NodeForm est inséré dans la page ; l’utilisateur peut définir method et action, et déposer des champs formulaire et des conteneurs de mise en page dans la zone du formulaire

#### Scenario: Composition avec conteneur interne

- **WHEN** l’utilisateur place un conteneur (ex. NodeFlex) à l’intérieur d’un NodeForm puis y dépose des NodeFormInput
- **THEN** la structure est acceptée par le builder et le rendu preview affiche le formulaire avec les champs à l’intérieur du conteneur

#### Scenario: Champ formulaire refusé hors NodeForm

- **WHEN** l’utilisateur tente d’ajouter ou de déplacer un NodeFormInput, NodeFormSelect ou NodeFormRadio sous un parent qui n’est pas dans le sous-arbre d’un NodeForm
- **THEN** l’opération est refusée et le nœud ne peut pas y rester

#### Scenario: Persistance du NodeForm

- **WHEN** l’utilisateur sauvegarde une page contenant un NodeForm avec method, action et enfants
- **THEN** le contenu sérialisé conserve ces propriétés et la hiérarchie afin de reproduire le même formulaire à l’affichage et à la réouverture de l’éditeur

### Requirement: Champ saisie (NodeFormInput)

Le builder SHALL fournir un type de nœud **NodeFormInput** (identifiant `node-form-input`) rendu comme un champ de saisie unique avec libellé associé (ex. `<label>` lié au contrôle). Le nœud SHALL exposer au minimum : **name**, **label**, **type** de saisie parmi les types HTML usuels pour `<input>` (à minima `text`, `email`, `number`, `tel`, `password`, `hidden`), **placeholder** optionnel, **required** (booléen), **value** par défaut optionnel. Un NodeFormInput SHALL être placé uniquement dans le sous-arbre d’un NodeForm (éventuellement à travers un conteneur enfant).

#### Scenario: Configuration et rendu d’un champ texte

- **WHEN** l’utilisateur configure un NodeFormInput avec label, name et type `text`
- **THEN** le rendu preview affiche un libellé et un champ texte avec les attributs `name` et, si renseignés, `placeholder`, `required` et `value` par défaut

#### Scenario: Persistance du NodeFormInput

- **WHEN** l’utilisateur sauvegarde une page contenant un ou plusieurs NodeFormInput
- **THEN** les propriétés du champ sont conservées et restituées à l’identique lors du rechargement

### Requirement: Liste déroulante (NodeFormSelect)

Le builder SHALL fournir un type de nœud **NodeFormSelect** (identifiant `node-form-select`) rendu comme un élément `<select>` avec options. Le nœud SHALL exposer au minimum : **name**, **label**, **options** (liste ordonnée de paires valeur / libellé affiché), **required** (booléen), et optionnellement une **valeur** ou option vide initiale (placeholder). Un NodeFormSelect SHALL être placé uniquement dans le sous-arbre d’un NodeForm.

#### Scenario: Configuration et rendu d’un select

- **WHEN** l’utilisateur configure un NodeFormSelect avec plusieurs options
- **THEN** le rendu preview affiche un libellé et une liste déroulante contenant une entrée par option avec les `value` attendues

#### Scenario: Persistance du NodeFormSelect

- **WHEN** l’utilisateur sauvegarde une page contenant un NodeFormSelect
- **THEN** la liste d’options et les autres propriétés sont conservées et restituées à la réouverture

### Requirement: Groupe boutons radio (NodeFormRadio)

Le builder SHALL fournir un type de nœud **NodeFormRadio** (identifiant `node-form-radio`) représentant un groupe d’options exclusives : plusieurs entrées **value** / **label** partageant le même attribut **name**. Le nœud SHALL exposer au minimum : **name**, **label** du groupe, liste d’**options** (valeur et libellé par option), **required** (booléen) si au moins une option doit être choisie. Le rendu SHALL produire un ensemble de `<input type="radio">` avec le même `name` et des libellés associés. Un NodeFormRadio SHALL être placé uniquement dans le sous-arbre d’un NodeForm.

#### Scenario: Configuration et rendu d’un groupe radio

- **WHEN** l’utilisateur configure un NodeFormRadio avec name et au moins deux options
- **THEN** le rendu preview affiche le libellé du groupe et une option radio par entrée, toutes avec le même `name`

#### Scenario: Persistance du NodeFormRadio

- **WHEN** l’utilisateur sauvegarde une page contenant un NodeFormRadio
- **THEN** les options et le name du groupe sont conservés et restitués à la réouverture
