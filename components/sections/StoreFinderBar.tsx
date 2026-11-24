import Link from "next/link";

export function StoreFinderBar() {
  return (
    <section
      id="stores"
      aria-label="Store finder"
      className="relative z-10 bg-white pb-14"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Link
          href="/stores"
          className="group flex items-center justify-between rounded-2xl bg-ocean-deep px-6 py-6 text-white shadow-lg shadow-ocean-deep/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral"
        >
          <span className="font-display text-lg font-bold sm:text-xl">
            Find a store near you
          </span>
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center rounded-full bg-coral transition-transform group-hover:translate-x-1"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </Link>
      </div>
    </section>
  );
}
