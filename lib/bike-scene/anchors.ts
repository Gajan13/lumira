// Finds where the bike's anchors are on the page, so the camera rig (which
// moves the bike along a route) and the route line (which draws it) always
// agree. Browser only.
import { type Point } from "./route";

export type AnchorSpot = Point & { width: number; height: number };

/**
 * Page-coordinate centres of every scene's `[data-bike-anchor]`, in page order.
 * Scenes without an anchor (the outro) are skipped, so anchored scenes must come first.
 */
export function measureAnchors(): AnchorSpot[] {
  const spots: AnchorSpot[] = [];
  document.querySelectorAll<HTMLElement>("[data-scene]").forEach((section) => {
    const anchor = section.querySelector<HTMLElement>("[data-bike-anchor]");
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    if (rect.width < 1) return;
    spots.push({
      x: rect.left + window.scrollX + rect.width / 2,
      y: rect.top + window.scrollY + rect.height / 2,
      width: rect.width,
      height: rect.height,
    });
  });
  return spots;
}
