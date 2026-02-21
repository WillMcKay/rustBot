# Docker Setup

This project uses Docker Compose to run both the API and web application.

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
   - `NEXTAUTH_URL` - Your application URL (default: http://localhost:3000)
   - `STEAM_API_KEY` - Your Steam API key

## Usage

### Build and Start

```bash
docker-compose up -d
```

This will:
- Build both the API and web containers
- Start the services in the background
- API will be available at http://localhost:3001
- Web will be available at http://localhost:3000

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
```

### Stop Services

```bash
docker-compose down
```

### Rebuild After Changes

```bash
docker-compose up -d --build
```

## Development

For development with Docker (hot reload enabled):

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Or run services locally without Docker:

```bash
pnpm install
pnpm dev
```

## Network

Both services communicate through a Docker network called `rustbot-network`. The web app can reach the API at `http://api:3001` internally.
