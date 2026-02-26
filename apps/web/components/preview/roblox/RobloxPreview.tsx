import type { PlayerDecision } from "@design-dash/shared";
import RobloxHome from "./RobloxHome";
import RobloxNav from "./RobloxNav";

interface RobloxPreviewProps {
  decisions: Record<string, PlayerDecision>;
}

export default function RobloxPreview({ decisions }: RobloxPreviewProps) {
  const homeDecision = decisions["roblox-home-page"];
  const searchDecision = decisions["roblox-search"];

  const homeVariant = (homeDecision?.branchId as "trending" | "for-you" | "friends-activity") ?? null;
  const searchVariant = (searchDecision?.branchId as "smart-filters" | "visual-browse" | "ai-search") ?? null;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-hidden">
        <RobloxHome variant={homeVariant} searchVariant={searchVariant} />
      </div>
      <RobloxNav />
    </div>
  );
}
