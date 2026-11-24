// The bike's job on the page is done by here, so this section is the "outro"
// scene: the 3D stage fades out as it scrolls in.
// TODO(content): these are SAMPLE odd numbers for layout only. Replace every
// value with real figures from the client; never publish invented specs.
const SPECS = [
  { label: "Range", value: "75", unit: "km" },
  { label: "Weight", value: "23", unit: "kg" },
  { label: "Top speed", value: "25", unit: "km/h" },
  { label: "Full charge", value: "5", unit: "hours" },
] as const;

export function SpecsStrip() {
  return (
    <section
      data-scene="outro"
      aria-labelledby="specs-heading"
      className="bg-sky"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-16">
        <h2
          id="specs-heading"
          className="font-display text-3xl font-extrabold tracking-tight text-ocean-deep sm:text-4xl"
        >
          The numbers.
        </h2>
        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          {SPECS.map((spec) => (
            <div
              key={spec.label}
              data-placeholder
              className="flex flex-col-reverse gap-1 border-t-2 border-ocean-deep/15 pt-4"
            >
              <dt className="text-sm font-medium text-ocean-soft">
                {spec.label}
              </dt>
              <dd className="font-display text-5xl font-extrabold tracking-tight text-ocean-deep md:text-6xl">
                {spec.value}
                <span className="ml-1.5 text-xl font-bold text-ocean-soft">
                  {spec.unit}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
