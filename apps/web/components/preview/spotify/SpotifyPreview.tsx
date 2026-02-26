import type { PlayerDecision } from "@design-dash/shared";
import SpotifyHome from "./SpotifyHome";
import SpotifyNav from "./SpotifyNav";

interface SpotifyPreviewProps {
  decisions: Record<string, PlayerDecision>;
}

export default function SpotifyPreview({ decisions }: SpotifyPreviewProps) {
  const homeDecision = decisions["spotify-home-layout"];
  const navDecision = decisions["spotify-nav-complexity"];

  const homeVariant = (homeDecision?.branchId as "activity-based" | "social-feed" | "discovery-engine") ?? null;
  const navVariant = (navDecision?.branchId as "minimal-nav" | "balanced-nav" | "adaptive-nav") ?? null;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-hidden">
        <SpotifyHome variant={homeVariant} />
      </div>
      <SpotifyNav variant={navVariant} />
    </div>
  );
}
