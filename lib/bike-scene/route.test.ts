import { describe, expect, it } from "vitest";
import { buildRoute, legHeading, pointOnRoute, routePathData } from "./route";

// Zig-zag down a page: left, right, left.
const POINTS = [
  { x: 200, y: 300 },
  { x: 900, y: 1000 },
  { x: 250, y: 1700 },
];

describe("route", () => {
  const route = buildRoute(POINTS);

  it("starts and ends exactly on the anchors", () => {
    expect(pointOnRoute(route, 0, 0)).toEqual(POINTS[0]);
    expect(pointOnRoute(route, 0, 1)).toEqual(POINTS[1]);
    expect(pointOnRoute(route, 1, 1)).toEqual(POINTS[2]);
  });

  it("holds the last anchor once past the end", () => {
    expect(pointOnRoute(route, 2, 0.5)).toEqual(POINTS[2]);
  });

  it("curves: the middle of a leg is not on the straight line between anchors", () => {
    const middle = pointOnRoute(route, 0, 0.5);
    expect(middle.x).toBeCloseTo(550, 0); // halfway across, by symmetry
    expect(middle.y).toBeCloseTo(650, 0);
    const early = pointOnRoute(route, 0, 0.15);
    const straightX = POINTS[0].x + (POINTS[1].x - POINTS[0].x) * 0.15;
    expect(early.x).toBeLessThan(straightX); // leaves vertically, so it lags horizontally at first
  });

  it("reports which way each leg heads", () => {
    expect(legHeading(route, 0)).toBe(1);
    expect(legHeading(route, 1)).toBe(-1);
    expect(legHeading(route, 2)).toBe(0);
  });

  it("writes SVG path data with one curve per leg", () => {
    const d = routePathData(route);
    expect(d.startsWith("M 200.0 300.0")).toBe(true);
    expect(d.match(/C /g)).toHaveLength(2);
  });

  it("copes with fewer than two points", () => {
    expect(routePathData(buildRoute([]))).toBe("");
    expect(pointOnRoute(buildRoute([{ x: 5, y: 6 }]), 0, 0.5)).toEqual({
      x: 5,
      y: 6,
    });
  });
});
