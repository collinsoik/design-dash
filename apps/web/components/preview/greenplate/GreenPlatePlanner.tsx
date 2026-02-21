interface GreenPlatePlannerProps {
  variant: "ai-auto-plan" | "drag-calendar" | "quick-picks" | null;
  showKidBadges?: boolean;
}

function LeafBadge() {
  return (
    <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 shrink-0">
      <circle cx="5" cy="5" r="4.5" fill="#D1FAE5" />
      <path d="M5 2 C3 2, 2 4, 2 5.5 C2 7.5, 4 8, 5 8 C6 8, 8 7.5, 8 5.5 C8 4, 7 2, 5 2z" fill="#34D399" opacity="0.8" />
      <path d="M5 3.5v4M3.5 5.5 C4 4.5, 5 4, 5 5" stroke="white" strokeWidth="0.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function AiAutoPlan({ showKidBadges }: { showKidBadges: boolean }) {
  const meals = [
    { day: "Mon", name: "Pasta Primavera", cal: "420 cal" },
    { day: "Tue", name: "Chicken Stir Fry", cal: "380 cal" },
    { day: "Wed", name: "Fish Tacos", cal: "350 cal" },
    { day: "Thu", name: "Veggie Curry", cal: "310 cal" },
    { day: "Fri", name: "Mac & Cheese", cal: "450 cal" },
  ];
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1 bg-emerald-50 rounded-lg px-1.5 py-1">
        <svg viewBox="0 0 16 16" className="w-3 h-3 text-emerald-500 shrink-0">
          <path d="M8 1l2 3 3.5.5-2.5 2.5.5 3.5L8 9l-3.5 1.5.5-3.5L2.5 4.5 6 4z" fill="currentColor" />
        </svg>
        <p className="text-[5px] font-bold text-emerald-700">AI-Generated Plan</p>
      </div>
      {meals.map((m, i) => (
        <div key={m.day} className="flex items-center gap-1 bg-gray-50 rounded-lg px-1.5 py-1">
          <p className="text-[5px] font-bold text-gray-400 w-4 shrink-0">{m.day}</p>
          <div className="flex-1 min-w-0">
            <p className="text-[5px] font-semibold text-gray-700 truncate">{m.name}</p>
            <p className="text-[4px] text-gray-400">{m.cal}</p>
          </div>
          {showKidBadges && i <= 2 && <LeafBadge />}
          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-gray-300 shrink-0">
            <path d="M3 3l6 3-6 3" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      ))}
      <div className="flex items-center justify-center gap-1 py-0.5">
        <svg viewBox="0 0 12 12" className="w-2 h-2 text-emerald-400">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <p className="text-[4px] text-emerald-500 font-semibold">Regenerate Plan</p>
      </div>
    </div>
  );
}

function DragCalendar({ showKidBadges }: { showKidBadges: boolean }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const meals = [
    { label: "B", colors: ["bg-amber-200", "bg-amber-100", "bg-amber-200", "bg-amber-100", "bg-amber-200", "bg-amber-100", "bg-amber-200"] },
    { label: "L", colors: ["bg-emerald-200", "bg-sky-200", "bg-emerald-200", "bg-rose-200", "bg-emerald-200", "bg-sky-200", "bg-emerald-200"] },
    { label: "D", colors: ["bg-violet-200", "bg-rose-200", "bg-sky-200", "bg-emerald-200", "bg-amber-200", "bg-violet-200", "bg-rose-200"] },
  ];
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <p className="text-[5px] font-bold text-gray-500">This Week</p>
        <p className="text-[4px] text-emerald-500 font-semibold">Feb 17-23</p>
      </div>
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-[12px_repeat(7,1fr)] bg-gray-50">
          <div />
          {days.map((d, i) => (
            <div key={i} className="text-center text-[5px] font-bold text-gray-400 py-0.5">{d}</div>
          ))}
        </div>
        {/* Meal rows */}
        {meals.map((row, ri) => (
          <div key={ri} className="grid grid-cols-[12px_repeat(7,1fr)] gap-px border-t border-gray-100">
            <div className="flex items-center justify-center text-[4px] font-bold text-gray-400">{row.label}</div>
            {row.colors.map((color, di) => (
              <div key={di} className="relative p-px">
                <div className={`h-4 rounded-sm ${color}`} />
                {showKidBadges && ri === 2 && di < 3 && (
                  <div className="absolute -top-0.5 -right-0.5">
                    <svg viewBox="0 0 8 8" className="w-1.5 h-1.5 text-green-500">
                      <circle cx="4" cy="4" r="3.5" fill="#D1FAE5" />
                      <path d="M4 2C3 2 2 3 2 4.5S3 6 4 6 6 5 6 4.5 5 2 4 2z" fill="currentColor" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="text-[4px] text-gray-400 text-center">Drag recipes to swap meals</p>
      <div className="flex gap-1">
        {[
          { name: "Oatmeal", color: "bg-amber-100" },
          { name: "Salad", color: "bg-emerald-100" },
        ].map((r) => (
          <div key={r.name} className={`flex-1 rounded-md ${r.color} px-1 py-1`}>
            <p className="text-[4px] font-semibold text-gray-600">{r.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickPicks({ showKidBadges }: { showKidBadges: boolean }) {
  const picks = [
    { name: "Chicken Alfredo", time: "25 min", gradient: "from-amber-100 to-orange-100", selected: true },
    { name: "Veggie Bowl", time: "15 min", gradient: "from-emerald-100 to-teal-100", selected: false },
    { name: "Beef Tacos", time: "20 min", gradient: "from-rose-100 to-pink-100", selected: false },
  ];
  return (
    <div className="space-y-1">
      <p className="text-[5px] font-bold text-gray-400 uppercase">Tonight&apos;s Dinner</p>
      <div className="flex gap-1">
        {picks.map((p, i) => (
          <div
            key={p.name}
            className={`flex-1 rounded-lg border p-1 space-y-0.5 relative ${
              p.selected ? "border-emerald-400 bg-emerald-50" : "border-gray-200"
            }`}
          >
            <div className={`aspect-[4/3] rounded-md bg-gradient-to-br ${p.gradient} flex items-center justify-center`}>
              <svg viewBox="0 0 20 20" className="w-4 h-4 text-gray-400/40">
                <circle cx="10" cy="8" r="5" fill="currentColor" />
                <rect x="9" y="12" width="2" height="5" rx="1" fill="currentColor" />
              </svg>
            </div>
            <p className="text-[4px] font-bold text-gray-700 leading-tight truncate">{p.name}</p>
            <p className="text-[3px] text-gray-400">{p.time}</p>
            <div className="flex justify-center">
              <div className={`w-2 h-2 rounded-full border-2 ${
                p.selected ? "border-emerald-400 bg-emerald-400" : "border-gray-300"
              }`}>
                {p.selected && (
                  <svg viewBox="0 0 8 8" className="w-full h-full text-white">
                    <path d="M2 4l1.5 1.5L6 3" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                  </svg>
                )}
              </div>
            </div>
            {showKidBadges && i <= 1 && (
              <div className="absolute top-0.5 right-0.5">
                <LeafBadge />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="bg-gray-50 rounded-lg px-1.5 py-1">
        <div className="flex items-center justify-between">
          <p className="text-[5px] font-semibold text-gray-600">Grocery List</p>
          <p className="text-[4px] text-emerald-500 font-bold">8 items</p>
        </div>
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
