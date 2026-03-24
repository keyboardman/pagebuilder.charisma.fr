## 1. Spécification et design

- [x] 1.1 Valider la proposition et les deltas (openspec validate add-node-nav --strict)

## 2. NodeNav (conteneur)

- [x] 2.1 Créer le type NodeNav (NodeNavType, options direction, burger) et configuration (View, Edit, Settings)
- [x] 2.2 Implémenter la direction (horizontal / vertical) dans View/Edit et persistance
- [x] 2.3 Implémenter l’option « icône burger » et le comportement (recenser / afficher les NodeNavItem)
- [x] 2.4 Restreindre les enfants acceptés au seul type NodeNavItem (drop + panneau)

## 3. NodeNavItem (item de menu)

- [x] 3.1 Créer le type NodeNavItem (lien, image, bouton) et configuration (View, Edit, Settings)
- [x] 3.2 Implémenter le type lien (href, target) avec rendu `<a>`
- [x] 3.3 Implémenter le type image (src, alt, optionnel lien) avec rendu `<img>` / `<a><img></a>`
- [x] 3.4 Implémenter le type bouton (label, type button/submit) avec rendu `<button>`
- [x] 3.5 Persistance du NodeNavItem (type + champs selon le type)

## 4. Intégration

- [x] 4.1 Enregistrer NodeNav et NodeNavItem dans NodeRegistry et catégories du panneau
- [x] 4.2 Étendre les types (NodeType / NodeRegistry) pour NodeNav et NodeNavItem
- [x] 4.3 Tests manuels ou automatisés : ajout NodeNav, ajout NodeNavItem dedans, direction, burger, persistance
