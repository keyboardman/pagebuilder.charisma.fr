## Change: Éditeur de variables CSS du thème sous le sélecteur de polices

## Why
La page `/theme/fonts` permet aujourd’hui de sélectionner les polices d’un thème, mais ne donne aucun moyen de gérer les variables CSS (`vars`) du `theme.yaml`, alors qu’elles pilotent les couleurs et autres tokens du thème. Centraliser la gestion des variables sous le sélecteur de polices permet d’aligner la configuration des polices et des tokens Tailwind/DaisyUI au même endroit.

## What Changes
- Ajouter sur la page `/theme/fonts` un éditeur de variables CSS du thème (section `vars` du `theme.yaml`) affiché **sous** le sélecteur de polices.
- Permettre d’**ajouter**, **modifier** et **supprimer** des variables CSS (nom commençant par `--`, valeur string libre) depuis cette interface.
- Initialiser, lorsqu’aucune configuration n’existe encore, la liste des variables avec un ensemble de **variables Tailwind CSS par défaut** (ex. couleurs de base et tailles de police).
- Connecter cet éditeur à la structure `vars` du `theme.yaml` (capability `theme-generator`) afin que les changements soient pris en compte par le générateur CSS (`:root { … }`).

## Impact
- Affected specs: `theme-generator/spec.md` (ajout d’un requirement sur l’édition des `vars` depuis l’UI, en particulier sur `/theme/fonts`).
- Affected code: contrôleur et template de la page `/theme/fonts` (`ThemeController`, `templates/theme/fonts.html.twig`), composants React liés au formulaire de thème (`assets/ThemeForm2.tsx`, `assets/components/ThemeFormComponent.tsx` et/ou composants associés), service de sérialisation du `theme.yaml` si nécessaire.

