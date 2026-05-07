# 1. Dependances et composant d'edition

- [x] 1.1 Ajouter les dependances CodeMirror necessaires a l'edition CSS dans le frontend.
- [x] 1.2 Creer/adapter un composant React d'editeur CodeMirror pour `custom_css` avec configuration CSS minimale.
- [x] 1.3 Ajouter le style d'affichage necessaire pour que l'editeur s'integre visuellement au formulaire de theme.

## 2. Integration dans ThemeFormComponent

- [x] 2.1 Remplacer le `textarea` de la section "CSS personnalise" par l'editeur CodeMirror.
- [x] 2.2 Conserver la soumission du champ `config[custom_css]` avec le meme format de donnees qu'actuellement.
- [x] 2.3 Prevoir un fallback `textarea` en cas d'indisponibilite de l'editeur.

## 3. Validation fonctionnelle

- [x] 3.1 Verifier la prepopulation de l'editeur avec `initialConfig.custom_css`.
- [x] 3.2 Verifier qu'une modification est bien persistee et reapparait apres rechargement.
- [x] 3.3 Verifier que le CSS personnalise est toujours injecte en fin de CSS genere via `ThemeCssGenerator`.
