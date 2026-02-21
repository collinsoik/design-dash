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
        <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide">Progress</p>
        <p className="text-sm font-semibold text-accent-green">
          {made}/{total}
        </p>
      </div>
      <div className="w-full h-2 bg-surface-tertiary border border-border-primary rounded-full overflow-hidden">
        <div
          className="h-full bg-accent-green transition-all duration-500 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
