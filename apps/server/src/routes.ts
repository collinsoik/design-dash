import { Router } from "express";
import crypto from "crypto";
import {
  CASE_STUDIES,
  RestGame,
  GamePublic,
  Submission,
  CaseStudy,
} from "@design-dash/shared";
import { saveGame, saveSubmission, loadGames } from "./db";

const router = Router();

// In-memory game store, backed by SQLite for persistence across restarts
const games = new Map<string, RestGame>();

function generateCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function generateAdminToken(): string {
  return crypto.randomBytes(16).toString("hex");
}

function getUniqueCode(): string {
  let code: string;
  do {
    code = generateCode();
  } while (games.has(code));
  return code;
}

function getTotalRounds(caseStudy: CaseStudy): number {
  const rounds = new Set(caseStudy.decisions.map((d) => d.round));
  return rounds.size;
}

function toPublic(game: RestGame): GamePublic {
  return {
    code: game.code,
    caseStudyId: game.caseStudyId,
    currentRound: game.currentRound,
    totalRounds: game.totalRounds,
    phase: game.phase,
    submittedTeams: Object.values(game.submissions).map((s) => s.teamName),
    createdAt: game.createdAt,
  };
}

/** Populate in-memory map from DB on startup */
export function loadPersistedGames(): void {
  for (const game of loadGames()) {
    games.set(game.code, game);
  }
  if (games.size > 0) {
    console.log(`Loaded ${games.size} game(s) from database`);
  }
}

// ─── POST /api/games ─────────────────────────
// Presenter creates a new game session.
router.post("/games", (req, res) => {
  const { caseStudyId } = req.body;

  if (!caseStudyId) {
    res.status(400).json({ error: "caseStudyId is required" });
    return;
  }

  const caseStudy = CASE_STUDIES.find((cs) => cs.id === caseStudyId);
  if (!caseStudy) {
    res.status(400).json({ error: "Invalid case study" });
    return;
  }

  const code = getUniqueCode();
  const adminToken = generateAdminToken();
  const totalRounds = getTotalRounds(caseStudy);

  const game: RestGame = {
    code,
    adminToken,
    caseStudyId,
    currentRound: 0,
    totalRounds,
    phase: "presenting",
    submissions: {},
    createdAt: Date.now(),
  };

  games.set(code, game);
  saveGame(game);

  res.json({ code, adminToken });
});

// ─── GET /api/games/:code ────────────────────
// Anyone can poll game state (phase, round, who submitted).
router.get("/games/:code", (req, res) => {
  const game = games.get(req.params.code);
  if (!game) {
    res.status(404).json({ error: "Game not found" });
    return;
  }

  res.json(toPublic(game));
});

// ─── POST /api/games/:code/advance ───────────
// Presenter advances round (or transitions phase).
//   presenting: round++ until last round, then → submission
//   submission: → gallery
router.post("/games/:code/advance", (req, res) => {
  const game = games.get(req.params.code);
  if (!game) {
    res.status(404).json({ error: "Game not found" });
    return;
  }

  const { adminToken } = req.body;
  if (adminToken !== game.adminToken) {
    res.status(403).json({ error: "Invalid admin token" });
    return;
  }

  if (game.phase === "presenting") {
    if (game.currentRound < game.totalRounds - 1) {
      game.currentRound++;
    } else {
      game.phase = "submission";
    }
  } else if (game.phase === "submission") {
    game.phase = "gallery";
  }

  saveGame(game);
  res.json(toPublic(game));
});

// ─── POST /api/games/:code/go-back ───────────
// Presenter goes back to the previous round.
router.post("/games/:code/go-back", (req, res) => {
  const game = games.get(req.params.code);
  if (!game) {
    res.status(404).json({ error: "Game not found" });
    return;
  }

  const { adminToken } = req.body;
  if (adminToken !== game.adminToken) {
    res.status(403).json({ error: "Invalid admin token" });
    return;
  }

  if (game.phase === "presenting" && game.currentRound > 0) {
    game.currentRound--;
  } else if (game.phase === "submission") {
    // Go back to the last round of presenting
    game.phase = "presenting";
  } else {
    res.status(400).json({ error: "Cannot go back further" });
    return;
  }

  saveGame(game);
  res.json(toPublic(game));
});

// ─── POST /api/games/:code/submit ────────────
// Team submits their design decisions.
// Idempotent: same team name overwrites previous submission (safe to retry).
router.post("/games/:code/submit", (req, res) => {
  const game = games.get(req.params.code);
  if (!game) {
    res.status(404).json({ error: "Game not found" });
    return;
  }

  if (game.phase !== "submission") {
    res.status(400).json({ error: "Game is not accepting submissions" });
    return;
  }

  const { teamName, decisions } = req.body;

  if (!teamName || typeof teamName !== "string" || teamName.trim().length === 0) {
    res.status(400).json({ error: "Team name is required" });
    return;
  }

  if (!Array.isArray(decisions) || decisions.length === 0) {
    res.status(400).json({ error: "At least one decision is required" });
    return;
  }

  // Validate decision point IDs exist in the case study
  const caseStudy = CASE_STUDIES.find((cs) => cs.id === game.caseStudyId);
  if (!caseStudy) {
    res.status(500).json({ error: "Case study not found" });
    return;
  }

  const validIds = new Set(caseStudy.decisions.map((d) => d.id));
  for (const d of decisions) {
    if (!d.decisionPointId || !validIds.has(d.decisionPointId)) {
      res.status(400).json({ error: `Invalid decision point: ${d.decisionPointId}` });
      return;
    }
  }

  const key = teamName.trim().toLowerCase();
  const submission: Submission = {
    teamName: teamName.trim(),
    decisions,
    submittedAt: Date.now(),
  };

  game.submissions[key] = submission;
  saveGame(game);
  saveSubmission(game.code, submission);

  res.json({ success: true, teamName: submission.teamName });
});

// ─── GET /api/games/:code/designs ────────────
// View all submitted designs (available in submission + gallery phases).
router.get("/games/:code/designs", (req, res) => {
  const game = games.get(req.params.code);
  if (!game) {
    res.status(404).json({ error: "Game not found" });
    return;
  }

  if (game.phase === "presenting") {
    res.status(400).json({ error: "Designs are not available yet" });
    return;
  }

  const caseStudy = CASE_STUDIES.find((cs) => cs.id === game.caseStudyId);

  res.json({
    caseStudy,
    submissions: Object.values(game.submissions),
    phase: game.phase,
  });
});

export { router, games };
