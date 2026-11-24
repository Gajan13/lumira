import Link from "next/link";

// These are sections of the home page, not separate pages. The "/#" prefix
// also works when the header is shown on another route.
// TODO(content): Accessories has no section yet; it points at the colour
// section until the client says what it should show.
const NAV_LINKS = [
  { href: "/#bikes", label: "Bikes" },
  { href: "/#colours", label: "Accessories" },
  { href: "/#stores", label: "Stores" },
  { href: "/#service", label: "Service" },
] as const;

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c.8-3.6 3.4-5.5 7-5.5s6.2 1.9 7 5.5" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-5 py-5 sm:px-8">
      <Link
        href="/"
        className="font-display text-3xl font-bold tracking-tight text-ocean-deep"
      >
        lumira
      </Link>

      <nav aria-label="Main" className="hidden md:block">
        <ul className="flex items-center gap-9 text-sm font-medium text-ocean-deep">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="border-b-2 border-transparent py-1.5 hover:border-coral hover:text-ocean focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-4 text-ocean-deep">
        <Link
          href="/search"
          aria-label="Search"
          className="rounded-full p-1.5 hover:bg-sky-deep focus-visible:outline-2 focus-visible:outline-coral"
        >
          <SearchIcon />
        </Link>
        <Link
          href="/account"
          aria-label="Account"
          className="rounded-full p-1.5 hover:bg-sky-deep focus-visible:outline-2 focus-visible:outline-coral"
        >
          <AccountIcon />
        </Link>
      </div>
    </header>
  );
}
