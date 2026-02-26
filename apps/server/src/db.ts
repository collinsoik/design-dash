import initSqlJs, { Database } from "sql.js";
import fs from "fs";
import path from "path";
import { RestGame, Submission } from "@design-dash/shared";

const DB_PATH =
  process.env.DB_PATH || path.join(__dirname, "..", "data", "designdash.db");

let db: Database;

export async function initDb(): Promise<void> {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Drop legacy tables from the old Socket.IO-based schema
  db.run("DROP TABLE IF EXISTS decisions");
  db.run("DROP TABLE IF EXISTS players");
  db.run("DROP TABLE IF EXISTS teams");
  db.run("DROP TABLE IF EXISTS games");

  // New schema
  db.run(`
    CREATE TABLE IF NOT EXISTS rest_games (
      code TEXT PRIMARY KEY,
      admin_token TEXT NOT NULL,
      case_study_id TEXT NOT NULL,
      current_round INTEGER DEFAULT 0,
      total_rounds INTEGER NOT NULL,
      phase TEXT DEFAULT 'presenting',
      created_at INTEGER NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS rest_submissions (
      game_code TEXT NOT NULL,
      team_key TEXT NOT NULL,
      team_name TEXT NOT NULL,
      decisions_json TEXT NOT NULL,
      submitted_at INTEGER NOT NULL,
      PRIMARY KEY (game_code, team_key)
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

/** Load all games (with their submissions) from the database. */
export function loadGames(): RestGame[] {
  const results: RestGame[] = [];

  try {
    const gameRows = db.exec(
      "SELECT code, admin_token, case_study_id, current_round, total_rounds, phase, created_at FROM rest_games"
    );
    if (gameRows.length === 0) return results;

    // Load all submissions and group by game_code
    const submissionsByGame = new Map<string, Array<{ teamKey: string; teamName: string; decisionsJson: string; submittedAt: number }>>();
    const subRows = db.exec(
      "SELECT game_code, team_key, team_name, decisions_json, submitted_at FROM rest_submissions"
    );
    if (subRows.length > 0) {
      for (const row of subRows[0].values) {
        const [gameCode, teamKey, teamName, decisionsJson, submittedAt] = row as [string, string, string, string, number];
        if (!submissionsByGame.has(gameCode)) {
          submissionsByGame.set(gameCode, []);
        }
        submissionsByGame.get(gameCode)!.push({ teamKey, teamName, decisionsJson, submittedAt });
      }
    }

    for (const row of gameRows[0].values) {
      const [code, adminToken, caseStudyId, currentRound, totalRounds, phase, createdAt] = row;

      const game: RestGame = {
        code: code as string,
        adminToken: adminToken as string,
        caseStudyId: caseStudyId as string,
        currentRound: currentRound as number,
        totalRounds: totalRounds as number,
        phase: phase as RestGame["phase"],
        submissions: {},
        createdAt: createdAt as number,
      };

      // Attach submissions
      const subs = submissionsByGame.get(code as string) || [];
      for (const sub of subs) {
        game.submissions[sub.teamKey] = {
          teamName: sub.teamName,
          decisions: JSON.parse(sub.decisionsJson),
          submittedAt: sub.submittedAt,
        };
      }

      results.push(game);
    }
  } catch (err) {
    console.error("Failed to load games from database:", err);
  }

  return results;
}

export function saveGame(game: RestGame): void {
  try {
    db.run(
      `INSERT OR REPLACE INTO rest_games
        (code, admin_token, case_study_id, current_round, total_rounds, phase, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [game.code, game.adminToken, game.caseStudyId, game.currentRound, game.totalRounds, game.phase, game.createdAt]
    );
    persistDb();
  } catch (err) {
    console.error("Failed to save game:", err);
  }
}

export function saveSubmission(gameCode: string, submission: Submission): void {
  try {
    const teamKey = submission.teamName.trim().toLowerCase();
    db.run(
      `INSERT OR REPLACE INTO rest_submissions
        (game_code, team_key, team_name, decisions_json, submitted_at)
       VALUES (?, ?, ?, ?, ?)`,
      [gameCode, teamKey, submission.teamName, JSON.stringify(submission.decisions), submission.submittedAt]
    );
    persistDb();
  } catch (err) {
    console.error("Failed to save submission:", err);
  }
}
