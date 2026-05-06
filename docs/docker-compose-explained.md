# docker-compose.yml — Explications des modifications

## 1. Suppression du port MySQL

```yaml
# Avant
ports:
  - '${MYSQL_PORT}:3306'

# Après — supprimé
```

En local, le port était exposé pour que `yarn dev` (qui tourne sur la machine hôte) puisse atteindre MySQL. Maintenant que le backend tourne dans le même réseau Docker que la DB, ils se parlent directement via le nom du service (`portfolio-db`) — plus besoin d'exposer MySQL à l'extérieur.

Avantage supplémentaire en prod : MySQL n'est pas accessible depuis l'extérieur du serveur, ce qui est plus sécurisé.

---

## 2. Suppression du volume `./database:/docker-entrypoint-initdb.d`

```yaml
# Avant
volumes:
  - ./database:/docker-entrypoint-initdb.d
  - db_data:/var/lib/mysql

# Après
volumes:
  - db_data:/var/lib/mysql
```

`docker-entrypoint-initdb.d` est un mécanisme MySQL qui exécute automatiquement les fichiers SQL au premier démarrage du container. Maintenant que le système de migrations gère la création des tables via `entrypoint.sh`, ce volume n'est plus nécessaire. Garder les deux aurait causé des conflits — les tables auraient été créées en double.

---

## 3. Ajout du healthcheck

```yaml
healthcheck:
  test: ["CMD", "mysqladmin", "ping", "-h", "127.0.0.1"]
  interval: 10s
  timeout: 5s
  retries: 5
```

Sans healthcheck, Docker considère MySQL comme "prêt" dès que le processus démarre — mais MySQL prend quelques secondes à vraiment initialiser. Le backend démarrait donc avant que MySQL soit opérationnel et crashait.

Le healthcheck vérifie toutes les 10s si MySQL répond vraiment. Combiné avec le `depends_on` du service `api` :

```yaml
depends_on:
  portfolio-db:
    condition: service_healthy
```

Le backend attend que MySQL soit vraiment prêt avant de démarrer.
