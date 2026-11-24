import Image from "next/image";
import Link from "next/link";
import { HeroDecor } from "./Decor";

const HIGHLIGHTS = [
  "Lights built in",
  "New: coral saddle",
  "Removable battery",
] as const;

export function Hero() {
  return (
    <section
      id="bikes"
      aria-labelledby="hero-heading"
      data-scene="hero"
      className="relative"
    >
      <HeroDecor />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-6 px-5 pt-2 pb-10 sm:px-8 md:grid-cols-[1.05fr_1fr] md:gap-10 md:pt-4 md:pb-14">
        <div className="order-2 md:order-1">
          {/* The bike is drawn exactly on this square, so it sits centred on the circle. */}
          <div
            data-bike-anchor
            className="relative mx-auto aspect-square w-full max-w-[34rem]"
          >
            <div
              aria-hidden="true"
              className="absolute inset-[5%] rounded-full bg-white/70"
            />
            <Image
              src="/images/hero/bicycle.png"
              alt="Lumira electric city bike in ocean blue with a coral saddle, grips and mudguards, side view"
              width={1570}
              height={1001}
              sizes="(min-width: 768px) 40vw, 90vw"
              priority
              className="bike-fallback absolute top-1/2 left-1/2 h-auto w-[106%] max-w-none -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <ul
            aria-label="Highlights"
            className="relative z-10 mt-2 flex flex-wrap justify-center gap-2"
          >
            {HIGHLIGHTS.map((label) => (
              <li
                key={label}
                className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-ocean-deep shadow-md shadow-ocean-deep/10"
              >
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-ocean"
                />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 order-1 md:order-2">
          <p className="mb-5 flex items-center gap-2 text-xs font-semibold tracking-widest text-ocean-soft uppercase">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-coral"
            />
            Electric city bike
          </p>
          <h1
            id="hero-heading"
            className="font-display text-5xl leading-[1.04] font-extrabold tracking-tight text-ocean-deep sm:text-6xl"
          >
            The easy way{" "}
            <span className="whitespace-nowrap underline decoration-coral decoration-[7px] underline-offset-[7px]">
              across town.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-ocean-soft sm:text-lg">
            A step through frame and a quiet motor. Try one at a store near you.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href="/test-ride"
              className="inline-flex h-12 items-center rounded-full bg-coral px-8 text-sm font-semibold text-white shadow-md shadow-coral/30 transition-colors hover:bg-coral-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ocean-deep"
            >
              Book a test ride
            </Link>
            <Link
              href="/bikes"
              className="text-sm font-semibold text-ocean-deep underline decoration-ocean-deep/30 decoration-2 underline-offset-4 hover:decoration-ocean-deep"
            >
              See the bike
            </Link>
          </div>
          {/* TODO(content): sample price for layout only; use the client's real starting price. */}
          <p className="mt-5 text-sm text-ocean-soft">
            From{" "}
            <span className="font-display text-lg font-bold text-ocean-deep">
              ₹49,999
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
