## ADDED Requirements

### Requirement: Édition des variables CSS du thème sur /theme/fonts

Le système SHALL permettre de gérer les variables CSS du thème (section `vars` du `theme.yaml`) depuis la page `/theme/fonts`, via une interface affichée sous le sélecteur de polices. L’interface SHALL afficher la liste des variables existantes sous la forme de paires `(nom, valeur)`, SHALL permettre d’ajouter une variable (nom commençant par `--`, valeur string), de modifier la valeur d’une variable existante et de supprimer une variable. Les modifications SHALL être propagées à la structure de données servant à générer le `theme.yaml` afin que le `ThemeCssGenerator` produise les variables correspondantes dans le bloc `:root { … }`.

#### Scenario: Gestion complète des variables sur /theme/fonts
- **WHEN** l’utilisateur ouvre la page `/theme/fonts` pour un Theme existant
- **THEN** sous le sélecteur de polices, une section « Variables du thème » affiche les variables actuelles (nom + valeur) et permet d’ajouter, modifier ou supprimer des variables ; à la sauvegarde, ces changements sont pris en compte dans la génération du `theme.yaml` et du CSS du thème

### Requirement: Initialisation avec des variables Tailwind CSS par défaut

Lorsque le Theme ne possède encore aucune configuration de variables (`vars` vide ou absent), le système SHALL initialiser la liste des variables exposées sur `/theme/fonts` avec un ensemble de variables Tailwind CSS par défaut (par ex. couleurs de base et tailles de police, alignées avec la configuration Tailwind/DaisyUI du projet). Ces variables par défaut SHALL être modifiables et supprimables par l’utilisateur ; une fois persistées, elles SHALL être considérées comme faisant partie des `vars` du `theme.yaml` et utilisées par le `ThemeCssGenerator` pour alimenter le bloc `:root`.

#### Scenario: Pré-remplissage des variables à partir de Tailwind
- **WHEN** l’utilisateur ouvre la page `/theme/fonts` pour un Theme qui n’a encore aucune variable définie
- **THEN** la section « Variables du thème » est pré-remplie avec un ensemble de variables Tailwind CSS par défaut (par ex. couleurs et tailles de police courantes), que l’utilisateur peut ensuite personnaliser avant de sauvegarder

