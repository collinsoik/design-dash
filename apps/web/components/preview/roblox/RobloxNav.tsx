function NavIcon({ type }: { type: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`w-2.5 h-2.5 ${type === "home" ? "text-white" : "text-[#838486]"}`}>
      {type === "home" && (
        <path d="M8 1L1 7h2v6h4V9h2v4h4V7h2L8 1z" fill="currentColor" />
      )}
      {type === "discover" && (
        <g fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="8" cy="8" r="6" />
          <path d="M6 6l5 2-2 5-5-2z" fill="currentColor" stroke="none" />
        </g>
      )}
      {type === "avatar" && (
        <g fill="currentColor">
          <rect x="5" y="2" width="6" height="6" rx="1" />
          <rect x="4" y="9" width="8" height="5" rx="1" />
          <rect x="2" y="9" width="2" height="4" rx="0.5" />
          <rect x="12" y="9" width="2" height="4" rx="0.5" />
        </g>
      )}
      {type === "create" && (
        <g fill="currentColor">
          <path d="M3 3h4v2H5v2H3V3zM9 3h4v4h-2V5H9V3zM3 9h2v2h2v2H3V9zM11 11v2H9v-2h2zm2-2v4h-2v-2h2V9z" />
        </g>
      )}
      {type === "more" && (
        <g fill="currentColor">
          <circle cx="4" cy="8" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="12" cy="8" r="1.5" />
        </g>
      )}
    </svg>
  );
}

const tabs = [
  { type: "home", label: "Home" },
  { type: "discover", label: "Discover" },
  { type: "avatar", label: "Avatar" },
  { type: "create", label: "Create" },
  { type: "more", label: "More" },
];

export default function RobloxNav() {
  return (
    <div className="flex items-center justify-around bg-[#1a1c1e] py-1 mt-auto shrink-0 -mx-1.5 px-1.5">
      {tabs.map((tab) => (
        <div key={tab.type} className="flex flex-col items-center gap-px">
          <NavIcon type={tab.type} />
          <p className={`text-[3px] ${tab.type === "home" ? "text-white" : "text-[#838486]"}`}>
            {tab.label}
          </p>
        </div>
      ))}
    </div>
  );
}
