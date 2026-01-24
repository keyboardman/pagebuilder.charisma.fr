## ADDED Requirements

### Requirement: Entité Font et champs obligatoires

Le système SHALL fournir une entité `Font` avec les champs obligatoires : `name` (string), `type` (enum), `fallback` (string, ex. `sans-serif`), `slug` (string, unique, slugifié). Le `slug` SHALL être utilisé pour les chemins de stockage et l’identification des polices custom.

#### Scenario: Création d’une Font avec champs obligatoires

- **WHEN** un utilisateur crée une Font avec name, type, fallback et slug valides
- **THEN** la Font est persistée et récupérable ; le slug est unique en base

#### Scenario: Rejet si slug manquant ou dupliqué

- **WHEN** une Font est créée sans slug ou avec un slug déjà existant
- **THEN** la validation échoue (contrainte unique ou NotBlank)

### Requirement: Types de Font (native, google, custom)

Le système SHALL supporter trois types de Font : `native` (présente dans tous les navigateurs, aucun fichier ni URL), `google` (lien Google Fonts stocké dans un champ dédié `googleFontUrl`), `custom` (fichiers uploadés, stockés par variante). Pour `google`, le champ `googleFontUrl` SHALL être requis lorsque `type` = google. Pour `native` et `custom`, `googleFontUrl` SHALL être null ou ignoré.

#### Scenario: Font native sans URL ni fichier

- **WHEN** une Font est créée avec type `native`
- **THEN** aucun `googleFontUrl` ni variante n’est requis ; la Font est utilisable comme `font-family` (nom seul)

#### Scenario: Font Google avec URL

- **WHEN** une Font est créée avec type `google` et `googleFontUrl` renseigné (ex. lien stylesheet Google Fonts)
- **THEN** la Font est persistée ; l’URL est utilisable pour le chargement de la police

#### Scenario: Font custom avec variantes uploadées

- **WHEN** une Font est créée avec type `custom`
- **THEN** les polices sont fournies par des variantes (fichiers) ; sans variante, la Font peut exister mais n’a pas de fichier à servir

### Requirement: Variantes de police pour Font custom

Pour les Font de type `custom`, le système SHALL permettre d’associer des variantes décrites par : (1) **poids** : thin, extra_light, light, regular, medium, semi_bold, bold, extra_bold, black ; (2) **inclinaison** : normal, italic, oblique ; (3) **largeur** : normal, condensed, expanded, extra_condensed, extra_expanded. Les combinaisons (ex. bold+italic, light+condensed+italic) SHALL être supportées : une variante est un enregistrement avec un jeu (weight, style, width) et le chemin du fichier. Chaque upload SHALL produire une entrée liée à la Font avec ces métadonnées et le chemin du fichier stocké.

#### Scenario: Upload d’une variante Bold Italic

- **WHEN** l’utilisateur upload un fichier pour une Font custom avec weight=bold, style=italic, width=normal
- **THEN** une variante est créée avec ces métadonnées et le chemin du fichier ; la Font peut servir `font-weight: bold` et `font-style: italic`

#### Scenario: Upload d’une variante Light Condensed Italic

- **WHEN** l’utilisateur upload un fichier pour une Font custom avec weight=light, style=italic, width=condensed
- **THEN** une variante est créée avec weight, style, width ; le fichier est stocké et associé à cette variante

### Requirement: Stockage des fichiers custom avec Flysystem

Le système SHALL utiliser `league/flysystem` pour stocker les fichiers des Font custom. Le répertoire racine SHALL être `storage/fonts` ; les fichiers d’une Font SHALL être placés sous `{slug}/` (ex. `storage/fonts/ma-police/Regular.woff2`, `storage/fonts/ma-police/Bold-Italic.woff2`). Un service dédié (ex. `FontStorage`) SHALL encapsuler l’écriture et la suppression. La suppression d’une variante SHALL supprimer le fichier associé du stockage.

#### Scenario: Écriture d’un fichier custom sous storage/fonts/{slug}

- **WHEN** une variante custom est uploadée pour une Font de slug `ma-police`
- **THEN** le fichier est écrit dans le Filesystem sous `storage/fonts/ma-police/` avec un nom dérivé de la variante ou du fichier source

#### Scenario: Suppression du fichier à la suppression d’une variante

- **WHEN** une variante (Font custom) est supprimée
- **THEN** le fichier correspondant est supprimé du Filesystem (storage/fonts/{slug}/…)
