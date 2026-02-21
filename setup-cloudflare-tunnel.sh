#!/bin/bash
# DesignDash - Cloudflare Tunnel Setup
# Run this on your Proxmox server (192.168.1.223)
#
# This creates a Cloudflare Tunnel to expose the game server
# at dash-api.collinsoik.dev without port forwarding.
#
# Prerequisites:
#   - cloudflared CLI installed
#   - Cloudflare account with collinsoik.dev domain

set -e

echo "=== Cloudflare Tunnel Setup for DesignDash ==="
echo ""

# Step 1: Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
  echo "[!] cloudflared is not installed. Installing..."
  # For Debian/Ubuntu:
  curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
  sudo dpkg -i cloudflared.deb
  rm cloudflared.deb
  echo "[OK] cloudflared installed."
else
  echo "[OK] cloudflared is already installed."
fi

echo ""
echo "=== Step 1: Login to Cloudflare ==="
echo "This will open a browser to authenticate."
cloudflared tunnel login

echo ""
echo "=== Step 2: Create Tunnel ==="
cloudflared tunnel create designdash-game

echo ""
echo "=== Step 3: Configure DNS ==="
cloudflared tunnel route dns designdash-game dash-api.collinsoik.dev

echo ""
echo "=== Step 4: Create Config File ==="
TUNNEL_ID=$(cloudflared tunnel list | grep designdash-game | awk '{print $1}')

mkdir -p ~/.cloudflared

cat > ~/.cloudflared/config.yml << EOF
tunnel: ${TUNNEL_ID}
credentials-file: /root/.cloudflared/${TUNNEL_ID}.json

ingress:
  - hostname: dash-api.collinsoik.dev
    service: http://localhost:3002
    originRequest:
      noTLSVerify: true
  - service: http_status:404
EOF

echo "Config written to ~/.cloudflared/config.yml"

echo ""
echo "=== Step 5: Install as System Service ==="
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared

echo ""
echo "=== Done! ==="
echo "Cloudflare Tunnel is running."
echo "dash-api.collinsoik.dev → localhost:3002"
echo ""
echo "To check status: sudo systemctl status cloudflared"
echo "To view logs:    sudo journalctl -u cloudflared -f"
