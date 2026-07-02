## Why

Le composant `Border2Settings` applique actuellement un style de bordure uniforme sur tous les cotes, ce qui limite les usages de design courants. Il faut permettre des configurations par cote (par exemple uniquement en bas) pour couvrir les besoins de mise en page reels dans l'editeur.

## What Changes

- Etendre `Border2Settings` pour supporter un mode "tous les cotes" et un mode "par cote".
- Permettre de definir independamment largeur, style et couleur pour `top`, `right`, `bottom` et `left`.
- Conserver la compatibilite avec la configuration existante quand un style global est utilise.
- Adapter la serialisation/deserialisation des valeurs de bordure pour representer les deux modes sans ambiguite.
- Mettre a jour l'UI de l'editeur pour rendre la selection par cote explicite et facile a utiliser.

## Capabilities

### New Capabilities
- `border2settings-side-specific-borders`: Gestion des bordures avec parametrage global ou par cote dans l'editeur.

### Modified Capabilities
- `page-builder`: Les exigences du builder evoluent pour permettre l'edition et le rendu des bordures par cote.

## Impact

- Code frontend de l'editeur (composants de settings, etat, mapping CSS).
- Logique de rendu des styles injectes dans les pages preview et render.
- Tests unitaires/autres tests frontend lies aux reglages de style.
