import { Server, Socket } from "socket.io";
import {
  CLIENT_EVENTS,
  SERVER_EVENTS,
  VoteSubmitPayload,
  JudgeScorePayload,
} from "@design-dash/shared";
import {
  Vote,
  JudgeScore,
  GameResults,
  TeamResult,
  BestSectionAward,
} from "@design-dash/shared";
import { getRoom } from "./rooms";
import { updateGameResults } from "./db";

// Store votes per room
const roomVotes = new Map<string, Vote[]>();
const roomJudgeScores = new Map<string, JudgeScore[]>();

function calculateResults(roomCode: string): GameResults | null {
  const room = getRoom(roomCode);
  if (!room || !room.gameState) return null;

  const votes = roomVotes.get(roomCode) || [];
  const judgeScores = roomJudgeScores.get(roomCode) || [];

  const teamResults: TeamResult[] = [];

  // Get active teams (teams with members)
  const activeTeams = Object.values(room.teams).filter(
    (t) => t.members.length > 0
  );

  for (const team of activeTeams) {
    // Calculate peer score (average of ratings, scaled to 0-10)
    const teamVotes = votes.filter((v) => v.teamId === team.id);
    const peerAvg =
      teamVotes.length > 0
        ? teamVotes.reduce((sum, v) => sum + v.rating, 0) / teamVotes.length
        : 0;
    const peerScore = (peerAvg / 5) * 10; // Scale 1-5 rating to 0-10

    // Get judge score
    const judgeEntry = judgeScores.find((j) => j.teamId === team.id);
    const judgeScore = judgeEntry?.score || 0;

    // Calculate final score
    const peerWeight = room.config.peerVoteWeight / 100;
    const judgeWeight = room.config.judgeWeight / 100;
    const finalScore = peerScore * peerWeight + judgeScore * judgeWeight;

    team.peerScore = peerScore;
    team.judgeScore = judgeScore;
    team.finalScore = finalScore;

    teamResults.push({
      teamId: team.id,
      teamName: team.name,
      peerScore,
      judgeScore,
      finalScore,
      rank: 0, // Set after sorting
    });
  }

  // Sort by final score descending and assign ranks
  teamResults.sort((a, b) => b.finalScore - a.finalScore);
  teamResults.forEach((t, i) => {
    t.rank = i + 1;
  });

  // Determine best section awards
  const bestSections: BestSectionAward[] = [];
  if (room.gameState.caseStudy) {
    for (const sectionDef of room.gameState.caseStudy.brokenSections) {
      // For now, award to the team ranked first (can be expanded later)
      if (teamResults.length > 0) {
        const topTeam = teamResults[0];
        const website = room.gameState.teamWebsites[topTeam.teamId];
        const section = website?.sections.find(
          (s) => s.id === sectionDef.id
        );
        if (section?.placedComponent) {
          bestSections.push({
            sectionLabel: sectionDef.label,
            teamId: topTeam.teamId,
            teamName: topTeam.teamName,
            componentId: section.placedComponent.registryId,
          });
        }
      }
    }
  }

  return { teams: teamResults, bestSections };
}

export function handleVotingEvents(io: Server, socket: Socket): void {
  // vote:submit - Player votes for a team
  socket.on(CLIENT_EVENTS.VOTE_SUBMIT, (payload: VoteSubmitPayload) => {
    const roomCode = (socket as any).roomCode;
    const room = getRoom(roomCode);
    if (!room || room.phase !== "voting") return;

    const player = room.players[socket.id];
    if (!player) return;

    // Can't vote for own team
    if (player.teamId === payload.teamId) return;

    // Validate rating
    if (payload.rating < 1 || payload.rating > 5) return;

    if (!roomVotes.has(roomCode)) {
      roomVotes.set(roomCode, []);
    }

    // Remove any previous vote from this player for this team
    const votes = roomVotes.get(roomCode)!;
    const existingIndex = votes.findIndex(
      (v) => v.voterId === socket.id && v.teamId === payload.teamId
    );
    if (existingIndex !== -1) {
      votes.splice(existingIndex, 1);
    }

    votes.push({
      voterId: socket.id,
      teamId: payload.teamId,
      rating: payload.rating,
    });
  });

  // judge:score - Host submits judge scores
  socket.on(CLIENT_EVENTS.JUDGE_SCORE, (payload: JudgeScorePayload) => {
    const roomCode = (socket as any).roomCode;
    const room = getRoom(roomCode);
    if (!room || room.phase !== "voting") return;
    if (room.hostId !== socket.id) return;

    if (!roomJudgeScores.has(roomCode)) {
      roomJudgeScores.set(roomCode, []);
    }

    const scores = roomJudgeScores.get(roomCode)!;
    const existing = scores.findIndex((j) => j.teamId === payload.teamId);
    if (existing !== -1) {
      scores[existing] = payload;
    } else {
      scores.push(payload);
    }

    // Check if all teams have been scored - if so, end the game
    const activeTeams = Object.values(room.teams).filter(
      (t) => t.members.length > 0
    );
    if (scores.length >= activeTeams.length) {
      const results = calculateResults(roomCode);
      if (results) {
        room.phase = "results";
        updateGameResults(room, results);
        io.to(roomCode).emit(SERVER_EVENTS.VOTE_RESULTS, results);
        io.to(roomCode).emit(SERVER_EVENTS.GAME_ENDED, results);
        io.to(roomCode).emit(SERVER_EVENTS.ROOM_STATE, room);
      }
    }
  });
}
