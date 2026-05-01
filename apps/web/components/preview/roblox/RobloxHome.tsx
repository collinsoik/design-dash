import RobloxSocial from "./RobloxSocial";
import RobloxCreator from "./RobloxCreator";

interface RobloxHomeProps {
  variant: "trending" | "for-you" | "friends-activity" | null;
  searchVariant: "smart-filters" | "visual-browse" | "ai-search" | null;
  socialVariant: "party-system" | "activity-feed" | "coop-queue" | null;
  creatorVariant: "creator-spotlight" | "boost-system" | "creator-mentorship" | null;
}

function GameTile({ name, rating, players, gradient }: {
  name: string;
  rating: string;
  players: string;
  gradient: string;
}) {
  return (
    <div className="flex-1 min-w-0">
      <div className={`bg-gradient-to-br ${gradient} rounded-lg aspect-square mb-0.5`} />
      <p className="text-[4px] font-semibold text-white truncate">{name}</p>
      <div className="flex items-center gap-0.5">
        <svg viewBox="0 0 16 16" className="w-1.5 h-1.5 text-[#00b06f] shrink-0">
          <path d="M2 10l4 4 8-10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
        <p className="text-[3px] text-[#838486]">{rating}</p>
        <p className="text-[3px] text-[#838486] ml-auto">{players}</p>
      </div>
    </div>
  );
}

function SearchBar({ searchVariant }: { searchVariant: string | null }) {
  return (
    <div className="mb-1.5">
      {searchVariant === "ai-search" ? (
        <div className="flex items-center gap-1 bg-[#393b3d] rounded-lg px-1.5 py-1">
          <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 text-violet-400 shrink-0">
            <path d="M8 2l1.5 3.5L13 7l-3.5 1.5L8 12l-1.5-3.5L3 7l3.5-1.5z" fill="currentColor" />
          </svg>
          <p className="text-[4px] text-[#838486] italic">Ask AI: &quot;Find me an adventure game...&quot;</p>
        </div>
      ) : searchVariant === "visual-browse" ? (
        <div className="flex items-center gap-1 bg-[#393b3d] rounded-lg px-1.5 py-1">
          <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 text-[#babbbc] shrink-0">
            <polygon points="3,1 13,8 3,15" fill="currentColor" />
          </svg>
          <p className="text-[4px] text-[#838486]">Swipe to browse games</p>
        </div>
      ) : (
        <div className="flex items-center gap-1 bg-[#393b3d] rounded-lg px-1.5 py-1">
          <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 text-[#838486] shrink-0">
            <circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-[4px] text-[#838486]">Search experiences</p>
          {searchVariant === "smart-filters" && (
            <div className="flex gap-0.5 ml-auto">
              <div className="bg-emerald-600/30 rounded-full px-1">
                <p className="text-[3px] text-emerald-400">Adventure</p>
              </div>
              <div className="bg-blue-600/30 rounded-full px-1">
                <p className="text-[3px] text-blue-400">Co-op</p>
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
    { name: "Adopt Me!", players: "234K", gradient: "from-pink-500 to-rose-600", rank: 1 },
    { name: "Brookhaven", players: "189K", gradient: "from-sky-500 to-blue-600", rank: 2 },
    { name: "Tower Defense", players: "156K", gradient: "from-amber-500 to-orange-600", rank: 3 },
    { name: "Murder Mystery", players: "98K", gradient: "from-red-500 to-red-700", rank: 4 },
  ];
  return (
    <div className="space-y-1">
      <p className="text-[5px] font-bold text-[#babbbc] uppercase tracking-wide">Trending Now</p>
      {games.map((g) => (
        <div key={g.name} className="flex items-center gap-1 bg-[#2c2e30] rounded-lg px-1 py-1">
          <p className="text-[6px] font-extrabold text-[#838486] w-3 text-center shrink-0">
            {g.rank}
          </p>
          <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${g.gradient} shrink-0`} />
          <div className="flex-1 min-w-0">
            <p className="text-[4.5px] font-bold text-white truncate">{g.name}</p>
            <p className="text-[3.5px] text-[#838486]">{g.players} playing</p>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#00b06f] animate-pulse shrink-0" />
        </div>
      ))}
      <div className="flex items-center gap-1 mt-0.5">
        <div className="h-px bg-[#393b3d] flex-1" />
        <p className="text-[3.5px] text-[#838486]">Updated live</p>
        <div className="h-px bg-[#393b3d] flex-1" />
      </div>
    </div>
  );
}

function ForYou() {
  return (
    <div className="space-y-1.5">
      <p className="text-[5px] font-bold text-[#babbbc] uppercase tracking-wide">For You</p>
      <div className="rounded-lg bg-gradient-to-br from-emerald-600 to-cyan-600 p-2 relative overflow-hidden">
        <svg viewBox="0 0 40 40" className="absolute right-0 top-0 w-8 h-8 text-white/10">
          <polygon points="16,14 28,20 16,26" fill="currentColor" />
        </svg>
        <p className="text-[5.5px] font-bold text-white">Recommended for Maya</p>
        <p className="text-[3.5px] text-white/60 mt-0.5">Based on your play history</p>
      </div>
      <p className="text-[4.5px] font-semibold text-[#babbbc]">Because you play Obbies</p>
      <div className="flex gap-1">
        {[
          { title: "Mega Obby", rating: "92%", players: "12K", gradient: "from-violet-500 to-purple-600" },
          { title: "Sky Jump", rating: "89%", players: "8K", gradient: "from-cyan-500 to-blue-600" },
          { title: "Lava Run", rating: "85%", players: "6K", gradient: "from-orange-500 to-red-600" },
        ].map((g) => (
          <GameTile key={g.title} name={g.title} rating={g.rating} players={g.players} gradient={g.gradient} />
        ))}
      </div>
      <p className="text-[4.5px] font-semibold text-[#babbbc]">New This Week</p>
      <div className="flex gap-1">
        {[
          { title: "Color Run", rating: "78%", players: "3K", gradient: "from-pink-500 to-fuchsia-600" },
          { title: "Tycoon X", rating: "81%", players: "5K", gradient: "from-lime-500 to-green-600" },
          { title: "Speed Race", rating: "76%", players: "2K", gradient: "from-sky-500 to-indigo-600" },
        ].map((g) => (
          <GameTile key={g.title} name={g.title} rating={g.rating} players={g.players} gradient={g.gradient} />
        ))}
      </div>
    </div>
  );
}

function FriendsActivity() {
  const friends = [
    { name: "Jake", initials: "J", color: "bg-blue-500", game: "Brookhaven", status: "In game" },
    { name: "Ava", initials: "A", color: "bg-emerald-500", game: "Adopt Me!", status: "In lobby" },
    { name: "Leo", initials: "L", color: "bg-amber-500", game: "Tower Defense", status: "In game" },
    { name: "Mia", initials: "M", color: "bg-pink-500", game: "Murder Mystery", status: "Online" },
  ];
  return (
    <div className="space-y-1">
      <p className="text-[5px] font-bold text-[#babbbc] uppercase tracking-wide">Friends Playing</p>
      {friends.map((f) => (
        <div key={f.name} className="flex items-center gap-1 bg-[#2c2e30] rounded-lg px-1.5 py-1">
          <div className="relative shrink-0">
            <div className={`w-4.5 h-4.5 rounded-full ${f.color} flex items-center justify-center text-[4.5px] font-bold text-white`}>
              {f.initials}
            </div>
            <div className="absolute -bottom-px -right-px w-1.5 h-1.5 rounded-full bg-[#00b06f] border border-[#2c2e30]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[4.5px] font-semibold text-white truncate">{f.name}</p>
            <p className="text-[3.5px] text-[#838486] truncate">{f.game} · {f.status}</p>
          </div>
          <div className="bg-[#00b06f]/20 rounded px-1.5 py-0.5">
            <p className="text-[3.5px] font-semibold text-[#00b06f]">Join</p>
          </div>
        </div>
      ))}
      <div className="bg-[#2c2e30] rounded-lg px-1.5 py-1">
        <p className="text-[4px] font-semibold text-[#00b06f]">4 friends online</p>
        <p className="text-[3px] text-[#838486]">Tap any friend to join their game</p>
      </div>
    </div>
  );
}

function DefaultHome() {
  return (
    <div className="space-y-1.5">
      <p className="text-[5px] font-bold text-[#babbbc] uppercase tracking-wide">Popular Games</p>
      <div className="grid grid-cols-2 gap-1">
        {[
          { title: "Adopt Me!", gradient: "from-pink-500 to-rose-600", rating: "95%", players: "234K" },
          { title: "Brookhaven", gradient: "from-sky-500 to-blue-600", rating: "93%", players: "189K" },
          { title: "Tower Defense", gradient: "from-amber-500 to-orange-600", rating: "90%", players: "156K" },
          { title: "Obby Creator", gradient: "from-emerald-500 to-teal-600", rating: "88%", players: "89K" },
        ].map((g) => (
          <GameTile key={g.title} name={g.title} rating={g.rating} players={g.players} gradient={g.gradient} />
        ))}
      </div>
      <p className="text-[4.5px] font-semibold text-[#babbbc]">Continue Playing</p>
      <div className="flex gap-1">
        {[
          { title: "My Obby", rating: "82%", players: "1K", gradient: "from-violet-500 to-purple-600" },
          { title: "Build It", rating: "79%", players: "4K", gradient: "from-cyan-500 to-teal-600" },
          { title: "Race Wars", rating: "84%", players: "7K", gradient: "from-orange-500 to-amber-600" },
        ].map((g) => (
          <GameTile key={g.title} name={g.title} rating={g.rating} players={g.players} gradient={g.gradient} />
        ))}
      </div>
    </div>
  );
}

export default function RobloxHome({ variant, searchVariant, socialVariant, creatorVariant }: RobloxHomeProps) {
  return (
    <div className="space-y-2 pb-1">
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
      {socialVariant && (
        <div className="pt-1 border-t border-[#393b3d]">
          <RobloxSocial variant={socialVariant} />
        </div>
      )}
      {creatorVariant && (
        <div className="pt-1 border-t border-[#393b3d]">
          <RobloxCreator variant={creatorVariant} />
        </div>
      )}
    </div>
  );
}
