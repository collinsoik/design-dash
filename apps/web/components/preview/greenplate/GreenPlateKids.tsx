interface GreenPlateKidsProps {
  variant: "kid-profiles" | "sneaky-healthy" | null;
}

function KidProfiles() {
  const initials = ["E", "M", "S"];
  const colors = ["bg-pink-200 text-pink-600", "bg-blue-200 text-blue-600", "bg-amber-200 text-amber-600"];
  return (
    <div className="flex items-center gap-1.5 py-1">
      {initials.map((letter, i) => (
        <div
          key={i}
          className={`w-5 h-5 rounded-full flex items-center justify-center text-[6px] font-bold ${colors[i]}`}
        >
          {letter}
        </div>
      ))}
      <div className="h-1 bg-gray-200 rounded-full flex-1" />
    </div>
  );
}

export default function GreenPlateKids({ variant }: GreenPlateKidsProps) {
  // sneaky-healthy renders badges directly on planner items (handled by GreenPlatePlanner showKidBadges prop)
  // This component only renders the kid profiles bar
  if (variant === "kid-profiles") return <KidProfiles />;
  return null;
}
