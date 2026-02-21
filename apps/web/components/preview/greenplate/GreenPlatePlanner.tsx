interface GreenPlatePlannerProps {
  variant: "ai-auto-plan" | "drag-calendar" | "quick-picks" | null;
  showKidBadges?: boolean;
}

function AiAutoPlan({ showKidBadges }: { showKidBadges: boolean }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1 mb-1">
        <svg viewBox="0 0 16 16" className="w-3 h-3 text-emerald-400 shrink-0">
          <path d="M8 1l2 3 3.5.5-2.5 2.5.5 3.5L8 9l-3.5 1.5.5-3.5L2.5 4.5 6 4z" fill="currentColor" />
        </svg>
        <div className="h-1.5 bg-emerald-100 rounded-full flex-1" />
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-1 bg-gray-50 rounded px-1 py-1">
          <div className="flex-1 space-y-0.5">
            <div className="h-1 bg-gray-300 rounded-full w-4/5" />
            <div className="h-0.5 bg-gray-200 rounded-full w-3/5" />
          </div>
          {showKidBadges && i <= 3 && (
            <svg viewBox="0 0 10 10" className="w-2 h-2 text-green-400 shrink-0">
              <path d="M5 1 C3 1, 1 3, 1 5 C1 8, 5 9, 5 9 C5 9, 9 8, 9 5 C9 3, 7 1, 5 1z" fill="currentColor" opacity="0.6" />
            </svg>
          )}
          <svg viewBox="0 0 12 12" className="w-2 h-2 text-gray-300 shrink-0">
            <path d="M3 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      ))}
    </div>
  );
}

function DragCalendar({ showKidBadges }: { showKidBadges: boolean }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const mealColors = [
    ["bg-emerald-200", "bg-amber-200", "bg-sky-200"],
    ["bg-rose-200", "bg-emerald-200", "bg-violet-200"],
    ["bg-amber-200", "bg-sky-200", "bg-emerald-200"],
  ];
  return (
    <div className="space-y-0.5">
      <div className="grid grid-cols-7 gap-px">
        {days.map((d, i) => (
          <div key={i} className="text-center text-[5px] font-bold text-gray-400">{d}</div>
        ))}
      </div>
      {mealColors.map((row, ri) => (
        <div key={ri} className="grid grid-cols-7 gap-px">
          {days.map((_, di) => {
            const colorIdx = (di + ri) % row.length;
            return (
              <div key={di} className="relative">
                <div className={`h-3 rounded-sm ${row[colorIdx]}`} />
                {showKidBadges && di < 3 && ri === 0 && (
                  <svg viewBox="0 0 10 10" className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 text-green-400">
                    <path d="M5 1 C3 1, 1 3, 1 5 C1 8, 5 9, 5 9 C5 9, 9 8, 9 5 C9 3, 7 1, 5 1z" fill="currentColor" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function QuickPicks({ showKidBadges }: { showKidBadges: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-[5px] font-bold text-gray-400 uppercase">Tonight&apos;s Dinner</p>
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 rounded-md border border-gray-200 p-1 space-y-1 relative">
            <div className="aspect-[4/3] bg-gray-100 rounded-sm" />
            <div className="h-1 bg-gray-300 rounded-full w-full" />
            <div className="h-0.5 bg-gray-200 rounded-full w-3/4" />
            <div className="flex justify-center">
              <div className={`w-2 h-2 rounded-full border ${i === 1 ? "border-emerald-400 bg-emerald-400" : "border-gray-300"}`} />
            </div>
            {showKidBadges && i <= 2 && (
              <svg viewBox="0 0 10 10" className="absolute top-0.5 right-0.5 w-2 h-2 text-green-400">
                <path d="M5 1 C3 1, 1 3, 1 5 C1 8, 5 9, 5 9 C5 9, 9 8, 9 5 C9 3, 7 1, 5 1z" fill="currentColor" opacity="0.6" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function UnknownState() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center opacity-40">
        <div className="text-2xl text-gray-300">?</div>
        <p className="text-[5px] text-gray-400 mt-0.5">Not decided</p>
      </div>
    </div>
  );
}

export default function GreenPlatePlanner({ variant, showKidBadges = false }: GreenPlatePlannerProps) {
  if (!variant) return <UnknownState />;

  switch (variant) {
    case "ai-auto-plan":
      return <AiAutoPlan showKidBadges={showKidBadges} />;
    case "drag-calendar":
      return <DragCalendar showKidBadges={showKidBadges} />;
    case "quick-picks":
      return <QuickPicks showKidBadges={showKidBadges} />;
  }
}
