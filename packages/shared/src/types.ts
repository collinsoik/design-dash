// ==========================================
// Core Game Types for DesignDash
// Product Design Decision Game
// ==========================================

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
  points: [string, string, string, string, string]; // descriptions for 0, 25, 50, 75, 100
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

export interface PlayerDecision {
  decisionPointId: string;
  type: DecisionType;
  choiceId?: string;        // for multiple_choice
  sliderValue?: number;     // for tradeoff_slider (0-100)
  branchId?: string;        // for branching_path
  followUpChoiceId?: string; // for branching_path follow-up
  submittedAt: number;
}

// ── REST API Game Model ─────────────────────
// Self-paced, presenter-driven game with offline team submissions.
// No persistent connections — all operations are idempotent REST calls.

export type RestGamePhase = "presenting" | "submission" | "gallery";

export interface RestGame {
  code: string;
  adminToken: string;
  caseStudyId: string;
  currentRound: number;
  totalRounds: number;
  phase: RestGamePhase;
  submissions: Record<string, Submission>; // teamKey (lowercase name) → submission
  createdAt: number;
}

/** Public view of a game (omits adminToken) */
export interface GamePublic {
  code: string;
  caseStudyId: string;
  currentRound: number;
  totalRounds: number;
  phase: RestGamePhase;
  submittedTeams: string[]; // display names of teams that have submitted
  createdAt: number;
}

export interface Submission {
  teamName: string;
  decisions: SubmittedDecision[];
  submittedAt: number;
}

export interface SubmittedDecision {
  decisionPointId: string;
  choiceId?: string;
  sliderValue?: number;
  branchId?: string;
  followUpChoiceId?: string;
}

// ── REST API Request / Response Types ───────

export interface CreateGameRequest {
  caseStudyId: string;
}

export interface CreateGameResponse {
  code: string;
  adminToken: string;
}

export interface AdvanceRequest {
  adminToken: string;
}

export interface SubmitDesignRequest {
  teamName: string;
  decisions: SubmittedDecision[];
}

export interface SubmitDesignResponse {
  success: boolean;
  teamName: string;
}

export interface DesignsResponse {
  caseStudy: CaseStudy;
  submissions: Submission[];
  phase: RestGamePhase;
}

export interface ApiError {
  error: string;
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
  "#0091FF", // Sky
  "#AB4ABA", // Plum
  "#D6409F", // Pink
  "#FFB224", // Amber
  "#7CE2FE", // Cyan
  "#3D9970", // Moss
  "#6E56CF", // Iris
  "#E93D82", // Crimson
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
  "Studio Sky",
  "Studio Plum",
  "Studio Pink",
  "Studio Amber",
  "Studio Cyan",
  "Studio Moss",
  "Studio Iris",
  "Studio Crimson",
] as const;
