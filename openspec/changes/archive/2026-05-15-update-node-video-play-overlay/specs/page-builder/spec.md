## ADDED Requirements

### Requirement: Indicateur de lecture sur les blocs vidéo du builder

Les nœuds du builder qui affichent une vidéo derrière une image poster (notamment `NodeVideo`, `NodeVideoApi`, et les cards vidéo utilisées par `NodeVideoHome`) MUST superposer une pastille de lecture clairement reconnaissable, distincte du poster, pour signaler qu’une action utilisateur peut lancer la lecture. La pastille MUST s’appuyer sur l’asset statique `/assets/icons/play2.svg` (rendu via balise image ou équivalent produisant le même résultat visuel), de sorte que le disque de fond et le glyphe play proviennent du fichier SVG sans les aplatir en masque monochrome sur un seul `background-color`.

#### Scenario: Vidéo avec poster en mode affichage

- **WHEN** un bloc vidéo avec poster est rendu hors mode édition (ou équivalent « prévisualisation publique »)
- **THEN** une pastille centrée utilisant `play2.svg` est visible au-dessus du poster
- **AND** le marquage structurel (classes `ce-video-icon-player`, `ce-video-icon-player-inner`, `ce-video-icon-player-img` ou équivalent documenté) reste stable pour le thème et les overrides CSS

#### Scenario: Cohérence multi-nœuds

- **WHEN** plusieurs types de nœuds réutilisent la même pastille (ex. `NodeVideo`, `NodeVideoApi`, grilles `NodeVideoHome`)
- **THEN** ils partagent le même composant ou le même markup et la même feuille de style de base pour l’indicateur, afin d’éviter les divergences visuelles
