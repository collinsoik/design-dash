import type { PlayerDecision } from "@design-dash/shared";
import GreenPlatePlanner from "./GreenPlatePlanner";
import GreenPlateKids from "./GreenPlateKids";

interface GreenPlatePreviewProps {
  decisions: Record<string, PlayerDecision>;
}

export default function GreenPlatePreview({ decisions }: GreenPlatePreviewProps) {
  const plannerDecision = decisions["greenplate-planning-ui"];
  const kidsDecision = decisions["greenplate-picky-eaters"];

  const plannerVariant = (plannerDecision?.choiceId as "ai-auto-plan" | "drag-calendar" | "quick-picks") ?? null;
  const kidsVariant = (kidsDecision?.branchId as "kid-profiles" | "sneaky-healthy") ?? null;

  // If sneaky-healthy, show badges on planner items; if kid-profiles, show avatar bar
  const showKidBadges = kidsVariant === "sneaky-healthy";

  return (
    <div className="flex flex-col flex-1 min-h-0 space-y-1">
      <GreenPlateKids variant={kidsVariant} />
      <div className="flex-1 overflow-hidden">
        <GreenPlatePlanner variant={plannerVariant} showKidBadges={showKidBadges} />
      </div>
    </div>
  );
}
