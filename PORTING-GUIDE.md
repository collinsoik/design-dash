# Multiplayer Game Infrastructure Porting Guide

> Extracted from **DesignDash** — a multiplayer design decision game.
> This guide documents every architectural pattern, deployment detail, and code contract
> needed to replicate the lobby/room/real-time infrastructure in a new project.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Monorepo Structure](#2-monorepo-structure)
3. [Shared Package Contract](#3-shared-package-contract)
4. [Backend Server](#4-backend-server)
5. [Frontend Client](#5-frontend-client)
6. [Deployment Pipeline](#6-deployment-pipeline)
7. [Critical Coupling Points](#7-critical-coupling-points)
8. [Porting Checklist](#8-porting-checklist)

---

## 1. Architecture Overview

```
┌─────────────────────┐         ┌──────────────────────┐         ┌─────────────────────┐
│   Vercel (Frontend)  │  WSS   │  Cloudflare Tunnel   │  HTTP   │  Local Docker (API)  │
│   Next.js + React    │◄──────►│  dash-api.domain.dev │◄──────►│  Express + Socket.IO │
│   socket.io-client   │        │  (public hostname)   │        │  SQLite (sql.js)     │
│   Zustand store      │        └──────────────────────┘        │  Port 3002           │
└─────────────────────┘                                          └─────────────────────┘
```

**Split deployment model:**
- **Frontend** — Next.js app on Vercel (auto-deploys on push)
- **Backend** — Express + Socket.IO server in Docker on a local/home machine
- **Networking** — Cloudflare Tunnel exposes the local Docker container to the internet (no port forwarding, no public IP needed)
- **Shared types** — A `packages/shared` workspace consumed by both apps

**Tech stack:**
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend framework | Next.js 14 (App Router) | Pages, routing, SSR |
| State management | Zustand 4 | Client-side game state |
| Real-time | Socket.IO 4 (client + server) | WebSocket communication |
| HTTP server | Express 4 | Health check endpoint |
| Database | sql.js (SQLite compiled to WASM) | Persistent game history |
| Container | Docker + docker-compose | Server packaging |
| Tunnel | Cloudflare Tunnel (cloudflared) | Public exposure of local server |
| Hosting | Vercel | Frontend deployment |

---

## 2. Monorepo Structure

```
project-root/
├── package.json                  # Root — npm workspaces config
├── package-lock.json
├── vercel.json                   # Vercel build configuration
├── deploy-server.sh              # Server build + deploy script
├── setup-cloudflare-tunnel.sh    # One-time Cloudflare Tunnel setup
├── .gitignore
│
├── packages/
│   └── shared/                   # @your-game/shared
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts          # Barrel re-export
│           ├── types.ts          # All shared TypeScript types
│           └── events.ts         # Socket.IO event name constants
│
├── apps/
│   ├── server/                   # @your-game/server
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── Dockerfile
│   │   ├── docker-compose.yml
│   │   ├── data/                 # SQLite DB file (gitignored)
│   │   └── src/
│   │       ├── index.ts          # Entry: Express + Socket.IO + boot
│   │       ├── rooms.ts          # Room CRUD, join/rejoin/disconnect
│   │       ├── db.ts             # SQLite persistence layer
│   │       └── [game-logic].ts   # Your game-specific handlers
│   │
│   └── web/                      # @your-game/web
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.mjs
│       ├── .env.local.example
│       ├── tailwind.config.ts
│       ├── postcss.config.js
│       ├── lib/
│       │   ├── socket.ts         # Socket.IO singleton manager
│       │   ├── game-store.ts     # Zustand state store
│       │   └── types.ts          # Re-exports from shared
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx          # Landing / join page
│       │   ├── host/page.tsx     # Room creation page
│       │   └── lobby/[roomCode]/page.tsx  # Waiting room
│       └── components/
│           └── lobby/            # Lobby UI components
```

### Root `package.json`

```json
{
  "name": "your-game",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "npm run dev:server & npm run dev:web",
    "dev:web": "npm run dev --workspace=apps/web",
    "dev:server": "npm run dev --workspace=apps/server",
    "build": "npm run build --workspace=packages/shared && npm run build --workspaces"
  },
  "engines": { "node": ">=18" },
  "devDependencies": {
    "next": "^14.2.0"
  }
}
```

> The root `next` devDependency is required solely for Vercel framework detection.

---

## 3. Shared Package Contract

The shared package is the single source of truth for all types and event names between client and server.

### 3a. Event Constants (`events.ts`)

```typescript
// Client -> Server (what the frontend emits)
export const CLIENT_EVENTS = {
  ROOM_CREATE:  "room:create",     // Host creates a room
  ROOM_JOIN:    "room:join",       // Player joins by code
  ROOM_REJOIN:  "room:rejoin",     // Reconnecting player re-associates
  GAME_START:   "game:start",      // Host starts the game
  // ... your game-specific events
} as const;

// Server -> Client (what the server broadcasts)
export const SERVER_EVENTS = {
  ROOM_STATE:         "room:state",          // Full room state sync
  ROOM_PLAYER_JOINED: "room:player-joined",  // New player notification
  ROOM_PLAYER_LEFT:   "room:player-left",    // Disconnect notification
  ROOM_ERROR:         "room:error",          // Error with code
  GAME_STARTED:       "game:started",        // Game has begun
  GAME_ENDED:         "game:ended",          // Game is over
  // ... your game-specific events
} as const;
```

### 3b. Core Types (`types.ts`)

#### Player & Team

```typescript
export interface Player {
  id: string;            // Socket ID (remapped on reconnect)
  displayName: string;
  teamId: string | null; // null for host
  isHost: boolean;
  connected: boolean;    // Live connection status
}

export interface Team {
  id: string;            // e.g. "team-0"
  name: string;          // From TEAM_NAMES constant
  color: string;         // Hex color from TEAM_COLORS constant
  members: string[];     // Array of player IDs
  // ... game-specific score fields
}

export const TEAM_COLORS = [
  "#E5484D", "#3E63DD", "#30A46C", "#F5D90A",
  "#8E4EC6", "#F76808", "#12A594", "#E54666",
] as const;

export const TEAM_NAMES = [
  "Studio Red", "Studio Blue", "Studio Green", "Studio Gold",
  "Studio Violet", "Studio Ember", "Studio Teal", "Studio Rose",
] as const;
```

#### Room & Config

```typescript
export type GamePhase = "lobby" | "playing" | "voting" | "results";

export interface RoomConfig {
  teamSize: number;      // Players per team
  turnTimer: number;     // Seconds per round
  // ... your game-specific config
}

export interface Room {
  code: string;          // 4-digit numeric room code
  hostId: string;        // Player ID of the host
  config: RoomConfig;
  players: Record<string, Player>;  // Keyed by player ID
  teams: Record<string, Team>;      // Keyed by team ID
  phase: GamePhase;
  gameState: GameState | null;      // null until game starts
  createdAt: number;
}
```

#### Event Payloads

```typescript
// Client -> Server
export interface RoomCreatePayload {
  teamSize: number;
  turnTimer: number;
  // ... game-specific config
}

export interface RoomJoinPayload {
  roomCode: string;
  playerName: string;
}

// Ack response shapes (returned via Socket.IO callbacks)
// Success: { success: true, roomCode: string, room: Room }
// Failure: { success: false, error: string }
```

### 3c. Package Configuration

```json
{
  "name": "@your-game/shared",
  "version": "1.0.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
```

**tsconfig.json:** Target ES2020, module CommonJS, output to `./dist`, strict mode enabled, declaration + sourceMap generation.

---

## 4. Backend Server

### 4a. Entry Point (`index.ts`)

```typescript
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { handleRoomEvents } from "./rooms";
import { initDb } from "./db";

const app = express();
const httpServer = createServer(app);

// Parse CORS origins from env (comma-separated)
const rawOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
const origins = rawOrigin.split(",").map((s) => s.trim());
const corsOrigin = origins.length === 1 ? origins[0] : origins;

export const io = new Server(httpServer, {
  cors: { origin: corsOrigin, methods: ["GET", "POST"] },
});

// Health check endpoint (used by Docker, monitoring, deploy script)
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
  handleRoomEvents(io, socket);
  // ... register your game-specific event handlers
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

async function start() {
  await initDb();
  const PORT = process.env.PORT || 3001;
  httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}
start().catch((err) => { console.error(err); process.exit(1); });
```

### 4b. Room System (`rooms.ts`) — THE CORE REUSABLE PIECE

This is the primary module to port. It handles room lifecycle with no game-specific logic.

```typescript
import { Server, Socket } from "socket.io";
import { Room, Player, Team, TEAM_COLORS, TEAM_NAMES } from "@your-game/shared";
import { CLIENT_EVENTS, SERVER_EVENTS } from "@your-game/shared";

// Global in-memory room store
export const rooms = new Map<string, Room>();

export function getRoom(code: string): Room | undefined {
  return rooms.get(code);
}

// Generate a unique 4-digit numeric room code
function generateRoomCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function createUniqueCode(): string {
  let code: string;
  do { code = generateRoomCode(); } while (rooms.has(code));
  return code;
}

export function handleRoomEvents(io: Server, socket: Socket): void {

  // ─── CREATE ROOM ─────────────────────────────────────
  socket.on(CLIENT_EVENTS.ROOM_CREATE, (payload, callback) => {
    const code = createUniqueCode();

    // Build 8 team slots
    const teams: Record<string, Team> = {};
    for (let i = 0; i < 8; i++) {
      teams[`team-${i}`] = {
        id: `team-${i}`,
        name: TEAM_NAMES[i],
        color: TEAM_COLORS[i],
        members: [],
        peerScore: 0, judgeScore: 0, finalScore: 0,  // game-specific
      };
    }

    // Host player (does NOT join a team)
    const hostPlayer: Player = {
      id: socket.id,
      displayName: "Host",
      teamId: null,
      isHost: true,
      connected: true,
    };

    const room: Room = {
      code,
      hostId: socket.id,
      config: { teamSize: payload.teamSize, turnTimer: payload.turnTimer, ...payload },
      players: { [socket.id]: hostPlayer },
      teams,
      phase: "lobby",
      gameState: null,
      createdAt: Date.now(),
    };

    rooms.set(code, room);

    // Clean up stale Socket.IO room memberships (defense against "Play Again")
    socket.rooms.forEach((r) => { if (r !== socket.id) socket.leave(r); });
    socket.join(code);

    // Stash identity on the socket for use in other handlers
    (socket as any).roomCode = code;
    (socket as any).playerId = socket.id;

    callback({ success: true, roomCode: code, room });
  });

  // ─── JOIN ROOM ───────────────────────────────────────
  socket.on(CLIENT_EVENTS.ROOM_JOIN, (payload, callback) => {
    const room = rooms.get(payload.roomCode);

    if (!room) {
      callback({ success: false, error: "Room not found" });
      socket.emit(SERVER_EVENTS.ROOM_ERROR, { message: "Room not found", code: "ROOM_NOT_FOUND" });
      return;
    }
    if (room.phase !== "lobby") {
      callback({ success: false, error: "Game already in progress" });
      socket.emit(SERVER_EVENTS.ROOM_ERROR, { message: "Game in progress", code: "GAME_IN_PROGRESS" });
      return;
    }

    // Find the team with fewest members (round-robin balancing)
    const availableTeams = Object.values(room.teams)
      .filter((t) => t.members.length < room.config.teamSize);

    if (availableTeams.length === 0) {
      callback({ success: false, error: "All teams are full" });
      socket.emit(SERVER_EVENTS.ROOM_ERROR, { message: "Teams full", code: "TEAMS_FULL" });
      return;
    }

    const targetTeam = availableTeams.reduce((a, b) =>
      a.members.length <= b.members.length ? a : b
    );

    const player: Player = {
      id: socket.id,
      displayName: payload.playerName,
      teamId: targetTeam.id,
      isHost: false,
      connected: true,
    };

    room.players[socket.id] = player;
    targetTeam.members.push(socket.id);

    // Socket.IO room management
    socket.rooms.forEach((r) => { if (r !== socket.id) socket.leave(r); });
    socket.join(payload.roomCode);
    (socket as any).roomCode = payload.roomCode;
    (socket as any).playerId = socket.id;

    callback({ success: true, room, playerId: socket.id });

    // Notify others
    socket.to(payload.roomCode).emit(SERVER_EVENTS.ROOM_PLAYER_JOINED, {
      player: { id: player.id, displayName: player.displayName, teamId: player.teamId },
    });
    io.to(payload.roomCode).emit(SERVER_EVENTS.ROOM_STATE, room);
  });

  // ─── REJOIN (reconnection) ──────────────────────────
  socket.on(CLIENT_EVENTS.ROOM_REJOIN, (payload, callback) => {
    const room = rooms.get(payload.roomCode);
    if (!room) { callback({ success: false, error: "Room not found" }); return; }

    const oldPlayerId = payload.playerId;
    const newSocketId = socket.id;
    const player = room.players[oldPlayerId];

    if (!player) { callback({ success: false, error: "Player not found" }); return; }

    if (oldPlayerId !== newSocketId) {
      // Remap the player ID across all data structures
      player.id = newSocketId;
      player.connected = true;
      delete room.players[oldPlayerId];
      room.players[newSocketId] = player;

      // Update hostId if this was the host
      if (room.hostId === oldPlayerId) room.hostId = newSocketId;

      // Update team members array
      if (player.teamId) {
        const team = room.teams[player.teamId];
        const idx = team.members.indexOf(oldPlayerId);
        if (idx !== -1) team.members[idx] = newSocketId;
      }

      // Update any game-specific active player tracking
      if (room.gameState?.currentTurn?.activePlayerIds) {
        for (const [teamId, pid] of Object.entries(room.gameState.currentTurn.activePlayerIds)) {
          if (pid === oldPlayerId) {
            room.gameState.currentTurn.activePlayerIds[teamId] = newSocketId;
          }
        }
      }
    } else {
      player.connected = true;
    }

    socket.rooms.forEach((r) => { if (r !== socket.id) socket.leave(r); });
    socket.join(payload.roomCode);
    (socket as any).roomCode = payload.roomCode;
    (socket as any).playerId = newSocketId;

    callback({ success: true, room, playerId: newSocketId });
    io.to(payload.roomCode).emit(SERVER_EVENTS.ROOM_STATE, room);
  });

  // ─── DISCONNECT ─────────────────────────────────────
  socket.on("disconnect", () => {
    const roomCode = (socket as any).roomCode;
    if (!roomCode) return;

    const room = rooms.get(roomCode);
    if (!room) return;

    const player = room.players[socket.id];
    if (!player) return;

    // Mark disconnected but DO NOT remove from room (allows rejoin)
    player.connected = false;

    socket.to(roomCode).emit(SERVER_EVENTS.ROOM_PLAYER_LEFT, { playerId: socket.id });
    io.to(roomCode).emit(SERVER_EVENTS.ROOM_STATE, room);
  });
}
```

**Key design decisions:**
- Players are **never removed** from the room on disconnect — they are marked `connected: false` so they can rejoin
- The host does **not** join a team (`teamId: null`)
- Team assignment uses **round-robin balancing** (smallest team gets the next player)
- Room codes are **4-digit numeric** strings (`1000`–`9999`)
- Socket identity is stashed on the socket object via `(socket as any).roomCode` for cross-handler access
- Rooms are **never cleaned up** (no TTL) — a server restart loses all in-progress games

### 4c. Database Layer (`db.ts`)

Uses `sql.js` — SQLite compiled to WASM. No native bindings, works everywhere.

```typescript
import initSqlJs, { Database } from "sql.js";
import fs from "fs";
import path from "path";

let db: Database;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, "..", "data", "designdash.db");

export function getDb(): Database { return db; }

function persistDb(): void {
  try {
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  } catch (err) {
    console.error("Failed to persist database:", err);
  }
}

export async function initDb(): Promise<void> {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Create your schema
  db.run(`CREATE TABLE IF NOT EXISTS games (
    id TEXT PRIMARY KEY,
    room_code TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    game_id TEXT REFERENCES games(id),
    name TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    game_id TEXT REFERENCES games(id),
    team_id TEXT REFERENCES teams(id),
    display_name TEXT
  )`);

  persistDb();
}

// Save when a game starts
export function saveGame(room: Room): void {
  const gameId = `game-${room.code}-${Date.now()}`;
  db.run("INSERT INTO games VALUES (?, ?, CURRENT_TIMESTAMP, NULL)", [gameId, room.code]);
  // ... insert teams, players
  persistDb();
}
```

**Pattern:** The DB is write-only during gameplay (no reads for game logic). It exists purely for post-game history/analytics.

### 4d. Server Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.4",
    "sql.js": "^1.10.2",
    "@your-game/shared": "*"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.11.0",
    "@types/express": "^4.17.21",
    "tsx": "^4.7.0"
  },
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

---

## 5. Frontend Client

### 5a. Socket Connection Singleton (`lib/socket.ts`)

```typescript
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001", {
      autoConnect: false,      // Don't connect until explicitly called
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
  }
  return socket;
}

export function connectSocket(): Socket {
  const s = getSocket();
  if (!s.connected) s.connect();
  return s;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;  // Forces fresh instance on next getSocket()
  }
}
```

**Key decisions:**
- `autoConnect: false` — no connection until a page explicitly calls `connectSocket()`
- Setting `socket = null` after disconnect ensures fresh instances between game sessions
- Reconnection built-in with exponential backoff (1s → 5s, 10 attempts)

### 5b. Zustand State Store (`lib/game-store.ts`)

```typescript
import { create } from "zustand";
import { Room, GamePhase, GameState } from "@your-game/shared";

interface GameStore {
  // State
  room: Room | null;
  playerId: string | null;
  phase: GamePhase;
  gameState: GameState | null;
  error: string | null;

  // Actions
  setRoom: (room: Room) => void;
  setPlayerId: (id: string) => void;
  setPhase: (phase: GamePhase) => void;
  setGameState: (gs: GameState) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  room: null,
  playerId: null,
  phase: "lobby" as GamePhase,
  gameState: null,
  error: null,
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  setRoom: (room) => set({
    room,
    phase: room.phase,
    gameState: room.gameState ?? undefined,
  }),

  setPlayerId: (playerId) => set({ playerId }),
  setPhase: (phase) => set({ phase }),

  setGameState: (gameState) => set((state) => ({
    gameState,
    room: state.room ? { ...state.room, gameState } : state.room,
  })),

  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
```

**Pattern:** `setRoom` is the primary sync action — it extracts `phase` and `gameState` from the room object so the store always stays consistent.

### 5c. Page Flow

#### Landing Page (`app/page.tsx`) — Join Entry Point

```
Mount → reset() + disconnectSocket()   ← Clears stale state from previous game
User enters: room code (4 digits) + name
Submit → router.push(`/lobby/${roomCode}?name=${encodedName}`)
No socket connection on this page.
```

#### Host Page (`app/host/page.tsx`) — Room Creation

```
Mount → reset() + disconnectSocket()
User configures: team size, turn timer, game-specific options
Submit → connectSocket()
       → emit CLIENT_EVENTS.ROOM_CREATE { teamSize, turnTimer, ... }
       → ack: setRoom(room), setPlayerId(socket.id)
       → router.push(`/lobby/${roomCode}`)
```

#### Lobby Page (`app/lobby/[roomCode]/page.tsx`) — Waiting Room

Three join paths based on identity state:

```
1. New player (has name from URL, no playerId in store):
   → connectSocket()
   → emit ROOM_JOIN { roomCode, playerName }
   → ack: setRoom(room), setPlayerId(playerId)

2. Returning player (has playerId in store):
   → connectSocket()
   → emit ROOM_REJOIN { roomCode, playerId }
   → ack: setRoom(room), setPlayerId(playerId)
   → on failure: reset() + redirect to /

3. No identity (no name, no playerId):
   → redirect to /
```

**Socket listeners:**
- `ROOM_STATE` → `setRoom(room)` — updates when players join/leave
- `GAME_STARTED` → `router.push(/game/${roomCode})` — transitions to game

**Reconnection handler:**
```typescript
socket.on("connect", () => {
  // Re-associate after reconnection
  socket.emit(CLIENT_EVENTS.ROOM_REJOIN, { roomCode, playerId });
});
```

**Host starts game:**
```typescript
socket.emit(CLIENT_EVENTS.GAME_START, null, (response) => {
  if (response.success) router.push(`/game/${roomCode}`);
});
```

**Minimum 2 players** required to start (configurable).

### 5d. Next.js Configuration (`next.config.mjs`)

```javascript
const nextConfig = {
  transpilePackages: ["@your-game/shared"],  // Required for monorepo shared package
  images: { unoptimized: true },
};
export default nextConfig;
```

### 5e. Environment Variable

```
# .env.local
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
```

The `NEXT_PUBLIC_` prefix makes it available in client-side code (embedded at build time).

### 5f. Frontend Dependencies

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "socket.io-client": "^4.7.4",
    "zustand": "^4.5.0",
    "@your-game/shared": "*"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.33",
    "autoprefixer": "^10.4.17",
    "@types/react": "^18",
    "@types/node": "^20"
  }
}
```

---

## 6. Deployment Pipeline

### 6a. Dockerfile (built from monorepo root)

```dockerfile
FROM node:20-alpine
WORKDIR /app

# Dependency caching layer
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/server/package.json apps/server/
RUN npm ci --workspace=packages/shared --workspace=apps/server

# Source copy and build
COPY packages/shared/ packages/shared/
COPY apps/server/ apps/server/
RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=apps/server

# Data directory for SQLite
RUN mkdir -p /app/data

EXPOSE 3002
CMD ["node", "apps/server/dist/index.js"]
```

**Key:** Build context must be the monorepo root (not `apps/server/`).

### 6b. Docker Compose

```yaml
services:
  game-server:
    build:
      context: ../../          # Monorepo root
      dockerfile: apps/server/Dockerfile
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
      - PORT=3002
      - CORS_ORIGIN=https://your-game.vercel.app
      - DB_PATH=/app/data/game.db
    volumes:
      - ./data:/app/data       # Persist SQLite across restarts
    restart: unless-stopped
```

### 6c. Server Deploy Script (`deploy-server.sh`)

```bash
#!/bin/bash
set -e
echo "Building Docker image..."
docker compose -f apps/server/docker-compose.yml build

echo "Starting container..."
docker compose -f apps/server/docker-compose.yml up -d

echo "Waiting for health check..."
sleep 3
if curl -sf http://localhost:3002/health | grep -q '"status":"ok"'; then
  echo "Server is healthy!"
else
  echo "WARNING: Health check failed. Check: docker compose -f apps/server/docker-compose.yml logs"
fi
```

### 6d. Cloudflare Tunnel Setup (`setup-cloudflare-tunnel.sh`)

```bash
#!/bin/bash
set -e

# Step 1: Install cloudflared
if ! command -v cloudflared &> /dev/null; then
  echo "Installing cloudflared..."
  curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o /tmp/cloudflared.deb
  sudo dpkg -i /tmp/cloudflared.deb
fi

# Step 2: Authenticate (opens browser)
cloudflared tunnel login

# Step 3: Create the tunnel
cloudflared tunnel create your-game-tunnel
TUNNEL_ID=$(cloudflared tunnel list | grep your-game-tunnel | awk '{print $1}')

# Step 4: Route DNS
cloudflared tunnel route dns your-game-tunnel game-api.yourdomain.dev

# Step 5: Write config
cat > ~/.cloudflared/config.yml << EOF
tunnel: ${TUNNEL_ID}
credentials-file: /root/.cloudflared/${TUNNEL_ID}.json

ingress:
  - hostname: game-api.yourdomain.dev
    service: http://localhost:3002
    originRequest:
      noTLSVerify: true
  - service: http_status:404
EOF

# Step 6: Install as system service (survives reboots)
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared

echo "Tunnel running! Verify: curl https://game-api.yourdomain.dev/health"
```

### 6e. Vercel Configuration (`vercel.json`)

```json
{
  "buildCommand": "npm run build --workspace=packages/shared && npm run build --workspace=apps/web",
  "outputDirectory": "apps/web/.next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

**Vercel environment variable** (set in Vercel dashboard):
```
NEXT_PUBLIC_SERVER_URL=https://game-api.yourdomain.dev
```

### 6f. Complete First-Time Deploy Sequence

#### Server (on your VM/machine):
```bash
git clone https://github.com/you/your-game.git
cd your-game
chmod +x deploy-server.sh setup-cloudflare-tunnel.sh
./deploy-server.sh            # Build + start Docker container
./setup-cloudflare-tunnel.sh  # Expose to internet
curl https://game-api.yourdomain.dev/health  # Verify
```

#### Frontend (Vercel):
1. Link repo to Vercel (dashboard or `vercel link`)
2. Set env var: `NEXT_PUBLIC_SERVER_URL=https://game-api.yourdomain.dev`
3. Push to `master` — Vercel auto-builds and deploys

#### Ongoing Updates:
- **Server:** `git pull && docker compose -f apps/server/docker-compose.yml up -d --build`
- **Frontend:** Push to `master` (Vercel auto-deploys)

### 6g. Boot Persistence

| Component | Mechanism | Survives Reboot? |
|-----------|----------|-----------------|
| Docker container | `restart: unless-stopped` | Yes |
| Cloudflare Tunnel | systemd service | Yes |
| SQLite database | Docker volume mount | Yes |
| Vercel frontend | Hosted SaaS | Yes |

---

## 7. Critical Coupling Points

These values **must stay in sync** across the stack:

| Setting | Where It's Set | Must Match |
|---------|---------------|-----------|
| Server port | `docker-compose.yml` `PORT` env var | Dockerfile `EXPOSE`, docker-compose `ports`, Cloudflare tunnel `service` |
| CORS origin | `docker-compose.yml` `CORS_ORIGIN` | Exact Vercel deployment URL |
| Server URL | Vercel env var `NEXT_PUBLIC_SERVER_URL` | Cloudflare Tunnel hostname |
| Shared package | `packages/shared` | Must be built before both `apps/web` and `apps/server` |
| Event constants | `CLIENT_EVENTS` / `SERVER_EVENTS` | Used by both client and server — single source of truth in shared pkg |

---

## 8. Porting Checklist

### Phase 1: Scaffold

- [ ] Create monorepo with `package.json` workspaces (`apps/*`, `packages/*`)
- [ ] Create `packages/shared/` with `types.ts`, `events.ts`, `index.ts`
- [ ] Define your `Player`, `Team`, `Room`, `RoomConfig`, `GamePhase` types
- [ ] Define `CLIENT_EVENTS` and `SERVER_EVENTS` constants
- [ ] Create `apps/server/` with `package.json`, `tsconfig.json`
- [ ] Create `apps/web/` with Next.js 14 App Router setup
- [ ] Set up Tailwind CSS in `apps/web/`

### Phase 2: Backend Core

- [ ] Copy `apps/server/src/index.ts` (Express + Socket.IO entry point)
- [ ] Copy `apps/server/src/rooms.ts` (room create/join/rejoin/disconnect)
- [ ] Copy `apps/server/src/db.ts` (SQLite persistence with sql.js)
- [ ] Adapt game-specific event handlers for your new game
- [ ] Add `/health` endpoint

### Phase 3: Frontend Core

- [ ] Copy `apps/web/lib/socket.ts` (Socket.IO singleton)
- [ ] Copy `apps/web/lib/game-store.ts` (Zustand store — adapt state fields)
- [ ] Create landing page (`app/page.tsx`) with room code + name input
- [ ] Create host page (`app/host/page.tsx`) with room creation
- [ ] Create lobby page (`app/lobby/[roomCode]/page.tsx`) with join/rejoin logic
- [ ] Set up `next.config.mjs` with `transpilePackages`
- [ ] Create `.env.local` with `NEXT_PUBLIC_SERVER_URL`

### Phase 4: Deployment

- [ ] Copy `Dockerfile` and `docker-compose.yml` (update names, CORS origin)
- [ ] Copy `deploy-server.sh` (update port if needed)
- [ ] Copy `setup-cloudflare-tunnel.sh` (update hostname and tunnel name)
- [ ] Copy `vercel.json` (update workspace names)
- [ ] Deploy server to your machine and verify health endpoint
- [ ] Set up Cloudflare Tunnel and verify public access
- [ ] Deploy to Vercel with `NEXT_PUBLIC_SERVER_URL` env var
- [ ] Verify end-to-end: create room on Vercel → join on another device → see real-time updates

### Phase 5: Game Logic

- [ ] Implement your game-specific event handlers on the server
- [ ] Implement your game pages (`/game/[roomCode]`, etc.)
- [ ] Add game-specific types to the shared package
- [ ] Test the full game lifecycle

---

## Socket Event Quick Reference

### Client → Server

| Event | Payload | Ack Response | Handler |
|-------|---------|-------------|---------|
| `room:create` | `{ teamSize, turnTimer, ... }` | `{ success, roomCode?, room? }` | `rooms.ts` |
| `room:join` | `{ roomCode, playerName }` | `{ success, room?, playerId? }` | `rooms.ts` |
| `room:rejoin` | `{ roomCode, playerId }` | `{ success, room?, playerId? }` | `rooms.ts` |
| `game:start` | `null` | `{ success }` | game handler |

### Server → Client

| Event | Payload | When |
|-------|---------|------|
| `room:state` | Full `Room` object | Any room state change |
| `room:player-joined` | `{ player: { id, displayName, teamId } }` | New player joins |
| `room:player-left` | `{ playerId }` | Player disconnects |
| `room:error` | `{ message, code }` | Validation failure |
| `game:started` | `GameState` | Host starts the game |
| `game:ended` | `GameResults` | Game completes |

### Error Codes

| Code | Meaning |
|------|---------|
| `ROOM_NOT_FOUND` | Room code doesn't exist |
| `GAME_IN_PROGRESS` | Can't join after game started |
| `TEAMS_FULL` | All teams at max capacity |

---

## State Architecture Summary

```
┌─ In-Memory (rooms Map) ─────────────────────────┐
│  Single source of truth during gameplay           │
│  Rooms never evicted (no TTL)                     │
│  Server restart = all in-progress games lost      │
│  Players marked disconnected, never removed       │
└──────────────────────────────────────────────────┘

┌─ SQLite (sql.js WASM) ──────────────────────────┐
│  Write-only during gameplay                       │
│  Stores game history for post-game analytics      │
│  Persisted to disk via Docker volume mount        │
│  Never read for game logic decisions              │
└──────────────────────────────────────────────────┘

┌─ Zustand (client) ──────────────────────────────┐
│  Mirrors server state via ROOM_STATE events       │
│  setRoom() is the primary sync action             │
│  reset() + disconnectSocket() between games       │
│  No localStorage persistence (by design)          │
└──────────────────────────────────────────────────┘
```

---

## Reconnection Flow

```
1. Socket disconnects (network drop, sleep, etc.)
2. socket.io-client auto-reconnects (up to 10 attempts, 1-5s backoff)
3. On reconnect, client emits ROOM_REJOIN { roomCode, playerId }
4. Server remaps old socket ID → new socket ID across:
   - room.players dictionary
   - room.hostId (if host)
   - team.members array
   - gameState.currentTurn.activePlayerIds (if in game)
5. Server broadcasts updated ROOM_STATE to all clients
6. Client continues seamlessly
```
