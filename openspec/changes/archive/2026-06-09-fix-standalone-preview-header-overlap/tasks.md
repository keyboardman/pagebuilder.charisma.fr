## 1. Mise en page et défilement

- [x] 1.1 Adapter `pageBuilderStandalone.jsx` : un seul conteneur de scroll, hauteur `h-full` / `min-h-0` cohérente entre l'en-tête standalone et la zone builder.
- [x] 1.2 Adapter `Builder.tsx` (ou `BuilderInline`) pour utiliser `h-full` au lieu de `h-screen` en contexte embarqué standalone.
- [x] 1.3 Modifier `builder.css` : en mode preview, supprimer le scroll sur `.admin-layout[data-mode=preview]` et confiner le défilement à `.admin-layout__main`.
- [x] 1.4 Rendre `.admin-layout__header` sticky en mode preview avec un `z-index` inférieur à l'en-tête standalone mais suffisant pour rester au-dessus du canevas.

## 2. Validation

- [x] 2.1 Vérifier manuellement sur `/page/{id}/builder` : page longue, basculer en prévisualisation, scroller jusqu'en bas — `Layout.Header` reste visible et cliquable (retour mode édition).
- [x] 2.2 Vérifier que l'en-tête standalone (Retour, Enregistrer) n'est jamais masqué.
- [x] 2.3 Vérifier le mode édition (sidebars, drag-and-drop) et le `NodeTopButton` en preview (scroll vers le haut du canevas).
- [x] 2.4 Vérifier le mode plein écran : pas de chevauchement nouveau des barres.
