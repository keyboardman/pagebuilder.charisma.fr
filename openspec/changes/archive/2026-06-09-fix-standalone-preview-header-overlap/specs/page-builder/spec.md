## ADDED Requirements

### Requirement: Mise en page preview sans chevauchement d’en-têtes (standalone)

Lorsque le builder est monté dans la page standalone (`pageBuilderStandalone.jsx`, route builder dédiée), le système SHALL afficher deux barres distinctes et non superposées : l’en-tête applicatif (navigation Retour, titre de page, action Enregistrer) et la barre d’outils du builder (`Layout.Header` : bascule Édition/Prévisualisation, plein écran, thème, undo/redo, breakpoints). En mode prévisualisation, le défilement du contenu de la page SHALL être confiné au canevas (`admin-layout__main`) ; la barre d’outils du builder SHALL rester visible et interactive pendant tout le défilement, y compris lorsque l’utilisateur atteint le bas d’une page longue.

#### Scenario: Défilement en bas de page en prévisualisation standalone

- **WHEN** l’utilisateur ouvre le builder standalone, bascule en mode prévisualisation et fait défiler une page longue jusqu’en bas
- **THEN** l’en-tête applicatif (Retour / Enregistrer) reste visible en haut de la fenêtre
- **AND** la barre d’outils du builder (`Layout.Header`) reste visible sous l’en-tête applicatif, sans être recouverte par celui-ci
- **AND** l’utilisateur peut cliquer sur le bouton de retour en mode édition sans recharger la page

#### Scenario: Une seule zone de défilement vertical en preview

- **WHEN** l’utilisateur est en mode prévisualisation sur la page standalone et fait défiler le contenu
- **THEN** seul le canevas de prévisualisation défile verticalement
- **AND** ni l’en-tête applicatif ni la barre d’outils du builder ne défilent hors de la zone visible à cause d’un conteneur parent scrollable

#### Scenario: Hauteur du builder adaptée au shell standalone

- **WHEN** le builder est monté dans le shell standalone sous l’en-tête applicatif
- **THEN** le layout builder occupe la hauteur disponible restante (sans imposer `100vh` au-delà de l’espace alloué)
- **AND** aucune barre de défilement superflue n’apparaît sur le conteneur englobant du builder en l’absence de contenu dépassant la hauteur utile
