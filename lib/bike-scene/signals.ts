// Values the camera rig publishes every frame for the rest of the 3D scene to
// read (lamps, lighting, battery glow). A plain module object: it changes 60
// times a second and must never trigger React renders.
export const sceneSignals = {
  /** 0–1: dark scene, lamps on. */
  night: 0,
  /** 0–1: battery area glows. */
  highlight: 0,
};
