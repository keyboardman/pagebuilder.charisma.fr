## Context

Le projet repose sur Tailwind v4 via `@tailwindcss/postcss` et Webpack Encore. DaisyUI v5 est le plugin recommandé pour Tailwind v4 ; il s’intère via `@plugin "daisyui"` dans le CSS, sans `tailwind.config.js`. Le thème est appliqué via l’attribut `data-theme` sur un ancêtre (souvent `<html>`).

## Goals / Non-Goals

- **Goals :** Intégrer DaisyUI avec thème light par défaut ; fournir une page de référence pour les composants utilisés dans le projet.
- **Non-Goals :** Support du mode sombre, thèmes multiples, personnalisation avancée des thèmes Daisy ; pas d’exhaustivité de tous les composants daisyUI sur la page (un sous-ensemble représentatif suffit).

## Decisions

- **daisyUI v5 (daisyui@latest) :** Compatible Tailwind v4. Installation via `@plugin "daisyui"` dans `app.css` ; pas de `tailwind.config.js` (Tailwind v4 est configuré via CSS).
- **Thème light :** `data-theme="light"` sur `<html>` dans le layout de base. Simple, prévisible, et cohérent avec la demande « theme light ».
- **Page showcase :** Route dédiée (ex. `/_daisyui` ou `/daisyui`). Emplacement `/_daisyui` signale une page outil/dev ; `/daisyui` est plus visible. La proposition laisse le choix à l’implémentation ; la spec exige une route dédiée et une page accessible.
- **Composants à montrer :** Au minimum : boutons (couleurs sémantiques, variantes), badges, cartes, alertes, inputs (text, textarea, select, checkbox, toggle). Extensible à d’autres (accordion, modal, etc.) si la tâche le prévoit.

## Risks / Trade-offs

- **Dépendance daisyUI :** Mise à jour future de daisyUI ou de Tailwind peut nécessiter des ajustements. Mitigation : versions fixées ou plages connues dans `package.json` ; la page showcase sert de régression visuelle.
- **Poids CSS :** DaisyUI ajoute des classes. Mitigation : le build Tailwind/PostCSS ne conserve que les classes utilisées ; la page showcase utilise un sous-ensemble raisonnable.

## Migration Plan

Aucune migration de données. Après implémentation : `npm install`, `npm run build`, vérification de la page showcase et des pages existantes avec le thème light.

## Open Questions

- Aucune.
