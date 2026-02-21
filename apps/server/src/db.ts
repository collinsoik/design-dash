import initSqlJs, { Database } from "sql.js";
import fs from "fs";
import path from "path";
import { Room, GameResults } from "@design-dash/shared";

const DB_PATH =
  process.env.DB_PATH || path.join(__dirname, "..", "data", "designdash.db");

let db: Database;

export async function initDb(): Promise<void> {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const SQL = await initSqlJs();

  // Load existing database if it exists
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      room_code TEXT,
      case_study_id TEXT,
      team_size INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ended_at DATETIME
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      game_id TEXT REFERENCES games(id),
      name TEXT,
      peer_score REAL DEFAULT 0,
      judge_score REAL DEFAULT 0,
      final_score REAL DEFAULT 0
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      game_id TEXT REFERENCES games(id),
      team_id TEXT REFERENCES teams(id),
      display_name TEXT
    );
  `);

  persistDb();
}

function persistDb(): void {
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  } catch (err) {
    console.error("Failed to persist database:", err);
  }
}

export function saveGame(room: Room): void {
  const gameId = `game-${room.code}-${Date.now()}`;

  db.run(
    "INSERT INTO games (id, room_code, case_study_id, team_size, created_at) VALUES (?, ?, ?, ?, ?)",
    [gameId, room.code, room.config.caseStudyId, room.config.teamSize, new Date().toISOString()]
  );

  for (const team of Object.values(room.teams)) {
    if (team.members.length === 0) continue;
    db.run(
      "INSERT INTO teams (id, game_id, name) VALUES (?, ?, ?)",
      [`${gameId}-${team.id}`, gameId, team.name]
    );

    for (const memberId of team.members) {
      const player = room.players[memberId];
      if (player) {
        db.run(
          "INSERT INTO players (id, game_id, team_id, display_name) VALUES (?, ?, ?, ?)",
          [`${gameId}-${memberId}`, gameId, `${gameId}-${team.id}`, player.displayName]
        );
      }
    }
  }

  persistDb();
}

export function updateGameResults(room: Room, results: GameResults): void {
  for (const teamResult of results.teams) {
    db.run(
      "UPDATE teams SET peer_score = ?, judge_score = ?, final_score = ? WHERE game_id LIKE ? AND name = ?",
      [teamResult.peerScore, teamResult.judgeScore, teamResult.finalScore, `game-${room.code}-%`, teamResult.teamName]
    );
  }

  db.run(
    "UPDATE games SET ended_at = ? WHERE room_code = ? AND ended_at IS NULL",
    [new Date().toISOString(), room.code]
  );

  persistDb();
}

export function getDb(): Database {
  return db;
}
