// Decorative shapes behind the content: rings, pills, plus signs, stars. They
// echo the brand sheet, never carry meaning (aria-hidden), and drift gently
// (animate-float is switched off for people who prefer reduced motion).
// Everything is positioned in percentages so it scales with the section.

const FLOAT = "animate-float motion-reduce:animate-none";

function Plus({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`absolute ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
    >
      <path d="M12 3v18M3 12h18" />
    </svg>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {children}
    </div>
  );
}

/** Hero: the brand sheet's circles, pills and plus signs. */
export function HeroDecor() {
  return (
    <Frame>
      <div className="absolute -top-24 -right-20 size-72 rounded-full bg-ocean/10" />
      <div
        className={`absolute top-[9%] left-[3%] hidden size-14 rounded-full border-[10px] border-coral/70 md:block ${FLOAT}`}
      />
      <div className="absolute bottom-[12%] -left-10 h-9 w-40 -rotate-12 rounded-full bg-ocean/10" />
      <div
        className={`absolute right-[6%] bottom-[16%] h-8 w-28 rotate-[18deg] rounded-full bg-coral/60 ${FLOAT}`}
      />
      <Plus className="top-[14%] left-[47%] hidden size-6 text-ocean/60 md:block" />
      <Plus className="right-[4%] bottom-[44%] size-7 text-coral/70" />
      <Plus className="bottom-[6%] left-[40%] size-5 text-ocean/40" />
    </Frame>
  );
}

/** Battery (navy): concentric rings radiating from where the bike sits. */
export function BatteryDecor() {
  return (
    <Frame>
      <div className="absolute top-1/2 right-[8%] size-[22rem] -translate-y-1/2 rounded-full border border-white/10" />
      <div className="absolute top-1/2 right-[8%] size-[34rem] translate-x-[12%] -translate-y-1/2 rounded-full border border-white/[0.07]" />
      <div className="absolute top-1/2 right-[8%] size-[46rem] translate-x-[24%] -translate-y-1/2 rounded-full border border-white/[0.05]" />
      <div
        className={`absolute top-[18%] left-[42%] size-3 rounded-full bg-coral/70 ${FLOAT}`}
      />
      <Plus className="bottom-[16%] left-[6%] size-6 text-white/25" />
    </Frame>
  );
}

// Fixed positions so server and client agree (no randomness at render).
const STARS = [
  [6, 12, 2],
  [14, 70, 1.5],
  [22, 28, 1],
  [31, 82, 2],
  [39, 18, 1.5],
  [47, 60, 1],
  [53, 9, 2],
  [61, 76, 1],
  [68, 30, 1.5],
  [74, 88, 2],
  [82, 14, 1],
  [88, 52, 1.5],
  [93, 80, 1],
  [10, 44, 1],
  [27, 52, 1.5],
  [58, 40, 1],
  [79, 66, 1],
  [96, 28, 2],
] as const;

/** Lights (night): stars and a crescent moon. */
export function NightDecor() {
  return (
    <Frame>
      {STARS.map(([x, y, size], index) => (
        <span
          key={index}
          className="absolute rounded-full bg-white/70"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: size * 2,
            height: size * 2,
            opacity: 0.25 + (index % 4) * 0.15,
          }}
        />
      ))}
      <svg
        viewBox="0 0 64 64"
        className={`absolute top-[10%] right-[6%] size-14 text-ocean-mist/80 ${FLOAT}`}
        fill="currentColor"
      >
        <path d="M44 6a28 28 0 1 0 14 40A24 24 0 0 1 44 6Z" />
      </svg>
    </Frame>
  );
}

/** Colours (cream): soft blobs in the finish colours, plus confetti dots. */
export function ColourDecor() {
  return (
    <Frame>
      <div className="absolute -bottom-16 -left-12 size-56 rounded-full bg-ocean/10" />
      <div
        className={`absolute top-[8%] right-[5%] size-20 rounded-full bg-coral/25 ${FLOAT}`}
      />
      <div className="absolute right-[22%] bottom-[10%] size-10 rounded-full bg-[#9fc3dc]/50" />
      <div
        className={`absolute top-[16%] left-[44%] size-3 rounded-full bg-ocean/50 ${FLOAT}`}
      />
      <div className="absolute bottom-[26%] left-[40%] size-2.5 rounded-full bg-coral/60" />
      <Plus className="top-[40%] left-[3%] size-5 text-coral/60" />
    </Frame>
  );
}
