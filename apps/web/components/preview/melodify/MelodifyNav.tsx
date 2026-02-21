interface MelodifyNavProps {
  sliderValue: number | null;
}

function NavIcon({ type }: { type: string }) {
  return (
    <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 text-gray-400">
      {type === "home" && (
        <path d="M8 1L1 7h2v6h4V9h2v4h4V7h2L8 1z" fill="currentColor" />
      )}
      {type === "search" && (
        <circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      )}
      {type === "library" && (
        <g fill="currentColor">
          <rect x="2" y="2" width="3" height="12" rx="0.5" />
          <rect x="6.5" y="4" width="3" height="10" rx="0.5" />
          <rect x="11" y="2" width="3" height="12" rx="0.5" />
        </g>
      )}
      {type === "radio" && (
        <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      )}
      {type === "social" && (
        <g fill="currentColor">
          <circle cx="6" cy="5" r="2.5" />
          <circle cx="11" cy="5" r="2" />
          <path d="M1 14c0-3 2-5 5-5s5 2 5 5" />
        </g>
      )}
      {type === "profile" && (
        <g fill="currentColor">
          <circle cx="8" cy="5" r="3" />
          <path d="M2 15c0-3.5 2.5-6 6-6s6 2.5 6 6" />
        </g>
      )}
      {type === "more" && (
        <g fill="currentColor">
          <circle cx="4" cy="12" r="1.5" />
          <circle cx="8" cy="12" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
        </g>
      )}
    </svg>
  );
}

function getTabConfig(sliderValue: number | null): string[] {
  if (sliderValue === null) return [];
  if (sliderValue <= 12) return ["home", "search", "library"];
  if (sliderValue <= 37) return ["home", "search", "library", "more"];
  if (sliderValue <= 62) return ["home", "search", "radio", "library", "profile"];
  if (sliderValue <= 87) return ["home", "search", "radio", "social", "library", "profile"];
  return ["home", "search", "radio", "social", "library", "profile", "more"];
}

export default function MelodifyNav({ sliderValue }: MelodifyNavProps) {
  const tabs = getTabConfig(sliderValue);

  if (tabs.length === 0) {
    return (
      <div className="flex items-center justify-center border-t border-gray-100 py-1 mt-auto">
        <p className="text-[5px] text-gray-300">? tabs</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-around border-t border-gray-100 py-1 mt-auto shrink-0">
      {tabs.map((tab, i) => (
        <NavIcon key={`${tab}-${i}`} type={tab} />
      ))}
    </div>
  );
}
