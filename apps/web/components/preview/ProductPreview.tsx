import type { PlayerDecision } from "@design-dash/shared";
import MelodifyPreview from "./melodify/MelodifyPreview";
import GreenPlatePreview from "./greenplate/GreenPlatePreview";
import ParkWisePreview from "./parkwise/ParkWisePreview";

interface ProductPreviewProps {
  caseStudyId: string;
  decisions: Record<string, PlayerDecision>;
}

export default function ProductPreview({ caseStudyId, decisions }: ProductPreviewProps) {
  switch (caseStudyId) {
    case "melodify":
      return <MelodifyPreview decisions={decisions} />;
    case "greenplate":
      return <GreenPlatePreview decisions={decisions} />;
    case "parkwise":
      return <ParkWisePreview decisions={decisions} />;
    default:
      return (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[6px] text-gray-400">Unknown product</p>
        </div>
      );
  }
}
