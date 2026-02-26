"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CASE_STUDIES,
  DESIGN_PHASES,
  type CaseStudy,
  type DecisionPoint,
  type SubmittedDecision,
} from "@design-dash/shared";
import { submitDesign } from "@/lib/api";
import MultipleChoiceDecision from "@/components/game/MultipleChoiceDecision";
import TradeoffSlider from "@/components/game/TradeoffSlider";
import BranchingPath from "@/components/game/BranchingPath";
import CaseStudyBriefing from "@/components/tutorial/CaseStudyBriefing";
import DiscussionPrompt from "@/components/game/DiscussionPrompt";

interface DecisionDraft {
  choiceId: string | null;
  sliderValue: number;
  branchId: string | null;
  followUpChoiceId: string | null;
}

export default function PlayPage() {
  return (
    <Suspense>
      <PlayPageContent />
    </Suspense>
  );
}

function PlayPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCode = searchParams.get("code") || "";
  const groupMode = searchParams.get("group") === "true";

  // Case study selection
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [showBriefing, setShowBriefing] = useState(false);

  // Team info gate (group mode)
  const [teamInfoReady, setTeamInfoReady] = useState(false);

  // Discussion prompts (group mode)
  const [revealedDecisions, setRevealedDecisions] = useState<Set<string>>(
    new Set()
  );

  // One-at-a-time navigation
  const [currentDecisionIndex, setCurrentDecisionIndex] = useState(0);

  // Decision drafts keyed by decisionPointId
  const [drafts, setDrafts] = useState<Record<string, DecisionDraft>>({});

  // Submission
  const [gameCode, setGameCode] = useState(initialCode);
  const [teamName, setTeamName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function selectCaseStudy(cs: CaseStudy) {
    setCaseStudy(cs);
    if (!groupMode) {
      setShowBriefing(true);
    }
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
    setCurrentDecisionIndex(0);
  }

  function revealDecision(id: string) {
    setRevealedDecisions((prev) => new Set(prev).add(id));
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

  // Check if current decision has been answered
  function isDecisionAnswered(decision: DecisionPoint): boolean {
    const draft = drafts[decision.id];
    if (!draft) return false;
    if (decision.type === "multiple_choice") return draft.choiceId !== null;
    if (decision.type === "tradeoff_slider") return true; // slider always has a value
    if (decision.type === "branching_path") return draft.branchId !== null;
    return false;
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
            <svg
              className="w-8 h-8 text-accent-green"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
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

  // ─── TEAM SETUP (group mode) ───
  if (groupMode && !teamInfoReady) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-surface-primary">
        <div className="card-elevated max-w-md w-full">
          <h2 className="text-xl font-bold text-text-primary mb-2 text-center">
            Team Setup
          </h2>
          <p className="text-text-secondary text-center mb-6">
            Enter your team info before starting decisions
          </p>

          <div className="space-y-4">
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

          <div className="text-center mt-6">
            <button
              onClick={() => setTeamInfoReady(true)}
              disabled={!teamName.trim() || gameCode.length !== 4}
              className="btn-primary text-lg px-8 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Start Decisions
            </button>
          </div>

          <button
            onClick={() => setShowBriefing(true)}
            className="btn-ghost text-sm w-full mt-4"
          >
            View Briefing
          </button>
        </div>

        {showBriefing && (
          <CaseStudyBriefing
            caseStudy={caseStudy}
            onReady={() => setShowBriefing(false)}
          />
        )}
      </main>
    );
  }

  // ─── ONE DECISION AT A TIME ───
  const allDecisions = [...caseStudy.decisions].sort(
    (a, b) => a.order - b.order
  );
  const totalDecisions = allDecisions.length;
  const showSubmit = currentDecisionIndex >= totalDecisions;

  // Count answered decisions
  const answeredCount = allDecisions.filter((d) =>
    isDecisionAnswered(d)
  ).length;

  // ─── SUBMIT SCREEN ───
  if (showSubmit) {
    return (
      <main className="min-h-screen bg-surface-primary">
        <header className="bg-white border-b border-border-primary px-6 py-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-text-primary">
                {caseStudy.productName}
              </h1>
              <p className="text-base text-text-secondary">
                All decisions complete — submit your design
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

        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-text-secondary mb-2">
              <span>{answeredCount} of {totalDecisions} answered</span>
              <span>Ready to submit</span>
            </div>
            <div className="h-2 bg-surface-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-green rounded-full transition-all duration-300"
                style={{
                  width: `${(answeredCount / totalDecisions) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="card-elevated space-y-6">
            <h2 className="text-xl font-bold text-text-primary text-center">
              Submit Your Design
            </h2>

            {groupMode && teamInfoReady ? (
              <p className="text-base text-text-secondary text-center">
                Submitting as <strong>{teamName}</strong> to game{" "}
                <strong>{gameCode}</strong>
              </p>
            ) : (
              <>
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
              </>
            )}

            {error && (
              <p className="text-sm text-accent-red text-center">{error}</p>
            )}

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentDecisionIndex(totalDecisions - 1)}
                className="btn-ghost"
              >
                Back to Decisions
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  submitting || !teamName.trim() || gameCode.length !== 4
                }
                className="btn-green text-lg px-10 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Design"}
              </button>
            </div>
          </div>
        </div>

        {showBriefing && (
          <CaseStudyBriefing
            caseStudy={caseStudy}
            onReady={() => setShowBriefing(false)}
          />
        )}
      </main>
    );
  }

  // ─── SINGLE DECISION VIEW ───
  const decision = allDecisions[currentDecisionIndex];
  const draft = drafts[decision.id];
  const isRevealed = !groupMode || revealedDecisions.has(decision.id);
  const canGoNext = isDecisionAnswered(decision) || !groupMode;

  return (
    <main className="min-h-screen bg-surface-primary">
      {/* Header */}
      <header className="bg-white border-b border-border-primary px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              {caseStudy.productName}
            </h1>
            <p className="text-base text-text-secondary">
              Decision {currentDecisionIndex + 1} of {totalDecisions}
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

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Design phase label */}
        {decision.round < DESIGN_PHASES.length && (
          <div className={`rounded-xl px-5 py-3 ${
            decision.round === 0 ? "bg-rose-50 border border-rose-200" :
            decision.round === 1 ? "bg-amber-50 border border-amber-200" :
            decision.round === 2 ? "bg-emerald-50 border border-emerald-200" :
            decision.round === 3 ? "bg-blue-50 border border-blue-200" :
            "bg-violet-50 border border-violet-200"
          }`}>
            <p className={`text-sm font-bold uppercase tracking-wide ${
              decision.round === 0 ? "text-rose-600" :
              decision.round === 1 ? "text-amber-600" :
              decision.round === 2 ? "text-emerald-600" :
              decision.round === 3 ? "text-blue-600" :
              "text-violet-600"
            }`}>
              Step {decision.round + 1}: {DESIGN_PHASES[decision.round].name}
            </p>
            <p className={`text-xs mt-0.5 ${
              decision.round === 0 ? "text-rose-500" :
              decision.round === 1 ? "text-amber-500" :
              decision.round === 2 ? "text-emerald-500" :
              decision.round === 3 ? "text-blue-500" :
              "text-violet-500"
            }`}>
              {DESIGN_PHASES[decision.round].description}
            </p>
          </div>
        )}

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between text-sm text-text-secondary mb-2">
            <span>
              Decision {currentDecisionIndex + 1} of {totalDecisions}
            </span>
            <span>
              {answeredCount} of {totalDecisions} answered
            </span>
          </div>
          <div className="h-2 bg-surface-tertiary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-primary rounded-full transition-all duration-300"
              style={{
                width: `${((currentDecisionIndex + 1) / totalDecisions) * 100}%`,
              }}
            />
          </div>
          {/* Step dots */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {allDecisions.map((d, i) => (
              <button
                key={d.id}
                onClick={() => setCurrentDecisionIndex(i)}
                className={`rounded-full transition-all cursor-pointer ${
                  i === currentDecisionIndex
                    ? "w-6 h-2.5 bg-accent-primary"
                    : isDecisionAnswered(d)
                      ? "w-2.5 h-2.5 bg-accent-green"
                      : "w-2.5 h-2.5 bg-surface-tertiary"
                }`}
                aria-label={`Go to decision ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Decision card */}
        <div className="card-elevated">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge-blue">
              {decision.type === "multiple_choice"
                ? "Choice"
                : decision.type === "tradeoff_slider"
                  ? "Tradeoff"
                  : "Branch"}
            </span>
            <span className="text-xs text-text-tertiary">
              Decision {currentDecisionIndex + 1}
            </span>
          </div>
          <p className="text-lg text-text-primary leading-relaxed mb-1">
            {decision.scenarioText}
          </p>
          {decision.context && (
            <p className="text-base text-text-tertiary italic mb-4">
              {decision.context}
            </p>
          )}

          <div className="mt-4">
            {!isRevealed ? (
              <DiscussionPrompt
                onReveal={() => revealDecision(decision.id)}
              />
            ) : (
              <>
                {decision.type === "multiple_choice" &&
                  decision.choices && (
                    <MultipleChoiceDecision
                      choices={decision.choices}
                      selectedId={draft?.choiceId ?? null}
                      onSelect={(id) =>
                        updateDraft(decision.id, { choiceId: id })
                      }
                    />
                  )}

                {decision.type === "tradeoff_slider" &&
                  decision.tradeoff && (
                    <TradeoffSlider
                      tradeoff={decision.tradeoff}
                      value={draft?.sliderValue ?? 50}
                      onChange={(v) =>
                        updateDraft(decision.id, { sliderValue: v })
                      }
                    />
                  )}

                {decision.type === "branching_path" &&
                  decision.branches && (
                    <BranchingPath
                      branches={decision.branches}
                      selectedBranchId={draft?.branchId ?? null}
                      selectedFollowUpId={draft?.followUpChoiceId ?? null}
                      onSelectBranch={(id) =>
                        updateDraft(decision.id, {
                          branchId: id,
                          followUpChoiceId: null,
                        })
                      }
                      onSelectFollowUp={(id) =>
                        updateDraft(decision.id, {
                          followUpChoiceId: id,
                        })
                      }
                    />
                  )}
              </>
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() =>
              setCurrentDecisionIndex((i) => Math.max(0, i - 1))
            }
            disabled={currentDecisionIndex === 0}
            className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              Previous
            </span>
          </button>

          <button
            onClick={() => setCurrentDecisionIndex((i) => i + 1)}
            className="btn-primary text-lg px-8 py-3"
          >
            <span className="flex items-center gap-2">
              {currentDecisionIndex === totalDecisions - 1
                ? "Review & Submit"
                : "Next"}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </span>
          </button>
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
