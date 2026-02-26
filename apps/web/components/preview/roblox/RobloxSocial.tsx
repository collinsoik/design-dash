interface RobloxSocialProps {
  variant: "party-system" | "activity-feed" | "coop-queue";
}

function PartySystem() {
  return (
    <div className="space-y-1">
      <p className="text-[5px] font-bold text-[#babbbc] uppercase tracking-wide">Party Up</p>
      <div className="bg-[#2c2e30] rounded-lg p-1.5">
        <div className="flex items-center gap-1 mb-1">
          <div className="flex -space-x-1">
            {["bg-blue-500", "bg-emerald-500", "bg-amber-500"].map((c, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full ${c} border border-[#2c2e30] flex items-center justify-center`}
              >
                <p className="text-[3px] font-bold text-white">
                  {["J", "A", "L"][i]}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[4px] text-[#babbbc]">3 friends online</p>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex-1 bg-[#00b06f] rounded px-1.5 py-0.5 text-center">
            <p className="text-[4px] font-bold text-white">Start Party</p>
          </div>
          <div className="bg-[#393b3d] rounded px-1.5 py-0.5 text-center">
            <p className="text-[4px] text-[#babbbc]">Invite</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityFeed() {
  const activities = [
    { name: "Jake", icon: "trophy", text: "Earned 'Speed Demon' badge", color: "text-amber-400" },
    { name: "Ava", icon: "heart", text: "Liked Adopt Me! update", color: "text-pink-400" },
    { name: "Leo", icon: "circle", text: "Online — Tower Defense", color: "text-[#00b06f]" },
  ];
  return (
    <div className="space-y-1">
      <p className="text-[5px] font-bold text-[#babbbc] uppercase tracking-wide">Activity</p>
      {activities.map((a) => (
        <div key={a.name} className="flex items-center gap-1 bg-[#2c2e30] rounded-lg px-1.5 py-1">
          <svg viewBox="0 0 16 16" className={`w-2 h-2 ${a.color} shrink-0`}>
            {a.icon === "trophy" && (
              <path d="M4 2h8v3c0 2-1.5 3.5-4 4-2.5-.5-4-2-4-4V2zM6 10h4v2H6zM5 12h6v1H5z" fill="currentColor" />
            )}
            {a.icon === "heart" && (
              <path d="M8 14s-5.5-4-5.5-7.5C2.5 4 4.5 2.5 6.5 4L8 5.5 9.5 4c2-1.5 4-.5 4 2.5C13.5 10 8 14 8 14z" fill="currentColor" />
            )}
            {a.icon === "circle" && <circle cx="8" cy="8" r="4" fill="currentColor" />}
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-[4px] text-white truncate">
              <span className="font-bold">{a.name}</span>{" "}
              <span className="text-[#babbbc]">{a.text}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CoopQueue() {
  return (
    <div className="space-y-1">
      <p className="text-[5px] font-bold text-[#babbbc] uppercase tracking-wide">Co-op Queue</p>
      <div className="bg-[#2c2e30] rounded-lg p-1.5 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-[4px] text-white font-bold">Finding players...</p>
          <p className="text-[4px] text-[#00b06f]">3/4</p>
        </div>
        <div className="w-full bg-[#393b3d] rounded-full h-1">
          <div className="bg-[#00b06f] h-1 rounded-full" style={{ width: "75%" }} />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[3px] text-[#838486]">Est. wait: ~15s</p>
          <div className="flex -space-x-1">
            {["bg-blue-500", "bg-pink-500", "bg-amber-500"].map((c, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${c} border border-[#2c2e30]`}
              />
            ))}
            <div className="w-2.5 h-2.5 rounded-full bg-[#393b3d] border border-[#2c2e30] border-dashed flex items-center justify-center">
              <p className="text-[3px] text-[#838486]">?</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RobloxSocial({ variant }: RobloxSocialProps) {
  if (variant === "party-system") return <PartySystem />;
  if (variant === "activity-feed") return <ActivityFeed />;
  return <CoopQueue />;
}
