import type { Team, GameState } from "@design-dash/shared";
import { TEAM_COLORS } from "@design-dash/shared";
import PhoneFrame from "./PhoneFrame";
import ProductPreview from "./ProductPreview";

interface ProductPreviewGridProps {
  teams: Team[];
  gameState: GameState;
  myTeamId: string | null;
}

export default function ProductPreviewGrid({ teams, gameState, myTeamId }: ProductPreviewGridProps) {
  const caseStudyId = gameState.caseStudy.id;
  const productName = gameState.caseStudy.productName;

  return (
    <div className="max-w-5xl mx-auto mb-10">
      <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-4 text-center">
        Compare Designs
      </h2>
      <div className="flex gap-6 justify-center overflow-x-auto pb-2">
        {teams.map((team) => {
          const teamIndex = parseInt(team.id.split("-")[1]);
          const teamColor = TEAM_COLORS[teamIndex] || "#7C8CF5";
          const isOwnTeam = team.id === myTeamId;
          const teamDecisions = gameState.teamDecisions[team.id]?.decisions ?? {};

          return (
            <div
              key={team.id}
              className={`flex flex-col items-center gap-2 shrink-0 ${isOwnTeam ? "opacity-60" : ""}`}
            >
              <PhoneFrame teamColor={teamColor} productName={productName}>
                <ProductPreview caseStudyId={caseStudyId} decisions={teamDecisions} />
              </PhoneFrame>
              <div className="text-center">
                <p className="text-xs font-semibold" style={{ color: teamColor }}>
                  {team.name}
                </p>
                {isOwnTeam && (
                  <p className="text-[10px] text-text-tertiary">Your Team</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
