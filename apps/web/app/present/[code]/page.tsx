"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { CASE_STUDIES, DESIGN_PHASES, type CaseStudy, type GamePublic } from "@design-dash/shared";
import { getGame, advanceGame, goBackGame } from "@/lib/api";
import CaseStudyBriefing from "@/components/tutorial/CaseStudyBriefing";

export default function PresenterPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();

  const [game, setGame] = useState<GamePublic | null>(null);
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [advancing, setAdvancing] = useState(false);
  const [goingBack, setGoingBack] = useState(false);
  const [showBriefing, setShowBriefing] = useState(false);

  // Load admin token from sessionStorage
  useEffect(() => {
    const token = sessionStorage.getItem(`admin-${code}`);
    if (!token) {
      setError("No admin token found. Please create a new game from the home page.");
      return;
    }
    setAdminToken(token);
  }, [code]);

  // Fetch game state
  const fetchGame = useCallback(async () => {
    try {
      const g = await getGame(code);
      setGame(g);
      const cs = CASE_STUDIES.find((c) => c.id === g.caseStudyId);
      if (cs) setCaseStudy(cs);
    } catch (err: any) {
      setError(err.message);
    }
  }, [code]);

  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  // Poll for submissions in submission phase
  useEffect(() => {
    if (!game || game.phase !== "submission") return;
    const interval = setInterval(fetchGame, 3000);
    return () => clearInterval(interval);
  }, [game?.phase, fetchGame]);

  async function handleAdvance() {
    if (!adminToken) return;
    setAdvancing(true);
    try {
      const updated = await advanceGame(code, adminToken);
      setGame(updated);
    } catch (err: any) {
      setError(err.message);
    }
    setAdvancing(false);
  }

  async function handleGoBack() {
    if (!adminToken) return;
    setGoingBack(true);
    try {
      const updated = await goBackGame(code, adminToken);
      setGame(updated);
    } catch (err: any) {
      setError(err.message);
    }
    setGoingBack(false);
  }

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

  // Decision points for the current round
  const roundDecisions = caseStudy.decisions.filter(
    (d) => d.round === game.currentRound
  );

  const isLastRound = game.currentRound >= game.totalRounds - 1;
  const isFirstRound = game.currentRound === 0;

  return (
    <main className="min-h-screen bg-surface-primary">
      {/* Top bar */}
      <header className="bg-white border-b border-border-primary px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              {caseStudy.productName}
            </h1>
            <p className="text-sm text-text-secondary">{caseStudy.shortDescription}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-mono font-bold text-accent-primary tracking-widest">
              {code}
            </div>
            <p className="text-xs text-text-tertiary mt-1">Game Code</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Phase indicator */}
        <div className="flex items-center gap-3">
          {(["presenting", "submission", "gallery"] as const).map((phase) => (
            <div
              key={phase}
              className={`flex-1 h-2 rounded-full transition-colors ${
                game.phase === phase
                  ? "bg-accent-primary"
                  : game.phase === "gallery" || (game.phase === "submission" && phase === "presenting")
                    ? "bg-accent-green"
                    : "bg-surface-tertiary"
              }`}
            />
          ))}
        </div>

        {/* ─── PRESENTING PHASE ─── */}
        {game.phase === "presenting" && (
          <>
            {/* Design phase + round indicator */}
            <div className="text-center space-y-2">
              {game.currentRound < DESIGN_PHASES.length && (
                <div className={`inline-block rounded-xl px-5 py-3 ${
                  game.currentRound === 0 ? "bg-rose-50 border border-rose-200" :
                  game.currentRound === 1 ? "bg-amber-50 border border-amber-200" :
                  game.currentRound === 2 ? "bg-emerald-50 border border-emerald-200" :
                  game.currentRound === 3 ? "bg-blue-50 border border-blue-200" :
                  "bg-violet-50 border border-violet-200"
                }`}>
                  <p className={`text-base font-bold uppercase tracking-wide ${
                    game.currentRound === 0 ? "text-rose-600" :
                    game.currentRound === 1 ? "text-amber-600" :
                    game.currentRound === 2 ? "text-emerald-600" :
                    game.currentRound === 3 ? "text-blue-600" :
                    "text-violet-600"
                  }`}>
                    Step {game.currentRound + 1}: {DESIGN_PHASES[game.currentRound].name}
                  </p>
                  <p className={`text-sm mt-0.5 ${
                    game.currentRound === 0 ? "text-rose-500" :
                    game.currentRound === 1 ? "text-amber-500" :
                    game.currentRound === 2 ? "text-emerald-500" :
                    game.currentRound === 3 ? "text-blue-500" :
                    "text-violet-500"
                  }`}>
                    {DESIGN_PHASES[game.currentRound].description}
                  </p>
                </div>
              )}
              <div>
                <span className="badge-blue text-base px-4 py-1">
                  Round {game.currentRound + 1} of {game.totalRounds}
                </span>
              </div>
            </div>

            {/* Round scenarios */}
            <div className="space-y-6">
              {roundDecisions.map((decision) => (
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
                  <p className="text-lg text-text-primary leading-relaxed mb-2">
                    {decision.scenarioText}
                  </p>
                  {decision.context && (
                    <p className="text-sm text-text-tertiary italic">
                      {decision.context}
                    </p>
                  )}

                  {/* Show the options so presenter can read them */}
                  {decision.type === "multiple_choice" && decision.choices && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {decision.choices.map((c) => (
                        <div key={c.id} className="bg-surface-tertiary rounded-lg p-3">
                          <p className="text-sm font-semibold text-text-primary">{c.label}</p>
                          <p className="text-xs text-text-secondary mt-1">{c.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {decision.type === "tradeoff_slider" && decision.tradeoff && (
                    <div className="mt-4 flex justify-between bg-surface-tertiary rounded-lg p-3">
                      <div>
                        <p className="text-sm font-semibold text-accent-red">{decision.tradeoff.leftLabel}</p>
                        <p className="text-xs text-text-secondary">{decision.tradeoff.leftDescription}</p>
                      </div>
                      <div className="text-center text-text-tertiary px-4">vs</div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-accent-green">{decision.tradeoff.rightLabel}</p>
                        <p className="text-xs text-text-secondary">{decision.tradeoff.rightDescription}</p>
                      </div>
                    </div>
                  )}

                  {decision.type === "branching_path" && decision.branches && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {decision.branches.map((b) => (
                        <div key={b.id} className="bg-surface-tertiary rounded-lg p-3">
                          <p className="text-sm font-semibold text-text-primary">{b.label}</p>
                          <p className="text-xs text-text-secondary mt-1">{b.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowBriefing(true)}
                  className="btn-ghost"
                >
                  View Briefing
                </button>
                {!isFirstRound && (
                  <button
                    onClick={handleGoBack}
                    disabled={goingBack}
                    className="btn-ghost flex items-center gap-2"
                  >
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
                    {goingBack ? "..." : "Previous Round"}
                  </button>
                )}
              </div>
              <button
                onClick={handleAdvance}
                disabled={advancing}
                className="btn-primary text-lg px-8 py-3"
              >
                {advancing
                  ? "..."
                  : isLastRound
                    ? "Open Submissions"
                    : `Next Round`}
              </button>
            </div>
          </>
        )}

        {/* ─── SUBMISSION PHASE ─── */}
        {game.phase === "submission" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                Submissions Open
              </h2>
              <p className="text-text-secondary">
                Teams can now submit their designs at{" "}
                <span className="font-mono font-bold text-accent-primary">{code}</span>
              </p>
            </div>

            {/* Submitted teams */}
            <div className="card-elevated">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-4">
                Teams Submitted ({game.submittedTeams.length})
              </h3>
              {game.submittedTeams.length === 0 ? (
                <p className="text-text-tertiary text-sm animate-pulse">
                  Waiting for teams to submit...
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {game.submittedTeams.map((name) => (
                    <span key={name} className="badge-green text-sm px-3 py-1">
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="text-center pt-4">
              <button
                onClick={handleAdvance}
                disabled={advancing}
                className="btn-green text-lg px-8 py-3"
              >
                {advancing ? "..." : "Show Gallery"}
              </button>
            </div>
          </div>
        )}

        {/* ─── GALLERY PHASE ─── */}
        {game.phase === "gallery" && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">
              Gallery is Live
            </h2>
            <p className="text-text-secondary">
              Everyone can now view the designs.
            </p>
            <button
              onClick={() => router.push(`/gallery/${code}`)}
              className="btn-primary text-lg px-8 py-3"
            >
              View Gallery
            </button>
          </div>
        )}

        {error && (
          <p className="text-sm text-accent-red text-center">{error}</p>
        )}
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
