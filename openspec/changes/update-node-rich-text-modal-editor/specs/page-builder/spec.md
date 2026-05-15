## MODIFIED Requirements

### Requirement: Nœud texte riche (NodeRichText)

Le builder SHALL fournir un type de nœud **NodeRichText** (identifiant `node-rich-text`) permettant l’édition de texte riche sans saisie de HTML brut. Lorsque l’utilisateur **sélectionne** un `NodeRichText` dans le builder, le système SHALL ouvrir une **fenêtre modale** contenant l’éditeur visuel (WYSIWYG) complet. Dans le canevas, le nœud SHALL afficher un **aperçu** du contenu (sans éditeur inline contraint par la largeur du bloc). La modale SHALL offrir une largeur d’édition suffisante pour travailler confortablement (ex. largeur maximale adaptée à l’écran, zone de saisie scrollable si le contenu est long). La fermeture de la modale SHALL conserver le contenu déjà appliqué au nœud.

#### Scenario: Ajout d’un NodeRichText depuis le panneau
- **WHEN** l’utilisateur ajoute un bloc depuis le panneau des composants et choisit le nœud texte riche (NodeRichText)
- **THEN** un nœud NodeRichText est inséré dans la page avec un contenu texte initial éditable

#### Scenario: Ouverture de la modale à la sélection
- **WHEN** l’utilisateur sélectionne un `NodeRichText` déjà présent dans le canevas
- **THEN** une modale s’ouvre avec l’éditeur WYSIWYG (barre d’outils et zone de saisie) ; le canevas affiche l’aperçu du contenu sans éditeur inline

#### Scenario: Fermeture de la modale
- **WHEN** l’utilisateur ferme la modale (bouton de fermeture, clic sur l’overlay ou touche Échap) après avoir modifié le texte
- **THEN** la modale se ferme, le contenu riche reste enregistré sur le nœud et l’aperçu dans le canevas reflète les modifications

### Requirement: Mise en forme riche de base

Le nœud NodeRichText SHALL exposer au minimum les actions de mise en forme suivantes dans l’éditeur de la modale : **gras**, **italique**, **souligné**, **barré**, **liste à puces**, **liste numérotée** et **lien**. Les actions SHALL s’appliquer à la sélection courante dans l’éditeur.

#### Scenario: Application d’un style inline
- **WHEN** l’utilisateur sélectionne un texte dans l’éditeur de la modale `NodeRichText` puis active une action inline (ex. gras ou italique)
- **THEN** la mise en forme est appliquée immédiatement au texte sélectionné dans l’éditeur et visible dans l’aperçu du canevas après fermeture ou mise à jour du nœud

#### Scenario: Création d’une liste
- **WHEN** l’utilisateur sélectionne un ou plusieurs paragraphes dans la modale et active une liste à puces ou numérotée
- **THEN** le contenu est transformé en liste correspondante dans le rendu du NodeRichText

#### Scenario: Insertion d’un lien
- **WHEN** l’utilisateur sélectionne du texte dans la modale puis renseigne une URL via l’action lien
- **THEN** le texte est rendu comme lien cliquable avec l’URL configurée
