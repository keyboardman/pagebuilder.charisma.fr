## 1. Spécification et validation

- [x] 1.1 Faire valider le change avec `openspec validate add-builder-form-submissions --strict`

## 2. Modèle et configuration backend

- [x] 2.1 Définir l’entité (ou équivalent) « configuration de formulaire » : identifiant stable, libellé, e-mail(s) destinataire(s), sujet (gabarit ou texte), corps (gabarit avec rendu tableau), URL webhook optionnelle, métadonnées de sécurité si applicable.
- [x] 2.2 Implémenter un **catalogue** (service + endpoint JSON) listant les configurations pour le builder : au minimum `id`, `title` (libellé), `action` ou `submitUrl` (URL de soumission), avec accès réservé comme pour l’édition de page.
- [x] 2.3 Tests unitaires sur le service de catalogue et le mapping des entrées.

## 3. Soumission HTTP et antispam

- [x] 3.1 Implémenter la route POST de soumission avec **rate limiting** (paramètres configurables) et vérification **honeypot** avant tout envoi d’e-mail.
- [x] 3.2 Valider l’existence de la configuration, construire le tableau des champs depuis `FormData` (hors champs réservés antispam), rendre l’e-mail via le gabarit, envoyer le message.
- [x] 3.3 Si webhook renseigné, effectuer l’appel HTTP (timeout court, log d’erreur sans casser le succès utilisateur si l’e-mail est OK).
- [x] 3.4 Répondre en JSON compatible avec `NodeForm` (`success`, `message`) y compris en cas de blocage antispam (message générique si requis).
- [x] 3.5 Tests sur rejet honeypot, rejet rate limit et acceptation nominale.

## 4. Builder (NodeForm)

- [x] 4.1 Étendre le type `NodeFormType` / persistance : `formConfigId` optionnel ; conserver `action` comme valeur résolue pour le rendu public.
- [x] 4.2 Dans `Settings`, consommer l’endpoint **catalogue** (fetch dédié, pas `ApiAdapter` / ApiCard) pour lister les formulaires et appliquer la sélection.
- [x] 4.3 Lors du choix d’une configuration, renseigner `action` avec l’URL fournie par le backend et persister avec la page.
- [x] 4.4 Dans `View` (ou équivalent), lorsque `formConfigId` est défini, injecter le **honeypot** (et jetons requis) dans le `<form>` de façon accessible (masquage CSS / `aria-hidden` selon conventions du projet).

## 5. Qualité

- [x] 5.1 Tests fonctionnels ou PHPUnit sur la soumission (succès, formulaire inconnu, validation).
- [x] 5.2 Documenter le module (README ou doc interne : catalogue + soumission, pas d’ApiCard).
