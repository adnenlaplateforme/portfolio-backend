# portfolio-backend

API REST pour un portfolio de développeur, construite avec **Node.js / Express**. Elle expose des endpoints pour l'authentification, la gestion des projets et l'envoi de messages de contact.

## Stack technique

- **Runtime** : Node.js 20 (LTS)
- **Framework** : Express 5
- **Base de données** : MySQL 8.4 (via `mysql2`)
- **Auth** : JWT (`jsonwebtoken`)
- **Validation** : `express-validator`
- **Mail** : Nodemailer
- **Dev** : Nodemon, Devbox
- **Infra locale** : Docker Compose (MySQL + phpMyAdmin)

## Prérequis

- [Docker](https://www.docker.com/) et Docker Compose
- [Devbox](https://www.jetify.com/devbox) (optionnel, fournit Node 20 + Yarn isolés)

## Installation

```bash
# Cloner le dépôt
git clone git@github.com:adnenlaplateforme/portfolio-backend.git
cd portfolio-backend

# Copier et configurer les variables d'environnement
cp .env.example .env
# Editer .env avec vos valeurs

# Installer les dépendances
yarn install
```

## Démarrage

### Base de données (Docker)

```bash
docker compose up -d
```

- MySQL accessible sur le port défini par `MYSQL_PORT` (défaut : 3306)
- phpMyAdmin accessible sur `http://localhost:${PHPMYADMIN_PORT}` (défaut : 8080)

> Au premier lancement, supprimer le volume existant si vous changez les identifiants :
> `docker compose down -v && docker compose up -d`

### Serveur Node.js

```bash
# Développement (rechargement automatique)
yarn dev

# Production
yarn start
```

L'API écoute sur `http://localhost:${PORT}` (défaut : 3001).

## Variables d'environnement

| Variable            | Description                        | Exemple                  |
|---------------------|------------------------------------|--------------------------|
| `PORT`              | Port du serveur Express            | `3001`                   |
| `DB_HOST`           | Hôte MySQL                         | `localhost`              |
| `DB_USER`           | Utilisateur MySQL                  | `adnen`                  |
| `DB_PASSWORD`       | Mot de passe MySQL                 | `password`               |
| `DB_NAME`           | Nom de la base de données          | `portfolio_db`           |
| `JWT_SECRET`        | Clé secrète pour signer les JWT    | `un_secret_aleatoire`    |
| `MAIL_USER`         | Adresse Gmail expéditrice          | `you@gmail.com`          |
| `MAIL_PASS`         | Mot de passe d'application Gmail   | `xxxx xxxx xxxx xxxx`    |
| `MAIL_TO`           | Adresse destinataire des contacts  | `you@gmail.com`          |
| `MYSQL_PORT`        | Port exposé par le conteneur MySQL | `3307`                   |
| `MYSQL_ROOT_PASSWORD` | Mot de passe root MySQL          | `root`                   |
| `PHPMYADMIN_PORT`   | Port exposé par phpMyAdmin         | `8082`                   |

## Structure du projet

```
src/
├── config/         # Connexion MySQL (pool)
├── controllers/    # Réception req/res, délégation au service
├── services/       # Logique métier
├── models/         # Requêtes SQL
├── middlewares/    # Auth JWT, autorisation, validation, erreurs
├── validators/     # Règles express-validator
├── routes/         # Définition des routes
└── errors/         # Classe AppError
```

## Endpoints

| Méthode | Route              | Accès       | Description                  |
|---------|--------------------|-------------|------------------------------|
| POST    | `/api/auth/login`  | Public      | Connexion, retourne un JWT   |
| GET     | `/api/projects`    | Public      | Liste des projets            |
| POST    | `/api/projects`    | Admin (JWT) | Créer un projet              |
| PUT     | `/api/projects/:id`| Admin (JWT) | Modifier un projet           |
| DELETE  | `/api/projects/:id`| Admin (JWT) | Supprimer un projet          |
| POST    | `/api/contact`     | Public      | Envoyer un message de contact|
