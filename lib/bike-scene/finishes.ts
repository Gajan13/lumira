// Frame finishes offered by the colour picker. Names and hex values come from
// the Sky / Ocean / Coral brand palette in app/globals.css.
// TODO(content): confirm the real finish names and colours with the client.
export const FINISHES = [
  { id: "ocean", label: "Ocean", frame: "#1d4f6e", accent: "#ff6b5a" },
  { id: "coral", label: "Coral", frame: "#ff6b5a", accent: "#143a52" },
  { id: "sky", label: "Sky", frame: "#9fc3dc", accent: "#ff6b5a" },
] as const;

export type FinishId = (typeof FINISHES)[number]["id"];

export const DEFAULT_FINISH_ID: FinishId = "ocean";

export function getFinish(id: FinishId) {
  return FINISHES.find((finish) => finish.id === id) ?? FINISHES[0];
}
