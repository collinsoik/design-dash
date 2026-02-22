# Cloudflare Configuration Review — DesignDash

## Architecture Overview

```
┌──────────────────────────────┐      ┌──────────────────────────────────────────┐
│  Vercel (Frontend)           │      │  VM: dev server (Backend)                │
│                              │      │                                          │
│  design-dash-two.vercel.app  │─────▶│  cloudflared (systemd service)           │
│  (Next.js app)               │      │    └─▶ dash-api.collinsoik.dev           │
│                              │      │         └─▶ localhost:3002               │
│  Socket.IO client connects   │      │              └─▶ Docker: game-server     │
│  to dash-api.collinsoik.dev  │      │                                          │
│                              │      │  Also routed by the same tunnel:         │
│                              │      │  ├─ game-api.collinsoik.dev    → :3004   │
│                              │      │  └─ engiquest-api.collinsoik.dev → :3005 │
└──────────────────────────────┘      └──────────────────────────────────────────┘
```

## How the Tunnel Works

1. **`cloudflared`** runs as a systemd service on the VM. It creates an outbound-only connection to Cloudflare's edge network — no inbound ports need to be opened and no port forwarding is required.

2. **DNS routing**: `dash-api.collinsoik.dev` is a CNAME managed by Cloudflare that points into the tunnel. When the frontend (on Vercel) makes a Socket.IO or HTTP request to `https://dash-api.collinsoik.dev`, Cloudflare routes it through the tunnel to the VM.

3. **Ingress rules** (in `~/.cloudflared/config.yml`) map hostnames to local services:
   - `dash-api.collinsoik.dev` → `http://localhost:3002` (this project)
   - `game-api.collinsoik.dev` → `http://localhost:3004` (Landscape Game)
   - `engiquest-api.collinsoik.dev` → `http://localhost:3005` (EngiQuest)
   - Catch-all → `http_status:404`

4. **TLS**: `noTLSVerify: true` is set on the origin request, meaning the tunnel doesn't verify TLS on the local hop (localhost). TLS termination for the public-facing side is handled by Cloudflare's edge.

## Setup Flow (`setup-cloudflare-tunnel.sh`)

| Step | What it does |
|------|-------------|
| 1 | Installs `cloudflared` CLI from GitHub releases (`.deb` package) |
| 2 | `cloudflared tunnel login` — authenticates with your Cloudflare account |
| 3 | `cloudflared tunnel create designdash-game` — creates a named tunnel |
| 4 | `cloudflared tunnel route dns designdash-game dash-api.collinsoik.dev` — creates the DNS CNAME |
| 5 | Writes `~/.cloudflared/config.yml` with ingress rules |
| 6 | Installs as a systemd service, enables on boot, and starts it |

## Deployment Flow (`deploy-server.sh`)

| Step | What it does |
|------|-------------|
| 1 | Builds the Docker image via `docker compose build` |
| 2 | Starts the container in detached mode (`docker compose up -d`) |
| 3 | Health-checks `http://localhost:3002/health` |

## Boot Persistence

| Component | Mechanism |
|-----------|-----------|
| `cloudflared` | systemd service (`enabled`) — starts on boot |
| Game server | Docker `restart: unless-stopped` + Docker daemon auto-starts |

## Key Environment Variables

| Variable | Where | Value |
|----------|-------|-------|
| `PORT` | `docker-compose.yml` | `3002` |
| `CORS_ORIGIN` | `docker-compose.yml` | `https://design-dash-two.vercel.app` |
| `NODE_ENV` | `docker-compose.yml` | `production` |
| `DB_PATH` | `docker-compose.yml` | `/app/data/designdash.db` |
| `NEXT_PUBLIC_SOCKET_URL` | Vercel env | `https://dash-api.collinsoik.dev` |

## Notable Concerns

1. **Shared tunnel** — Restarting or stopping `cloudflared` affects all three games (DesignDash, Landscape, EngiQuest), not just this project.
2. **`noTLSVerify: true`** — Acceptable for localhost, but worth noting. The tunnel disables TLS verification on the local origin hop.
3. **Credentials path mismatch** — The setup script hardcodes `/root/.cloudflared/` for the credentials file, but `INFRASTRUCTURE.md` references `/home/collin/.cloudflared/`. This could cause issues if the setup script is run as a non-root user or if the service runs under a different user.
4. **Single setup script scope** — `setup-cloudflare-tunnel.sh` only configures the `dash-api` ingress rule, but the actual production config has three ingress rules. Re-running the setup script would overwrite the config and break the other two games.

## Health Checks

```
Local:    curl http://localhost:3002/health
External: curl https://dash-api.collinsoik.dev/health
```
