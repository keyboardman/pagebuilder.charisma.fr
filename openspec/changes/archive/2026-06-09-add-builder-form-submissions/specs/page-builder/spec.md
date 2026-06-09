## MODIFIED Requirements

### Requirement: Conteneur formulaire (NodeForm)

Le builder SHALL fournir un type de nœud conteneur **NodeForm** (identifiant `node-form`) représentant un élément HTML `<form>`. Le nœud SHALL être droppable (une zone unique, ex. `main`). Le NodeForm SHALL exposer au minimum les propriétés configurables **method** (méthode HTTP, ex. `GET` ou `POST`) et **action** (URL absolue ou relative de soumission). Le NodeForm SHALL permettre de sélectionner une **configuration de formulaire** issue du **catalogue backend** de la capacité **builder-form-submission** (**formConfigId** ou équivalent) ; lorsque ce champ est renseigné, l’**action** SHALL être dérivée de l’**URL de soumission** fournie par ce catalogue et SHALL être **enregistrée** dans le contenu du nœud avec cette valeur résolue, afin que l’affichage public et l’export HTML ne dépendent pas d’un nouvel appel au catalogue au chargement de la page. Lorsqu’un **formConfigId** est défini, le rendu du `<form>` (preview, page publique, export) SHALL inclure les **champs et jetons** requis par la politique **antispam** du backend (au minimum un **honeypot** convenu avec le serveur, et tout jeton supplémentaire si activé), de sorte que la soumission **AJAX** existante via `FormData` satisfasse les contrôles décrits dans **builder-form-submission**. Lorsque aucune configuration n’est choisie, l’utilisateur SHALL pouvoir définir **action** manuellement et aucune exigence antispam backend ne s’applique via ce mécanisme. Le chargement du catalogue dans l’éditeur SHALL utiliser la **fonctionnalité backend dédiée** (pas le registre ApiCard). Le NodeForm SHALL soumettre le formulaire en **AJAX** via `fetch` lors du `submit` (interception de l’événement), et afficher un message d’alerte de retour (succès en fond vert, erreur en fond rouge) dans l’interface de l’éditeur. Le NodeForm SHALL autoriser comme descendants directs ou indirects : les nœuds **NodeFormInput**, **NodeFormSelect**, **NodeFormRadio**, les nœuds **NodeButton** (pour des actions comme "submit"), et les nœuds du builder dont la catégorie d’enregistrement est **container** (ex. NodeFlex, NodeGrid, NodeContainer), afin de permettre la mise en page à l’intérieur du formulaire. Le NodeForm SHALL refuser l’imbrication d’un second NodeForm en tant qu’enfant (formulaires non imbriqués).

#### Scenario: Ajout d’un NodeForm depuis le panneau

- **WHEN** l’utilisateur ajoute un bloc depuis le panneau des composants et choisit le conteneur formulaire (NodeForm)
- **THEN** un nœud NodeForm est inséré dans la page ; l’utilisateur peut définir method et action (manuelle ou via catalogue backend), et déposer des champs formulaire et des conteneurs de mise en page dans la zone du formulaire

#### Scenario: Composition avec conteneur interne

- **WHEN** l’utilisateur place un conteneur (ex. NodeFlex) à l’intérieur d’un NodeForm puis y dépose des NodeFormInput
- **THEN** la structure est acceptée par le builder et le rendu preview affiche le formulaire avec les champs à l’intérieur du conteneur

#### Scenario: Ajout d’un NodeButton dans un NodeForm

- **WHEN** l’utilisateur ajoute un bloc NodeButton à l’intérieur d’un NodeForm (directement ou via un conteneur interne)
- **THEN** le builder autorise l’insertion et la preview restitue le bouton dans le rendu HTML du formulaire ; si le NodeButton est configuré en mode `submit`, il est rendu comme un bouton `<button type="submit">`

#### Scenario: Champ formulaire refusé hors NodeForm

- **WHEN** l’utilisateur tente d’ajouter ou de déplacer un NodeFormInput, NodeFormSelect ou NodeFormRadio sous un parent qui n’est pas dans le sous-arbre d’un NodeForm
- **THEN** l’opération est refusée et le nœud ne peut pas y rester

#### Scenario: Persistance du NodeForm

- **WHEN** l’utilisateur sauvegarde une page contenant un NodeForm avec method, action et enfants
- **THEN** le contenu sérialisé conserve ces propriétés et la hiérarchie afin de reproduire le même formulaire à l’affichage et à la réouverture de l’éditeur

#### Scenario: Soumission AJAX avec succès

- **WHEN** l’utilisateur soumet un NodeForm (via un bouton `submit`) et que la réponse HTTP est réussie (2xx) ou qu’un JSON retourne `{ success: true, message: "..." }`
- **THEN** un bandeau d’alerte est affiché avec un style de succès (fond vert) et le message de retour

#### Scenario: Soumission AJAX avec erreur

- **WHEN** l’utilisateur soumet un NodeForm (via un bouton `submit`) et que la réponse HTTP échoue (non-2xx) ou qu’un JSON retourne `{ success: false, message: "..." }`
- **THEN** un bandeau d’alerte est affiché avec un style d’erreur (fond rouge) et le message de retour

#### Scenario: Sélection d’une configuration via le catalogue backend

- **WHEN** l’utilisateur choisit une entrée du catalogue des formulaires configurés (appel backend dédié, hors ApiCard)
- **THEN** le NodeForm enregistre `formConfigId` et une propriété **action** égale à l’URL de soumission fournie pour cette configuration ; la soumission utilise cette URL sans rappel au catalogue côté affichage public

#### Scenario: Rendu des garde-fous antispam pour formulaire backend

- **WHEN** un NodeForm est associé à une configuration backend et affiché hors mode édition structuré uniquement (ex. prévisualisation ou page publique)
- **THEN** le DOM du formulaire inclut les éléments nécessaires au passage des contrôles antispam (honeypot et dépendances), sans casser l’accessibilité ni le flux `FormData` actuel
