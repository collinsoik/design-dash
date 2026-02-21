"use client";

interface DecisionSummaryProps {
  made: number;
  total: number;
}

export default function DecisionSummary({ made, total }: DecisionSummaryProps) {
  const percent = total > 0 ? Math.round((made / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p className="font-pixel text-[8px] text-gray-500">PROGRESS</p>
        <p className="font-pixel text-[9px] text-game-green">
          {made}/{total}
        </p>
      </div>
      <div className="w-full h-2 bg-game-dark border border-game-blue/40 rounded-full overflow-hidden">
        <div
          className="h-full bg-game-green transition-all duration-500 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
