// A small round icon above each feature heading. Decorative: the heading says
// what the feature is.
const ICONS = {
  battery: (
    <>
      <rect x="3" y="7" width="15" height="10" rx="2" />
      <path d="M21 10.5v3M9.5 9.5 8 12.5h3.5L10 15.5" />
    </>
  ),
  light: (
    <>
      <circle cx="12" cy="11" r="4" />
      <path d="M12 3v2M12 17v2M4 11H2M22 11h-2M6.3 5.3 5 4M18.7 5.3 20 4M6.3 16.7 5 18M18.7 16.7 20 18" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.9 2-1.8 0-1.5-1.5-1.7-1.5-3 0-1 .8-1.7 1.8-1.7H17a4 4 0 0 0 4-4C21 6.3 17 3 12 3Z" />
      <circle cx="7.5" cy="11" r=".6" />
      <circle cx="10" cy="7" r=".6" />
      <circle cx="15" cy="7" r=".6" />
    </>
  ),
} as const;

export type FeatureIconName = keyof typeof ICONS;

export function FeatureIcon({
  name,
  tone,
}: {
  name: FeatureIconName;
  tone: "light" | "dark";
}) {
  return (
    <span
      aria-hidden="true"
      className={`mb-5 flex size-12 items-center justify-center rounded-full ${
        tone === "light"
          ? "bg-white/10 text-white ring-1 ring-white/15"
          : "bg-ocean/10 text-ocean-deep ring-1 ring-ocean/15"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {ICONS[name]}
      </svg>
    </span>
  );
}
