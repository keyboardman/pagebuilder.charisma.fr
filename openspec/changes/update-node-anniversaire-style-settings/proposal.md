# Change: Parametrage de style avance pour NodeAnniversaire

## Why
Le NodeAnniversaire existe deja, mais ses options de personnalisation visuelle sont trop limitees pour couvrir des besoins editoriaux courants (mise en forme du titre, de la date et des lignes anniversaires). Une structuration claire des donnees dans `node.content` est necessaire pour garantir une persistance stable.

## What Changes
- Ajout d'un parametrage par onglets pour `NodeAnniversaire` dans le panneau settings: `general`, `titre`, `date`, `anniversaires`.
- Definition d'un contrat de style par section avec structure `node.content` normalisee:
  - `node.content.container`
  - `node.content.title`
  - `node.content.day`
  - `node.content.anniversaires`
- Ajout de la possibilite de modifier le texte du titre (`node.content.title.text` ou champ equivalent).
- Definition des controles de style:
  - `general`: background, margin, padding
  - `titre`, `date`, `anniversaires`: background, margin, padding + styles de texte

## Impact
- Affected specs: `page-builder`
- Affected code: `assets/editeur/ManagerNode/NodeAnniversaire/*` (View/Edit/index), composants settings de style texte/spacing/background, serialisation du contenu du builder
