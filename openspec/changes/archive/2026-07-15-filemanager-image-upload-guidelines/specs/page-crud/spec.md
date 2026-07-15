## ADDED Requirements

### Requirement: Mémo de conventions d'upload affiché sur la liste des pages

Le système SHALL afficher un panneau discret « Conventions médias » sur la liste des pages (`/admin/page`), visible en permanence pour les utilisateurs authentifiés. Ce panneau SHALL rappeler les recommandations du projet pour l'optimisation des images : formats acceptés/recommandés, dimensions cibles par usage (hero, carte, vignette, logo), poids maximal conseillé, conventions de nommage et rappels de compression/redimensionnement avant upload. Le contenu affiché SHALL être alimenté par une configuration applicative versionnée (fichier YAML ou paramètre Symfony), modifiable sans modifier le code des templates. Le panneau SHALL être informatif uniquement : il ne SHALL pas bloquer, rejeter ou modifier les uploads effectués dans la médiathèque.

#### Scenario: Mémo visible sur la liste des pages

- **WHEN** un utilisateur authentifié accède à `/admin/page`
- **THEN** il voit un encart « Conventions médias » contenant les recommandations configurées (formats, dimensions, poids, nommage)

#### Scenario: Contenu configurable sans changement de code

- **WHEN** un administrateur modifie le fichier de configuration des conventions médias et vide le cache applicatif si nécessaire
- **THEN** le texte affiché sur la liste des pages reflète les nouvelles valeurs sans modification des templates Twig

#### Scenario: Upload non bloqué par les conventions

- **WHEN** un utilisateur uploade une image dans la médiathèque qui dépasse les dimensions ou le poids conseillés affichés dans le mémo
- **THEN** l'upload aboutit normalement et le fichier est stocké comme aujourd'hui
