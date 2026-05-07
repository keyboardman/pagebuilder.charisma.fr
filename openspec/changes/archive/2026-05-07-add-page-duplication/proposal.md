## Why
Le back-office permet de créer/éditer/supprimer des pages, mais il manque une action rapide pour repartir d'une page existante. Dupliquer une page depuis la liste réduit le temps de production et évite les copier-coller manuels.

## What Changes
- Ajout d'une action "Dupliquer" dans la liste des pages.
- Ajout d'une route backend dédiée à la duplication d'une page existante.
- Définition du comportement de duplication (nouvelle page persistée avec identité propre et redirection vers l'édition de la copie).

## Impact
- Affected specs: `page-crud`
- Affected code: contrôleur des pages, template de liste des pages, tests fonctionnels du CRUD pages
