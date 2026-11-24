# 3D bike scene (three.js)

The home page has a scroll-driven 3D bike. Files:

| File                                   | Job                                                                                    |
| -------------------------------------- | -------------------------------------------------------------------------------------- |
| `components/three/BikeStageLoader.tsx` | Client. Checks the device, waits for idle, then lazy-loads the stage (`ssr: false`)    |
| `components/three/BikeStage.tsx`       | Fixed full-screen `<Canvas>` (`z-[5]`, `aria-hidden`, no pointer events) + `CameraRig` |
| `components/three/BikeModel.tsx`       | Loads the GLB, places it on the ground, drives the colour uniforms                     |
| `components/three/recolour.ts`         | Shader patch that swaps the texture's navy â†’ frame colour and red â†’ accent colour  |
| `lib/bike-scene/route.ts`              | The curved route (cubic BÃ©ziers) the bike rides through the section anchors           |
| `lib/bike-scene/anchors.ts`            | Measures anchor positions in page coordinates (shared by the rig and the road line)    |
| `components/sections/RoutePath.tsx`    | Draws the dashed "road" along that same route (desktop only)                           |
| `components/sections/Decor.tsx`        | Decorative shapes per section (rings, pills, stars, moonâ€¦); `aria-hidden`            |
| `lib/bike-scene/scenes.ts`             | Camera keyframes per section (wide and tall), blending, scroll â†’ pose                |
| `lib/bike-scene/finishes.ts`           | Frame / accent colours per finish (Ocean / Coral / Sky) from the brand palette         |
| `lib/bike-scene/finish-store.ts`       | Tiny shared store between the colour picker (DOM) and the scene (separate React root)  |
| `lib/bike-scene/eligibility.ts`        | `canRun3d()`: off for reduced motion, data saver, no WebGL, <4 GB memory, <4 cores     |
| `components/sections/ScrollScenes.tsx` | The `data-scene` sections (battery, lights, colours) + `ColourPicker`                  |

## The model

`public/models/3DGenerator-bicycle-v1-rapid-jpg.glb` is **one fused mesh** (~157k vertices, ~199k triangles) with two 1024Â² baked textures (colour and metallic/roughness). Consequences:

- The wheels do **not** spin, on purpose. An earlier version cut the wheels out of the fused mesh (by connectivity) and rolled them as the bike travelled; it looked like the wheel might break while spinning, so it was removed along with its code (`splitWheels.ts`). The bike is one solid piece that glides and turns. If wheel spin is ever wanted, use a model whose wheels are separate parts rather than cutting this mesh.
- Frame / saddle / battery can't be recoloured by material. Colour is changed in the shader instead (`recolour.ts`): navy pixels become the finish's frame colour, red pixels its accent colour, brightness and baked shading are kept. Black and grey parts never change.
- If the texture is ever re-baked, re-check the hue/brightness thresholds in `recolour.ts` (navy â‰ˆ hue 0.62, red â‰ˆ hue 0, reference brightness 0.2 and 0.75).
- It is **6.9 MB**, heavy for phones. Optimising it is the top follow-up (see below).
- The file faces +Z and is ~1.0 long, 0.61 tall; `BikeModel.tsx` turns it to face +X and scales it (`MODEL_SCALE`, `MODEL_YAW`). Poses in `scenes.ts` assume that size.
- Older files in `public/models/` (`lumira-city-bike.glb`, a parts-based model) are no longer used.

### Optimising the model (not done yet)

Target: under ~1.5 MB. With `@gltf-transform/cli` (pin a version): `simplify` to ~60k triangles at a low error, `resize` textures to 1024 or 512, convert textures to WebP, and compress geometry with meshopt. If meshopt is used, add `loader.setMeshoptDecoder(MeshoptDecoder)` (from `three/examples/jsm/libs/meshopt_decoder.module.js`) where `useLoader` is called. Check that the thin spokes survive simplification.

## How it fits together

1. Any section marked `data-scene="<id>"` is a scene. Ids and poses live in `scenes.ts`; the hero section is `hero`.
2. Each frame, `CameraRig` finds where the viewport centre sits between section centres and blends the two poses; the bike holds a pose while its section is in view.
3. **Anchors.** Each scene section contains an element marked `data-bike-anchor` (use `<BikeAnchor />`, or the hero's circle). The rig reads its size to zoom the bike to fit (`resolveFrame` in `BikeStage.tsx`; `fill` = bike length Ã· anchor width) and its position to place the bike exactly on it (see the route below). So layout and 3D can't drift apart. `shiftX/shiftY/distance` in `scenes.ts` are only fallbacks for scenes with no anchor (e.g. `outro`).
4. **Scene signals.** Poses also carry `night` (dims the studio lights, turns on the lamp glows and ground beam), `highlight` (battery area glows via the shader) and `visible` (fades the whole stage; the `outro` pose uses 0 so the bike leaves before the specs). The rig publishes them through `lib/bike-scene/signals.ts`; `BikeModel` and `Ground` read them each frame.
5. **Route.** The anchors' page-coordinate centres are joined into a curved route (`route.ts`). While a section is in view the bike sits on its anchor; between sections it rides the curve (leaving and arriving vertically, so it weaves down the page). On leftward legs it swings through a U-turn (front toward the camera) so it never looks like it's reversing. The wheels deliberately do not spin (see "The model"). The same route is drawn by `RoutePath` as the dotted road. All anchored scenes must come before any scene without an anchor.
6. Once the model has loaded, `<html data-bike3d="on">` is set and CSS fades out every `.bike-fallback` photo. Without 3D, those photos simply stay.
7. Section backgrounds are part of the design: battery = deep navy, lights = night, colours = cream. Keep text colours readable on each.
8. Anything readable stays in HTML above the canvas: give it `relative z-10` (canvas is `z-[5]`, header `z-20`).

## Rules

- The canvas is decoration. Never put information only in the 3D scene.
- Keep three.js out of the main bundle: only `BikeStageLoader` may import `BikeStage` (via `dynamic`).
- No network assets inside the scene (reflections come from `RoomEnvironment`, generated in code).
- New scene: add the id to `SceneId`, add a pose to **both** `WIDE_FRAMES` and `TALL_FRAMES`, add a `data-scene` section with a `BikeAnchor`, preview at 360 px and 1280 px. On phones put the text before the anchor in the DOM so the bike doesn't cover it.
- Lamp positions live in `components/three/Ground.tsx` (`FRONT_LAMP`, `REAR_LAMP`); re-measure them if the model changes.
- Sample content (specs, price, quotes; the numbers are odd sample values, not real figures) is marked `TODO(content)` / `data-placeholder`; none of it may ship.
- After big style changes the dev server's CSS can go stale: stop it, delete `.next/`, restart.
- Mutable per-frame state lives in refs; don't read refs during render (the React lint rules enforce this).
- Copy for the scenes ("Lights built in" etc.) must match what the model actually shows; confirm features with the client.
