## ADDED Requirements

### Requirement: Persistance des configurations de formulaire

Le système SHALL permettre de définir une ou plusieurs **configurations de formulaire** identifiables de façon stable (ex. slug ou UUID), avec un **libellé** affichable dans le builder, une ou plusieurs **adresses e-mail destinataires**, un **sujet** et un **corps de message** basés sur un gabarit dont le rendu SHALL inclure les données soumises sous forme de **tableau** (lignes = champs, colonnes au minimum libellé / valeur). Le système SHALL permettre d’associer optionnellement une **URL de webhook** HTTP(S) déclenchée après envoi réussi de l’e-mail de notification.

#### Scenario: Création d'une configuration minimale

- **WHEN** un administrateur crée une configuration avec destinataire, sujet et gabarit de corps incluant le rendu tabulaire des champs soumis
- **THEN** la configuration est stockée et apparaît dans le **catalogue backend** exploitable par le NodeForm pour la sélection éditoriale

### Requirement: Catalogue des formulaires pour l’éditeur

Le système SHALL exposer une **fonctionnalité backend dédiée** (ex. endpoint HTTP JSON et/ou service Symfony) permettant au builder de récupérer la liste des configurations de formulaire **sans utiliser le registre ApiCard**. L’accès SHALL être soumis à la **même politique d’authentification et d’autorisation** que l’édition des pages. Chaque entrée SHALL comporter au minimum un **identifiant stable**, un **libellé** affichable et l’**URL de soumission** à enregistrer comme `action` du NodeForm.

#### Scenario: Liste chargée dans les réglages NodeForm

- **WHEN** un éditeur ouvre le panneau de configuration d’un NodeForm et que le catalogue est appelé avec des droits valides
- **THEN** la réponse contient une entrée par configuration avec les champs nécessaires pour afficher la liste et remplir `action` après sélection

### Requirement: Endpoint de soumission

Le système SHALL exposer un **endpoint HTTP** (typiquement `POST`) associé à chaque configuration (route dédiée ou paramétrée) acceptant un corps `multipart/form-data` ou `application/x-www-form-urlencoded` compatible avec la soumission HTML standard. Le système SHALL vérifier que la cible existe, SHALL construire le contexte du gabarit à partir des paires nom/valeur reçues, SHALL envoyer l’e-mail aux destinataires selon le gabarit, et SHALL invoquer le webhook lorsqu’il est configuré et que l’e-mail a été accepté pour envoi. Le système SHALL répondre en **JSON** avec au minimum des champs interprétables par le NodeForm existant (`success` booléen et `message` chaîne).

#### Scenario: Soumission réussie

- **WHEN** un client envoie une requête valide avec des champs nommés
- **THEN** l’e-mail est envoyé selon le gabarit et la réponse JSON indique `success: true` avec un message exploitable par l’UI

#### Scenario: Webhook optionnel

- **WHEN** une configuration possède une URL de webhook et que l’envoi de l’e-mail aboutit
- **THEN** le système émet une requête HTTP `POST` vers cette URL avec un corps JSON décrivant l’identifiant du formulaire et les champs soumis

### Requirement: Protection antispam sur la soumission

Le système SHALL appliquer une **gestion antispam** sur l’endpoint de soumission exposé aux visiteurs : au minimum une **limitation de débit** (rate limiting) par origine identifiable (ex. adresse IP, éventuellement combinée à l’identifiant de la configuration de formulaire) avec des seuils fixés par configuration applicative ou des valeurs par défaut documentées, et une **validation de champ leurre** (honeypot) — le backend SHALL exiger un champ convenu **laissé vide** ; toute soumission avec ce champ renseigné SHALL être rejetée **sans** envoi d’e-mail ni invocation du webhook. Le système MAY ajouter d’autres mesures (ex. jeton CSRF synchronisé, service dédié type CAPTCHA) sans retirer ces garde-fous minimaux.

#### Scenario: Rejet pour dépassement de débit

- **WHEN** un client excède le nombre de soumissions autorisé dans la fenêtre de temps configurée
- **THEN** le serveur refuse la requête sans envoyer d’e-mail ni appeler le webhook et répond en JSON de façon compatible avec le NodeForm (`success` / `message`) ; le message affiché aux abus SHALL rester **générique** si une politique produit l’exige (pas de fuite d’information sur le motif exact)

#### Scenario: Rejet honeypot

- **WHEN** une soumission contient le champ honeypot avec une valeur non vide
- **THEN** le serveur n’envoie pas d’e-mail et n’appelle pas le webhook ; la réponse MAY être indistinguishable d’une erreur de validation courante pour dissuader l’affinage par les bots

#### Scenario: Soumission acceptée après contrôles antispam

- **WHEN** une soumission respecte le rate limiting et le honeypot (et tout contrôle additionnel activé)
- **THEN** le traitement se poursuit conformément à l’exigence **Endpoint de soumission**
