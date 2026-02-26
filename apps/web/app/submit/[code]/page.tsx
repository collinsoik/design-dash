"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CASE_STUDIES,
  type CaseStudy,
  type GamePublic,
  type DecisionPoint,
  type SubmittedDecision,
} from "@design-dash/shared";
import { getGame, submitDesign } from "@/lib/api";
import MultipleChoiceDecision from "@/components/game/MultipleChoiceDecision";
import TradeoffSlider from "@/components/game/TradeoffSlider";
import BranchingPath from "@/components/game/BranchingPath";

/** Local state for each decision being filled out */
interface DecisionDraft {
  choiceId: string | null;
  sliderValue: number;
  branchId: string | null;
  followUpChoiceId: string | null;
}

export default function SubmitPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();

  const [game, setGame] = useState<GamePublic | null>(null);
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [error, setError] = useState("");
  const [teamName, setTeamName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Decision drafts keyed by decisionPointId
  const [drafts, setDrafts] = useState<Record<string, DecisionDraft>>({});

  // Fetch game state
  const fetchGame = useCallback(async () => {
    try {
      const g = await getGame(code);
      setGame(g);
      const cs = CASE_STUDIES.find((c) => c.id === g.caseStudyId);
      if (cs) {
        setCaseStudy(cs);
        // Initialize drafts for all decisions
        const initial: Record<string, DecisionDraft> = {};
        for (const d of cs.decisions) {
          initial[d.id] = {
            choiceId: null,
            sliderValue: 50,
            branchId: null,
            followUpChoiceId: null,
          };
        }
        setDrafts((prev) => {
          // Don't overwrite if already populated (user may have started filling in)
          if (Object.keys(prev).length > 0) return prev;
          return initial;
        });
      }
    } catch (err: any) {
      setError(err.message);
    }
  }, [code]);

  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  // Poll while waiting for submission phase
  useEffect(() => {
    if (!game || game.phase === "submission" || game.phase === "gallery") return;
    const interval = setInterval(fetchGame, 3000);
    return () => clearInterval(interval);
  }, [game?.phase, fetchGame]);

  function updateDraft(id: string, patch: Partial<DecisionDraft>) {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  }

  async function handleSubmit() {
    if (!caseStudy || !teamName.trim()) return;

    // Build decisions array
    const decisions: SubmittedDecision[] = [];
    for (const dp of caseStudy.decisions) {
      const draft = drafts[dp.id];
      if (!draft) continue;

      const decision: SubmittedDecision = { decisionPointId: dp.id };

      if (dp.type === "multiple_choice") {
        if (!draft.choiceId) continue; // skip unanswered
        decision.choiceId = draft.choiceId;
      } else if (dp.type === "tradeoff_slider") {
        decision.sliderValue = draft.sliderValue;
      } else if (dp.type === "branching_path") {
        if (!draft.branchId) continue; // skip unanswered
        decision.branchId = draft.branchId;
        if (draft.followUpChoiceId) {
          decision.followUpChoiceId = draft.followUpChoiceId;
        }
      }

      decisions.push(decision);
    }

    if (decisions.length === 0) {
      setError("Please answer at least one decision before submitting.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await submitDesign(code, teamName.trim(), decisions);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Submission failed. Please try again.");
    }
    setSubmitting(false);
  }

  // Error / loading states
  if (error && !game) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-surface-primary">
        <div className="card-elevated text-center max-w-md">
          <p className="text-accent-red mb-4">{error}</p>
          <button onClick={() => router.push("/")} className="btn-primary">
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  if (!game || !caseStudy) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-surface-primary">
        <p className="text-text-tertiary animate-pulse">Loading game...</p>
      </main>
    );
  }

  // Waiting for submission phase
  if (game.phase === "presenting") {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-surface-primary">
        <div className="card-elevated text-center max-w-md">
          <h2 className="text-xl font-bold text-text-primary mb-2">
            {caseStudy.productName}
          </h2>
          <p className="text-text-secondary mb-4">
            The presenter is still going through the rounds.
            Submissions will open soon.
          </p>
          <p className="text-sm text-text-tertiary">
            Round {game.currentRound + 1} of {game.totalRounds}
          </p>
          <div className="mt-4">
            <div className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </div>
      </main>
    );
  }

  // Already submitted
  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-surface-primary">
        <div className="card-elevated text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-accent-green-light flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">
            Design Submitted!
          </h2>
          <p className="text-text-secondary mb-6">
            Your team&apos;s decisions have been recorded.
          </p>
          {game.phase === "gallery" ? (
            <button
              onClick={() => router.push(`/gallery/${code}`)}
              className="btn-primary"
            >
              View Gallery
            </button>
          ) : (
            <p className="text-sm text-text-tertiary">
              The gallery will open once the presenter is ready.
            </p>
          )}
        </div>
      </main>
    );
  }

  // Gallery already open — redirect
  if (game.phase === "gallery") {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-surface-primary">
        <div className="card-elevated text-center max-w-md">
          <h2 className="text-xl font-bold text-text-primary mb-2">
            Gallery is Open
          </h2>
          <p className="text-text-secondary mb-6">
            Submissions are closed. View the designs in the gallery.
          </p>
          <button
            onClick={() => router.push(`/gallery/${code}`)}
            className="btn-primary"
          >
            View Gallery
          </button>
        </div>
      </main>
    );
  }

  // ─── SUBMISSION FORM ───
  // Group decisions by round for clear organization
  const rounds = new Map<number, DecisionPoint[]>();
  for (const d of caseStudy.decisions) {
    if (!rounds.has(d.round)) rounds.set(d.round, []);
    rounds.get(d.round)!.push(d);
  }

  return (
    <main className="min-h-screen bg-surface-primary">
      {/* Header */}
      <header className="bg-white border-b border-border-primary px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-text-primary">
            {caseStudy.productName}
          </h1>
          <p className="text-sm text-text-secondary">
            Submit your team&apos;s design decisions
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Team name */}
        <div className="card-elevated">
          <label className="text-sm font-semibold text-text-primary block mb-2">
            Team Name
          </label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="e.g. The Innovators"
            maxLength={30}
            className="input text-lg"
          />
        </div>

        {/* Decisions grouped by round */}
        {Array.from(rounds.entries()).map(([round, decisions]) => (
          <div key={round} className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
              Round {round + 1}
            </h3>
            {decisions.map((decision) => {
              const draft = drafts[decision.id];
              if (!draft) return null;

              return (
                <div key={decision.id} className="card-elevated">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge-blue">
                      {decision.type === "multiple_choice"
                        ? "Choice"
                        : decision.type === "tradeoff_slider"
                          ? "Tradeoff"
                          : "Branch"}
                    </span>
                  </div>
                  <p className="text-base text-text-primary leading-relaxed mb-1">
                    {decision.scenarioText}
                  </p>
                  {decision.context && (
                    <p className="text-sm text-text-tertiary italic mb-4">
                      {decision.context}
                    </p>
                  )}

                  <div className="mt-4">
                    {decision.type === "multiple_choice" && decision.choices && (
                      <MultipleChoiceDecision
                        choices={decision.choices}
                        selectedId={draft.choiceId}
                        onSelect={(id) => updateDraft(decision.id, { choiceId: id })}
                      />
                    )}

                    {decision.type === "tradeoff_slider" && decision.tradeoff && (
                      <TradeoffSlider
                        tradeoff={decision.tradeoff}
                        value={draft.sliderValue}
                        onChange={(v) => updateDraft(decision.id, { sliderValue: v })}
                      />
                    )}

                    {decision.type === "branching_path" && decision.branches && (
                      <BranchingPath
                        branches={decision.branches}
                        selectedBranchId={draft.branchId}
                        selectedFollowUpId={draft.followUpChoiceId}
                        onSelectBranch={(id) =>
                          updateDraft(decision.id, {
                            branchId: id,
                            followUpChoiceId: null,
                          })
                        }
                        onSelectFollowUp={(id) =>
                          updateDraft(decision.id, { followUpChoiceId: id })
                        }
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Submit */}
        <div className="sticky bottom-0 bg-surface-primary border-t border-border-primary py-4 -mx-6 px-6">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            {error && (
              <p className="text-sm text-accent-red flex-1 mr-4">{error}</p>
            )}
            <button
              onClick={handleSubmit}
              disabled={submitting || !teamName.trim()}
              className="btn-green text-lg px-8 py-3 ml-auto disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Design"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
