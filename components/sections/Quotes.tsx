// TODO(content): these are SAMPLE quotes from made-up riders, for layout only.
// Replace them with real, permissioned customer quotes before launch; never
// publish invented testimonials.
const QUOTES = [
  {
    text: "I swapped my scooter for the Lumira and haven't looked back. The ride is smooth and quiet.",
    name: "Priya S.",
    place: "Pune",
  },
  {
    text: "Easy to get on and off, and the test ride at the store made the decision simple.",
    name: "Arjun M.",
    place: "Bengaluru",
  },
] as const;

export function Quotes() {
  return (
    <section aria-labelledby="quotes-heading" className="bg-white">
      <div className="relative z-10 mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-16">
        <h2
          id="quotes-heading"
          className="font-display text-3xl font-extrabold tracking-tight text-ocean-deep sm:text-4xl"
        >
          Riders say.
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {QUOTES.map((quote, index) => (
            <figure
              key={index}
              data-placeholder
              className="rounded-3xl bg-sky p-7"
            >
              <span
                aria-hidden="true"
                className="block h-9 font-display text-7xl leading-none font-extrabold text-coral/50"
              >
                “
              </span>
              <blockquote className="font-display text-xl leading-snug font-bold text-ocean-deep">
                “{quote.text}”
              </blockquote>
              <figcaption className="mt-5 text-sm text-ocean-soft">
                {quote.name}, {quote.place}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
