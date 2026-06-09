# Change : barre d’outils du builder non masquée en prévisualisation standalone

## Why

Sur la page builder standalone (`pageBuilderStandalone.jsx`), l’en-tête applicatif (Retour, Enregistrer) et la barre d’outils du builder (`Layout.Header` : bascule Édition/Prévisualisation, plein écran, breakpoints) se superposent lorsque l’utilisateur fait défiler une page longue en mode prévisualisation. La barre d’outils devient inaccessible ou partiellement cachée, ce qui empêche de revenir en mode édition sans recharger la page.

La cause est un empilement de conteneurs de défilement (`overflow-auto` du shell standalone + `overflow-y: scroll` sur `.admin-layout[data-mode=preview]`) et une hauteur `h-screen` (100vh) du builder à l’intérieur d’un layout qui réserve déjà de l’espace pour l’en-tête standalone.

## What Changes

- Corriger la hiérarchie de défilement en mode prévisualisation : le contenu de la page défile dans le canevas (`admin-layout__main`), pas sur l’ensemble du `admin-layout`.
- Adapter la hauteur du builder embarqué pour occuper l’espace disponible sous l’en-tête standalone (`h-full` plutôt que `h-screen` dans ce contexte).
- Maintenir `Layout.Header` visible (position sticky ou équivalent) au-dessus du canevas en mode prévisualisation, sans chevauchement avec l’en-tête standalone.
- Ajuster le CSS preview (`builder.css`) et, si nécessaire, le shell `pageBuilderStandalone.jsx` pour supprimer le double scroll.

## Impact

- Specs : `page-builder` (nouvelle exigence sur la mise en page preview en contexte standalone).
- Code : `assets/pageBuilderStandalone.jsx`, `assets/editeur/app/builder/Builder.tsx`, `assets/editeur/assets/css/builder.css`, éventuellement `assets/editeur/app/layout/Header.tsx` et `assets/editeur/app/builder/BuilderInline.tsx`.
