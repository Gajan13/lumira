import { describe, expect, it } from "vitest";
import { canRun3d, type DeviceEnvironment } from "./eligibility";

const CAPABLE: DeviceEnvironment = {
  prefersReducedMotion: false,
  hasWebGL: true,
  saveData: false,
  deviceMemoryGb: 8,
  logicalCores: 8,
};

describe("canRun3d", () => {
  it("allows a capable device", () => {
    expect(canRun3d(CAPABLE)).toBe(true);
  });

  it("allows a device that doesn't report memory or cores", () => {
    expect(
      canRun3d({
        ...CAPABLE,
        deviceMemoryGb: undefined,
        logicalCores: undefined,
      }),
    ).toBe(true);
  });

  it.each([
    ["reduced motion", { prefersReducedMotion: true }],
    ["data saver", { saveData: true }],
    ["no WebGL", { hasWebGL: false }],
    ["low memory", { deviceMemoryGb: 2 }],
    ["few cores", { logicalCores: 2 }],
  ])("falls back to the photo for %s", (_name, override) => {
    expect(canRun3d({ ...CAPABLE, ...override })).toBe(false);
  });
});
