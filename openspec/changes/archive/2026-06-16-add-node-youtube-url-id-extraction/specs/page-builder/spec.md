## ADDED Requirements

### Requirement: Saisie URL ou ID pour NodeYoutube

Le nœud `NodeYoutube` MUST stocker uniquement l'identifiant vidéo YouTube dans `content.videoId`. Le panneau de réglages du nœud SHALL accepter soit un ID brut, soit une URL YouTube complète ; lors de la saisie, le builder MUST normaliser la valeur et ne persister que l'ID extrait.

Les formats d'URL suivants MUST être reconnus pour l'extraction :
- `https://www.youtube.com/watch?v={id}` (et variantes `youtube.com`, `m.youtube.com`, avec paramètres additionnels)
- `https://youtu.be/{id}`
- `https://www.youtube.com/embed/{id}`
- `https://www.youtube.com/shorts/{id}`

Lorsque la valeur saisie correspond déjà à un ID YouTube valide (sans URL), le builder MUST la conserver telle quelle après trim des espaces.

#### Scenario: Collage d'une URL watch
- **WHEN** l'utilisateur colle `https://www.youtube.com/watch?v=dQw4w9WgXcQ` dans le champ vidéo de `NodeYoutube`
- **THEN** `content.videoId` est enregistré avec la valeur `dQw4w9WgXcQ`
- **AND** le champ affiche `dQw4w9WgXcQ`

#### Scenario: Collage d'une URL youtu.be
- **WHEN** l'utilisateur colle `https://youtu.be/dQw4w9WgXcQ` dans le champ vidéo
- **THEN** `content.videoId` est enregistré avec la valeur `dQw4w9WgXcQ`

#### Scenario: Collage d'une URL shorts ou embed
- **WHEN** l'utilisateur colle `https://www.youtube.com/shorts/dQw4w9WgXcQ` ou `https://www.youtube.com/embed/dQw4w9WgXcQ`
- **THEN** `content.videoId` est enregistré avec la valeur `dQw4w9WgXcQ`

#### Scenario: Saisie d'un ID brut
- **WHEN** l'utilisateur saisit directement `dQw4w9WgXcQ` (éventuellement entouré d'espaces)
- **THEN** `content.videoId` est enregistré avec la valeur `dQw4w9WgXcQ`

#### Scenario: Rendu après extraction
- **WHEN** un `videoId` valide a été extrait et enregistré depuis une URL
- **THEN** le rendu `NodeYoutube` affiche le lecteur YouTube correspondant à cet ID
