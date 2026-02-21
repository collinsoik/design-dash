interface MelodifyHomeProps {
  variant: "activity-based" | "social-feed" | "library-first" | "discovery-engine" | null;
}

function ActivityBased() {
  return (
    <div className="space-y-1.5">
      <p className="text-[5px] font-bold text-gray-400 uppercase">Good Morning</p>
      {/* Time-of-day rows */}
      {[
        { icon: "morning", color: "bg-amber-100", accent: "text-amber-500" },
        { icon: "afternoon", color: "bg-blue-100", accent: "text-blue-500" },
        { icon: "evening", color: "bg-purple-100", accent: "text-purple-500" },
      ].map((row) => (
        <div key={row.icon} className={`flex items-center gap-1 ${row.color} rounded-md px-1.5 py-1.5`}>
          <svg viewBox="0 0 16 16" className={`w-3 h-3 ${row.accent} shrink-0`}>
            {row.icon === "morning" && (
              <circle cx="8" cy="8" r="4" fill="currentColor" opacity="0.8" />
            )}
            {row.icon === "afternoon" && (
              <circle cx="8" cy="8" r="4" fill="currentColor" opacity="0.6" />
            )}
            {row.icon === "evening" && (
              <path d="M10 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" fill="currentColor" opacity="0.7" />
            )}
          </svg>
          <div className="flex-1 space-y-0.5">
            <div className="h-1 bg-gray-300 rounded-full w-3/4" />
            <div className="h-1 bg-gray-200 rounded-full w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SocialFeed() {
  return (
    <div className="space-y-1.5">
      <p className="text-[5px] font-bold text-gray-400 uppercase">Friends Listening</p>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-0.5">
            <div className="h-1 bg-gray-300 rounded-full w-4/5" />
            <div className="h-1 bg-gray-200 rounded-full w-3/5" />
          </div>
          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-gray-300 shrink-0">
            <polygon points="2,1 10,6 2,11" fill="currentColor" />
          </svg>
        </div>
      ))}
    </div>
  );
}

function LibraryFirst() {
  return (
    <div className="space-y-1.5">
      <p className="text-[5px] font-bold text-gray-400 uppercase">Your Library</p>
      <div className="grid grid-cols-2 gap-1">
        {["bg-indigo-200", "bg-rose-200", "bg-emerald-200", "bg-amber-200"].map((color, i) => (
          <div key={i} className={`aspect-square rounded-md ${color}`} />
        ))}
      </div>
      <p className="text-[5px] text-gray-400 mt-1">Recently Played</p>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-gray-200" />
        ))}
      </div>
    </div>
  );
}

function DiscoveryEngine() {
  return (
    <div className="space-y-1.5">
      <p className="text-[5px] font-bold text-gray-400 uppercase">For You</p>
      <div className="rounded-lg bg-gradient-to-br from-violet-300 to-pink-300 p-2 h-16 flex items-end">
        <div className="space-y-0.5">
          <div className="h-1.5 bg-white/80 rounded-full w-12" />
          <div className="h-1 bg-white/50 rounded-full w-8" />
        </div>
      </div>
      <div className="flex gap-1">
        {["bg-sky-100", "bg-orange-100", "bg-green-100"].map((color, i) => (
          <div key={i} className={`flex-1 rounded-md ${color} px-1 py-1.5`}>
            <div className="h-1 bg-gray-300 rounded-full w-full" />
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

export default function MelodifyHome({ variant }: MelodifyHomeProps) {
  if (!variant) return <UnknownState />;

  switch (variant) {
    case "activity-based":
      return <ActivityBased />;
    case "social-feed":
      return <SocialFeed />;
    case "library-first":
      return <LibraryFirst />;
    case "discovery-engine":
      return <DiscoveryEngine />;
  }
}
