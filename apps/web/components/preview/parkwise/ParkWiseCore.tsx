interface ParkWiseCoreProps {
  variant: "voice-first" | "smart-list" | "simplified-map" | "auto-navigate" | null;
  safetyOverlay?: "safety-score" | "community-reviews" | null;
}

function SafetyShield({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 10 12" className="w-2 h-2.5 shrink-0">
      <path d="M5 1L1 3v4c0 2.5 4 4 4 4s4-1.5 4-4V3L5 1z" fill={color} opacity="0.8" />
    </svg>
  );
}

function ReviewBubble() {
  return (
    <svg viewBox="0 0 14 12" className="w-3 h-2.5 shrink-0">
      <path d="M1 1h10c.5 0 1 .5 1 1v5c0 .5-.5 1-1 1H5l-2 2V8H2c-.5 0-1-.5-1-1V2c0-.5.5-1 1-1z" fill="#E5E7EB" />
      <path d="M4 4.5l1 1 2.5-2.5" stroke="#F59E0B" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function VoiceFirst({ safetyOverlay }: { safetyOverlay: ParkWiseCoreProps["safetyOverlay"] }) {
  const shieldColors = ["#30A46C", "#F5D90A", "#30A46C"];
  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-2">
      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-400">
          <path d="M12 1a4 4 0 0 0-4 4v5a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4z" fill="currentColor" />
          <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
      <p className="text-[5px] text-gray-400">Tap to search</p>
      <div className="w-full space-y-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-1 bg-gray-50 rounded px-1 py-1">
            <div className="w-2 h-2 rounded-sm bg-blue-200 text-[4px] text-blue-600 flex items-center justify-center font-bold">P</div>
            <div className="flex-1 h-1 bg-gray-200 rounded-full" />
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
  return (
    <div className="space-y-1">
      <p className="text-[5px] font-bold text-gray-400 uppercase">Nearby Parking</p>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-1 bg-gray-50 rounded px-1.5 py-1">
          <div className="w-3 h-3 rounded-sm bg-blue-200 text-[5px] text-blue-600 flex items-center justify-center font-bold shrink-0">P</div>
          <div className="flex-1 space-y-0.5">
            <div className="h-1 bg-gray-300 rounded-full w-4/5" />
            <div className="h-0.5 bg-gray-200 rounded-full w-3/5" />
          </div>
          {safetyOverlay === "safety-score" && <SafetyShield color={shieldColors[i]} />}
          {safetyOverlay === "community-reviews" && <ReviewBubble />}
          <div className="text-[5px] text-gray-400 shrink-0">$</div>
        </div>
      ))}
    </div>
  );
}

function SimplifiedMap({ safetyOverlay }: { safetyOverlay: ParkWiseCoreProps["safetyOverlay"] }) {
  const pins = [
    { x: "25%", y: "30%", color: "#3E63DD" },
    { x: "55%", y: "20%", color: "#30A46C" },
    { x: "70%", y: "50%", color: "#3E63DD" },
    { x: "35%", y: "60%", color: "#F76808" },
    { x: "60%", y: "70%", color: "#30A46C" },
  ];
  return (
    <div className="flex-1 flex flex-col space-y-1">
      <div className="relative bg-gray-100 rounded-md flex-1 min-h-[60px]">
        {/* Map roads */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="0" y1="40" x2="100" y2="40" stroke="#D0D4DA" strokeWidth="1.5" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="#D0D4DA" strokeWidth="1.5" />
          <line x1="0" y1="70" x2="100" y2="70" stroke="#E2E5EA" strokeWidth="1" />
        </svg>
        {/* Pins */}
        {pins.map((pin, i) => (
          <div
            key={i}
            className="absolute w-2.5 h-2.5 rounded-full border border-white"
            style={{ left: pin.x, top: pin.y, backgroundColor: pin.color, transform: "translate(-50%, -50%)" }}
          >
            {safetyOverlay === "safety-score" && (
              <div className="absolute -top-2 -right-1.5">
                <SafetyShield color={i % 2 === 0 ? "#30A46C" : "#F5D90A"} />
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Detail card */}
      <div className="bg-white rounded-md border border-gray-200 p-1.5 space-y-0.5">
        <div className="flex items-center gap-1">
          <div className="h-1.5 bg-gray-300 rounded-full flex-1" />
          {safetyOverlay === "community-reviews" && <ReviewBubble />}
        </div>
        <div className="h-1 bg-gray-200 rounded-full w-3/4" />
      </div>
    </div>
  );
}

function AutoNavigate({ safetyOverlay }: { safetyOverlay: ParkWiseCoreProps["safetyOverlay"] }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-1.5">
      <div className="w-full bg-blue-50 rounded-lg p-2 relative">
        <svg viewBox="0 0 60 40" className="w-full h-8">
          <line x1="5" y1="35" x2="55" y2="5" stroke="#3E63DD" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 2" />
          <circle cx="5" cy="35" r="3" fill="#3E63DD" />
          <circle cx="55" cy="5" r="3" fill="#30A46C" />
        </svg>
        {safetyOverlay === "safety-score" && (
          <div className="absolute top-1 right-1">
            <SafetyShield color="#30A46C" />
          </div>
        )}
      </div>
      <p className="text-[6px] font-semibold text-blue-500">Navigating...</p>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div className="bg-blue-400 h-1.5 rounded-full w-2/3" />
      </div>
      <div className="w-full flex items-center gap-1">
        <div className="h-1 bg-gray-300 rounded-full flex-1" />
        {safetyOverlay === "community-reviews" && <ReviewBubble />}
        <div className="text-[5px] text-gray-400">2 min</div>
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
