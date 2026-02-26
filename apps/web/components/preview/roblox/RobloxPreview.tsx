import type { PlayerDecision } from "@design-dash/shared";
import RobloxHome from "./RobloxHome";
import RobloxNav from "./RobloxNav";

interface RobloxPreviewProps {
  decisions: Record<string, PlayerDecision>;
}

export default function RobloxPreview({ decisions }: RobloxPreviewProps) {
  const homeDecision = decisions["roblox-home-page"];
  const searchDecision = decisions["roblox-search"];
  const socialDecision = decisions["roblox-social"];
  const creatorDecision = decisions["roblox-creator-discovery"];

  const homeVariant = (homeDecision?.branchId as "trending" | "for-you" | "friends-activity") ?? null;
  const searchVariant = (searchDecision?.branchId as "smart-filters" | "visual-browse" | "ai-search") ?? null;
  const socialVariant = (socialDecision?.branchId as "party-system" | "activity-feed" | "coop-queue") ?? null;
  const creatorVariant = (creatorDecision?.branchId as "creator-spotlight" | "boost-system" | "creator-mentorship") ?? null;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Roblox header */}
      <div className="flex items-center justify-between py-1 shrink-0">
        <p className="text-[6px] font-extrabold tracking-wider text-white">ROBLOX</p>
        <div className="flex items-center gap-0.5 bg-[#2c2e30] rounded-full px-1 py-0.5">
          <svg viewBox="0 0 16 16" className="w-2 h-2 text-amber-400">
            <circle cx="8" cy="8" r="6" fill="currentColor" />
            <text x="8" y="10.5" textAnchor="middle" fontSize="8" fill="#232527" fontWeight="bold">R</text>
          </svg>
          <p className="text-[4px] font-bold text-white">1,250</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <RobloxHome
          variant={homeVariant}
          searchVariant={searchVariant}
          socialVariant={socialVariant}
          creatorVariant={creatorVariant}
        />
      </div>
      <RobloxNav />
    </div>
  );
}
