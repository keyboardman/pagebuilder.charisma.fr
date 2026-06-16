# Change: Lisibilité des titres de section Settings et placeholders thème NodeYoutube

## Why

Les titres de section des panneaux de style partagés (`Margin`, `Padding`, `Text`, `Border`, etc.) utilisent un fond `bg-gray-200/50` codé en dur. En mode sombre du panneau latéral du builder, ce fond clair combiné à `text-muted-foreground` réduit fortement le contraste et rend les libellés difficiles à lire.

Par ailleurs, le nœud `NodeYoutube` expose des réglages de style (`Spacing2Settings`, `Border2Settings`) avec le sélecteur thème `.ce-youtube`, mais ce comportement n’est pas explicitement couvert par la spec. Les éditeurs doivent voir les valeurs définies dans le thème comme indication dans les placeholders des champs vides, de la même manière que pour les autres nœuds média.

## What Changes

- Introduire un composant partagé (ex. `SettingsSectionTitle`) pour les titres de section des panneaux `*2Settings`, utilisant les tokens sémantiques du thème éditeur (`bg-muted`, `text-muted-foreground`) afin d’assurer un contraste lisible en mode clair et en mode sombre.
- Remplacer les six occurrences du motif `bg-gray-200/50` dans `Text2Settings`, `Spacing2Settings`, `Background2Settings`, `Border2Settings`, `Size2Settings` et `Object2Settings`.
- Étendre la spec des placeholders thème pour inclure explicitement `NodeYoutube` avec le sélecteur `.ce-youtube`.
- Aucun changement de schéma thème ni de persistance : le champ `content.videoId` conserve son placeholder générique (le thème ne définit pas de valeur de contenu pour YouTube).

## Impact

- Affected specs: `page-builder`
- Affected code:
  - `assets/editeur/ManagerNode/Settings/` (nouveau composant + 6 fichiers `*2Settings.tsx`)
  - `assets/editeur/ManagerNode/NodeYoutube/Settings.tsx` (vérification du câblage `themeOverrideSelector`, sans changement fonctionnel attendu si déjà correct)
