# DesignDash — Server Infrastructure

## Overview

DesignDash is a presenter-paced design challenge game with a **Vercel frontend** and a **Node.js REST API backend** running in **Docker** on a shared VM (`dev` server). The container is exposed to the internet through a **shared Cloudflare Tunnel**.

The backend uses plain HTTP REST (no WebSocket/Socket.IO) so it handles lost packets and connection problems gracefully — all operations are idempotent and safe to retry.

## Architecture

```
┌──────────────────────────┐      ┌─────────────────────────────────────────┐
│  Vercel (Frontend)       │      │  VM: dev server (Backend)               │
│                          │      │                                         │
│  design-dash-two.vercel.app ────▶ cloudflared (systemd)                  │
│  (Next.js app)           │      │   └─▶ dash-api.collinsoik.dev          │
│                          │      │        └─▶ localhost:3002               │
│  Uses fetch() for REST   │      │             └─▶ Docker: server-game-   │
│  API calls               │      │                  server-1               │
└──────────────────────────┘      │                                         │
                                  │  Also on this VM:                       │
                                  │  ├─ Landscape   :3004  (PM2)            │
                                  │  └─ EngiQuest   :3005  (PM2)            │
                                  └─────────────────────────────────────────┘
```

## API Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/health` | — | Health check |
| POST | `/api/games` | — | Create game (returns code + adminToken) |
| GET | `/api/games/:code` | — | Get game state (phase, round, submitted teams) |
| POST | `/api/games/:code/advance` | adminToken | Advance round or phase |
| POST | `/api/games/:code/submit` | — | Submit team decisions (idempotent) |
| GET | `/api/games/:code/designs` | — | View all submitted designs |

## Game Flow

1. Presenter creates a game → gets a 4-digit code + admin token
2. Presenter advances through rounds at their own pace (no timers)
3. After all rounds, game enters `submission` phase
4. Teams enter the game code on the website and submit their design decisions
5. Presenter advances to `gallery` phase — everyone can view all submissions

## Backend Process Management

The backend runs in **Docker** with `restart: unless-stopped`, meaning it auto-restarts on crash and survives reboots (Docker daemon starts on boot).

**Docker Compose:** `/home/collin/design-dash/apps/server/docker-compose.yml`

**Common commands:**

| Action | Command |
|---|---|
| View status | `docker ps` (look for `server-game-server-1`) |
| View logs | `docker logs server-game-server-1` |
| Tail logs | `docker logs -f server-game-server-1` |
| Restart | `cd /home/collin/design-dash/apps/server && docker compose restart` |
| Rebuild + restart | `cd /home/collin/design-dash/apps/server && docker compose up -d --build` |
| Stop | `cd /home/collin/design-dash/apps/server && docker compose down` |

## Environment

Environment variables are set in `docker-compose.yml` under the `environment` key. Key variables:
- `NODE_ENV=production`
- `PORT=3002`
- `CORS_ORIGIN` — must match the Vercel deployment URL (`https://design-dash-two.vercel.app`)

**Vercel environment variable:**
- `NEXT_PUBLIC_API_URL=https://dash-api.collinsoik.dev`

## Cloudflare Tunnel (Shared)

A single Cloudflare tunnel serves all three game APIs on this VM.

**Service:** `/etc/systemd/system/cloudflared.service`
**Config:** `/home/collin/.cloudflared/config.yml`

Routes:
- `dash-api.collinsoik.dev` → `localhost:3002` (this project)
- `game-api.collinsoik.dev` → `localhost:3004` (Landscape Game)
- `engiquest-api.collinsoik.dev` → `localhost:3005` (EngiQuest)

> **Warning:** Restarting or stopping cloudflared affects ALL three games, not just this one.

## Boot Persistence

| Component | Mechanism |
|---|---|
| cloudflared | systemd service (`enabled`) |
| DesignDash container | Docker `restart: unless-stopped` + Docker daemon auto-starts |

No PM2 involvement — this project uses Docker exclusively.

## Health Check

- **Local:** `curl http://localhost:3002/health`
- **External:** `curl https://dash-api.collinsoik.dev/health`
- **Full status:** `~/server-status.sh` (checks all services on the VM)

## Differences from Other Games on This VM

| Aspect | DesignDash | Landscape Game | EngiQuest |
|---|---|---|---|
| Port | 3002 | 3004 | 3005 |
| Process manager | Docker | PM2 | PM2 |
| Tunnel subdomain | dash-api | game-api | engiquest-api |

## Troubleshooting

**Backend not responding:**
1. `docker ps` — is `server-game-server-1` running and healthy?
2. `docker logs server-game-server-1 --tail 50` — check for errors
3. `sudo systemctl status cloudflared` — is the tunnel running?
4. `curl http://localhost:3002/health` — can the server respond locally?

**Container not starting:**
- `docker compose logs` from the `apps/server/` directory
- Check if port 3002 is already in use: `lsof -i :3002`
- Rebuild: `docker compose up -d --build`
