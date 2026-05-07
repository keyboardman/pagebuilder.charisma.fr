## Context
Le formulaire React `ThemeFormComponent` expose une section "CSS personnalise" qui est persistee via `config[custom_css]`. Le besoin est de remplacer l'edition texte brute par une experience dediee CSS sans modifier le contrat backend.

## Goals / Non-Goals
- Goals:
  - Fournir une edition CSS avec coloration syntaxique et meilleure ergonomie dans `ThemeFormComponent`.
  - Conserver le meme payload HTTP (`config[custom_css]`) pour ne pas impacter `ThemeConfigDTO` ni `ThemeCssGenerator`.
  - Garder une experience degradable (fallback textarea).
- Non-Goals:
  - Modifier les regles de sanitation/validation serveur du CSS.
  - Introduire un validateur CSS complet cote client.

## Decisions
- Decision: Integrer CodeMirror comme composant d'edition de `custom_css` avec extension CSS.
  - Rationale: bibliotheque mature orientee editeur de code, extensions modulaires, et bonne accessibilite.
- Decision: Synchroniser la valeur CodeMirror vers un champ de formulaire (`name="config[custom_css]"`) afin de conserver le mecanisme de soumission existant.
  - Rationale: minimise l'impact sur le backend et evite les regressions sur la persistence.
- Decision: Prevoir un fallback `textarea` si CodeMirror est indisponible.
  - Rationale: robustesse UX et compatibilite environnementale.

## Risks / Trade-offs
- Poids JS additionnel lie a CodeMirror.
  - Mitigation: n'importer que les modules necessaires (setup minimal + language CSS).
- Divergence potentielle entre valeur visible editeur et valeur soumise.
  - Mitigation: source de verite unique dans l'etat React et synchronisation testee.

## Migration Plan
1. Ajouter la dependance CodeMirror et le composant d'edition.
2. Remplacer le `textarea` `custom_css` par l'editeur + champ synchronise.
3. Verifier manuellement la sauvegarde et la regeneration de CSS.

## Open Questions
- Aucun blocage fonctionnel identifie pour la proposition.
