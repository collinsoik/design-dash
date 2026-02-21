"use client";

import { useState } from "react";

interface TeamEntry {
  id: string;
  name: string;
  color: string;
}

interface JudgePanelProps {
  teams: TeamEntry[];
  onScore: (teamId: string, score: number) => void;
  onFinalize: () => void;
}

interface TeamScoreState {
  score: number;
  notes: string;
}

export default function JudgePanel({
  teams,
  onScore,
  onFinalize,
}: JudgePanelProps) {
  const [scores, setScores] = useState<Record<string, TeamScoreState>>(() => {
    const initial: Record<string, TeamScoreState> = {};
    teams.forEach((team) => {
      initial[team.id] = { score: 5, notes: "" };
    });
    return initial;
  });

  const [showConfirm, setShowConfirm] = useState(false);

  function handleScoreChange(teamId: string, value: number) {
    // Clamp between 1 and 10
    const clamped = Math.min(10, Math.max(1, value));
    setScores((prev) => ({
      ...prev,
      [teamId]: { ...prev[teamId], score: clamped },
    }));
    onScore(teamId, clamped);
  }

  function handleNotesChange(teamId: string, notes: string) {
    setScores((prev) => ({
      ...prev,
      [teamId]: { ...prev[teamId], notes },
    }));
  }

  function handleFinalize() {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }
    onFinalize();
  }

  const allScored = teams.every(
    (team) => scores[team.id] && scores[team.id].score >= 1
  );

  return (
    <div className="rounded-xl border-2 border-game-purple/40 bg-game-dark p-6 space-y-6">
      {/* Panel header */}
      <div className="flex items-center gap-3">
        <div className="h-3 w-3 rounded-sm bg-game-red animate-pulse" />
        <h2 className="font-pixel text-sm text-game-yellow tracking-wide uppercase">
          Judge Scoring Panel
        </h2>
      </div>

      {/* Team scoring rows */}
      <div className="space-y-5">
        {teams.map((team) => {
          const state = scores[team.id] ?? { score: 5, notes: "" };

          return (
            <div
              key={team.id}
              className="rounded-lg border border-white/10 bg-white/[0.02] p-4 space-y-3"
              style={{ borderLeftColor: team.color, borderLeftWidth: "4px" }}
            >
              {/* Team name */}
              <div className="flex items-center justify-between">
                <h3
                  className="font-pixel text-xs tracking-wider uppercase"
                  style={{ color: team.color }}
                >
                  {team.name}
                </h3>
                <span className="font-pixel text-lg text-game-yellow">
                  {state.score}
                  <span className="text-[10px] text-white/40">/10</span>
                </span>
              </div>

              {/* Score slider */}
              <div className="space-y-1">
                <label className="font-pixel text-[8px] text-white/50 uppercase tracking-wide">
                  Score
                </label>
                <div className="flex items-center gap-3">
                  <span className="font-sans text-xs text-white/40 w-4 text-center">
                    1
                  </span>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={state.score}
                    onChange={(e) =>
                      handleScoreChange(team.id, parseInt(e.target.value, 10))
                    }
                    className="judge-slider flex-1 h-2 appearance-none rounded-full bg-white/10 outline-none"
                    style={
                      {
                        "--slider-color": team.color,
                      } as React.CSSProperties
                    }
                  />
                  <span className="font-sans text-xs text-white/40 w-5 text-center">
                    10
                  </span>
                </div>

                {/* Numeric input alternative */}
                <div className="flex justify-end">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={state.score}
                    onChange={(e) =>
                      handleScoreChange(team.id, parseInt(e.target.value, 10) || 1)
                    }
                    className="w-16 rounded border border-white/10 bg-game-dark px-2 py-1 text-center font-sans text-sm text-white outline-none focus:border-game-yellow"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="font-pixel text-[8px] text-white/50 uppercase tracking-wide">
                  Notes (optional)
                </label>
                <textarea
                  value={state.notes}
                  onChange={(e) => handleNotesChange(team.id, e.target.value)}
                  placeholder="Feedback for the team..."
                  rows={2}
                  className="w-full resize-none rounded border border-white/10 bg-game-dark/60 px-3 py-2 font-sans text-sm text-white/80 placeholder-white/20 outline-none focus:border-game-purple"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Score summary */}
      {showConfirm && (
        <div className="rounded-lg border border-game-yellow/30 bg-game-yellow/5 p-4 space-y-3">
          <p className="font-pixel text-[10px] text-game-yellow uppercase tracking-wide">
            Confirm Scores
          </p>
          <ul className="space-y-1">
            {teams.map((team) => {
              const state = scores[team.id] ?? { score: 5, notes: "" };
              return (
                <li
                  key={team.id}
                  className="flex items-center justify-between font-sans text-sm"
                >
                  <span style={{ color: team.color }}>{team.name}</span>
                  <span className="text-game-yellow font-pixel text-xs">
                    {state.score}/10
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="font-sans text-xs text-white/40">
            Click &quot;FINALIZE SCORES&quot; again to submit.
          </p>
        </div>
      )}

      {/* Finalize button */}
      <button
        type="button"
        onClick={handleFinalize}
        disabled={!allScored}
        className={`w-full rounded-lg border-2 px-6 py-3 font-pixel text-xs uppercase tracking-widest transition-all ${
          allScored
            ? showConfirm
              ? "border-game-red bg-game-red/20 text-game-red hover:bg-game-red/30 animate-pulse"
              : "border-game-green bg-game-green/20 text-game-green hover:bg-game-green/30"
            : "cursor-not-allowed border-white/10 bg-white/5 text-white/30"
        }`}
      >
        {showConfirm ? "Confirm & Finalize Scores" : "Finalize Scores"}
      </button>

      {/* Custom slider styles */}
      <style jsx>{`
        .judge-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 4px;
          background: var(--slider-color, #f5c518);
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 8px var(--slider-color, #f5c518);
        }
        .judge-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          background: var(--slider-color, #f5c518);
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 8px var(--slider-color, #f5c518);
        }
        .judge-slider:focus::-webkit-slider-thumb {
          box-shadow: 0 0 12px var(--slider-color, #f5c518);
        }
      `}</style>
    </div>
  );
}
