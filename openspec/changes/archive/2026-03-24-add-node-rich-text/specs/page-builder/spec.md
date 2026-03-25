## ADDED Requirements
### Requirement: Nœud texte riche (NodeRichText)

Le builder SHALL fournir un type de nœud **NodeRichText** (identifiant `node-rich-text`) permettant l’édition de texte riche sans saisie de HTML brut. Le nœud SHALL proposer un éditeur visuel (WYSIWYG) directement dans l’interface de configuration du nœud.

#### Scenario: Ajout d’un NodeRichText depuis le panneau
- **WHEN** l’utilisateur ajoute un bloc depuis le panneau des composants et choisit le nœud texte riche (NodeRichText)
- **THEN** un nœud NodeRichText est inséré dans la page avec un contenu texte initial éditable

### Requirement: Mise en forme riche de base

Le nœud NodeRichText SHALL exposer au minimum les actions de mise en forme suivantes: **gras**, **italique**, **souligné**, **barré**, **liste à puces**, **liste numérotée** et **lien**. Les actions SHALL s’appliquer à la sélection courante dans l’éditeur.

#### Scenario: Application d’un style inline
- **WHEN** l’utilisateur sélectionne un texte dans NodeRichText puis active une action inline (ex. gras ou italique)
- **THEN** la mise en forme est appliquée immédiatement au texte sélectionné dans l’éditeur et visible en preview

#### Scenario: Création d’une liste
- **WHEN** l’utilisateur sélectionne un ou plusieurs paragraphes et active une liste à puces ou numérotée
- **THEN** le contenu est transformé en liste correspondante dans le rendu du NodeRichText

#### Scenario: Insertion d’un lien
- **WHEN** l’utilisateur sélectionne du texte puis renseigne une URL via l’action lien
- **THEN** le texte est rendu comme lien cliquable avec l’URL configurée

### Requirement: Persistance du contenu riche

Le builder SHALL sérialiser le contenu de NodeRichText dans le format de persistance existant de page et SHALL le restaurer de manière éditable lors du rechargement.

#### Scenario: Sauvegarde et rechargement du NodeRichText
- **WHEN** l’utilisateur sauvegarde une page contenant un ou plusieurs NodeRichText
- **THEN** le contenu riche (structure et formats) est conservé et restitué à l’identique lors de la réouverture de la page
