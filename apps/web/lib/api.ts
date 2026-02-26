import type {
  GamePublic,
  SubmittedDecision,
  DesignsResponse,
  CreateGameResponse,
  SubmitDesignResponse,
  TeamVotes,
  VoteResponse,
} from "@design-dash/shared";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:3001";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data as T;
}

export function createGame() {
  return request<CreateGameResponse>("/api/games", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export function getGame(code: string) {
  return request<GamePublic>(`/api/games/${code}`);
}

export function advanceGame(code: string, adminToken: string) {
  return request<GamePublic>(`/api/games/${code}/advance`, {
    method: "POST",
    body: JSON.stringify({ adminToken }),
  });
}

export function goBackGame(code: string, adminToken: string) {
  return request<GamePublic>(`/api/games/${code}/go-back`, {
    method: "POST",
    body: JSON.stringify({ adminToken }),
  });
}

export function submitDesign(
  code: string,
  caseStudyId: string,
  decisions: SubmittedDecision[],
  teamName?: string
) {
  return request<SubmitDesignResponse>(`/api/games/${code}/submit`, {
    method: "POST",
    body: JSON.stringify({ caseStudyId, decisions, ...(teamName ? { teamName } : {}) }),
  });
}

export function getDesigns(code: string) {
  return request<DesignsResponse>(`/api/games/${code}/designs`);
}

export function submitVote(code: string, voterTeam: string, votes: TeamVotes) {
  return request<VoteResponse>(`/api/games/${code}/vote`, {
    method: "POST",
    body: JSON.stringify({ voterTeam, votes }),
  });
}
