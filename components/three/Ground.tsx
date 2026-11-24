"use client";

// Things on and above the ground: a soft contact shadow, and (at night) the
// glow of the bike's lamps plus a pool of light in front of it.
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  CanvasTexture,
  type MeshBasicMaterial,
  type Sprite,
  type SpriteMaterial,
} from "three";
import { sceneSignals } from "@/lib/bike-scene/signals";

// Lamp positions in scene units (bike centred on x = 0, ground at y = 0).
// TODO(content): re-measure if the model changes.
const FRONT_LAMP = [0.42, 0.7, 0] as const;
const REAR_LAMP = [-0.72, 0.62, 0] as const;

function paintTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx) draw(ctx, width, height);
  return new CanvasTexture(canvas);
}

function radialTexture(
  stops: readonly (readonly [number, string])[],
): CanvasTexture {
  return paintTexture(128, 128, (ctx, w, h) => {
    const gradient = ctx.createRadialGradient(
      w / 2,
      h / 2,
      0,
      w / 2,
      h / 2,
      w / 2,
    );
    stops.forEach(([at, colour]) => gradient.addColorStop(at, colour));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  });
}

function beamTexture(): CanvasTexture {
  return paintTexture(256, 128, (ctx, w, h) => {
    ctx.filter = "blur(7px)";
    const gradient = ctx.createLinearGradient(0, 0, w, 0);
    gradient.addColorStop(0, "rgba(255,244,214,0.95)");
    gradient.addColorStop(0.5, "rgba(255,244,214,0.35)");
    gradient.addColorStop(1, "rgba(255,244,214,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.46);
    ctx.lineTo(w * 0.96, h * 0.08);
    ctx.lineTo(w * 0.96, h * 0.92);
    ctx.lineTo(0, h * 0.54);
    ctx.closePath();
    ctx.fill();
  });
}

export function Ground() {
  const textures = useMemo(
    () => ({
      shadow: radialTexture([
        [0, "rgba(0,0,0,0.7)"],
        [0.45, "rgba(0,0,0,0.32)"],
        [1, "rgba(0,0,0,0)"],
      ]),
      glow: radialTexture([
        [0, "rgba(255,255,255,1)"],
        [0.25, "rgba(255,255,255,0.45)"],
        [1, "rgba(255,255,255,0)"],
      ]),
      beam: beamTexture(),
    }),
    [],
  );
  useEffect(
    () => () => {
      Object.values(textures).forEach((texture) => texture.dispose());
    },
    [textures],
  );

  const shadow = useRef<MeshBasicMaterial>(null);
  const beam = useRef<MeshBasicMaterial>(null);
  const front = useRef<Sprite>(null);
  const rear = useRef<Sprite>(null);

  useFrame(() => {
    const night = sceneSignals.night;
    if (shadow.current) shadow.current.opacity = 0.5 - 0.3 * night;
    if (beam.current) beam.current.opacity = 0.5 * night;
    if (front.current)
      (front.current.material as SpriteMaterial).opacity = 0.95 * night;
    if (rear.current)
      (rear.current.material as SpriteMaterial).opacity = 0.85 * night;
  });

  return (
    <group>
      {/* Soft shadow hugging the tyres */}
      <mesh
        position={[0, 0.002, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[1.9, 0.34, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={shadow}
          map={textures.shadow}
          color="#0a2233"
          transparent
          depthWrite={false}
          opacity={0.5}
        />
      </mesh>

      {/* Pool of light on the ground ahead of the front lamp */}
      <mesh
        position={[FRONT_LAMP[0] + 1.25, 0.003, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[2.5, 1.2, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={beam}
          map={textures.beam}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          opacity={0}
        />
      </mesh>

      <sprite ref={front} position={[...FRONT_LAMP]} scale={[0.55, 0.55, 1]}>
        <spriteMaterial
          map={textures.glow}
          color="#fff1c9"
          transparent
          depthWrite={false}
          depthTest={false}
          blending={AdditiveBlending}
          opacity={0}
        />
      </sprite>
      <sprite ref={rear} position={[...REAR_LAMP]} scale={[0.34, 0.34, 1]}>
        <spriteMaterial
          map={textures.glow}
          color="#ff4a3d"
          transparent
          depthWrite={false}
          depthTest={false}
          blending={AdditiveBlending}
          opacity={0}
        />
      </sprite>
    </group>
  );
}
