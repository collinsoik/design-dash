import type { PlayerDecision } from "@design-dash/shared";
import SpotifyPreview from "./spotify/SpotifyPreview";
import RobloxPreview from "./roblox/RobloxPreview";

interface ProductPreviewProps {
  caseStudyId: string;
  decisions: Record<string, PlayerDecision>;
}

export default function ProductPreview({ caseStudyId, decisions }: ProductPreviewProps) {
  switch (caseStudyId) {
    case "spotify":
      return <SpotifyPreview decisions={decisions} />;
    case "roblox":
      return <RobloxPreview decisions={decisions} />;
    default:
      return (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[6px] text-gray-400">Unknown product</p>
        </div>
      );
  }
}
