# Docker Setup

This project uses separate Docker Compose files for independent deployment of the API and web application.

## Prerequisites

- Docker
- Docker Compose

## Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Fill in your environment variables in `.env`:
   - `RUSTBOT_API_SECRET` - Secret key for API authentication
   - `NEXTAUTH_SECRET` - Secret for NextAuth (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL` - Full URL of your web app (e.g., https://rustbot.example.com)
   - `STEAM_API_KEY` - Your Steam API key
   - `RUSTBOT_API_URL` - Full URL of your API (e.g., https://api.rustbot.example.com)

## Deployment

### Separate Deployments (Recommended)

The API and web app are designed to be deployed independently:

**API Deployment:**
```bash
docker-compose -f docker-compose.api.yml up -d
```

**Web Deployment:**
```bash
docker-compose -f docker-compose.web.yml up -d
```

Both use Traefik for routing and automatic SSL via Let's Encrypt. Configure your domains in the environment variables.

### View Logs

```bash
# API logs
docker-compose -f docker-compose.api.yml logs -f

# Web logs
docker-compose -f docker-compose.web.yml logs -f
```

### Stop Services

```bash
# Stop API
docker-compose -f docker-compose.api.yml down

# Stop Web
docker-compose -f docker-compose.web.yml down
```

## Development

For local development with hot reload:

```bash
docker-compose -f docker-compose.dev.yml up
```

Or run services locally without Docker:

```bash
pnpm install
pnpm dev
```

## Coolify Deployment

1. Create two separate resources in Coolify
2. Deploy `docker-compose.api.yml` for the Discord bot
3. Deploy `docker-compose.web.yml` for the web interface
4. Set environment variables separately for each deployment
