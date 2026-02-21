#!/bin/bash
# DesignDash Game Server Deployment Script
# Run this on your Proxmox server (192.168.1.223)
#
# Usage:
#   1. Clone the repo on the server: git clone https://github.com/collinsoik/design-dash.git
#   2. cd design-dash
#   3. chmod +x deploy-server.sh
#   4. ./deploy-server.sh

set -e

echo "=== DesignDash Game Server Deployment ==="

# Build and start the Docker container
echo "[1/3] Building Docker image..."
docker compose -f apps/server/docker-compose.yml build

echo "[2/3] Starting game server..."
docker compose -f apps/server/docker-compose.yml up -d

echo "[3/3] Verifying server health..."
sleep 3
if curl -s http://localhost:3001/health | grep -q '"status":"ok"'; then
  echo "Game server is running on port 3001!"
else
  echo "WARNING: Server may not have started correctly. Check logs:"
  echo "  docker compose -f apps/server/docker-compose.yml logs"
fi

echo ""
echo "=== Next Steps ==="
echo "Set up Cloudflare Tunnel to expose port 3001 as dash-api.collinsoik.dev"
echo "See: setup-cloudflare-tunnel.sh"
