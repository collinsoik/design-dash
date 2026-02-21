// ==========================================
// Core Game Types for DesignDash
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

export interface SectionSlot {
  id: string;
  label: string;
  assignedTo: string | null; // playerId
  turnOrder: number;
  placedComponent: PlacedComponent | null;
  status: "empty" | "placed" | "locked";
}

export interface PlacedComponent {
  registryId: string;
  customizations?: Record<string, string>;
}

export interface WebsiteState {
  sections: SectionSlot[];
}

export interface CaseStudy {
  id: string;
  businessName: string;
  businessType: string;
  story: string;
  brokenSections: SectionSlot[];
  idealCategories: Record<string, string[]>;
  scoringCriteria: string[];
}

export interface RoomConfig {
  teamSize: number;
  turnTimer: number; // seconds
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

export interface GameState {
  caseStudy: CaseStudy;
  teamWebsites: Record<string, WebsiteState>; // teamId -> website
  currentTurn: TurnState;
  totalTurns: number;
}

export interface TurnState {
  turnNumber: number;
  activePlayerIds: Record<string, string>; // teamId -> playerId
  timeRemaining: number;
  assignedSlots: Record<string, string[]>; // playerId -> slotIds
}

export interface BrainstormMessage {
  id: string;
  playerId: string;
  playerName: string;
  teamId: string;
  text: string;
  timestamp: number;
}

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
  bestSections: BestSectionAward[];
}

export interface TeamResult {
  teamId: string;
  teamName: string;
  peerScore: number;
  judgeScore: number;
  finalScore: number;
  rank: number;
}

export interface BestSectionAward {
  sectionLabel: string;
  teamId: string;
  teamName: string;
  componentId: string;
}

// Component Registry Types
export interface ComponentEntry {
  id: string;
  name: string;
  category: ComponentCategory;
  preview: string; // path to PNG
  jsx: string; // path to JSX file
}

export type ComponentCategory =
  | "headers"
  | "hero_sections"
  | "feature_sections"
  | "content_sections"
  | "cta_sections"
  | "pricing_sections"
  | "testimonials"
  | "team_sections"
  | "stats_sections"
  | "contact_sections"
  | "newsletter_sections"
  | "blog_sections"
  | "footers"
  | "logo_clouds"
  | "faqs"
  | "banners"
  | "bento_grids"
  | "about_pages"
  | "404_pages"
  | "flyout_menus"
  | "header_sections"
  | "landing_pages"
  | "pricing_pages";

// Team color presets
export const TEAM_COLORS = [
  "#e94560", // Red
  "#0f3460", // Blue
  "#16c79a", // Green
  "#f5c518", // Yellow
  "#9b59b6", // Purple
  "#e67e22", // Orange
  "#1abc9c", // Teal
  "#e74c3c", // Crimson
] as const;

export const TEAM_NAMES = [
  "Pixel Pirates",
  "Code Wizards",
  "Design Dragons",
  "Layout Legends",
  "CSS Samurai",
  "HTML Heroes",
  "UX Unicorns",
  "Grid Guardians",
] as const;
