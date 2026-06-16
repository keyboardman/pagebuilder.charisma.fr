## ADDED Requirements

### Requirement: Titres de section lisibles en mode clair et sombre dans les panneaux Settings

Les panneaux de style partagés du builder (`Text2Settings`, `Background2Settings`, `Border2Settings`, `Spacing2Settings`, `Size2Settings`, `Object2Settings`) SHALL afficher leurs titres de section intermédiaires (ex. `Margin`, `Padding`, `Text`, `Border`, `Background`, `Image`, `Taille min / max`) via un composant ou un style partagé basé sur les tokens sémantiques du thème éditeur (`bg-muted`, `text-muted-foreground` ou équivalent), et non sur des couleurs Tailwind fixes non adaptatives (ex. `bg-gray-200/50`).

Le texte du titre SHALL rester lisible lorsque le panneau latéral droit du builder est affiché en mode clair ou en mode sombre (classe `dark` sur le conteneur du panneau).

#### Scenario: Mode clair du panneau réglages
- **WHEN** l'utilisateur ouvre les réglages de style d'un nœud dans le panneau latéral droit en mode clair
- **THEN** les titres de section (`Margin`, `Padding`, etc.) sont visibles avec un contraste suffisant par rapport au fond du panneau

#### Scenario: Mode sombre du panneau réglages
- **WHEN** l'utilisateur ouvre les réglages de style d'un nœud dans le panneau latéral droit en mode sombre
- **THEN** les titres de section utilisent un fond et une couleur de texte adaptés au mode sombre
- **AND** le libellé reste lisible (pas de texte atténué sur fond clair codé en dur)

## MODIFIED Requirements

### Requirement: Indication des valeurs thème dans les placeholders des panneaux de style

Les panneaux de style partagés du builder (`Text2Settings`, `Background2Settings`, `Border2Settings`, `Spacing2Settings`, `Size2Settings`, `Object2Settings`) SHALL accepter un contexte de sélecteur d'override thème optionnel. Lorsqu'un champ de style du nœud est vide (aucune valeur inline persistée pour cette propriété) et que le thème de la page définit une valeur pour la propriété CSS correspondante dans `node_overrides`, le champ SHALL afficher cette valeur comme **placeholder** indicatif, après résolution des références `var(--…)` à partir des `vars` du thème. Lorsque le nœud possède déjà une valeur pour la propriété, le placeholder thème SHALL NOT remplacer la valeur affichée. Lorsqu'aucune valeur thème n'est définie pour la propriété, ou lorsque la variable CSS ne peut pas être résolue via les `vars` du thème, le placeholder générique existant (ex. `ex: 1.5rem`, `auto`) SHALL être conservé.

Le builder SHALL recevoir les `node_overrides` et les `vars` du thème associé à la page au chargement de l'éditeur, normalisés en structure exploitable côté frontend (y compris pour les overrides legacy stockés en chaîne CSS).

Les réglages de style de `NodeYoutube` (`Spacing2Settings`, `Border2Settings`) SHALL utiliser le sélecteur d'override `.ce-youtube` pour résoudre les placeholders thème des champs vides.

#### Scenario: Champ vide avec valeur thème littérale
- **WHEN** l'utilisateur ouvre les réglages de style d'un nœud dont une propriété (ex. `font-size`) n'a pas de valeur inline
- **AND** le thème définit `font-size: 1.25rem` pour le sélecteur d'override correspondant
- **THEN** le champ affiche `1.25rem` en placeholder, sans préfixe

#### Scenario: Champ vide avec variable CSS résolue
- **WHEN** l'utilisateur ouvre les réglages de style d'un nœud dont `color` n'a pas de valeur inline
- **AND** le thème définit `color: var(--color-primary)` pour le sélecteur correspondant
- **AND** `vars` contient `--color-primary: #3b82f6`
- **THEN** le champ affiche `#3b82f6` en placeholder
- **AND** le champ n'affiche pas la chaîne `var(--color-primary)`

#### Scenario: Champ renseigné sur le nœud
- **WHEN** l'utilisateur a défini une valeur inline pour une propriété de style sur le nœud
- **THEN** le champ affiche la valeur du nœud
- **AND** le placeholder thème n'est pas affiché à la place de cette valeur

#### Scenario: Aucune valeur thème pour la propriété
- **WHEN** le thème ne définit pas de valeur pour la propriété CSS concernée
- **THEN** le champ conserve le placeholder générique existant du composant (ex. `ex: 1.5rem`)

#### Scenario: Variable CSS non résolvable
- **WHEN** le thème définit une valeur `var(--inconnue)` pour une propriété
- **AND** `--inconnue` est absente des `vars` du thème
- **THEN** le champ conserve le placeholder générique existant du composant

#### Scenario: Contexte de sous-partie (ex. titre de carte)
- **WHEN** l'utilisateur édite le style du titre d'un NodeCard en position `top`
- **AND** le thème définit des overrides pour `.ce-card-position-top .ce-card-title`
- **THEN** les champs vides de `Text2Settings` / `Spacing2Settings` affichent les valeurs thème résolues de ce sélecteur en placeholder

#### Scenario: NodeYoutube avec overrides thème
- **WHEN** l'utilisateur ouvre les réglages de style d'un `NodeYoutube` dont `margin-top` n'a pas de valeur inline
- **AND** le thème définit `margin-top: 1rem` pour le sélecteur `.ce-youtube`
- **THEN** le champ `margin-top` de `Spacing2Settings` affiche `1rem` en placeholder indicatif
