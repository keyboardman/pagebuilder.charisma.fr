# Change: Soumissions de formulaires builder (e-mail, webhook, sélection NodeForm)

## Why

Les pages éditées dans le builder contiennent des **NodeForm** qui envoient aujourd’hui des requêtes AJAX vers une URL d’action libre, sans modèle backend dédié pour traiter les envois (notification, traçabilité, intégration externe). Il manque une configuration centralisée (destinataire, présentation du message) et un moyen éditorial de **choisir un formulaire** parmi les configurations maintenues par l’application, **sans passer par le registre ApiCard**.

## What Changes

- **Fonctionnalité backend Symfony** : persistance des **configurations de formulaire** (libellé, e-mail(s), gabarits sujet/corps avec **tableau** des champs soumis, webhook optionnel).
- **Endpoint de soumission** (POST multipart) par configuration, utilisable comme `action` d’un NodeForm, avec **antispam** : limitation de débit et **honeypot** (extensions type CAPTCHA / CSRF possibles).
- **Endpoint (ou équivalent)** de **catalogue** réservé au contexte édition du builder : liste JSON des formulaires configurés (`identifiant`, libellé affichable, URL de soumission) avec la **même politique d’accès** que l’édition des pages (pas une ApiCard `list`).
- **NodeForm** : dans les réglages, choix d’une configuration dans ce catalogue ; persistance de **`formConfigId`** (ou équivalent) et **dénormalisation** de **`action`** pour le rendu public.

## Impact

- Specs affectées : `builder-form-submission` (nouvelle capacité), `page-builder` (NodeForm).
- Code prévu : entité / repository, service, contrôleurs ou actions (catalogue + soumission), rate limiter / stockage compteurs, mailer, client HTTP webhook, rendu NodeForm (honeypot + jetons si besoin), Settings NodeForm.
