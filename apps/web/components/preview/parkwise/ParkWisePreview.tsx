import type { PlayerDecision } from "@design-dash/shared";
import ParkWiseCore from "./ParkWiseCore";
import { resolveSafetyVariant } from "./ParkWiseSafety";

interface ParkWisePreviewProps {
  decisions: Record<string, PlayerDecision>;
}

export default function ParkWisePreview({ decisions }: ParkWisePreviewProps) {
  const coreDecision = decisions["parkwise-core-ui"];
  const safetyDecision = decisions["parkwise-safety"];

  const coreVariant = (coreDecision?.choiceId as "voice-first" | "smart-list" | "simplified-map" | "auto-navigate") ?? null;
  const safetyVariant = resolveSafetyVariant(safetyDecision?.branchId);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ParkWiseCore variant={coreVariant} safetyOverlay={safetyVariant} />
    </div>
  );
}
