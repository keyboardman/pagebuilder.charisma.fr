# Design: Page CRUD et formulaire React

## Context

- L’application dispose déjà d’une entité `Theme` avec `generatedCssPath` et d’un CRUD Thème (liste, new, edit, delete). Le formulaire thème (polices/config) est en React (themeForm2) avec shadcn/ui.
- Il faut introduire une entité Page liée à un Theme pour afficher des pages web dont le style est piloté par le CSS du thème choisi.

## Goals / Non-Goals

- Goals : entité Page avec titre, slug (minuscule), thème, description SEO, content ; CRUD aligné sur Theme ; formulaire page en React + shadcn/ui ; chargement du CSS du thème sur les vues page.
- Non-Goals : pas de versioning de contenu, pas de publication/dépublication dans cette première version (si besoin, à traiter plus tard).

## Decisions

- **Relation Page → Theme** : ManyToOne (une page a un thème ; un thème peut être utilisé par plusieurs pages). Le CSS chargé est celui du thème associé (`Theme.generatedCssPath`), servi via la route existante `app_theme_css`.
- **Slug** : dérivé du titre, normalisé en minuscule (et caractères ASCII/accents gérés comme pour Theme, ex. SluggerInterface). Unique par page ; généré côté serveur à la création/mise à jour pour rester cohérent.
- **Formulaire page** : React + shadcn/ui, comme pour le formulaire thème (themeForm2). Données envoyées en POST (ou API dédiée si préféré) ; le contrôleur Symfony gère la validation et la persistance. Champs : titre, slug (éditable mais pré-rempli depuis le titre), select thème (liste des Theme avec CSS), description (texte), content (texte long / textarea ou éditeur riche si besoin ultérieur).
- **Routes** : préfixe `/page`, noms `app_page_*` (index, new, edit, delete, show pour affichage public si nécessaire). Pas de conflit avec les routes theme/media existantes.

## Risks / Trade-offs

- **Slug unique** : contrainte d’unicité sur `Page.slug` ; en cas de doublon (ex. deux pages « Contact »), le slugger ou une logique métier doit différencier (suffixe numérique ou message d’erreur).
- **Theme sans CSS** : si le thème choisi n’a pas encore de `generatedCssPath`, la page peut être affichée sans feuille de style ; à documenter ou gérer par un message dans l’UI.

## Migration Plan

- Créer la table `page` via une migration Doctrine (champs + clé étrangère vers `theme.id`). Pas de modification des tables existantes. Rollback : migration down pour supprimer la table `page`.

## Open Questions

- Aucun pour le périmètre décrit.
