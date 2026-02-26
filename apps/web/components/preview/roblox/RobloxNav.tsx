function NavIcon({ type }: { type: string }) {
  return (
    <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 text-gray-400">
      {type === "home" && (
        <path d="M8 1L1 7h2v6h4V9h2v4h4V7h2L8 1z" fill="currentColor" />
      )}
      {type === "search" && (
        <circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      )}
      {type === "friends" && (
        <g fill="currentColor">
          <circle cx="6" cy="5" r="2.5" />
          <circle cx="11" cy="5" r="2" />
          <path d="M1 14c0-3 2-5 5-5s5 2 5 5" />
        </g>
      )}
      {type === "avatar" && (
        <g fill="currentColor">
          <circle cx="8" cy="5" r="3" />
          <path d="M2 15c0-3.5 2.5-6 6-6s6 2.5 6 6" />
        </g>
      )}
      {type === "create" && (
        <g fill="currentColor">
          <rect x="3" y="7" width="10" height="2" rx="1" />
          <rect x="7" y="3" width="2" height="10" rx="1" />
        </g>
      )}
    </svg>
  );
}

export default function RobloxNav() {
  const tabs = ["home", "search", "friends", "avatar", "create"];

  return (
    <div className="flex items-center justify-around border-t border-gray-100 py-1 mt-auto shrink-0">
      {tabs.map((tab) => (
        <NavIcon key={tab} type={tab} />
      ))}
    </div>
  );
}
