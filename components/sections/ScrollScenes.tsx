import { BikeAnchor } from "./BikeAnchor";
import { ColourPicker } from "./ColourPicker";
import { BatteryDecor, ColourDecor, NightDecor } from "./Decor";
import { FeatureIcon } from "./FeatureIcon";

// The three feature sections the 3D bike reacts to. Each has its own
// background so the page has rhythm, its own decoration, and its own
// `data-scene` that matches a pose in lib/bike-scene/scenes.ts. The bike is
// drawn on the BikeAnchor.
// TODO(content): replace the placeholder copy with approved text from the client.
const HEADING =
  "font-display text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl";
const GRID =
  "relative mx-auto grid max-w-6xl gap-6 px-5 py-12 sm:px-8 md:grid-cols-2 md:items-center md:gap-12 md:py-14";

export function ScrollScenes() {
  return (
    <>
      {/* Battery: deep navy, battery area glows */}
      <section
        data-scene="battery"
        aria-labelledby="battery-heading"
        className="relative bg-ocean-deep text-white"
      >
        <BatteryDecor />
        <div className={GRID}>
          <div className="relative z-10 max-w-sm">
            <FeatureIcon name="battery" tone="light" />
            <h2 id="battery-heading" className={HEADING}>
              Take the power with you.
            </h2>
            <p className="mt-4 text-lg leading-8 text-ocean-mist">
              Lift the battery out and charge it wherever suits you.
            </p>
          </div>
          <BikeAnchor />
        </div>
      </section>

      {/* Lights: night, lamps glow */}
      <section
        data-scene="lights"
        aria-labelledby="lights-heading"
        className="relative bg-night bg-[radial-gradient(70%_90%_at_25%_50%,#17394e_0%,#08141d_72%)] text-white"
      >
        <NightDecor />
        <div className={GRID}>
          <BikeAnchor className="order-2 md:order-1" />
          <div className="relative z-10 order-1 max-w-md md:order-2 md:ml-auto">
            <FeatureIcon name="light" tone="light" />
            <h2 id="lights-heading" className={HEADING}>
              Seen from every side.
            </h2>
            <p className="mt-4 text-lg leading-8 text-ocean-mist">
              Front and rear lights are part of the bike, so there is nothing
              extra to fit.
            </p>
          </div>
        </div>
      </section>

      {/* Colours: warm off-white, swatches sit right under the bike */}
      <section
        id="colours"
        data-scene="colours"
        aria-labelledby="colours-heading"
        className="relative bg-cream text-ocean-deep"
      >
        <ColourDecor />
        <div className={GRID}>
          <div className="relative z-10 max-w-md">
            <FeatureIcon name="palette" tone="dark" />
            <h2 id="colours-heading" className={HEADING}>
              Make it yours.
            </h2>
            <p className="mt-4 text-lg leading-8 text-ocean-soft">
              Choose a frame colour and watch the bike change.
            </p>
          </div>
          <div>
            <BikeAnchor />
            <ColourPicker />
          </div>
        </div>
      </section>
    </>
  );
}
