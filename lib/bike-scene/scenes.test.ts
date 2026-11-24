import { describe, expect, it } from "vitest";
import {
  TALL_FRAMES,
  WIDE_FRAMES,
  blendFrames,
  framesFor,
  locateScene,
} from "./scenes";

const CENTRES = [500, 1500, 2500, 3500];

describe("locateScene", () => {
  it("holds the first scene before the first section", () => {
    expect(locateScene(CENTRES, 0)).toEqual({ from: 0, to: 0, t: 0 });
  });

  it("holds the last scene after the last section", () => {
    expect(locateScene(CENTRES, 9999)).toEqual({ from: 3, to: 3, t: 0 });
  });

  it("holds a pose while a section is in view", () => {
    expect(locateScene(CENTRES, 1500 + 100).t).toBe(0);
    expect(locateScene(CENTRES, 2500 - 100).t).toBe(1);
  });

  it("blends halfway at the midpoint between two sections", () => {
    const place = locateScene(CENTRES, 2000);
    expect(place).toMatchObject({ from: 1, to: 2 });
    expect(place.t).toBeCloseTo(0.5);
  });

  it("copes with no sections", () => {
    expect(locateScene([], 100)).toEqual({ from: 0, to: 0, t: 0 });
  });
});

describe("blendFrames", () => {
  it("returns each end of the range at t = 0 and t = 1", () => {
    const a = WIDE_FRAMES.hero;
    const b = WIDE_FRAMES.battery;
    expect(blendFrames(a, b, 0)).toEqual(a);
    expect(blendFrames(a, b, 1)).toEqual(b);
  });

  it("interpolates distance linearly", () => {
    const a = WIDE_FRAMES.hero;
    const b = WIDE_FRAMES.battery;
    expect(blendFrames(a, b, 0.5).distance).toBeCloseTo(
      (a.distance + b.distance) / 2,
    );
  });
});

describe("framesFor", () => {
  it("uses the portrait layout on tall screens and landscape otherwise", () => {
    expect(framesFor(0.5)).toBe(TALL_FRAMES);
    expect(framesFor(1.6)).toBe(WIDE_FRAMES);
  });
});
