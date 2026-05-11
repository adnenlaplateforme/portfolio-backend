# Portfolio Backend

API REST pour un portfolio de développeur, construite avec **Node.js / Express / TypeScript**.  
Elle expose des endpoints pour l'authentification, la gestion de projets et l'envoi de messages de contact.

## Stack technique

| Catégorie      | Outil                                              |
|----------------|----------------------------------------------------|
| Runtime        | Node.js 20 (LTS)                                  |
| Framework      | Express 5                                          |
| Langage        | TypeScript (NodeNext)                              |
| Base de données| MySQL 8.4 via `mysql2/promise`                    |
| Auth           | JWT (`jsonwebtoken`) + `bcrypt`                   |
| Validation     | `express-validator`                                |
| Mail           | Nodemailer — Gmail ou OVH SMTP                    |
| Tests          | Vitest                                             |
| Infra locale   | Docker Compose (MySQL + phpMyAdmin)               |
| Infra prod     | Docker + Coolify + Traefik                        |
| CI/CD          | GitHub Actions → Docker Hub → Coolify webhook     |

## Prérequis

- [Docker](https://www.docker.com/) et Docker Compose
- [Devbox](https://www.jetify.com/devbox) (optionnel — fournit Node 20 + Yarn isolés)

---

## Installation

```bash
git clone git@github.com:adnenlaplateforme/portfolio-backend.git
cd portfolio-backend
cp .env.example .env
# Éditer .env avec vos valeurs
yarn install
```

---

## Développement local

```bash
# 1. Démarrer la base de données
docker compose up portfolio-db -d

# 2. Appliquer les migrations
yarn migrate

# 3. Créer le compte admin (première fois uniquement)
yarn seed

# 4. Lancer le serveur avec rechargement automatique
yarn dev
```

L'API écoute sur `http://localhost:${PORT}` (défaut : `3001`).

> Pour administrer la base de données, démarrer aussi phpMyAdmin :  
> `docker compose up phpmyadmin -d` → `http://localhost:${PHPMYADMIN_PORT}`

---

## Tests

33 tests répartis en deux catégories. La base de données n'est jamais sollicitée : toutes les dépendances sont mockées via `vi.mock`.

```bash
# Lancer les tests une fois
yarn test

# Mode watch (relance à chaque sauvegarde)
yarn test:watch

# Avec rapport de couverture
yarn test:coverage
```

**Tests unitaires — services**

| Fichier                       | Tests | Scénarios couverts                                         |
|-------------------------------|-------|------------------------------------------------------------|
| `auth.service.test.ts`        | 3     | Login valide, email inconnu, mauvais mot de passe          |
| `project.service.test.ts`     | 8     | CRUD complet, 404 sur ressource inexistante                |
| `contact.service.test.ts`     | 3     | Sauvegarde DB + 2 emails, propagation d'erreurs            |

**Tests HTTP — routes (supertest)**

| Fichier                       | Tests | Scénarios couverts                                                    |
|-------------------------------|-------|-----------------------------------------------------------------------|
| `auth.routes.test.ts`         | 4     | Login valide, credentials invalides, champs manquants, email invalide |
| `project.routes.test.ts`      | 11    | CRUD complet, 401 sans token, 404 sur ressource inexistante           |
| `contact.routes.test.ts`      | 4     | Envoi valide, champs manquants, message trop court, email invalide    |

> Les tests sont exécutés automatiquement en CI avant chaque build. Un push qui fait échouer les tests bloque le déploiement.

---

## Migrations

Les migrations versionnent les changements de schéma. Chaque changement est un fichier SQL numéroté dans `database/migrations/`.

```bash
yarn migrate
```

Le système enregistre les migrations déjà appliquées dans une table `migrations` — relancer `yarn migrate` est toujours sûr.

**Ajouter un changement de schéma :**

```bash
touch database/migrations/005_description.sql
# Écrire le SQL, puis :
yarn migrate
```

---

## Variables d'environnement

Copier `.env.example` en `.env` et renseigner les valeurs.

| Variable              | Description                                    | Exemple                    |
|-----------------------|------------------------------------------------|----------------------------|
| `PORT`                | Port du serveur Express                        | `3001`                     |
| `DB_HOST`             | Hôte MySQL                                     | `localhost`                |
| `DB_PORT`             | Port MySQL                                     | `3306`                     |
| `DB_USER`             | Utilisateur MySQL                              | `adnen`                    |
| `DB_PASSWORD`         | Mot de passe MySQL                             | `password`                 |
| `DB_NAME`             | Nom de la base de données                      | `portfolio_db`             |
| `JWT_SECRET`          | Clé secrète pour signer les JWT               | `openssl rand -base64 32`  |
| `CORS_ORIGINS`        | Origines autorisées (séparées par `,`)         | `https://adnensaid.fr`     |
| `EMAIL_PROVIDER`      | Provider email : `gmail` ou `ovh`              | `gmail`                    |
| `GMAIL_USER`          | Adresse Gmail expéditrice                      | `you@gmail.com`            |
| `GMAIL_PASS`          | Mot de passe d'application Gmail              | `xxxx xxxx xxxx xxxx`      |
| `OVH_USER`            | Adresse email OVH                              | `you@domain.com`           |
| `OVH_PASS`            | Mot de passe OVH                               | `password`                 |
| `MYSQL_PORT`          | Port exposé par le conteneur MySQL             | `3307`                     |
| `MYSQL_ROOT_PASSWORD` | Mot de passe root MySQL                        | `openssl rand -base64 32`  |
| `PHPMYADMIN_PORT`     | Port exposé par phpMyAdmin                     | `8082`                     |
| `ADMIN_EMAIL`         | Email du compte admin (seed)                   | `admin@example.com`        |
| `ADMIN_PASSWORD`      | Mot de passe du compte admin (seed)            | `password`                 |

---

## Endpoints

| Méthode | Route               | Accès       | Description                   |
|---------|---------------------|-------------|-------------------------------|
| GET     | `/health`           | Public      | État du serveur               |
| POST    | `/api/auth/login`   | Public      | Connexion — retourne un JWT   |
| GET     | `/api/projects`     | Public      | Liste des projets             |
| GET     | `/api/projects/:id` | Public      | Détail d'un projet            |
| POST    | `/api/projects`     | Admin (JWT) | Créer un projet               |
| PUT     | `/api/projects/:id` | Admin (JWT) | Modifier un projet            |
| DELETE  | `/api/projects/:id` | Admin (JWT) | Supprimer un projet           |
| POST    | `/api/contact`      | Public      | Envoyer un message de contact |

**Authentification :** les routes admin nécessitent un header `Authorization: Bearer <token>`.

---

## Structure du projet

```
src/
├── config/         # Pool MySQL, transporter email, migrate, seed
├── controllers/    # Réception req/res, délégation au service
├── services/       # Logique métier (testée)
├── models/         # Requêtes SQL
├── middlewares/    # Auth JWT, autorisation, validation, erreurs
├── validators/     # Règles express-validator
├── routes/         # Définition des routes Express
├── types/          # Interfaces TypeScript
├── errors/         # Classe AppError
├── app.ts          # App Express (sans listen) — importé par les tests HTTP
├── server.ts       # Point d'entrée prod (DB + listen)
└── __tests__/
    ├── services/   # Tests unitaires Vitest
    └── routes/     # Tests HTTP supertest

database/
└── migrations/     # Fichiers SQL versionnés (001, 002, ...)
```

---

## Déploiement

### Pipeline CI/CD

Le pipeline GitHub Actions s'exécute à chaque push sur `main` et à chaque tag `v*`.

```
push main / tag v*
      │
      ▼
  [test]  ← vitest (bloque le build si échec)
      │
      ▼
  [build-and-deploy]
      ├── Build image Docker
      ├── Push Docker Hub
      │     ├── adenino/portfolio-api:latest
      │     ├── adenino/portfolio-api:<sha>
      │     └── adenino/portfolio-api:<tag>  (si tag v*)
      ├── Webhook Coolify (déploiement)
      └── GitHub Release (si tag v*)
```

### Créer une release

```bash
git tag v1.2.0
git push --tags
```

Cela publie l'image Docker versionnée sur Docker Hub, déclenche le déploiement et crée une GitHub Release avec les notes générées automatiquement depuis les commits.

### Secrets GitHub requis

| Secret                | Description                                   |
|-----------------------|-----------------------------------------------|
| `DOCKERHUB_USERNAME`  | Nom d'utilisateur Docker Hub                  |
| `DOCKERHUB_TOKEN`     | Token d'accès Docker Hub                      |
| `COOLIFY_WEBHOOK_URL` | URL du webhook de déploiement Coolify         |
| `COOLIFY_API_TOKEN`   | Token API Coolify (`deploy: true`)            |

### Coolify

L'application est déployée via `docker-compose.prod.yml` :

- `portfolio-db` — MySQL 8.4, réseau interne uniquement
- `api` — image Docker Hub, port interne `3001`, routage HTTPS via Traefik

Variables à configurer dans Coolify (onglet **Environment Variables**) :

```env
PORT=3001
DB_NAME=portfolio_db
DB_USER=...
DB_PASSWORD=...
MYSQL_ROOT_PASSWORD=...
JWT_SECRET=...
CORS_ORIGINS=https://adnensaid.fr
EMAIL_PROVIDER=gmail
GMAIL_USER=...
GMAIL_PASS=...
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
NODE_ENV=production
```

### Démarrage du container

`entrypoint.sh` s'exécute automatiquement au démarrage et enchaîne :

1. `yarn migrate` — applique les migrations en attente
2. `yarn seed` — crée le compte admin s'il n'existe pas
3. `node dist/server.js` — démarre le serveur

### Health check

`GET /health` retourne `{"status":"ok"}` — utilisé par Docker pour surveiller l'état du container.
