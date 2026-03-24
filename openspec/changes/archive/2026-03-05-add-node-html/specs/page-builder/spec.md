## ADDED Requirements

### Requirement: Nœud HTML (NodeHtml)

Le builder SHALL fournir un type de nœud **NodeHtml** (identifiant `node-html`) permettant d’insérer un fragment de **code HTML brut** dans une page. Le nœud SHALL exposer un champ de contenu HTML éditable (zone de texte multi‑ligne ou éditeur de code) dans le panneau de propriétés, et SHALL rendre ce contenu tel quel (sous forme de HTML) dans la prévisualisation et dans le rendu final de la page.

#### Scenario: Ajout d’un NodeHtml depuis le panneau

- **WHEN** l’utilisateur ajoute un bloc depuis le panneau des composants et choisit le nœud HTML (NodeHtml)
- **THEN** un nœud NodeHtml est inséré dans la page avec un contenu HTML vide ou d’exemple ; l’utilisateur voit un champ de contenu HTML dans les paramètres du nœud

#### Scenario: Édition du code HTML

- **WHEN** l’utilisateur modifie le champ de contenu HTML du NodeHtml dans le panneau de propriétés
- **THEN** l’aperçu dans l’éditeur est mis à jour pour refléter le HTML saisi (balises, structure, texte) et la prévisualisation utilise le même HTML

#### Scenario: Persistance du NodeHtml

- **WHEN** l’utilisateur sauvegarde une page contenant un ou plusieurs NodeHtml avec du contenu HTML saisi
- **THEN** le contenu sérialisé conserve le fragment HTML pour chaque NodeHtml de sorte que la prévisualisation et le rendu final restituent le même HTML

