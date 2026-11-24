"use client";

// The dashed "road" the bike rides: the same curved route the 3D bike follows
// (lib/bike-scene/route.ts), drawn behind it. Place inside a `relative`
// container that spans the scene sections. Hidden on phones, where the
// sections are stacked in a single column.
import { useEffect, useRef, useState } from "react";
import { measureAnchors } from "@/lib/bike-scene/anchors";
import { buildRoute, routePathData } from "@/lib/bike-scene/route";

type Drawing = {
  d: string;
  width: number;
  height: number;
  ends: readonly { x: number; y: number }[];
};

export function RoutePath() {
  const svg = useRef<SVGSVGElement>(null);
  const [drawing, setDrawing] = useState<Drawing | null>(null);

  useEffect(() => {
    const measure = () => {
      const container = svg.current?.parentElement;
      if (!container) return;
      const box = container.getBoundingClientRect();
      const originX = box.left + window.scrollX;
      const originY = box.top + window.scrollY;
      const spots = measureAnchors().map((spot) => ({
        x: spot.x - originX,
        y: spot.y - originY,
      }));
      setDrawing(
        spots.length > 1
          ? {
              d: routePathData(buildRoute(spots)),
              width: box.width,
              height: box.height,
              ends: spots,
            }
          : null,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, []);

  return (
    <svg
      ref={svg}
      aria-hidden="true"
      width={drawing?.width ?? 0}
      height={drawing?.height ?? 0}
      viewBox={`0 0 ${drawing?.width ?? 0} ${drawing?.height ?? 0}`}
      className="pointer-events-none absolute top-0 left-0 z-[1] hidden md:block"
    >
      {drawing ? (
        <>
          <path
            d={drawing.d}
            fill="none"
            stroke="#ff6b5a"
            strokeOpacity="0.5"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="1 14"
          />
          {drawing.ends.map((end, index) => (
            <circle
              key={index}
              cx={end.x}
              cy={end.y}
              r="5"
              fill="#ff6b5a"
              fillOpacity="0.55"
            />
          ))}
        </>
      ) : null}
    </svg>
  );
}
