interface PhoneFrameProps {
  teamColor: string;
  productName: string;
  dark?: boolean;
  children: React.ReactNode;
}

export default function PhoneFrame({ teamColor, productName, dark, children }: PhoneFrameProps) {
  return (
    <div
      className={`w-[180px] aspect-[9/19] rounded-[1.5rem] border-2 overflow-hidden flex flex-col ${dark ? "bg-[#232527]" : "bg-white"}`}
      style={{ borderColor: teamColor }}
    >
      {/* Status bar + notch */}
      <div className="flex flex-col items-center pt-1.5 pb-1 px-2 shrink-0">
        <div className={`w-12 h-1.5 rounded-full mb-1 ${dark ? "bg-[#393b3d]" : "bg-gray-200"}`} />
        {!dark && (
          <p className="text-[6px] font-semibold text-gray-400 tracking-wide uppercase">
            {productName}
          </p>
        )}
      </div>

      {/* Content area */}
      <div className="flex-1 px-1.5 overflow-hidden flex flex-col min-h-0">
        {children}
      </div>

      {/* Home indicator */}
      <div className="flex justify-center py-1.5 shrink-0">
        <div className={`w-10 h-1 rounded-full ${dark ? "bg-[#393b3d]" : "bg-gray-200"}`} />
      </div>
    </div>
  );
}
