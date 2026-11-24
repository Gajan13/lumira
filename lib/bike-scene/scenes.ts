// Camera poses for the scroll-driven bike. Each page section marked
// `data-scene="<id>"` maps to one pose; between sections the camera blends.
//
// Camera orbits a target point:
//   azimuth   radians around the bike (0 = pure side view, + moves toward the front)
//   elevation radians above the horizon
//   distance  world units from the target (used only when a scene has no anchor)
//   shiftX/Y  fraction of the screen to push the bike (X: + right, Y: + down);
//             overridden by the section's `[data-bike-anchor]` element when present
//   fill      how large the bike appears relative to its anchor's width
//             (1 = bike length equals anchor width; 2 = zoomed to about half the bike)
//   night     0–1, dims the studio lights and switches on the bike's lamps
//   highlight 0–1, makes the battery area glow
//   visible   0–1, fades the whole stage (used once the bike's job is done)
export type SceneId = "hero" | "battery" | "lights" | "colours" | "outro";

export type Vec3 = readonly [number, number, number];

export type SceneFrame = {
  azimuth: number;
  elevation: number;
  distance: number;
  target: Vec3;
  shiftX: number;
  shiftY: number;
  fill: number;
  night: number;
  highlight: number;
  visible: number;
};

type SceneFrames = Record<SceneId, SceneFrame>;

// Pose settings shared by both layouts.
const POSES = {
  hero: {
    azimuth: 0.32,
    elevation: 0.08,
    target: [0.02, 0.5, 0],
    fill: 1.06,
    night: 0,
    highlight: 0,
    visible: 1,
  },
  battery: {
    azimuth: 0.14,
    elevation: 0.1,
    target: [0.3, 0.52, 0],
    fill: 1.2,
    night: 0,
    highlight: 1,
    visible: 1,
  },
  lights: {
    azimuth: 0.9,
    elevation: 0.1,
    target: [0.25, 0.7, 0],
    fill: 1.5,
    night: 1,
    highlight: 0,
    visible: 1,
  },
  colours: {
    azimuth: 0.55,
    elevation: 0.1,
    target: [0.02, 0.5, 0],
    fill: 1.0,
    night: 0,
    highlight: 0,
    visible: 1,
  },
  outro: {
    azimuth: 0.55,
    elevation: 0.1,
    target: [0.02, 0.5, 0],
    fill: 1.0,
    night: 0,
    highlight: 0,
    visible: 0,
  },
} as const satisfies Record<
  SceneId,
  Omit<SceneFrame, "distance" | "shiftX" | "shiftY">
>;

// Landscape / desktop: text sits beside the bike.
export const WIDE_FRAMES: SceneFrames = {
  hero: { ...POSES.hero, distance: 5.6, shiftX: -0.24, shiftY: 0.02 },
  battery: { ...POSES.battery, distance: 3.5, shiftX: 0.27, shiftY: 0 },
  lights: { ...POSES.lights, distance: 3.3, shiftX: -0.22, shiftY: 0 },
  colours: { ...POSES.colours, distance: 5.2, shiftX: 0.22, shiftY: 0 },
  outro: { ...POSES.outro, distance: 5.2, shiftX: 0.22, shiftY: -0.35 },
};

// Portrait / phone: text on top, bike below it.
export const TALL_FRAMES: SceneFrames = {
  hero: { ...POSES.hero, distance: 8.8, shiftX: 0, shiftY: 0.27 },
  battery: { ...POSES.battery, distance: 6.4, shiftX: 0, shiftY: 0.24 },
  lights: { ...POSES.lights, distance: 6.2, shiftX: 0, shiftY: 0.24 },
  colours: { ...POSES.colours, distance: 8.8, shiftX: 0, shiftY: 0.26 },
  outro: { ...POSES.outro, distance: 8.8, shiftX: 0, shiftY: -0.35 },
};

export function framesFor(aspect: number): SceneFrames {
  return aspect < 1 ? TALL_FRAMES : WIDE_FRAMES;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const smoothstep = (t: number) => t * t * (3 - 2 * t);

export type SceneLocation = { from: number; to: number; t: number };

/**
 * Where the viewport's centre line sits between section centres.
 * `centres` are page-space Y positions of each scene section's centre, in
 * order. The bike holds each pose while its section is in view and only
 * blends through the middle half of the gap between two sections.
 */
export function locateScene(
  centres: readonly number[],
  y: number,
): SceneLocation {
  const last = centres.length - 1;
  if (last < 0) return { from: 0, to: 0, t: 0 };
  if (y <= centres[0]) return { from: 0, to: 0, t: 0 };
  if (y >= centres[last]) return { from: last, to: last, t: 0 };
  let i = 0;
  while (i < last - 1 && y >= centres[i + 1]) i++;
  const span = centres[i + 1] - centres[i];
  const raw = span > 0 ? (y - centres[i]) / span : 0;
  return { from: i, to: i + 1, t: smoothstep(clamp01((raw - 0.25) / 0.5)) };
}

export function blendFrames(
  a: SceneFrame,
  b: SceneFrame,
  t: number,
): SceneFrame {
  // Exact at both ends so a held pose never drifts by rounding error.
  const mix = (x: number, y: number) =>
    t <= 0 ? x : t >= 1 ? y : x + (y - x) * t;
  return {
    azimuth: mix(a.azimuth, b.azimuth),
    elevation: mix(a.elevation, b.elevation),
    distance: mix(a.distance, b.distance),
    target: [
      mix(a.target[0], b.target[0]),
      mix(a.target[1], b.target[1]),
      mix(a.target[2], b.target[2]),
    ],
    shiftX: mix(a.shiftX, b.shiftX),
    shiftY: mix(a.shiftY, b.shiftY),
    fill: mix(a.fill, b.fill),
    night: mix(a.night, b.night),
    highlight: mix(a.highlight, b.highlight),
    visible: mix(a.visible, b.visible),
  };
}
