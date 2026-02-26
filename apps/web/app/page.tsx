"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGame } from "@/lib/api";

export default function LandingPage() {
  const router = useRouter();

  // Create
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  async function handleCreate() {
    setIsCreating(true);
    setCreateError("");
    try {
      const { code, adminToken } = await createGame();
      sessionStorage.setItem(`admin-${code}`, adminToken);
      router.push(`/present/${code}`);
    } catch (err: any) {
      setCreateError(err.message || "Failed to create game");
      setIsCreating(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-surface-primary">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-4 tracking-tight">
          DesignDash
        </h1>
        <p className="text-lg text-text-secondary">
          Make Design Decisions. Together.
        </p>
      </div>

      {/* Action Cards */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-3xl">
        {/* PLAY Card (Students) */}
        <div className="flex-1 card flex flex-col items-center justify-center min-h-[260px]">
          <h2 className="text-lg font-semibold text-text-primary mb-4 text-center">
            Play
          </h2>
          <p className="text-text-secondary text-sm text-center mb-6 leading-relaxed">
            Go through the design decisions at your own pace.
            Submit with the game code when you&apos;re ready.
          </p>
          <button
            onClick={() => router.push("/play")}
            className="btn-primary"
          >
            Start Playing
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center">
          <span className="text-sm text-text-tertiary">or</span>
        </div>

        {/* PRESENT Card (Teacher) */}
        <div className="flex-1 card flex flex-col items-center justify-center min-h-[260px]">
          <h2 className="text-lg font-semibold text-text-primary mb-4 text-center">
            Present a Game
          </h2>
          <p className="text-text-secondary text-sm text-center mb-6 leading-relaxed">
            Create a game code. Players choose their own case study.
          </p>
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="btn-green disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isCreating ? "Creating..." : "Create Game"}
          </button>
          {createError && (
            <p className="text-sm text-accent-red text-center mt-4">{createError}</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center">
        <p className="text-xs text-text-disabled">
          A product design decision game for the classroom
        </p>
      </div>
    </main>
  );
}
