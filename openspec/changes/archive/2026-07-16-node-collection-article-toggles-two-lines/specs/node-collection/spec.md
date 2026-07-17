## ADDED Requirements

### Requirement: Layout des toggles show carte article en settings

Lorsque `collectionType=article` et `view=default`, les settings de layout carte (`CardLayoutSettings`) SHALL afficher les quatre switchs de visibilité (Image, Title, Text, Label) sur **deux lignes** de deux contrôles, afin qu’ils tiennent correctement dans le panneau latéral sans débordement horizontal. Le comportement de persistance (`content.show.image`, `content.show.title`, `content.show.description`, `content.show.labels`) SHALL rester inchangé.

#### Scenario: Toggles show sur deux lignes

- **WHEN** l'utilisateur ouvre les settings de layout carte d'une collection article (vue default)
- **THEN** les switchs Image et Title apparaissent sur la première ligne, et Text et Label sur la seconde

#### Scenario: Binding show inchangé

- **WHEN** l'utilisateur bascule le switch Text
- **THEN** `content.show.description` est mis à jour comme auparavant
