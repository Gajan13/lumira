// The bike doesn't jump between sections: it rides a curved route that
// connects the sections' anchors (page coordinates). Each leg is an S-shaped
// cubic Bézier that leaves and arrives vertically, so the route weaves down
// the page. The same route is drawn as the dashed road line.
export type Point = { x: number; y: number };

type Leg = readonly [Point, Point, Point, Point];

export type Route = {
  points: readonly Point[];
  legs: readonly Leg[];
};

const CURVE_TENSION = 0.55;

function bezier(leg: Leg, u: number): Point {
  const k = 1 - u;
  const a = k * k * k;
  const b = 3 * k * k * u;
  const c = 3 * k * u * u;
  const d = u * u * u;
  return {
    x: a * leg[0].x + b * leg[1].x + c * leg[2].x + d * leg[3].x,
    y: a * leg[0].y + b * leg[1].y + c * leg[2].y + d * leg[3].y,
  };
}

export function buildRoute(points: readonly Point[]): Route {
  const legs: Leg[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];
    const dy = to.y - from.y;
    legs.push([
      from,
      { x: from.x, y: from.y + dy * CURVE_TENSION },
      { x: to.x, y: to.y - dy * CURVE_TENSION },
      to,
    ]);
  }
  return { points, legs };
}

/** Where the bike is on leg `leg`, `t` (0–1) of the way along it. */
export function pointOnRoute(route: Route, leg: number, t: number): Point {
  const last = route.points.length - 1;
  if (last < 0) return { x: 0, y: 0 };
  if (leg >= last) return route.points[last];
  return bezier(route.legs[Math.max(0, leg)], Math.min(1, Math.max(0, t)));
}

/** −1 if the leg heads left, +1 if it heads right, 0 if straight down. */
export function legHeading(route: Route, leg: number): -1 | 0 | 1 {
  const from = route.points[leg];
  const to = route.points[leg + 1];
  if (!from || !to) return 0;
  const dx = to.x - from.x;
  return Math.abs(dx) < 1 ? 0 : dx < 0 ? -1 : 1;
}

/** SVG path data for drawing the whole route. */
export function routePathData(route: Route): string {
  if (!route.legs.length) return "";
  const [start] = route.legs[0];
  const parts = [`M ${start.x.toFixed(1)} ${start.y.toFixed(1)}`];
  for (const [, c1, c2, end] of route.legs) {
    parts.push(
      `C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${end.x.toFixed(1)} ${end.y.toFixed(1)}`,
    );
  }
  return parts.join(" ");
}
