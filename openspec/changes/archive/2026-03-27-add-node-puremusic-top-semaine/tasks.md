## 1. Specification
- [x] 1.1 Ajouter le delta OpenSpec `page-builder` pour définir `NodePureMusicTopSemaine`, sa source distante et son rendu de référence.
- [x] 1.2 Valider le change avec `openspec validate add-node-puremusic-top-semaine --strict`.

## 2. Implementation
- [x] 2.1 Créer le type de nœud `NodePureMusicTopSemaine` (catégorie, enregistrement, structure de contenu).
- [x] 2.2 Implémenter le chargement des données depuis `https://api.charisma.fr/api/puremusic/musiques/tops/semaine`.
- [x] 2.3 Implémenter le rendu de la liste "top semaine" conforme à la page de référence.
- [x] 2.4 Ajouter/adapter le CSS du thème pour reproduire le rendu visuel attendu.
- [x] 2.5 Vérifier le comportement en cas d'erreur réseau (fallback non bloquant) et la persistance après sauvegarde/rechargement.
