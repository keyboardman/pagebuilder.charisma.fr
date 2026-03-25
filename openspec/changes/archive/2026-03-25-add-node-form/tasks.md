## 1. Modèle et registre

- [x] 1.1 Définir les identifiants de types (`node-form`, `node-form-input`, `node-form-select`, `node-form-radio`), schémas de contenu par défaut et catégories panneau (ex. catégorie « formulaire » ou « container » pour NodeForm).
- [x] 1.2 Enregistrer les quatre nœuds dans `NodeRegistry` et les exports du builder.

## 2. Règles drag-and-drop

- [x] 2.1 Étendre `useDnd.ts` : NodeForm accepte les types « champs formulaire » et les types `category === 'container'` (ou liste explicite alignée sur la spec) ; les champs formulaire refusés en dehors d’un ancêtre NodeForm (y compris après move).

## 3. UI éditeur

- [x] 3.1 Implémenter View/Edit/Settings pour NodeForm (method, action, attributs de base id/className si pattern existant).
- [x] 3.2 Implémenter View/Edit/Settings pour NodeFormInput (type input usuel, name, label, placeholder, required, valeur par défaut optionnelle).
- [x] 3.3 Implémenter View/Edit/Settings pour NodeFormSelect (name, label, options liste clé/valeur, required, placeholder optionnel).
- [x] 3.4 Implémenter View/Edit/Settings pour NodeFormRadio (name, label, groupe d’options valeur/libellé, required, orientation optionnelle).

## 4. Rendu et styles

- [x] 4.1 Rendu preview et export : balise `<form>` avec `method` et `action` ; champs en HTML accessible (label associé, name stable).
- [x] 4.2 Ajouter ou étendre le CSS thème `base` pour cohérence visuelle avec les autres nœuds.

## 5. Validation

- [x] 5.1 Vérifier sauvegarde/rechargement d’une page contenant un formulaire et champs imbriqués dans un conteneur.
- [x] 5.2 Tests manuels : DnD accepté/refusé selon les règles ; soumission navigateur vers l’URL configurée (hors périmètre backend Symfony sauf besoin ultérieur).
