interface SpotifyHomeProps {
  variant: "activity-based" | "social-feed" | "discovery-engine" | null;
}

function ActivityBased() {
  const activities = [
    { label: "Morning Commute", time: "7:30 AM", gradient: "from-amber-200 to-orange-200", icon: "sun" },
    { label: "Focus Work", time: "10:00 AM", gradient: "from-sky-200 to-blue-200", icon: "brain" },
    { label: "Workout", time: "5:30 PM", gradient: "from-rose-200 to-pink-200", icon: "bolt" },
    { label: "Wind Down", time: "9:00 PM", gradient: "from-violet-200 to-indigo-200", icon: "moon" },
  ];
  return (
    <div className="space-y-1">
      <p className="text-[5px] font-bold text-gray-400 uppercase">Good Morning, Alex</p>
      {activities.map((a) => (
        <div key={a.label} className={`flex items-center gap-1.5 bg-gradient-to-r ${a.gradient} rounded-lg px-1.5 py-1.5`}>
          <div className="w-5 h-5 rounded-md bg-white/60 flex items-center justify-center shrink-0">
            {a.icon === "sun" && (
              <svg viewBox="0 0 16 16" className="w-3 h-3 text-amber-500">
                <circle cx="8" cy="8" r="3.5" fill="currentColor" />
                {[0,45,90,135,180,225,270,315].map(r => (
                  <line key={r} x1="8" y1="1.5" x2="8" y2="3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" transform={`rotate(${r} 8 8)`} />
                ))}
              </svg>
            )}
            {a.icon === "brain" && (
              <svg viewBox="0 0 16 16" className="w-3 h-3 text-blue-500">
                <circle cx="8" cy="6" r="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <path d="M6 10v3M10 10v3M8 10v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
            )}
            {a.icon === "bolt" && (
              <svg viewBox="0 0 16 16" className="w-3 h-3 text-rose-500">
                <path d="M9 1L4 9h4l-1 6 5-8H8l1-6z" fill="currentColor" />
              </svg>
            )}
            {a.icon === "moon" && (
              <svg viewBox="0 0 16 16" className="w-3 h-3 text-violet-500">
                <path d="M12 10A6 6 0 0 1 6 4a6 6 0 1 0 6 6z" fill="currentColor" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[5px] font-bold text-gray-700 truncate">{a.label}</p>
            <p className="text-[4px] text-gray-500">{a.time}</p>
          </div>
          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-gray-400 shrink-0">
            <polygon points="2,1 10,6 2,11" fill="currentColor" />
          </svg>
        </div>
      ))}
      <div className="flex items-center gap-1 mt-0.5">
        <div className="h-px bg-gray-200 flex-1" />
        <p className="text-[4px] text-gray-300">Personalized for you</p>
        <div className="h-px bg-gray-200 flex-1" />
      </div>
    </div>
  );
}

function SocialFeed() {
  const friends = [
    { name: "Maya", initials: "M", color: "bg-pink-300", song: "Blinding Lights", artist: "The Weeknd" },
    { name: "Jake", initials: "J", color: "bg-blue-300", song: "Flowers", artist: "Miley Cyrus" },
    { name: "Ava", initials: "A", color: "bg-emerald-300", song: "Anti-Hero", artist: "Taylor Swift" },
    { name: "Leo", initials: "L", color: "bg-amber-300", song: "As It Was", artist: "Harry Styles" },
  ];
  return (
    <div className="space-y-1">
      <p className="text-[5px] font-bold text-gray-400 uppercase">Friends Listening</p>
      {friends.map((f) => (
        <div key={f.name} className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-1.5 py-1">
          <div className={`w-5 h-5 rounded-full ${f.color} flex items-center justify-center text-[5px] font-bold text-white shrink-0`}>
            {f.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[5px] font-semibold text-gray-700 truncate">{f.song}</p>
            <p className="text-[4px] text-gray-400 truncate">{f.artist}</p>
          </div>
          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-emerald-400 shrink-0">
            <polygon points="2,1 10,6 2,11" fill="currentColor" />
          </svg>
        </div>
      ))}
      <div className="bg-violet-50 rounded-lg px-1.5 py-1">
        <p className="text-[5px] font-semibold text-violet-600">Shared Playlist</p>
        <p className="text-[4px] text-violet-400">Road Trip Mix - 24 songs</p>
      </div>
    </div>
  );
}

function DiscoveryEngine() {
  return (
    <div className="space-y-1.5">
      <p className="text-[5px] font-bold text-gray-400 uppercase">For You</p>
      <div className="rounded-lg bg-gradient-to-br from-violet-400 to-pink-400 p-2 relative overflow-hidden">
        <svg viewBox="0 0 40 40" className="absolute right-0 top-0 w-10 h-10 text-white/20">
          <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="20" cy="20" r="3" fill="currentColor" />
        </svg>
        <p className="text-[6px] font-bold text-white">Daily Mix #1</p>
        <p className="text-[4px] text-white/70 mt-0.5">Based on your listening</p>
        <div className="flex gap-0.5 mt-1.5">
          {["bg-white/40", "bg-white/30", "bg-white/20"].map((c, i) => (
            <div key={i} className={`w-4 h-4 rounded-sm ${c}`} />
          ))}
        </div>
      </div>
      <p className="text-[5px] font-semibold text-gray-400">New Releases</p>
      <div className="flex gap-1">
        {[
          { title: "Indie", gradient: "from-cyan-200 to-blue-300" },
          { title: "Pop", gradient: "from-pink-200 to-rose-300" },
          { title: "Lo-fi", gradient: "from-emerald-200 to-teal-300" },
        ].map((m, i) => (
          <div key={i} className={`flex-1 rounded-lg bg-gradient-to-br ${m.gradient} p-1 py-1.5`}>
            <p className="text-[4px] font-bold text-white">{m.title}</p>
            <p className="text-[3px] text-white/60">12 songs</p>
          </div>
        ))}
      </div>
      <div className="bg-amber-50 rounded-lg px-1.5 py-1">
        <p className="text-[5px] font-semibold text-amber-700">Discover Weekly</p>
        <p className="text-[4px] text-amber-500">30 new songs picked for you</p>
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

export default function SpotifyHome({ variant }: SpotifyHomeProps) {
  if (!variant) return <UnknownState />;

  switch (variant) {
    case "activity-based":
      return <ActivityBased />;
    case "social-feed":
      return <SocialFeed />;
    case "discovery-engine":
      return <DiscoveryEngine />;
  }
}
