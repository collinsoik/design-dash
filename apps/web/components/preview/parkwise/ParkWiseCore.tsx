interface ParkWiseCoreProps {
  variant: "voice-first" | "smart-list" | "simplified-map" | "auto-navigate" | null;
  safetyOverlay?: "safety-score" | "community-reviews" | null;
}

function SafetyShield({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 10 12" className="w-2.5 h-3 shrink-0">
      <path d="M5 1L1 3v4c0 2.5 4 4 4 4s4-1.5 4-4V3L5 1z" fill={color} opacity="0.8" />
      <path d="M3.5 6l1.2 1.2L7 5" stroke="white" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function ReviewBubble() {
  return (
    <svg viewBox="0 0 14 12" className="w-3 h-2.5 shrink-0">
      <path d="M1 1h10c.5 0 1 .5 1 1v5c0 .5-.5 1-1 1H5l-2 2V8H2c-.5 0-1-.5-1-1V2c0-.5.5-1 1-1z" fill="#FEF3C7" />
      <path d="M4 4.5l1 1 2.5-2.5" stroke="#F59E0B" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function VoiceFirst({ safetyOverlay }: { safetyOverlay: ParkWiseCoreProps["safetyOverlay"] }) {
  const shieldColors = ["#30A46C", "#F5D90A", "#30A46C"];
  const results = [
    { name: "Elm St Garage", price: "$3/hr", dist: "0.1 mi" },
    { name: "Main St Lot", price: "$2/hr", dist: "0.3 mi" },
    { name: "City Center", price: "$5/hr", dist: "0.1 mi" },
  ];
  return (
    <div className="flex-1 flex flex-col items-center space-y-1.5">
      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center relative">
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-500">
          <path d="M12 1a4 4 0 0 0-4 4v5a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4z" fill="currentColor" />
          <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-ping opacity-30" />
      </div>
      <p className="text-[5px] text-blue-500 font-semibold">&quot;Find parking near me&quot;</p>
      <div className="w-full space-y-1">
        {results.map((r, i) => (
          <div key={r.name} className="flex items-center gap-1 bg-gray-50 rounded-lg px-1.5 py-1">
            <div className="w-3.5 h-3.5 rounded bg-blue-500 text-[5px] text-white flex items-center justify-center font-bold shrink-0">P</div>
            <div className="flex-1 min-w-0">
              <p className="text-[5px] font-semibold text-gray-700 truncate">{r.name}</p>
              <div className="flex gap-1">
                <p className="text-[4px] text-emerald-600 font-bold">{r.price}</p>
                <p className="text-[4px] text-gray-400">{r.dist}</p>
              </div>
            </div>
            {safetyOverlay === "safety-score" && <SafetyShield color={shieldColors[i]} />}
            {safetyOverlay === "community-reviews" && <ReviewBubble />}
          </div>
        ))}
      </div>
    </div>
  );
}

function SmartList({ safetyOverlay }: { safetyOverlay: ParkWiseCoreProps["safetyOverlay"] }) {
  const shieldColors = ["#30A46C", "#30A46C", "#F5D90A", "#E5484D", "#30A46C"];
  const spots = [
    { name: "Elm St Garage", price: "$3", dist: "0.1 mi", spots: "23 open" },
    { name: "Main St Lot", price: "$2", dist: "0.3 mi", spots: "8 open" },
    { name: "Oak Ave Deck", price: "$4", dist: "0.2 mi", spots: "15 open" },
    { name: "1st St Meter", price: "$1", dist: "0.5 mi", spots: "3 open" },
    { name: "Central Plaza", price: "$6", dist: "0.1 mi", spots: "40 open" },
  ];
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <p className="text-[5px] font-bold text-gray-400 uppercase">Nearby Parking</p>
        <p className="text-[4px] text-blue-500 font-semibold">Sort: Distance</p>
      </div>
      {spots.map((s, i) => (
        <div key={s.name} className={`flex items-center gap-1 rounded-lg px-1.5 py-1 ${i === 0 ? "bg-blue-50 border border-blue-200" : "bg-gray-50"}`}>
          <div className={`w-3.5 h-3.5 rounded ${i === 0 ? "bg-blue-500" : "bg-gray-300"} text-[5px] text-white flex items-center justify-center font-bold shrink-0`}>P</div>
          <div className="flex-1 min-w-0">
            <p className="text-[5px] font-semibold text-gray-700 truncate">{s.name}</p>
            <div className="flex gap-1">
              <p className="text-[4px] text-gray-400">{s.dist}</p>
              <p className="text-[4px] text-emerald-500">{s.spots}</p>
            </div>
          </div>
          {safetyOverlay === "safety-score" && <SafetyShield color={shieldColors[i]} />}
          {safetyOverlay === "community-reviews" && <ReviewBubble />}
          <p className="text-[6px] font-bold text-gray-600 shrink-0">{s.price}</p>
        </div>
      ))}
    </div>
  );
}

function SimplifiedMap({ safetyOverlay }: { safetyOverlay: ParkWiseCoreProps["safetyOverlay"] }) {
  const pins = [
    { x: "25%", y: "30%", color: "#3E63DD", label: "$3" },
    { x: "55%", y: "20%", color: "#30A46C", label: "$2" },
    { x: "70%", y: "50%", color: "#3E63DD", label: "$4" },
    { x: "35%", y: "60%", color: "#F76808", label: "$1" },
    { x: "60%", y: "72%", color: "#30A46C", label: "$6" },
  ];
  return (
    <div className="flex-1 flex flex-col space-y-1">
      <div className="relative bg-emerald-50 rounded-lg flex-1 min-h-[70px] overflow-hidden">
        {/* Map features */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Roads */}
          <line x1="0" y1="40" x2="100" y2="40" stroke="#D0D4DA" strokeWidth="3" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="#D0D4DA" strokeWidth="3" />
          <line x1="0" y1="70" x2="100" y2="70" stroke="#E2E5EA" strokeWidth="2" />
          <line x1="25" y1="0" x2="25" y2="100" stroke="#E2E5EA" strokeWidth="1.5" />
          {/* Buildings */}
          <rect x="5" y="10" width="15" height="20" rx="1" fill="#E2E5EA" />
          <rect x="55" y="45" width="12" height="18" rx="1" fill="#E2E5EA" />
          <rect x="75" y="8" width="18" height="12" rx="1" fill="#E2E5EA" />
          <rect x="5" y="50" width="16" height="14" rx="1" fill="#E2E5EA" />
          <rect x="80" y="75" width="14" height="16" rx="1" fill="#E2E5EA" />
        </svg>
        {/* Pins with prices */}
        {pins.map((pin, i) => (
          <div
            key={i}
            className="absolute flex flex-col items-center"
            style={{ left: pin.x, top: pin.y, transform: "translate(-50%, -100%)" }}
          >
            <div className="px-0.5 rounded-sm text-[4px] font-bold text-white" style={{ backgroundColor: pin.color }}>
              {pin.label}
            </div>
            <svg viewBox="0 0 10 14" className="w-2 h-3" style={{ color: pin.color }}>
              <path d="M5 0C2.2 0 0 2.2 0 5c0 3.5 5 8 5 8s5-4.5 5-8c0-2.8-2.2-5-5-5z" fill="currentColor" />
              <circle cx="5" cy="5" r="2" fill="white" />
            </svg>
            {safetyOverlay === "safety-score" && (
              <div className="absolute -top-1 -right-2.5">
                <SafetyShield color={i % 2 === 0 ? "#30A46C" : "#F5D90A"} />
              </div>
            )}
          </div>
        ))}
        {/* You are here */}
        <div className="absolute" style={{ left: "45%", top: "45%", transform: "translate(-50%, -50%)" }}>
          <div className="w-2 h-2 rounded-full bg-blue-500 border border-white" />
        </div>
      </div>
      {/* Detail card */}
      <div className="bg-white rounded-lg border border-gray-200 p-1.5">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-500 text-[4px] text-white flex items-center justify-center font-bold shrink-0">P</div>
          <div className="flex-1 min-w-0">
            <p className="text-[5px] font-bold text-gray-700">Elm St Garage</p>
            <p className="text-[4px] text-gray-400">0.1 mi away</p>
          </div>
          {safetyOverlay === "community-reviews" && <ReviewBubble />}
          <p className="text-[5px] font-bold text-emerald-600 shrink-0">$3/hr</p>
        </div>
      </div>
    </div>
  );
}

function AutoNavigate({ safetyOverlay }: { safetyOverlay: ParkWiseCoreProps["safetyOverlay"] }) {
  return (
    <div className="flex-1 flex flex-col space-y-1.5">
      {/* Destination header */}
      <div className="bg-blue-500 rounded-lg px-1.5 py-1 text-center">
        <p className="text-[5px] text-blue-200">Navigating to</p>
        <p className="text-[6px] font-bold text-white">Elm St Garage</p>
      </div>
      {/* Route visualization */}
      <div className="flex-1 bg-emerald-50 rounded-lg p-1.5 relative min-h-[50px]">
        <svg viewBox="0 0 60 50" className="w-full h-full">
          {/* Roads */}
          <line x1="0" y1="25" x2="60" y2="25" stroke="#D0D4DA" strokeWidth="3" />
          <line x1="30" y1="0" x2="30" y2="50" stroke="#D0D4DA" strokeWidth="2" />
          {/* Route line */}
          <path d="M10 40 L10 25 L45 25 L45 10" stroke="#3E63DD" strokeWidth="2.5" strokeLinecap="round" fill="none" strokeDasharray="4 2" />
          {/* You */}
          <circle cx="10" cy="40" r="3" fill="#3E63DD" />
          <circle cx="10" cy="40" r="5" fill="#3E63DD" opacity="0.2" />
          {/* Destination */}
          <rect x="40" y="5" width="10" height="8" rx="1" fill="#30A46C" />
          <text x="45" y="11" textAnchor="middle" className="text-[5px] fill-white font-bold">P</text>
        </svg>
        {safetyOverlay === "safety-score" && (
          <div className="absolute top-1 right-1">
            <SafetyShield color="#30A46C" />
          </div>
        )}
      </div>
      {/* Turn instruction */}
      <div className="bg-gray-50 rounded-lg px-1.5 py-1 flex items-center gap-1">
        <svg viewBox="0 0 12 12" className="w-3 h-3 text-blue-500 shrink-0">
          <path d="M6 10V4l3 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="flex-1">
          <p className="text-[5px] font-bold text-gray-700">Turn right on Elm St</p>
          <p className="text-[4px] text-gray-400">in 200 ft</p>
        </div>
        {safetyOverlay === "community-reviews" && <ReviewBubble />}
      </div>
      {/* Progress */}
      <div className="space-y-0.5">
        <div className="flex justify-between">
          <p className="text-[4px] text-gray-400">ETA</p>
          <p className="text-[5px] font-bold text-blue-600">2 min</p>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div className="bg-blue-400 h-1.5 rounded-full w-2/3" />
        </div>
      </div>
      <div className="flex items-center justify-between bg-emerald-50 rounded-lg px-1.5 py-1">
        <p className="text-[5px] font-semibold text-emerald-700">$3/hr</p>
        <p className="text-[4px] text-emerald-500">23 spots open</p>
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

export default function ParkWiseCore({ variant, safetyOverlay = null }: ParkWiseCoreProps) {
  if (!variant) return <UnknownState />;

  switch (variant) {
    case "voice-first":
      return <VoiceFirst safetyOverlay={safetyOverlay} />;
    case "smart-list":
      return <SmartList safetyOverlay={safetyOverlay} />;
    case "simplified-map":
      return <SimplifiedMap safetyOverlay={safetyOverlay} />;
    case "auto-navigate":
      return <AutoNavigate safetyOverlay={safetyOverlay} />;
  }
}
