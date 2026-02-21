import type { PlayerDecision } from "@design-dash/shared";
import MelodifyHome from "./MelodifyHome";
import MelodifyNav from "./MelodifyNav";

interface MelodifyPreviewProps {
  decisions: Record<string, PlayerDecision>;
}

export default function MelodifyPreview({ decisions }: MelodifyPreviewProps) {
  const homeDecision = decisions["melodify-home-layout"];
  const navDecision = decisions["melodify-nav-complexity"];

  const homeVariant = (homeDecision?.choiceId as "activity-based" | "social-feed" | "library-first" | "discovery-engine") ?? null;
  const navSlider = navDecision?.sliderValue ?? null;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-hidden">
        <MelodifyHome variant={homeVariant} />
      </div>
      <MelodifyNav sliderValue={navSlider} />
    </div>
  );
}
