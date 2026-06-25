# Formulaires builder (soumission e-mail / webhook)

Fonctionnalité **sans ApiCard** : les configurations sont en base (`builder_form_config`), exposées au builder via `GET /api/page-builder/forms/catalog` (même accès que l’édition de page : utilisateur authentifié).

> Vue d’ensemble de l’API builder (cards, polices, formulaires) : [builder-api.md](builder-api.md).

## Interface d’administration

Liste, création et édition : **`/builder-form`** (menu latéral **Formulaires**, même accès que Pages / Thèmes).

Les mêmes données sont exposées au builder via `GET /api/page-builder/forms/catalog` pour le sélecteur NodeForm.

## Routes

| Méthode | Chemin | Accès | Rôle |
|---------|--------|-------|------|
| — | **`/builder-form`** | Authentifié | CRUD des configurations (interface web) |
| `GET` | `/api/page-builder/forms/catalog` | Public | JSON catalogue pour le builder |
| `POST` | `/api/page-builder/forms/{slug}/submit` | Public | Réception du `NodeForm` (multipart), antispam, e-mail, webhook optionnel |

`action` renvoyée par le catalogue est une URL relative (générée par le routeur Symfony). Les pages déjà enregistrées avec l’ancienne URL `/submit/form/{slug}` continuent de fonctionner : le NodeForm résout l’URL au moment de la soumission à partir de `formConfigId` (ou migre le chemin legacy).

## Antispam

- **Honeypot** : champ `name="_builder_form_hp"` (voir `App\BuilderForm\BuilderFormAntispam::HONEYPOT_FIELD`), doit rester vide. Le NodeForm l’injecte lorsque `content.formConfigId` est défini.
- **Rate limiting** : cache applicatif, clé IP + slug ; paramètres `app.builder_form.rate_limit.*` dans `config/services.yaml`.

## Configuration (Doctrine)

Entité `App\Entity\BuilderFormConfig` :

- `slug` (unique) — identifiant d’URL et `formConfigId` côté NodeForm.
- `label` — libellé dans le catalogue.
- `recipientEmails` (JSON, liste de chaînes).
- `emailSubjectTemplate` / `emailBodyTemplate` — chaînes **Twig** ; contexte : `form_label`, `form_slug`, `rows` (`{ label, value }` pour chaque champ POST hors champs réservés).
- `webhookUrl` — optionnel ; `POST` JSON `{ formId, submittedAt, fields }` après envoi d’e-mail réussi.

## Paramètres

Dans `config/services.yaml` : `app.builder_form.honeypot_field`, `app.builder_form.rate_limit.*`, `app.builder_form.mail_from`, `app.builder_form.generic_error_message`.

**Mailer (dev)** : `.env.local` utilise en général `MAILER_DSN=smtp://localhost:1025` avec **Mailpit** (`docker compose up -d mailer`). Les ports doivent être mappés en `1025:1025` et `8025:8025` dans `compose.override.yaml` ; interface web Mailpit : http://localhost:8025. Si Mailpit n’est pas démarré, la soumission échoue avec le message générique (voir `var/log/dev.log` : `Builder form mail send failed`).

## Données de démo (optionnel)

```bash
symfony console doctrine:fixtures:load --append --group=builder-form
```

(le groupe dépend de l’ajout éventuel du groupe sur `BuilderFormFixtures` ; sinon créer une entrée via l’admin **Formulaires** ou SQL.)
