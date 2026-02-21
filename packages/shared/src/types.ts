// ==========================================
// Core Game Types for DesignDash
// Product Design Decision Game
// ==========================================

export interface Player {
  id: string;
  displayName: string;
  teamId: string | null;
  isHost: boolean;
  connected: boolean;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  members: string[]; // player IDs
  peerScore: number;
  judgeScore: number;
  finalScore: number;
}

// ── Decision Types ──────────────────────────

export type DecisionType = "multiple_choice" | "tradeoff_slider" | "branching_path";

export interface ChoiceOption {
  id: string;
  label: string;
  description: string;
}

export interface TradeoffConfig {
  leftLabel: string;
  rightLabel: string;
  leftDescription: string;
  rightDescription: string;
}

export interface BranchOption {
  id: string;
  label: string;
  description: string;
  followUp: {
    scenarioText: string;
    choices: ChoiceOption[];
  };
}

export interface DecisionPoint {
  id: string;
  order: number;
  round: number;
  type: DecisionType;
  scenarioText: string;
  context?: string;
  choices?: ChoiceOption[];       // for multiple_choice
  tradeoff?: TradeoffConfig;      // for tradeoff_slider
  branches?: BranchOption[];      // for branching_path
}

export interface UserPersona {
  name: string;
  age: number;
  occupation: string;
  bio: string;
  goals: string[];
}

export interface CaseStudy {
  id: string;
  productName: string;
  productType: string;
  shortDescription: string;
  story: string;
  persona: UserPersona;
  decisions: DecisionPoint[];
  scoringCriteria: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  learningObjectives: string[];
  designTips: Record<string, string>;
  whatsBroken: string[];
  successHints: string[];
  funFact: string;
}

// ── Game State ──────────────────────────────

export interface RoomConfig {
  teamSize: number;
  turnTimer: number; // seconds per round
  caseStudyId: string;
  peerVoteWeight: number; // 0-100, percentage
  judgeWeight: number; // 0-100, percentage
}

export interface Room {
  code: string;
  hostId: string;
  config: RoomConfig;
  players: Record<string, Player>;
  teams: Record<string, Team>;
  phase: GamePhase;
  gameState: GameState | null;
  createdAt: number;
}

export type GamePhase = "lobby" | "playing" | "voting" | "results";

export interface PlayerDecision {
  decisionPointId: string;
  type: DecisionType;
  choiceId?: string;        // for multiple_choice
  sliderValue?: number;     // for tradeoff_slider (0-100)
  branchId?: string;        // for branching_path
  followUpChoiceId?: string; // for branching_path follow-up
  submittedAt: number;
}

export interface TeamDecisionState {
  decisions: Record<string, PlayerDecision>; // decisionPointId -> decision
}

export interface GameState {
  caseStudy: CaseStudy;
  teamDecisions: Record<string, TeamDecisionState>; // teamId -> decisions
  currentTurn: TurnState;
  totalRounds: number;
}

export interface TurnState {
  round: number;
  activePlayerIds: Record<string, string>; // teamId -> playerId
  timeRemaining: number;
  submittedTeams: string[]; // teamIds that have submitted this round
}

export interface BrainstormMessage {
  id: string;
  playerId: string;
  playerName: string;
  teamId: string;
  text: string;
  timestamp: number;
}

// ── Voting & Results ────────────────────────

export interface Vote {
  voterId: string;
  teamId: string;
  rating: number; // 1-5
}

export interface JudgeScore {
  teamId: string;
  score: number; // 1-10
  notes?: string;
}

export interface GameResults {
  teams: TeamResult[];
  bestDecisions: BestDecisionAward[];
}

export interface TeamResult {
  teamId: string;
  teamName: string;
  peerScore: number;
  judgeScore: number;
  finalScore: number;
  rank: number;
}

export interface BestDecisionAward {
  decisionLabel: string;
  teamId: string;
  teamName: string;
}

// ── Constants ───────────────────────────────

export const TEAM_COLORS = [
  "#E5484D", // Red
  "#3E63DD", // Blue
  "#30A46C", // Green
  "#F5D90A", // Yellow
  "#8E4EC6", // Purple
  "#F76808", // Orange
  "#12A594", // Teal
  "#E54666", // Rose
] as const;

export const TEAM_NAMES = [
  "Studio Red",
  "Studio Blue",
  "Studio Green",
  "Studio Gold",
  "Studio Violet",
  "Studio Ember",
  "Studio Teal",
  "Studio Rose",
] as const;
