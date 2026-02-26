import { Router } from "express";
import crypto from "crypto";
import {
  CASE_STUDIES,
  AWARD_CATEGORIES,
  TEAM_NAMES,
  RestGame,
  GamePublic,
  Submission,
  CaseStudy,
  AwardResult,
  TeamVotes,
} from "@design-dash/shared";
import { saveGame, saveSubmission, saveVote, loadGames } from "./db";

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
  // Build voted team display names from vote keys + submissions
  const votedTeams: string[] = [];
  for (const voterKey of Object.keys(game.votes)) {
    const sub = game.submissions[voterKey];
    votedTeams.push(sub ? sub.teamName : voterKey);
  }

  return {
    code: game.code,
    caseStudyId: game.caseStudyId,
    currentRound: game.currentRound,
    totalRounds: game.totalRounds,
    phase: game.phase,
    submittedTeams: Object.values(game.submissions).map((s) => s.teamName),
    votedTeams,
    createdAt: game.createdAt,
  };
}

function computeAwards(game: RestGame): AwardResult[] {
  const results: AwardResult[] = [];
  const allVotes = Object.values(game.votes);

  for (const cat of AWARD_CATEGORIES) {
    // Count votes per team for this category
    const tally = new Map<string, number>();
    for (const v of allVotes) {
      const teamName = v[cat.id];
      if (teamName) {
        tally.set(teamName, (tally.get(teamName) || 0) + 1);
      }
    }

    // Find winner (most votes, alphabetical tie-break)
    let winnerTeam = "";
    let winnerVotes = 0;
    for (const [team, count] of tally.entries()) {
      if (count > winnerVotes || (count === winnerVotes && team < winnerTeam)) {
        winnerTeam = team;
        winnerVotes = count;
      }
    }

    results.push({
      categoryId: cat.id,
      categoryName: cat.name,
      winnerTeam: winnerTeam || "No votes",
      winnerVotes,
      totalVotes: allVotes.length,
    });
  }

  return results;
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
  const { caseStudyId: requestedId } = req.body;
  const caseStudyId = requestedId || "all";

  let totalRounds = 5; // default for "all" games
  if (caseStudyId !== "all") {
    const caseStudy = CASE_STUDIES.find((cs) => cs.id === caseStudyId);
    if (!caseStudy) {
      res.status(400).json({ error: "Invalid case study" });
      return;
    }
    totalRounds = getTotalRounds(caseStudy);
  }

  const code = getUniqueCode();
  const adminToken = generateAdminToken();

  const game: RestGame = {
    code,
    adminToken,
    caseStudyId,
    currentRound: 0,
    totalRounds,
    phase: "presenting",
    submissions: {},
    votes: {},
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
  } else if (game.phase === "gallery") {
    game.phase = "voting";
  } else if (game.phase === "voting") {
    game.phase = "awards";
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
  } else if (game.phase === "voting") {
    game.phase = "gallery";
  } else {
    res.status(400).json({ error: "Cannot go back further" });
    return;
  }

  saveGame(game);
  res.json(toPublic(game));
});

// ─── POST /api/games/:code/submit ────────────
// Team submits their design decisions.
// Auto-assigns a studio name. If client sends teamName (retry), reuse it.
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

  const { teamName: clientTeamName, caseStudyId: submissionCaseStudyId, decisions } = req.body;

  if (!submissionCaseStudyId || typeof submissionCaseStudyId !== "string") {
    res.status(400).json({ error: "caseStudyId is required" });
    return;
  }

  if (!Array.isArray(decisions) || decisions.length === 0) {
    res.status(400).json({ error: "At least one decision is required" });
    return;
  }

  // Validate decision point IDs exist in the submitted case study
  const caseStudy = CASE_STUDIES.find((cs) => cs.id === submissionCaseStudyId);
  if (!caseStudy) {
    res.status(400).json({ error: "Invalid case study" });
    return;
  }

  const validIds = new Set(caseStudy.decisions.map((d) => d.id));
  for (const d of decisions) {
    if (!d.decisionPointId || !validIds.has(d.decisionPointId)) {
      res.status(400).json({ error: `Invalid decision point: ${d.decisionPointId}` });
      return;
    }
  }

  // Auto-assign team name or reuse client-provided name (retry)
  let assignedName: string;
  if (clientTeamName && typeof clientTeamName === "string" && clientTeamName.trim().length > 0) {
    // Retry: reuse the previously assigned name
    assignedName = clientTeamName.trim();
  } else {
    // New submission: auto-assign from TEAM_NAMES
    const submissionCount = Object.keys(game.submissions).length;
    assignedName = TEAM_NAMES[submissionCount % TEAM_NAMES.length];
  }

  const key = assignedName.toLowerCase();
  const submission: Submission = {
    teamName: assignedName,
    caseStudyId: submissionCaseStudyId,
    decisions,
    submittedAt: Date.now(),
  };

  game.submissions[key] = submission;
  saveGame(game);
  saveSubmission(game.code, submission);

  res.json({ success: true, teamName: submission.teamName });
});

// ─── POST /api/games/:code/vote ─────────────
// Team submits their votes for awards.
// Idempotent: same voter overwrites previous votes.
router.post("/games/:code/vote", (req, res) => {
  const game = games.get(req.params.code);
  if (!game) {
    res.status(404).json({ error: "Game not found" });
    return;
  }

  if (game.phase !== "voting") {
    res.status(400).json({ error: "Voting is not open" });
    return;
  }

  const { voterTeam, votes } = req.body;

  if (!voterTeam || typeof voterTeam !== "string" || voterTeam.trim().length === 0) {
    res.status(400).json({ error: "Voter team name is required" });
    return;
  }

  if (!votes || typeof votes !== "object") {
    res.status(400).json({ error: "Votes are required" });
    return;
  }

  const voterKey = voterTeam.trim().toLowerCase();

  // Voter must be a submitted team
  if (!game.submissions[voterKey]) {
    res.status(400).json({ error: "Only submitted teams can vote" });
    return;
  }

  // Validate each vote: must be for a valid submitted team, not self
  const validTeamKeys = new Set(Object.keys(game.submissions));
  const validCategoryIds = new Set<string>(AWARD_CATEGORIES.map((c) => c.id));
  const cleanVotes: TeamVotes = {};

  for (const [categoryId, teamName] of Object.entries(votes)) {
    if (!validCategoryIds.has(categoryId)) continue;
    if (typeof teamName !== "string") continue;

    const votedKey = teamName.trim().toLowerCase();
    if (!validTeamKeys.has(votedKey)) {
      res.status(400).json({ error: `Invalid team: ${teamName}` });
      return;
    }
    if (votedKey === voterKey) {
      res.status(400).json({ error: "You cannot vote for your own team" });
      return;
    }

    cleanVotes[categoryId] = game.submissions[votedKey].teamName;
  }

  // Must vote for all 3 categories
  if (Object.keys(cleanVotes).length !== AWARD_CATEGORIES.length) {
    res.status(400).json({ error: "Please vote in all categories" });
    return;
  }

  game.votes[voterKey] = cleanVotes;
  saveGame(game);
  saveVote(game.code, voterTeam.trim(), cleanVotes);

  res.json({ success: true, voterTeam: voterTeam.trim() });
});

// ─── GET /api/games/:code/designs ────────────
// View all submitted designs (available after presenting phase).
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

  const caseStudy = game.caseStudyId === "all"
    ? null
    : CASE_STUDIES.find((cs) => cs.id === game.caseStudyId) || null;

  // Build voted team names
  const votedTeams: string[] = [];
  for (const voterKey of Object.keys(game.votes)) {
    const sub = game.submissions[voterKey];
    votedTeams.push(sub ? sub.teamName : voterKey);
  }

  res.json({
    caseStudy,
    submissions: Object.values(game.submissions),
    phase: game.phase,
    votedTeams,
    awards: game.phase === "awards" ? computeAwards(game) : [],
  });
});

export { router, games };
