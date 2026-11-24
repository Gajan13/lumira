"use client";

// The Lumira city bike: a single textured mesh (public/models/…glb). Frame and
// accent colours follow the colour picker through a shader recolour (see
// recolour.ts); the camera rig does the travelling. The bike is one solid
// piece: its wheels deliberately do not spin.
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Color, type Mesh, type MeshStandardMaterial } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { getFinishId } from "@/lib/bike-scene/finish-store";
import { getFinish } from "@/lib/bike-scene/finishes";
import { sceneSignals } from "@/lib/bike-scene/signals";
import { Ground } from "./Ground";
import { applyRecolour, setHighlight } from "./recolour";

export const BIKE_MODEL_URL = "/models/3DGenerator-bicycle-v1-rapid-jpg.glb";

// The file is ~1.0 long (along Z, front toward +Z) and ~0.61 tall.
const MODEL_SCALE = 1.7;
const MODEL_HALF_HEIGHT = 0.308;
const MODEL_YAW = Math.PI / 2; // turn the front to face +X, like the scene poses assume
const COLOUR_EASE_PER_SECOND = 7;
const HIGHLIGHT_PULSE_PER_SECOND = 3;
const READY_ATTRIBUTE = "bike3d";

// Start downloading as soon as this chunk loads.
useLoader.preload(GLTFLoader, BIKE_MODEL_URL);

export function BikeModel() {
  const gltf = useLoader(GLTFLoader, BIKE_MODEL_URL);
  const maxAnisotropy = useThree((state) =>
    state.gl.capabilities.getMaxAnisotropy(),
  );
  const frameTarget = useRef(new Color());
  const accentTarget = useRef(new Color());

  const { model, recolours } = useMemo(() => {
    const clone = gltf.scene.clone(true);
    const found: ReturnType<typeof applyRecolour>[] = [];
    clone.traverse((object) => {
      const mesh = object as Mesh;
      if (!mesh.isMesh) return;
      const material = (mesh.material as MeshStandardMaterial).clone();
      // Sharper spokes and tube edges at glancing angles.
      for (const texture of [
        material.map,
        material.metalnessMap,
        material.roughnessMap,
      ]) {
        if (texture) texture.anisotropy = maxAnisotropy;
      }
      found.push(applyRecolour(material));
      mesh.material = material;
    });
    return { model: clone, recolours: found };
  }, [gltf, maxAnisotropy]);

  // Start on the default finish so the first frame doesn't flash the raw texture colours.
  useEffect(() => {
    const finish = getFinish(getFinishId());
    recolours.forEach((recolour) => {
      recolour.frame.value.set(finish.frame);
      recolour.accent.value.set(finish.accent);
    });
    document.documentElement.dataset[READY_ATTRIBUTE] = "on";
    return () => {
      delete document.documentElement.dataset[READY_ATTRIBUTE];
    };
  }, [recolours]);

  useFrame(({ clock }, delta) => {
    const finish = getFinish(getFinishId());
    const ease = 1 - Math.exp(-COLOUR_EASE_PER_SECOND * delta);
    frameTarget.current.set(finish.frame);
    accentTarget.current.set(finish.accent);
    const pulse =
      0.7 + 0.3 * Math.sin(clock.elapsedTime * HIGHLIGHT_PULSE_PER_SECOND);
    recolours.forEach((recolour) => {
      recolour.frame.value.lerp(frameTarget.current, ease);
      recolour.accent.value.lerp(accentTarget.current, ease);
      setHighlight(recolour, sceneSignals.highlight * pulse);
    });
  });

  return (
    <group>
      <group
        position={[0, MODEL_HALF_HEIGHT * MODEL_SCALE, 0]}
        rotation={[0, MODEL_YAW, 0]}
        scale={MODEL_SCALE}
      >
        <primitive object={model} />
      </group>
      <Ground />
    </group>
  );
}
