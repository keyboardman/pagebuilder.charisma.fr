## Context

Le builder sérialise les NodeForm avec `method`, `action` et des champs enfants ; la soumission en édition/preview utilise `fetch` et `FormData`. La liste des formulaires configurés est une **ressource applicative** (Symfony), distincte des **ApiCard** du page builder. Les formulaires publics sont souvent **anonymes**, ce qui pose la question du **CSRF** et de l’abus (spam).

## Goals / Non-Goals

- Goals : configuration déclarative par formulaire (e-mail, tableau des champs dans le corps, webhook optionnel) ; catalogue exposé au builder via un mécanisme backend dédié ; réponse JSON stable pour l’UX AJAX existante (`success`, `message`) ; **protection antispam** obligatoire sur la soumission publique (rate limit + honeypot, extensible).
- Non-Goals : enregistrer les formulaires comme `ApiCardListInterface` ; constructeur visuel de champs hors builder ; file d’attente asynchrone complexe (hors scope initial).

## Decisions

- **Transport** : soumission en `multipart/form-data` (comportement actuel du `FormData` dans NodeForm) ; le backend agrège les paires nom/valeur pour l’e-mail et le webhook.
- **Gabarit e-mail** : moteur de template existant du projet (ex. Twig) avec un contexte structuré (méta du formulaire + liste de lignes `label` / `value` dérivées des clés POST) ; le rendu SHALL produire au minimum un **tableau HTML** des paires champ / valeur dans le corps.
- **Webhook** : `POST` JSON (identifiant du formulaire, horodatage, champs). Défaut : **l’e-mail est la source de vérité** ; échec webhook journalisé sans faire échouer la réponse utilisateur si l’e-mail a été envoyé.
- **Catalogue pour l’éditeur** : route HTTP interne (ex. `GET` JSON) implémentée dans le même module que les configurations ; authentification / autorisation **alignées sur l’édition de page** ; pas de dépendance à `ApiCardRegistry`.
- **Résolution de l’URL dans NodeForm** : lorsque l’éditeur choisit une configuration, le builder SHALL enregistrer **`formConfigId`** (identifiant stable côté backend) **et** recopier l’**URL de soumission** fournie par le catalogue dans **`action`**, pour le HTML exporté et l’affichage public sans rappeler le catalogue.
- **Antispam (obligatoire)** : l’endpoint de soumission public SHALL combiner **rate limiting** (clé typiquement IP + identifiant de formulaire, seuils configurables) — **champ honeypot** (nom et sémantique convenus avec le frontend ; champ masqué aux utilisateurs, vide à la soumission légitime) — réponses d’échec **génériques** quand la politique produit l’exige, pour limiter l’énumération. Extensions possibles : jeton CSRF (cookie / session / double-submit), intégration CAPTCHA ou service tiers, documentées hors périmètre minimal si non activées au MVP.
- **Sécurité admin** : création / modification des configurations protégées comme le reste du back-office.

## Risques / Trade-offs

- **Faux positifs rate limit** (NAT, entreprises) → plages de seuils configurables ou allowlist optionnelle ultérieure.
- **Fuite de données via webhook** → URL saisie par un admin de confiance.

## Migration Plan

- Déploiement : nouvelles tables ou entités ; routes catalogue + soumission ; contenu NodeForm existant inchangé si `action` reste manuel.
- Rollback : désactiver les routes de soumission et retirer l’UI de sélection dans NodeForm.

## Open Questions

- Interface d’administration : CRUD intégré ou configuration initiale par migration / fixture.
- Champs **From** / **Reply-To** par formulaire.
- Pièces jointes futures (`input type="file"`).
