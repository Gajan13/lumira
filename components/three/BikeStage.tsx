"use client";

// Fixed, full-screen canvas that draws the bike above the page background and
// below the page's text. It is decorative (aria-hidden, no pointer events);
// all real content stays in normal HTML.
//
// Each section can mark an element `data-bike-anchor`. The bike rides a curved
// route through those anchors (lib/bike-scene/route.ts): it sits exactly on an
// anchor while its section is in view, and travels along the road line to the
// next one, turning to face the way it goes and rolling its wheels as it moves.
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import {
  MathUtils,
  PMREMGenerator,
  Vector3,
  type DirectionalLight,
  type HemisphereLight,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { measureAnchors } from "@/lib/bike-scene/anchors";
import {
  buildRoute,
  legHeading,
  pointOnRoute,
  type Route,
} from "@/lib/bike-scene/route";
import {
  blendFrames,
  framesFor,
  locateScene,
  type SceneFrame,
  type SceneId,
} from "@/lib/bike-scene/scenes";
import { sceneSignals } from "@/lib/bike-scene/signals";
import { BikeModel } from "./BikeModel";

const STAGE_ID = "bike-stage";
const DAMPING = 4.5;
const SIGNAL_DAMPING = 3;
const FLOAT_AMPLITUDE = 0.012;
const FOV_DEGREES = 30;
const TAN_HALF_FOV = Math.tan(MathUtils.degToRad(FOV_DEGREES / 2));
const BIKE_LENGTH_UNITS = 1.7;

type SceneSection = {
  id: SceneId;
  centre: number;
  anchor: HTMLElement | null;
};

// Same shape as SceneFrame, but mutable so it can be eased every frame.
type LiveFrame = Omit<SceneFrame, "target"> & {
  target: [number, number, number];
};

function measureSections(): SceneSection[] {
  return Array.from(document.querySelectorAll<HTMLElement>("[data-scene]")).map(
    (el) => {
      const rect = el.getBoundingClientRect();
      return {
        id: el.dataset.scene as SceneId,
        centre: rect.top + window.scrollY + rect.height / 2,
        anchor: el.querySelector<HTMLElement>("[data-bike-anchor]"),
      };
    },
  );
}

/** Size the bike to the section's anchor (zoom), and fall back to the pose's own shift without one. */
function resolveFrame(
  base: SceneFrame,
  anchor: HTMLElement | null,
): SceneFrame {
  if (!anchor) return base;
  const rect = anchor.getBoundingClientRect();
  if (rect.width < 1) return base;
  const bikePixels = rect.width * base.fill;
  return {
    ...base,
    distance:
      (BIKE_LENGTH_UNITS * window.innerHeight) /
      (2 * TAN_HALF_FOV * bikePixels),
  };
}

function CameraRig() {
  const sections = useRef<SceneSection[]>([]);
  const route = useRef<Route | null>(null);
  const current = useRef<LiveFrame | null>(null);
  const look = useRef(new Vector3());

  useEffect(() => {
    const measure = () => {
      sections.current = measureSections();
      route.current = buildRoute(measureAnchors());
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

  useFrame(({ camera, size, clock }, delta) => {
    const list = sections.current;
    const path = route.current;
    if (!list.length || !path) return;

    const frames = framesFor(size.width / size.height);
    const viewW = window.innerWidth;
    const viewH = window.innerHeight;
    const viewportCentre = window.scrollY + viewH / 2;
    const place = locateScene(
      list.map((section) => section.centre),
      viewportCentre,
    );
    const from = list[place.from];
    const to = list[place.to];
    const a = resolveFrame(frames[from.id], from.anchor);
    const b =
      place.to === place.from ? a : resolveFrame(frames[to.id], to.anchor);
    const target = blendFrames(a, b, place.t);

    // Position: ride the route when both ends are anchored (anchored scenes come first).
    const anchoredCount = path.points.length;
    const isOnRoute = place.to < anchoredCount;
    const spot = isOnRoute
      ? place.to === place.from
        ? path.points[place.from]
        : pointOnRoute(path, place.from, place.t)
      : null;
    if (spot) {
      target.shiftX = (spot.x - window.scrollX - viewW / 2) / viewW;
      target.shiftY = (spot.y - window.scrollY - viewH / 2) / viewH;
    } else if (place.from < anchoredCount) {
      // Leaving the last anchor for a scene without one: start from the anchor, then drift.
      const here = path.points[place.from];
      const startX = (here.x - window.scrollX - viewW / 2) / viewW;
      const startY = (here.y - window.scrollY - viewH / 2) / viewH;
      target.shiftX = MathUtils.lerp(startX, b.shiftX, place.t);
      target.shiftY = MathUtils.lerp(startY, b.shiftY, place.t);
    }

    // Turn to face the way it travels: leftward legs swing the bike through a U-turn
    // (front toward the camera) and back to its resting pose on arrival.
    const isLeftward =
      isOnRoute && place.to !== place.from && legHeading(path, place.from) < 0;
    const turn = isLeftward ? Math.PI * Math.sin(Math.PI * place.t) ** 2 : 0;

    // First frame starts on the target pose; afterwards ease toward it.
    current.current ??= {
      ...target,
      target: [target.target[0], target.target[1], target.target[2]],
    };
    const frame = current.current;
    frame.azimuth = MathUtils.damp(
      frame.azimuth,
      target.azimuth + turn,
      DAMPING,
      delta,
    );
    frame.elevation = MathUtils.damp(
      frame.elevation,
      target.elevation,
      DAMPING,
      delta,
    );
    frame.distance = MathUtils.damp(
      frame.distance,
      target.distance,
      DAMPING,
      delta,
    );
    const focus = frame.target;
    focus[0] = MathUtils.damp(focus[0], target.target[0], DAMPING, delta);
    focus[1] = MathUtils.damp(focus[1], target.target[1], DAMPING, delta);
    focus[2] = MathUtils.damp(focus[2], target.target[2], DAMPING, delta);
    // Screen position follows the route exactly (no easing) so the bike never lags the layout.
    frame.shiftX = target.shiftX;
    frame.shiftY = target.shiftY;
    frame.visible = MathUtils.damp(
      frame.visible,
      target.visible,
      SIGNAL_DAMPING,
      delta,
    );

    sceneSignals.night = MathUtils.damp(
      sceneSignals.night,
      target.night,
      SIGNAL_DAMPING,
      delta,
    );
    sceneSignals.highlight = MathUtils.damp(
      sceneSignals.highlight,
      target.highlight,
      SIGNAL_DAMPING,
      delta,
    );
    const stage = document.getElementById(STAGE_ID);
    if (stage) stage.style.opacity = frame.visible.toFixed(3);

    const bob = Math.sin(clock.elapsedTime * 0.8) * FLOAT_AMPLITUDE;
    look.current.set(focus[0], focus[1] + bob, focus[2]);
    const horizontal = Math.cos(frame.elevation) * frame.distance;
    camera.position.set(
      look.current.x + Math.sin(frame.azimuth) * horizontal,
      look.current.y + Math.sin(frame.elevation) * frame.distance,
      look.current.z + Math.cos(frame.azimuth) * horizontal,
    );
    camera.lookAt(look.current);
    camera.setViewOffset(
      size.width,
      size.height,
      -frame.shiftX * size.width,
      -frame.shiftY * size.height,
      size.width,
      size.height,
    );
  });

  return null;
}

// Soft studio lighting. The reflections come from three's built-in room
// (generated in code, nothing downloaded) so the metal parts catch light.
// At night the whole rig dims so the lamps read.
function Lights() {
  const gl = useThree((state) => state.gl);
  const hemisphere = useRef<HemisphereLight>(null);
  const key = useRef<DirectionalLight>(null);
  const fill = useRef<DirectionalLight>(null);
  const environment = useMemo(() => {
    const generator = new PMREMGenerator(gl);
    const target = generator.fromScene(new RoomEnvironment(), 0.04);
    generator.dispose();
    return target;
  }, [gl]);

  useEffect(() => {
    gl.setClearColor(0x000000, 0);
  }, [gl]);
  useEffect(() => () => environment.dispose(), [environment]);

  useFrame(({ scene }) => {
    const dim = 1 - 0.7 * sceneSignals.night;
    if (hemisphere.current) hemisphere.current.intensity = 0.5 * dim;
    if (key.current) key.current.intensity = 1.8 * dim;
    if (fill.current) fill.current.intensity = 0.6 * dim;
    scene.environmentIntensity = 0.9 * (1 - 0.65 * sceneSignals.night);
  });

  return (
    <>
      <primitive object={environment.texture} attach="environment" />
      <hemisphereLight ref={hemisphere} args={["#ffffff", "#cfe0ec", 0.5]} />
      <directionalLight ref={key} position={[3, 4, 3]} intensity={1.8} />
      <directionalLight
        ref={fill}
        position={[-3, 2, -2]}
        intensity={0.6}
        color="#cfe6ff"
      />
    </>
  );
}

export default function BikeStage() {
  return (
    <div
      id={STAGE_ID}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[5]"
    >
      <Canvas
        camera={{ fov: FOV_DEGREES, near: 0.1, far: 50, position: [0, 0.6, 4] }}
        dpr={[1, 2]}
        scene={{ environmentIntensity: 0.9 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Lights />
        <CameraRig />
        <Suspense fallback={null}>
          <BikeModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
