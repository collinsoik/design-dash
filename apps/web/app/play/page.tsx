"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CASE_STUDIES,
  type CaseStudy,
  type DecisionPoint,
  type SubmittedDecision,
} from "@design-dash/shared";
import { submitDesign } from "@/lib/api";
import MultipleChoiceDecision from "@/components/game/MultipleChoiceDecision";
import TradeoffSlider from "@/components/game/TradeoffSlider";
import BranchingPath from "@/components/game/BranchingPath";
import CaseStudyBriefing from "@/components/tutorial/CaseStudyBriefing";

interface DecisionDraft {
  choiceId: string | null;
  sliderValue: number;
  branchId: string | null;
  followUpChoiceId: string | null;
}

export default function PlayPage() {
  const router = useRouter();

  // Case study selection
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [showBriefing, setShowBriefing] = useState(false);

  // Decision drafts keyed by decisionPointId
  const [drafts, setDrafts] = useState<Record<string, DecisionDraft>>({});

  // Submission
  const [gameCode, setGameCode] = useState("");
  const [teamName, setTeamName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function selectCaseStudy(cs: CaseStudy) {
    setCaseStudy(cs);
    setShowBriefing(true);
    // Initialize drafts
    const initial: Record<string, DecisionDraft> = {};
    for (const d of cs.decisions) {
      initial[d.id] = {
        choiceId: null,
        sliderValue: 50,
        branchId: null,
        followUpChoiceId: null,
      };
    }
    setDrafts(initial);
  }

  function updateDraft(id: string, patch: Partial<DecisionDraft>) {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  }

  function handleCodeChange(value: string) {
    const cleaned = value.replace(/[^0-9]/g, "");
    if (cleaned.length <= 4) setGameCode(cleaned);
  }

  async function handleSubmit() {
    if (!caseStudy || !teamName.trim() || gameCode.length !== 4) return;

    const decisions: SubmittedDecision[] = [];
    for (const dp of caseStudy.decisions) {
      const draft = drafts[dp.id];
      if (!draft) continue;

      const decision: SubmittedDecision = { decisionPointId: dp.id };

      if (dp.type === "multiple_choice") {
        if (!draft.choiceId) continue;
        decision.choiceId = draft.choiceId;
      } else if (dp.type === "tradeoff_slider") {
        decision.sliderValue = draft.sliderValue;
      } else if (dp.type === "branching_path") {
        if (!draft.branchId) continue;
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
      await submitDesign(gameCode, teamName.trim(), decisions);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Submission failed. Please try again.");
    }
    setSubmitting(false);
  }

  // ─── SUCCESS ───
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
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push(`/gallery/${gameCode}`)}
              className="btn-primary"
            >
              View Gallery
            </button>
            <button onClick={() => router.push("/")} className="btn-ghost">
              Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ─── CASE STUDY PICKER ───
  if (!caseStudy) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-surface-primary">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Choose Your Case Study
          </h1>
          <p className="text-text-secondary">
            Pick the product scenario your presenter assigned
          </p>
        </div>

        <div className="grid gap-4 w-full max-w-2xl">
          {CASE_STUDIES.map((cs) => (
            <button
              key={cs.id}
              onClick={() => selectCaseStudy(cs)}
              className="card text-left hover:shadow-elevated transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">
                    {cs.productName}
                  </h2>
                  <p className="text-sm text-text-secondary mt-1">
                    {cs.shortDescription}
                  </p>
                </div>
                <span
                  className={
                    cs.difficulty === "beginner"
                      ? "badge-green"
                      : cs.difficulty === "intermediate"
                        ? "badge-yellow"
                        : "badge-red"
                  }
                >
                  {cs.difficulty}
                </span>
              </div>
            </button>
          ))}
        </div>

        <button onClick={() => router.push("/")} className="btn-ghost mt-8">
          Back
        </button>
      </main>
    );
  }

  // ─── DECISIONS + SUBMIT ───
  const rounds = new Map<number, DecisionPoint[]>();
  for (const d of caseStudy.decisions) {
    if (!rounds.has(d.round)) rounds.set(d.round, []);
    rounds.get(d.round)!.push(d);
  }

  return (
    <main className="min-h-screen bg-surface-primary">
      {/* Header */}
      <header className="bg-white border-b border-border-primary px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              {caseStudy.productName}
            </h1>
            <p className="text-sm text-text-secondary">
              Go through each decision, then submit at the bottom
            </p>
          </div>
          <button
            onClick={() => setShowBriefing(true)}
            className="btn-ghost text-sm"
          >
            Briefing
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
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

        {/* ─── SUBMIT SECTION ─── */}
        <div className="border-t-2 border-border-primary pt-8 space-y-4">
          <h2 className="text-lg font-bold text-text-primary text-center">
            Submit Your Design
          </h2>
          <p className="text-sm text-text-secondary text-center">
            Enter the game code from your presenter and your team name
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <div>
              <label className="text-sm font-medium text-text-secondary block mb-1">
                Game Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={gameCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="1234"
                maxLength={4}
                className="input font-mono tracking-widest text-center text-xl"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary block mb-1">
                Team Name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. The Innovators"
                maxLength={30}
                className="input"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-accent-red text-center">{error}</p>
          )}

          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={submitting || !teamName.trim() || gameCode.length !== 4}
              className="btn-green text-lg px-10 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Design"}
            </button>
          </div>
        </div>
      </div>

      {/* Briefing modal */}
      {showBriefing && (
        <CaseStudyBriefing
          caseStudy={caseStudy}
          onReady={() => setShowBriefing(false)}
        />
      )}
    </main>
  );
}
