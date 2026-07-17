## ADDED Requirements

### Requirement: Enregistrement du nœud NodeCollection dans le builder

Le registre des nœuds du builder (`NodeRegistry`) SHALL inclure **NodeCollection** (type `node-collection`). Le nœud SHALL apparaître dans le panneau des composants avec le label « Collection », une icône dédiée, la catégorie `api`, et SHALL être disponible en édition, preview et rendu final. Le CSS de thème généré SHALL inclure les styles de base du nœud (`node-collection.css`) pour assurer la cohérence visuelle en édition.

#### Scenario: NodeCollection visible dans la palette

- **WHEN** l'utilisateur ouvre le panneau des composants du builder
- **THEN** le bouton « Collection » (node-collection) est disponible dans la catégorie API

#### Scenario: Styles thème appliqués en édition

- **WHEN** une page contient un NodeCollection et un thème avec CSS généré est actif
- **THEN** les hooks `ce-collection` et dérivés reçoivent les styles du thème en édition comme en preview
