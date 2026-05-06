# portfolio-backend

API REST pour un portfolio de développeur, construite avec **Node.js / Express**. Elle expose des endpoints pour l'authentification, la gestion des projets et l'envoi de messages de contact.

## Stack technique

- **Runtime** : Node.js 20 (LTS)
- **Framework** : Express 5
- **Base de données** : MySQL 8.4 (via `mysql2`)
- **Auth** : JWT (`jsonwebtoken`)
- **Validation** : `express-validator`
- **Mail** : Nodemailer (Gmail ou OVH SMTP)
- **Infra locale** : Docker Compose (MySQL + phpMyAdmin)
- **Infra prod** : Docker Compose + Coolify + Traefik

## Prérequis

- [Docker](https://www.docker.com/) et Docker Compose
- [Devbox](https://www.jetify.com/devbox) (optionnel, fournit Node 20 + Yarn isolés)

## Installation

```bash
git clone git@github.com:adnenlaplateforme/portfolio-backend.git
cd portfolio-backend
cp .env.example .env
# Éditer .env avec vos valeurs
yarn install
```

## Développement local

```bash
# 1. Démarrer uniquement la base de données
docker compose up portfolio-db -d

# 2. Appliquer les migrations
yarn migrate

# 3. Créer le compte admin (première fois uniquement)
yarn seed

# 4. Lancer le serveur avec rechargement automatique
yarn dev
```

L'API écoute sur `http://localhost:${PORT}` (défaut : 3001).

> Pour administrer la base de données, lancer aussi phpMyAdmin :
> `docker compose up phpmyadmin -d` → accessible sur `http://localhost:${PHPMYADMIN_PORT}`

## Ajouter une nouvelle feature

1. Démarrer la DB : `docker compose up portfolio-db -d`
2. Coder avec `yarn dev` (rechargement automatique à chaque sauvegarde)
3. Si le schéma DB change → créer `database/migrations/00X_description.sql` et lancer `yarn migrate`
4. Commit + push → le déploiement se déclenche automatiquement via GitHub Actions

## Migrations

Les migrations versionnent les changements de schéma de la base de données. Chaque changement est un fichier SQL numéroté dans `database/migrations/`.

```bash
# Appliquer les migrations en attente
yarn migrate
```

Le système enregistre les migrations déjà jouées dans une table `migrations` — relancer `yarn migrate` est toujours sûr, les migrations déjà appliquées sont ignorées.

**Ajouter un changement de schéma :**
```bash
# Créer un nouveau fichier de migration
touch database/migrations/005_description.sql
# Écrire le SQL, puis appliquer
yarn migrate
```

## Stack complète Docker (test prod en local)

```bash
docker compose up --build -d
```

Lance la DB, l'API (avec migrations + seed automatiques au démarrage) et phpMyAdmin.

```bash
docker compose down -v  # Tout arrêter et supprimer les volumes
```

## Variables d'environnement

| Variable               | Description                              | Exemple                  |
|------------------------|------------------------------------------|--------------------------|
| `PORT`                 | Port du serveur Express                  | `3001`                   |
| `DB_HOST`              | Hôte MySQL                               | `localhost`              |
| `DB_PORT`              | Port MySQL                               | `3306`                   |
| `DB_USER`              | Utilisateur MySQL                        | `adnen`                  |
| `DB_PASSWORD`          | Mot de passe MySQL                       | `password`               |
| `DB_NAME`              | Nom de la base de données                | `portfolio_db`           |
| `JWT_SECRET`           | Clé secrète pour signer les JWT          | `un_secret_aleatoire`    |
| `EMAIL_PROVIDER`       | Provider email : `gmail` ou `ovh`        | `gmail`                  |
| `GMAIL_USER`           | Adresse Gmail expéditrice                | `you@gmail.com`          |
| `GMAIL_PASS`           | Mot de passe d'application Gmail         | `xxxx xxxx xxxx xxxx`    |
| `OVH_USER`             | Adresse email OVH                        | `you@domain.com`         |
| `OVH_PASS`             | Mot de passe OVH                         | `password`               |
| `MYSQL_PORT`           | Port exposé par le conteneur MySQL       | `3307`                   |
| `MYSQL_ROOT_PASSWORD`  | Mot de passe root MySQL                  | `root`                   |
| `PHPMYADMIN_PORT`      | Port exposé par phpMyAdmin               | `8082`                   |
| `ADMIN_EMAIL`          | Email du compte admin (seed)             | `admin@example.com`      |
| `ADMIN_PASSWORD`       | Mot de passe du compte admin (seed)      | `password`               |

## Structure du projet

```
src/
├── config/         # Pool MySQL, transporter email, migrate, seed
├── controllers/    # Réception req/res, délégation au service
├── services/       # Logique métier
├── models/         # Requêtes SQL
├── middlewares/    # Auth JWT, autorisation, validation, erreurs
├── validators/     # Règles express-validator
├── routes/         # Définition des routes
├── types/          # Interfaces TypeScript
└── errors/         # Classe AppError

database/
└── migrations/     # Fichiers SQL versionnés (001, 002, ...)
```

## Endpoints

| Méthode | Route                | Accès       | Description                    |
|---------|----------------------|-------------|--------------------------------|
| POST    | `/api/auth/login`    | Public      | Connexion, retourne un JWT     |
| GET     | `/api/projects`      | Public      | Liste des projets              |
| GET     | `/api/projects/:id`  | Public      | Détail d'un projet             |
| POST    | `/api/projects`      | Admin (JWT) | Créer un projet                |
| PUT     | `/api/projects/:id`  | Admin (JWT) | Modifier un projet             |
| DELETE  | `/api/projects/:id`  | Admin (JWT) | Supprimer un projet            |
| POST    | `/api/contact`       | Public      | Envoyer un message de contact  |
| POST    | `/emails/send`       | Public      | Envoi d'email générique        |

## Déploiement

Le déploiement sur le VPS est automatisé via GitHub Actions. Chaque push sur `main` déclenche le pipeline CI/CD qui redéploie l'application via Coolify.

Sur le VPS, au démarrage du container l'`entrypoint.sh` exécute automatiquement :
1. `yarn migrate` — applique les nouvelles migrations
2. `yarn seed` — crée le compte admin si absent
3. `node dist/server.js` — démarre le serveur
