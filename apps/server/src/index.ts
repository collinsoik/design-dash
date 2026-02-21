import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { handleRoomEvents } from "./rooms";
import { handleTurnEvents } from "./turns";
import { handleVotingEvents } from "./voting";
import { initDb } from "./db";

const app = express();
const httpServer = createServer(app);

const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
// Support comma-separated origins for multiple Vercel preview URLs
const allowedOrigins = CORS_ORIGIN.split(",").map((s) => s.trim());

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
    methods: ["GET", "POST"],
  },
});

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  handleRoomEvents(io, socket);
  handleTurnEvents(io, socket);
  handleVotingEvents(io, socket);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;

async function start() {
  await initDb();
  httpServer.listen(PORT, () => {
    console.log(`DesignDash game server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

export { io };
