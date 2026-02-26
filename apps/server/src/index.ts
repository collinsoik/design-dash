import express from "express";
import { initDb } from "./db";
import { router, loadPersistedGames } from "./routes";

const app = express();

const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
const allowedOrigins = CORS_ORIGIN.split(",").map((s) => s.trim());

// CORS middleware (no extra dependency needed)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// REST API
app.use("/api", router);

const PORT = process.env.PORT || 3001;

async function start() {
  await initDb();
  loadPersistedGames();
  app.listen(PORT, () => {
    console.log(`DesignDash API server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
