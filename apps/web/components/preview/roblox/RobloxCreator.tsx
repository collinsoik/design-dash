interface RobloxCreatorProps {
  variant: "creator-spotlight" | "boost-system" | "creator-mentorship";
}

function CreatorSpotlight() {
  return (
    <div className="space-y-1">
      <p className="text-[5px] font-bold text-[#babbbc] uppercase tracking-wide">New Creator</p>
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg p-1.5 relative overflow-hidden">
        <svg viewBox="0 0 40 40" className="absolute right-0 top-0 w-6 h-6 text-white/10">
          <polygon points="20,4 25,15 37,17 28,25 30,37 20,31 10,37 12,25 3,17 15,15" fill="currentColor" />
        </svg>
        <div className="flex items-center gap-1 mb-1">
          <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
            <p className="text-[4px] font-bold text-white">M</p>
          </div>
          <div>
            <p className="text-[4px] font-bold text-white">MayaBuilds</p>
            <p className="text-[3px] text-white/60">New creator</p>
          </div>
        </div>
        <p className="text-[5px] font-bold text-white">Rainbow Obby World</p>
        <p className="text-[3px] text-white/70 mt-0.5">Featured this week — 2.4K visits</p>
      </div>
    </div>
  );
}

function BoostSystem() {
  const games = [
    { name: "Sky Castle", rating: "91%", gradient: "from-cyan-500 to-blue-600" },
    { name: "Pet World", rating: "87%", gradient: "from-pink-500 to-rose-600" },
  ];
  return (
    <div className="space-y-1">
      <p className="text-[5px] font-bold text-[#babbbc] uppercase tracking-wide">Boosted</p>
      <div className="flex gap-1">
        {games.map((g) => (
          <div key={g.name} className="flex-1 relative">
            <div className={`bg-gradient-to-br ${g.gradient} rounded-lg p-1 aspect-square flex flex-col justify-end`}>
              <p className="text-[4px] font-bold text-white">{g.name}</p>
              <p className="text-[3px] text-white/70">{g.rating}</p>
            </div>
            <div className="absolute -top-0.5 -right-0.5 bg-orange-500 rounded-full w-2.5 h-2.5 flex items-center justify-center">
              <svg viewBox="0 0 16 16" className="w-1.5 h-1.5 text-white">
                <path d="M8 2l1 4h4l-3 3 1 4-3-2-3 2 1-4-3-3h4l1-4z" fill="currentColor" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CreatorMentorship() {
  return (
    <div className="space-y-1">
      <p className="text-[5px] font-bold text-[#babbbc] uppercase tracking-wide">Creator Buddy</p>
      <div className="bg-[#2c2e30] rounded-lg p-1.5">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
              <p className="text-[4px] font-bold text-white">M</p>
            </div>
            <p className="text-[3px] text-[#babbbc] mt-0.5">Maya</p>
            <p className="text-[2.5px] text-[#838486]">New</p>
          </div>
          <div className="flex items-center gap-0.5">
            <div className="w-1 h-px bg-[#00b06f]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#00b06f] flex items-center justify-center">
              <svg viewBox="0 0 16 16" className="w-1 h-1 text-white">
                <path d="M4 8h8M8 4v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="w-1 h-px bg-[#00b06f]" />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
              <p className="text-[4px] font-bold text-white">S</p>
            </div>
            <p className="text-[3px] text-[#babbbc] mt-0.5">StarDev</p>
            <p className="text-[2.5px] text-[#838486]">Mentor</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-[3px] text-[#838486]">Paired for scripting help</p>
        </div>
      </div>
    </div>
  );
}

export default function RobloxCreator({ variant }: RobloxCreatorProps) {
  if (variant === "creator-spotlight") return <CreatorSpotlight />;
  if (variant === "boost-system") return <BoostSystem />;
  return <CreatorMentorship />;
}
