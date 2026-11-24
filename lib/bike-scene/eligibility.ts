// Decides whether to run the 3D bike at all. The static hero photo stays for
// everyone else, so phones that are weak, saving data, or set to reduced
// motion never download three.js.
export type DeviceEnvironment = {
  prefersReducedMotion: boolean;
  hasWebGL: boolean;
  saveData: boolean;
  deviceMemoryGb?: number;
  logicalCores?: number;
};

const MIN_MEMORY_GB = 4;
const MIN_CORES = 4;

export function canRun3d(env: DeviceEnvironment): boolean {
  if (env.prefersReducedMotion || env.saveData || !env.hasWebGL) return false;
  if (env.deviceMemoryGb !== undefined && env.deviceMemoryGb < MIN_MEMORY_GB)
    return false;
  if (env.logicalCores !== undefined && env.logicalCores < MIN_CORES)
    return false;
  return true;
}

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

export function detectEnvironment(): DeviceEnvironment {
  const nav = navigator as NavigatorWithHints;
  return {
    prefersReducedMotion:
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    hasWebGL: detectWebGL(),
    saveData: nav.connection?.saveData === true,
    deviceMemoryGb: nav.deviceMemory,
    logicalCores: nav.hardwareConcurrency,
  };
}
