"use client";

interface HowToPlayProps {
  onClose: () => void;
}

const RULES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    label: "Teams",
    text: "Compete in teams. Take turns making decisions.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
    label: "Decide",
    text: "Pick options, drag sliders, choose paths.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    label: "Score",
    text: "Teams vote + teacher scores. Highest wins!",
  },
];

export default function HowToPlay({ onClose }: HowToPlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="card-elevated relative w-full max-w-md">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center text-lg text-text-tertiary transition-colors hover:text-accent-red"
          aria-label="Close tutorial"
        >
          X
        </button>

        <h2 className="pt-6 text-center text-xl font-semibold text-text-primary">
          How to Play
        </h2>

        <div className="space-y-4 px-6 py-6 md:px-8">
          {RULES.map((rule) => (
            <div key={rule.label} className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-blue-light text-accent-blue">
                {rule.icon}
              </div>
              <div>
                <span className="text-sm font-semibold text-accent-primary">
                  {rule.label}
                </span>
                <p className="text-sm text-text-secondary">{rule.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pb-6">
          <button
            type="button"
            onClick={onClose}
            className="btn-green px-8 py-3"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
}
