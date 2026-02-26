interface RobloxHomeProps {
  variant: "trending" | "for-you" | "friends-activity" | null;
  searchVariant: "smart-filters" | "visual-browse" | "ai-search" | null;
}

function SearchBar({ searchVariant }: { searchVariant: string | null }) {
  return (
    <div className="mb-1">
      {searchVariant === "ai-search" ? (
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-1.5 py-1">
          <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 text-violet-400 shrink-0">
            <circle cx="8" cy="6" r="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M6 10v3M10 10v3M8 10v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
          <p className="text-[4px] text-gray-400 italic">Ask AI: &quot;Find me a scary game...&quot;</p>
        </div>
      ) : searchVariant === "visual-browse" ? (
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-1.5 py-1">
          <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 text-gray-400 shrink-0">
            <polygon points="2,1 10,6 2,11" fill="currentColor" />
          </svg>
          <p className="text-[4px] text-gray-400">Swipe to browse games</p>
        </div>
      ) : (
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-1.5 py-1">
          <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 text-gray-400 shrink-0">
            <circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
          <p className="text-[4px] text-gray-400">Search games...</p>
          {searchVariant === "smart-filters" && (
            <div className="flex gap-0.5 ml-auto">
              <div className="bg-emerald-100 rounded-full px-1">
                <p className="text-[3px] text-emerald-600">Horror</p>
              </div>
              <div className="bg-blue-100 rounded-full px-1">
                <p className="text-[3px] text-blue-600">Co-op</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Trending() {
  const games = [
    { name: "Adopt Me!", players: "234K", gradient: "from-pink-300 to-rose-400" },
    { name: "Brookhaven", players: "189K", gradient: "from-sky-300 to-blue-400" },
    { name: "Tower Defense", players: "156K", gradient: "from-amber-300 to-orange-400" },
    { name: "Murder Mystery", players: "98K", gradient: "from-red-300 to-red-500" },
  ];
  return (
    <div className="space-y-1">
      <p className="text-[5px] font-bold text-gray-400 uppercase">Trending Now</p>
      {games.map((g, i) => (
        <div key={g.name} className={`flex items-center gap-1.5 bg-gradient-to-r ${g.gradient} rounded-lg px-1.5 py-1.5`}>
          <div className="w-5 h-5 rounded-md bg-white/60 flex items-center justify-center shrink-0 text-[6px] font-bold text-gray-600">
            #{i + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[5px] font-bold text-white truncate">{g.name}</p>
            <p className="text-[4px] text-white/70">{g.players} playing</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse shrink-0" />
        </div>
      ))}
      <div className="flex items-center gap-1 mt-0.5">
        <div className="h-px bg-gray-200 flex-1" />
        <p className="text-[4px] text-gray-300">Updated live</p>
        <div className="h-px bg-gray-200 flex-1" />
      </div>
    </div>
  );
}

function ForYou() {
  return (
    <div className="space-y-1.5">
      <p className="text-[5px] font-bold text-gray-400 uppercase">For You</p>
      <div className="rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 p-2 relative overflow-hidden">
        <svg viewBox="0 0 40 40" className="absolute right-0 top-0 w-8 h-8 text-white/20">
          <rect x="8" y="8" width="24" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
          <polygon points="16,14 28,20 16,26" fill="currentColor" />
        </svg>
        <p className="text-[6px] font-bold text-white">Recommended for Maya</p>
        <p className="text-[4px] text-white/70 mt-0.5">Based on your play history</p>
      </div>
      <p className="text-[5px] font-semibold text-gray-400">Because you play Obbies</p>
      <div className="flex gap-1">
        {[
          { title: "Mega Obby", gradient: "from-violet-200 to-purple-300" },
          { title: "Sky Jump", gradient: "from-cyan-200 to-blue-300" },
          { title: "Lava Run", gradient: "from-orange-200 to-red-300" },
        ].map((m, i) => (
          <div key={i} className={`flex-1 rounded-lg bg-gradient-to-br ${m.gradient} p-1 py-1.5`}>
            <p className="text-[4px] font-bold text-white">{m.title}</p>
            <p className="text-[3px] text-white/60">12K plays</p>
          </div>
        ))}
      </div>
      <p className="text-[5px] font-semibold text-gray-400">New This Week</p>
      <div className="flex gap-1">
        {["bg-pink-200", "bg-lime-200", "bg-sky-200"].map((c, i) => (
          <div key={i} className={`flex-1 aspect-square rounded-lg ${c}`} />
        ))}
      </div>
    </div>
  );
}

function FriendsActivity() {
  const friends = [
    { name: "Jake", initials: "J", color: "bg-blue-300", game: "Brookhaven" },
    { name: "Ava", initials: "A", color: "bg-emerald-300", game: "Adopt Me!" },
    { name: "Leo", initials: "L", color: "bg-amber-300", game: "Tower Defense" },
    { name: "Mia", initials: "M", color: "bg-pink-300", game: "Murder Mystery" },
  ];
  return (
    <div className="space-y-1">
      <p className="text-[5px] font-bold text-gray-400 uppercase">Friends Playing</p>
      {friends.map((f) => (
        <div key={f.name} className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-1.5 py-1">
          <div className={`w-5 h-5 rounded-full ${f.color} flex items-center justify-center text-[5px] font-bold text-white shrink-0`}>
            {f.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[5px] font-semibold text-gray-700 truncate">{f.name}</p>
            <p className="text-[4px] text-gray-400 truncate">{f.game}</p>
          </div>
          <div className="bg-emerald-100 rounded-full px-1.5 py-0.5">
            <p className="text-[4px] font-semibold text-emerald-600">Join</p>
          </div>
        </div>
      ))}
      <div className="bg-blue-50 rounded-lg px-1.5 py-1">
        <p className="text-[5px] font-semibold text-blue-600">4 friends online</p>
        <p className="text-[4px] text-blue-400">Tap any friend to join their game</p>
      </div>
    </div>
  );
}

function DefaultHome() {
  return (
    <div className="space-y-1.5">
      <p className="text-[5px] font-bold text-gray-400 uppercase">Popular Games</p>
      <div className="grid grid-cols-2 gap-1">
        {[
          { title: "Adopt Me!", gradient: "from-pink-300 to-rose-400", players: "234K" },
          { title: "Brookhaven", gradient: "from-sky-300 to-blue-400", players: "189K" },
          { title: "Tower Defense", gradient: "from-amber-300 to-orange-400", players: "156K" },
          { title: "Obby Creator", gradient: "from-emerald-300 to-teal-400", players: "89K" },
        ].map((g) => (
          <div key={g.title} className={`rounded-lg bg-gradient-to-br ${g.gradient} p-1.5 aspect-square flex flex-col justify-end`}>
            <p className="text-[4px] font-bold text-white leading-tight">{g.title}</p>
            <p className="text-[3px] text-white/60">{g.players}</p>
          </div>
        ))}
      </div>
      <p className="text-[5px] font-semibold text-gray-400">Continue Playing</p>
      <div className="flex gap-1">
        {["bg-violet-200", "bg-cyan-200", "bg-orange-200"].map((c, i) => (
          <div key={i} className={`flex-1 h-4 rounded-lg ${c}`} />
        ))}
      </div>
    </div>
  );
}

export default function RobloxHome({ variant, searchVariant }: RobloxHomeProps) {
  return (
    <div className="space-y-1">
      <SearchBar searchVariant={searchVariant} />
      {!variant ? (
        <DefaultHome />
      ) : variant === "trending" ? (
        <Trending />
      ) : variant === "for-you" ? (
        <ForYou />
      ) : (
        <FriendsActivity />
      )}
    </div>
  );
}
