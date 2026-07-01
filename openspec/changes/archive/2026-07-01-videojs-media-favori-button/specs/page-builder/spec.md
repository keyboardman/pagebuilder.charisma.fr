## ADDED Requirements

### Requirement: Lecteur Video.js dans les modales vidéo Charisma

Les nœuds du builder qui ouvrent une modale de lecture pour une vidéo hébergée Charisma (`NodeVideoApi`, entrées `charisma` de `NodeVideoHome`, et `NodeVideo` lorsqu’une source est fournie) MUST utiliser **Video.js** comme lecteur dans la modale, à la place du lecteur HTML5 natif seul. Le lecteur SHALL conserver au minimum : lecture automatique à l’ouverture, contrôles utilisateur visibles, affichage du poster avant lecture, et fermeture de la modale sans fuite d’instance player (`dispose` à la fermeture).

#### Scenario: Ouverture modale NodeVideoApi en preview

- **WHEN** l’utilisateur consulte une page en mode preview ou rendu public contenant un `NodeVideoApi` avec `itemId` et `src` valides, et clique sur la card vidéo
- **THEN** une modale s’ouvre avec un lecteur Video.js initialisé sur la source vidéo et le poster configurés

#### Scenario: Fermeture modale sans fuite player

- **WHEN** l’utilisateur ferme la modale vidéo après lecture
- **THEN** l’instance Video.js est détruite (`dispose`) et une réouverture ultérieure recrée un lecteur fonctionnel

#### Scenario: NodeVideoHome YouTube inchangé

- **WHEN** l’utilisateur ouvre une vidéo home de type `youtube`
- **THEN** la modale affiche un lecteur embarqué (`iframe`) et SHALL NOT initialiser Video.js Charisma pour cette entrée

### Requirement: Bouton favori (cœur rouge) dans le player Video.js

Lorsqu’un identifiant média Charisma est disponible (`itemId` pour `NodeVideoApi`, `id` pour une entrée `charisma` de `NodeVideoHome`), le lecteur Video.js MUST afficher un bouton **favori** dans sa barre de contrôles, représenté par un **cœur rouge**. Au clic sur ce bouton, le système MUST envoyer une requête **`PUT`** vers `https://content.charisma.fr/api/media/{mediaId}/favori`, en substituant `{mediaId}` par l’identifiant média du contenu affiché. L’utilisateur MUST NOT pouvoir enregistrer plus d’**un favori par heure** pour un même média : après un like réussi ou un rejet API signalant la limite, le bouton SHALL rester désactivé jusqu’à expiration du délai d’une heure.

#### Scenario: Clic favori sur vidéo API

- **WHEN** un `NodeVideoApi` avec `itemId` « `abc123` » est lu en modale et l’utilisateur clique sur le bouton cœur rouge alors qu’aucun like n’a été enregistré pour ce média dans l’heure écoulée
- **THEN** le client envoie `PUT https://content.charisma.fr/api/media/abc123/favori` et désactive le bouton favori pour une heure

#### Scenario: Clic favori sur vidéo home Charisma

- **WHEN** une entrée `NodeVideoHome` de type `charisma` avec `id` « `xyz789` » est lue en modale et l’utilisateur clique sur le bouton cœur rouge alors qu’aucun like n’a été enregistré pour ce média dans l’heure écoulée
- **THEN** le client envoie `PUT https://content.charisma.fr/api/media/xyz789/favori` et désactive le bouton favori pour une heure

#### Scenario: Like déjà effectué dans l’heure

- **WHEN** l’utilisateur a déjà liké le média « `abc123` » il y a moins d’une heure (mémorisé côté client ou rejeté par l’API)
- **THEN** le bouton favori est désactivé et aucune nouvelle requête `PUT` n’est envoyée

#### Scenario: Absence d’identifiant média

- **WHEN** une modale vidéo est ouverte sans identifiant média Charisma (ex. `NodeVideo` avec fichier local uniquement)
- **THEN** le bouton favori n’est pas affiché dans la control bar Video.js

### Requirement: Compteur de lecture au play dans le player Video.js

Lorsqu’un identifiant média Charisma est disponible, le lecteur Video.js MUST envoyer une requête vers `https://content.charisma.fr/api/media/{mediaId}/compteur` au **premier démarrage effectif de la lecture** (événement `play`, y compris via autoplay à l’ouverture de la modale ou clic sur le bouton play). Cet appel SHALL être effectué **une seule fois par instance** de lecteur (ouverture de modale) : les reprises après pause ne MUST NOT déclencher de nouvel appel compteur.

#### Scenario: Lecture avec autoplay à l’ouverture modale

- **WHEN** un `NodeVideoApi` avec `itemId` « `abc123` » ouvre sa modale avec lecture automatique
- **THEN** le client envoie une requête vers `https://content.charisma.fr/api/media/abc123/compteur` une fois au démarrage de la lecture

#### Scenario: Lecture après clic play

- **WHEN** l’utilisateur ouvre une modale vidéo Charisma sans autoplay et clique sur le bouton play du lecteur Video.js
- **THEN** le client envoie une requête vers `https://content.charisma.fr/api/media/{mediaId}/compteur` une fois au premier `play`

#### Scenario: Reprise après pause

- **WHEN** l’utilisateur met la vidéo en pause puis relance la lecture dans la même modale
- **THEN** aucune nouvelle requête compteur n’est envoyée

#### Scenario: Absence d’identifiant média

- **WHEN** une modale vidéo est ouverte sans identifiant média Charisma
- **THEN** aucun appel compteur n’est effectué

### Requirement: Rendu statique — attributs et script modale vidéo

Le HTML statique généré pour les pages publiées contenant des cards vidéo Charisma identifiées MUST exposer, sur l’élément déclencheur de la modale, les attributs `data-video-src`, `data-video-poster` et, lorsque applicable, `data-media-id`. Le script de modale vidéo inclus dans le rendu public MUST initialiser Video.js (bouton favori et compteur play lorsque `data-media-id` est présent) au lieu d’un élément `<video>` natif seul.

#### Scenario: Page publiée avec NodeVideoApi

- **WHEN** une page est rendue en HTML statique avec un `NodeVideoApi` possédant `itemId` et une source vidéo
- **THEN** le déclencheur modale porte `data-media-id` égal à `itemId` et l’ouverture utilise Video.js avec le bouton favori et le compteur play

#### Scenario: Page publiée sans identifiant média

- **WHEN** une page est rendue avec une card vidéo sans `data-media-id`
- **THEN** l’ouverture modale utilise Video.js sans bouton favori
