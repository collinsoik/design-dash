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
    <div className="card-elevated space-y-6">
      {/* Panel header */}
      <div className="flex items-center gap-3">
        <div className="h-3 w-3 rounded-full bg-accent-red animate-pulse" />
        <h2 className="text-xl font-semibold text-text-primary">
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
              className="rounded-lg border border-border-primary bg-surface-secondary p-4 space-y-3"
              style={{ borderLeftColor: team.color, borderLeftWidth: "4px" }}
            >
              {/* Team name */}
              <div className="flex items-center justify-between">
                <h3
                  className="text-sm font-semibold uppercase tracking-wide"
                  style={{ color: team.color }}
                >
                  {team.name}
                </h3>
                <span className="text-2xl font-bold text-accent-primary">
                  {state.score}
                  <span className="text-sm text-text-disabled">/10</span>
                </span>
              </div>

              {/* Score slider */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-text-tertiary uppercase tracking-wide">
                  Score
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-disabled w-4 text-center">
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
                    className="judge-slider flex-1 h-2 appearance-none rounded-full bg-surface-tertiary outline-none"
                    style={
                      {
                        "--slider-color": team.color,
                      } as React.CSSProperties
                    }
                  />
                  <span className="text-sm text-text-disabled w-5 text-center">
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
                    className="w-16 rounded-lg border border-border-primary bg-white px-2 py-1 text-center text-lg text-text-primary outline-none focus:border-border-focus focus:ring-2 focus:ring-border-focus/20"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-text-tertiary uppercase tracking-wide">
                  Notes (optional)
                </label>
                <textarea
                  value={state.notes}
                  onChange={(e) => handleNotesChange(team.id, e.target.value)}
                  placeholder="Feedback for the team..."
                  rows={2}
                  className="w-full resize-none rounded-lg border border-border-primary bg-white px-3 py-2 text-sm text-text-primary placeholder-text-disabled outline-none focus:border-border-focus focus:ring-2 focus:ring-border-focus/20"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Score summary */}
      {showConfirm && (
        <div className="rounded-lg border border-accent-yellow/30 bg-accent-yellow-light p-4 space-y-3">
          <p className="text-sm font-semibold text-accent-yellow uppercase tracking-wide">
            Confirm Scores
          </p>
          <ul className="space-y-1">
            {teams.map((team) => {
              const state = scores[team.id] ?? { score: 5, notes: "" };
              return (
                <li
                  key={team.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span style={{ color: team.color }}>{team.name}</span>
                  <span className="font-bold text-accent-primary">
                    {state.score}/10
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="text-sm text-text-tertiary">
            Click &quot;Finalize Scores&quot; again to submit.
          </p>
        </div>
      )}

      {/* Finalize button */}
      <button
        type="button"
        onClick={handleFinalize}
        disabled={!allScored}
        className={`w-full rounded-lg border px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-all ${
          allScored
            ? showConfirm
              ? "btn-red animate-pulse"
              : "btn-green"
            : "cursor-not-allowed bg-surface-tertiary border-border-primary text-text-disabled"
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
          border-radius: 50%;
          background: var(--slider-color, #7C8CF5);
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
        }
        .judge-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--slider-color, #7C8CF5);
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
        }
        .judge-slider:focus::-webkit-slider-thumb {
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.16);
        }
      `}</style>
    </div>
  );
}
