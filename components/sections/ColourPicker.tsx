"use client";

import { setFinishId, useFinishId } from "@/lib/bike-scene/finish-store";
import { FINISHES, type FinishId } from "@/lib/bike-scene/finishes";

export function ColourPicker() {
  const selectedId = useFinishId();

  return (
    <fieldset className="relative z-10 mt-2">
      <legend className="sr-only">Frame colour</legend>
      <div className="flex flex-wrap justify-center gap-3">
        {FINISHES.map((finish) => (
          <label key={finish.id} className="cursor-pointer">
            <input
              type="radio"
              name="frame-colour"
              value={finish.id}
              checked={selectedId === finish.id}
              onChange={() => setFinishId(finish.id as FinishId)}
              className="peer sr-only"
            />
            <span className="flex items-center gap-3 rounded-full bg-white py-2 pr-5 pl-2 text-sm font-semibold text-ocean-deep shadow-md shadow-ocean-deep/10 transition peer-checked:bg-ocean-deep peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-coral">
              <span
                aria-hidden="true"
                className="size-7 rounded-full ring-2 ring-white"
                style={{ backgroundColor: finish.frame }}
              />
              {finish.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
