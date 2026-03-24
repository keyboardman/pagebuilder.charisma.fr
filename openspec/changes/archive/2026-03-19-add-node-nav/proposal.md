# Change: Menu en deux composants (NodeNav et NodeNavItem)

## Why

Permettre aux utilisateurs du builder de composer des menus de navigation (header, sidebar, footer) via un conteneur dédié **NodeNav** et des items **NodeNavItem** typés (lien, image, bouton), avec options de direction et affichage burger pour recenser les items.

## What Changes

- Ajout du type de nœud conteneur **NodeNav** (identifiant `node-nav`) qui n’accepte que des enfants de type **NodeNavItem**.
- Options du NodeNav : **direction** (horizontal, vertical), **icône burger** pour recenser / afficher tous les NodeNavItem (ex. menu mobile).
- Ajout du type de nœud **NodeNavItem** (identifiant `node-nav-item`) avec types : **lien**, **image**, **bouton** (champs associés : href/target pour lien, src/alt pour image, label/action pour bouton).
- Enregistrement des deux nœuds dans le registre et dans le panneau des composants (catégorie adaptée, ex. container pour NodeNav, content pour NodeNavItem ou catégorie dédiée « Nav »).
- Restriction côté builder : seuls les NodeNavItem peuvent être déposés dans un NodeNav (validation au drop et/ou dans le panneau).

## Impact

- Affected specs: **page-builder**
- Affected code: `assets/editeur/ManagerNode/` (nouveaux dossiers NodeNav, NodeNavItem), `NodeRegistry.ts`, types `NodeType`, logique de drop/accept si restriction par parent (DropZone ou useDnd).
