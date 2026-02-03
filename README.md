# Créer une base de données postgres

- psql -U postgres 
  - psql → client en ligne de commande PostgreSQL.
  - U postgres → se connecter avec l’utilisateur postgres (l’admin par défaut).
  - Après ça, tu es sur le prompt postgres=#, prêt à taper des commandes SQL.
  
- CREATE USER {DB_USER} WITH PASSWORD '{DB_PASSWORD}' ;
  - CREATE USER → crée un nouvel utilisateur PostgreSQL.
  - {DB_USER} → le nom que tu veux donner à l’utilisateur.
  - WITH PASSWORD '{DB_PASSWORD}' → définit le mot de passe de cet utilisateur.

- CREATE DATABASE {DB_NAME} OWNER {DB_USER};
  - CREATE DATABASE → crée une nouvelle base.
  - {DB_NAME} → nom de la base.
  - OWNER {DB_USER} → le propriétaire de la base, qui aura tous les droits par défaut sur cette base.

- psql -U postgres -h localhost -d {DB_NAME}
  - -h localhost → se connecter sur le serveur local (utile si pas en sudo).
  - -d {DB_NAME} → se connecter directement à cette base.

- GRANT CONNECT ON DATABASE {DB_NAME} TO {DB_USER};
  - Permet à {DB_USER} de se connecter à la base {DB_NAME}.
  - Sans ça, l’utilisateur ne peut même pas accéder à la base.

- GRANT USAGE ON SCHEMA public TO {DB_USER};
  - public → schema par défaut de PostgreSQL.
  - GRANT USAGE → permet à l’utilisateur d’utiliser ce schema (nécessaire pour créer ou manipuler des objets dedans).

- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO {DB_USER};
  - SELECT → lire les données.
  - INSERT → ajouter des lignes
  - UPDATE → modifier des lignes.
  - DELETE → supprimer des lignes.
  - ON ALL TABLES IN SCHEMA public → s’applique à toutes les tables déjà créées dans le schema public.

- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO {DB_USER};
  - Les tables créées après cette commande dans le schema public auront automatiquement ces droits pour {DB_USER}.
  - Évite de devoir refaire un GRANT à chaque nouvelle table.

- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO {DB_USER};
  - Séquences → utilisées pour les champs SERIAL ou BIGSERIAL.
  - USAGE → permet d’utiliser la séquence.
  - SELECT → permet de lire la valeur actuelle de la séquence.
  - Important pour que l’utilisateur puisse insérer de nouvelles lignes avec des clés auto-incrémentées.

- REVOKE CREATE ON SCHEMA public FROM {DB_USER};
  - Interdit à l’utilisateur de créer de nouvelles tables, vues ou objets dans le schema public.
  - Utile pour limiter les droits si tu veux que l’utilisateur ne fasse que manipuler les données, pas créer de structures.