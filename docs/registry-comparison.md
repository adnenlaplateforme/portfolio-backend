# Docker Registry — Comparaison Docker Hub vs GHCR

> Décision actuelle : **Docker Hub** (migration vers GHCR possible ultérieurement)

## Contexte

Le build de l'image Docker se fait sur GitHub Actions (pas sur le VPS) pour économiser les ressources. L'image est poussée vers un registry, puis Coolify la pull et redémarre le container.

## Comparaison

| | Docker Hub | GHCR |
|---|---|---|
| **Coût** | Gratuit (limité) ou 7$/mois | Gratuit |
| **Rate limits pulls** | 100 pulls / 6h | Aucune limite |
| **Images privées** | 1 repo privé gratuit | Inclus dans GitHub |
| **Auth dans Actions** | Credentials séparés | `GITHUB_TOKEN` automatique |
| **Intégration Coolify** | Native | Custom registry |
| **Rollback** | Images cachées seulement | Pareil, mais sans limite de stockage |

## Pourquoi GHCR est la meilleure option à terme

1. **Zéro limite de pull** — pas de risque de déploiement qui échoue à cause d'un rate limit
2. **Tout dans GitHub** — pas de compte Docker Hub à gérer, `GITHUB_TOKEN` suffit dans GitHub Actions
3. **Gratuit sans conditions** — Docker Hub a déjà changé ses tarifs une fois, GHCR promet un préavis
4. **Sécurité native** — les credentials suivent le modèle d'auth GitHub (2FA, audit logs)

## Pourquoi Docker Hub pour l'instant

- Intégration Coolify native et bien documentée
- Setup plus rapide
- Migration vers GHCR simple quand nécessaire

## Migrer vers GHCR

Quand tu voudras migrer, les changements à faire sont :

**GitHub Actions** — remplacer :
```yaml
# Docker Hub
- uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_TOKEN }}

tags: ${{ secrets.DOCKERHUB_USERNAME }}/portfolio-api:latest
```

par :
```yaml
# GHCR
- uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}

tags: ghcr.io/${{ github.repository }}:latest
```

**Coolify** — remplacer le registry Docker Hub par un Custom Registry :
- Registry URL : `ghcr.io`
- Username : ton username GitHub
- Password : Personal Access Token avec scope `read:packages`
