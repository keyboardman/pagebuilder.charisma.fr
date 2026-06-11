## 1. Modèle et utilitaires
- [x] 1.1 Ajouter `sanitizeButtonLabelHtml(html: string): string` (whitelist `strong` / `b`, normalisation, texte brut inchangé si pas de balises).
- [x] 1.2 Documenter dans le type `NodeButtonType` que `label` peut contenir du HTML inline limité.

## 2. Édition inline
- [x] 2.1 Modifier `TagNameEditable` (ou composant dédié NodeButton) pour persister `innerHTML` sanitizé au blur au lieu de `textContent`.
- [x] 2.2 Ajouter l'action Gras (bouton + raccourci Ctrl/Cmd+B) lors de l'édition du libellé dans le canevas.
- [x] 2.3 Conserver le collage en texte brut uniquement.

## 3. Rendu
- [x] 3.1 Mettre à jour `View.tsx` pour interpréter le libellé HTML sanitizé (`dangerouslySetInnerHTML` ou équivalent sûr).
- [x] 3.2 Ajouter les règles CSS dans `node-button.css` pour un contraste visible entre texte normal et segments `<strong>` / `<b>`.

## 4. Validation
- [x] 4.1 Vérifier manuellement : sélection partielle → Gras → rendu immédiat en édition et en preview.
- [x] 4.2 Vérifier la sauvegarde / rechargement d'une page avec libellé partiellement gras (types button, submit, link).
- [x] 4.3 Vérifier qu'un libellé texte brut existant (sans HTML) s'affiche et s'édite comme avant.
- [x] 4.4 Vérifier que le collage de HTML arbitraire ne conserve que le texte ou les balises autorisées.
