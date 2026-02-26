"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import type { CaseStudy, Submission, PlayerDecision, DecisionPoint } from "@design-dash/shared";
import { TEAM_COLORS, DESIGN_PHASES } from "@design-dash/shared";
import { getDesigns } from "@/lib/api";
import PhoneFrame from "@/components/preview/PhoneFrame";
import ProductPreview from "@/components/preview/ProductPreview";

/** Convert SubmittedDecision[] to the Record<string, PlayerDecision> expected by previews */
function toDecisionRecord(
  decisions: Submission["decisions"]
): Record<string, PlayerDecision> {
  const record: Record<string, PlayerDecision> = {};
  for (const d of decisions) {
    record[d.decisionPointId] = {
      decisionPointId: d.decisionPointId,
      type: "multiple_choice", // not used by preview renderers
      choiceId: d.choiceId,
      sliderValue: d.sliderValue,
      branchId: d.branchId,
      followUpChoiceId: d.followUpChoiceId,
      submittedAt: 0,
    };
  }
  return record;
}

/** Get answer text for a decision */
function getAnswerText(dp: DecisionPoint, d: Submission["decisions"][0]): string {
  if (dp.type === "multiple_choice" && dp.choices && d.choiceId) {
    const choice = dp.choices.find((c) => c.id === d.choiceId);
    return choice?.label || d.choiceId;
  } else if (
    dp.type === "tradeoff_slider" &&
    dp.tradeoff &&
    d.sliderValue != null
  ) {
    return `${dp.tradeoff.leftLabel} ${d.sliderValue}% ${dp.tradeoff.rightLabel}`;
  } else if (
    dp.type === "branching_path" &&
    dp.branches &&
    d.branchId
  ) {
    const branch = dp.branches.find((b) => b.id === d.branchId);
    let text = branch?.label || d.branchId;
    if (d.followUpChoiceId && branch) {
      const followUp = branch.followUp.choices.find(
        (c) => c.id === d.followUpChoiceId
      );
      if (followUp) text += ` \u2192 ${followUp.label}`;
    }
    return text;
  }
  return "Not answered";
}

export default function GalleryPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();

  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [phoneWidth, setPhoneWidth] = useState(480);

  useEffect(() => {
    async function load() {
      try {
        const data = await getDesigns(code);
        setCaseStudy(data.caseStudy);
        setSubmissions(data.submissions);
      } catch (err: any) {
        setError(err.message);
      }
    }
    load();
  }, [code]);

  // Responsive phone width
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setPhoneWidth(mq.matches ? 480 : 320);
    const handler = (e: MediaQueryListEvent) =>
      setPhoneWidth(e.matches ? 480 : 320);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    if (!autoPlay || submissions.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % submissions.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [autoPlay, submissions.length]);

  if (error) {
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

  if (!caseStudy) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-surface-primary">
        <p className="text-text-tertiary animate-pulse">Loading gallery...</p>
      </main>
    );
  }

  if (submissions.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-surface-primary">
        <div className="card-elevated text-center max-w-md">
          <h2 className="text-xl font-bold text-text-primary mb-2">
            No Submissions Yet
          </h2>
          <p className="text-text-secondary">
            No teams have submitted their designs yet.
          </p>
        </div>
      </main>
    );
  }

  const current = submissions[currentIndex];
  const teamColor = TEAM_COLORS[currentIndex % TEAM_COLORS.length];
  const decisions = toDecisionRecord(current.decisions);
  const phoneHeight = phoneWidth * (19 / 9);
  const phoneScale = phoneWidth / 180;

  const goNext = () => setCurrentIndex((i) => (i + 1) % submissions.length);
  const goPrev = () =>
    setCurrentIndex((i) => (i - 1 + submissions.length) % submissions.length);

  // Group all case study decisions by round for display
  const roundsMap = new Map<number, DecisionPoint[]>();
  for (const dp of caseStudy.decisions) {
    if (!roundsMap.has(dp.round)) roundsMap.set(dp.round, []);
    roundsMap.get(dp.round)!.push(dp);
  }
  const rounds = Array.from(roundsMap.entries()).sort(([a], [b]) => a - b);

  // Build submitted decisions lookup
  const submittedLookup = new Map(
    current.decisions.map((d) => [d.decisionPointId, d])
  );

  return (
    <main className="min-h-screen bg-surface-primary">
      {/* Header */}
      <header className="bg-white border-b border-border-primary px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              {caseStudy.productName} — Design Gallery
            </h1>
            <p className="text-base text-text-secondary">
              {submissions.length} team{submissions.length !== 1 ? "s" : ""}{" "}
              submitted
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoPlay((a) => !a)}
              className={`text-sm px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
                autoPlay
                  ? "bg-accent-primary text-white border-accent-primary"
                  : "bg-white text-text-secondary border-border-primary hover:border-border-secondary"
              }`}
            >
              {autoPlay ? "Stop Slideshow" : "Auto-Play"}
            </button>
            <button
              onClick={() => router.push("/")}
              className="btn-ghost text-sm"
            >
              Home
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Carousel */}
        <div className="flex items-center justify-center gap-4 md:gap-8">
          {/* Left arrow */}
          <button
            onClick={goPrev}
            className="shrink-0 w-12 h-12 rounded-full bg-white border border-border-primary shadow-card flex items-center justify-center hover:shadow-elevated transition-shadow cursor-pointer"
            aria-label="Previous team"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5 text-text-secondary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          {/* Center: phone + info */}
          <div className="flex flex-col items-center gap-4">
            {/* Team name */}
            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: teamColor }}>
                {current.teamName}
              </p>
              <p className="text-sm text-text-tertiary mt-1">
                {current.decisions.length} decision
                {current.decisions.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Phone preview */}
            <div
              className="relative"
              style={{
                width: `${phoneWidth}px`,
                height: `${phoneHeight}px`,
              }}
            >
              <div
                className="origin-top-left"
                style={{
                  transform: `scale(${phoneScale})`,
                  width: "180px",
                }}
              >
                <PhoneFrame
                  teamColor={teamColor}
                  productName={caseStudy.productName}
                >
                  <ProductPreview
                    caseStudyId={caseStudy.id}
                    decisions={decisions}
                  />
                </PhoneFrame>
              </div>
            </div>

            {/* Dot indicators */}
            <div className="flex items-center gap-2">
              {submissions.map((s, i) => {
                const dotColor = TEAM_COLORS[i % TEAM_COLORS.length];
                return (
                  <button
                    key={s.teamName}
                    onClick={() => setCurrentIndex(i)}
                    className="rounded-full transition-all cursor-pointer"
                    style={{
                      width: i === currentIndex ? "24px" : "8px",
                      height: "8px",
                      backgroundColor:
                        i === currentIndex ? dotColor : "#D0D4DA",
                    }}
                    aria-label={`View ${s.teamName}`}
                  />
                );
              })}
            </div>

            <p className="text-sm text-text-tertiary">
              {currentIndex + 1} / {submissions.length}
            </p>
          </div>

          {/* Right arrow */}
          <button
            onClick={goNext}
            className="shrink-0 w-12 h-12 rounded-full bg-white border border-border-primary shadow-card flex items-center justify-center hover:shadow-elevated transition-shadow cursor-pointer"
            aria-label="Next team"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5 text-text-secondary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>

        {/* All decisions grouped by round */}
        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-text-primary mb-6 text-center">
            {current.teamName}&apos;s Decisions
          </h2>

          {rounds.map(([round, roundDecisions]) => (
            <div key={round} className="mb-8">
              <h3 className={`text-sm font-semibold uppercase tracking-wide mb-3 ${
                round < DESIGN_PHASES.length
                  ? round === 0 ? "text-rose-600" :
                    round === 1 ? "text-amber-600" :
                    round === 2 ? "text-emerald-600" :
                    round === 3 ? "text-blue-600" :
                    "text-violet-600"
                  : "text-text-secondary"
              }`}>
                {round < DESIGN_PHASES.length
                  ? `${DESIGN_PHASES[round].name}`
                  : `Round ${round + 1}`}
              </h3>
              <div className="grid gap-3">
                {roundDecisions.map((dp) => {
                  const submitted = submittedLookup.get(dp.id);
                  const answered = !!submitted;
                  const answerText = submitted
                    ? getAnswerText(dp, submitted)
                    : "Not answered";

                  return (
                    <div
                      key={dp.id}
                      className={`bg-white border rounded-lg p-4 ${
                        answered
                          ? "border-border-primary"
                          : "border-dashed border-border-secondary opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            dp.type === "multiple_choice"
                              ? "bg-blue-50 text-blue-600"
                              : dp.type === "tradeoff_slider"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-purple-50 text-purple-600"
                          }`}
                        >
                          {dp.type === "multiple_choice"
                            ? "Choice"
                            : dp.type === "tradeoff_slider"
                              ? "Tradeoff"
                              : "Branch"}
                        </span>
                      </div>
                      <p className="text-base text-text-primary mb-1">
                        {dp.scenarioText}
                      </p>
                      <p
                        className={`text-base font-semibold ${
                          answered ? "" : "text-text-tertiary italic"
                        }`}
                        style={answered ? { color: teamColor } : undefined}
                      >
                        {answerText}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
