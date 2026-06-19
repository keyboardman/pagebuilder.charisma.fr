# Change : refonte des settings NodeRoot et arrière-plan de page

## Why

Le nœud racine (`NodeRoot`) est le conteneur de toute la page, mais son panneau **NodeSettings** ne propose aujourd’hui que le titre de la page et les styles de typographie par défaut. Il n’existe aucun paramétrage de l’**arrière-plan global** (couleur, image avec position, ou vidéo en boucle), alors que c’est un besoin courant pour le rendu final et la prévisualisation WYSIWYG.

Pour rapprocher l’édition du rendu publié et offrir un contrôle cohérent avec les autres nœuds (qui utilisent déjà `Background2Settings`), les réglages de `NodeRoot` doivent être restructurés autour d’un panneau par onglets incluant une section **Arrière-plan** dédiée.

## What Changes

- Refonte du panneau **NodeSettings** de `NodeRoot` avec une structure par **onglets** (au minimum : **Général**, **Arrière-plan**, **Typographie**).
- Ajout d’un contrat de données `node.content.background` sur `NodeRoot` avec un mode exclusif :
  - **Aucun / thème** (comportement actuel par défaut) ;
  - **Couleur** (`backgroundColor`) ;
  - **Image** (`backgroundImage`, `backgroundPosition`, `backgroundSize`, `backgroundRepeat`) avec sélection via la médiathèque ;
  - **Vidéo** (`videoUrl`, options de cadrage) en **lecture automatique, muette et en boucle** (`autoplay`, `muted`, `loop`, `playsInline`).
- Rendu de l’arrière-plan sur le conteneur pleine page de `NodeRoot` (wrapper `.node-root-content`) en mode édition, prévisualisation et rendu final.
- La couleur de fond peut servir de **fallback** ou de **calque sous une image/vidéo** lorsque renseignée.
- Conservation des réglages existants (titre de page, `defaultStyles` typographiques) dans l’onglet dédié, sans perte de données.

## Impact

- Affected specs: `page-builder`
- Affected code:
  - `assets/editeur/ManagerNode/NodeRoot/Settings.tsx`
  - `assets/editeur/ManagerNode/NodeRoot/Content.tsx`
  - `assets/editeur/ManagerNode/NodeRoot/index.ts`
  - `assets/editeur/ManagerNode/NodeRoot/View.tsx`
  - `assets/editeur/ManagerNode/NodeRoot/Edit.tsx`
  - éventuellement un composant dédié `NodeRoot/Settings/BackgroundSettings.tsx`
  - styles builder / rendu public si nécessaire pour la couche vidéo (`pointer-events: none`, `object-fit`)
