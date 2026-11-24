// The bike is ONE mesh with a baked texture, so parts can't be recoloured by
// material. Instead the fragment shader finds two colour families in the
// texture and swaps them:
//   navy pixels â†’ the finish's frame colour
//   red pixels  â†’ the finish's accent colour
// Brightness is kept (scaled against a reference), so the baked shading,
// highlights and shadows survive. Black and grey parts are left alone.
// The navy area (frame + battery) can also glow: `highlight` adds emission.
import {
  Color,
  type IUniform,
  type MeshStandardMaterial,
  type WebGLProgramParametersWithUniforms,
} from "three";

export type Recolour = {
  frame: IUniform<Color>;
  accent: IUniform<Color>;
  highlight: IUniform<number>;
};

const HELPERS = /* glsl */ `
vec3 lumiraRgb2Hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
uniform vec3 uFrameColour;
uniform vec3 uAccentColour;
uniform float uHighlight;
`;

// Reference brightness (HSV value, 0â€“1) of each family in the baked texture:
// red â‰ˆ 0.75, navy â‰ˆ 0.2.
const RECOLOUR = /* glsl */ `
vec3 lumiraSrgb = pow(max(diffuseColor.rgb, vec3(0.0)), vec3(1.0 / 2.2));
vec3 lumiraHsv = lumiraRgb2Hsv(lumiraSrgb);
float lumiraHueToRed = min(lumiraHsv.x, 1.0 - lumiraHsv.x);
float lumiraRed = (1.0 - smoothstep(0.04, 0.09, lumiraHueToRed))
  * smoothstep(0.45, 0.7, lumiraHsv.y) * smoothstep(0.12, 0.3, lumiraHsv.z);
float lumiraNavy = (1.0 - smoothstep(0.05, 0.11, abs(lumiraHsv.x - 0.62)))
  * smoothstep(0.35, 0.6, lumiraHsv.y) * smoothstep(0.04, 0.12, lumiraHsv.z);
vec3 lumiraAsAccent = uAccentColour * pow(clamp(lumiraHsv.z / 0.75, 0.0, 1.6), 2.2);
vec3 lumiraAsFrame = uFrameColour * pow(clamp(lumiraHsv.z / 0.2, 0.0, 2.4), 2.2);
diffuseColor.rgb = mix(diffuseColor.rgb, lumiraAsAccent, lumiraRed);
diffuseColor.rgb = mix(diffuseColor.rgb, lumiraAsFrame, lumiraNavy);
`;

const GLOW = /* glsl */ `
totalEmissiveRadiance += uFrameColour * lumiraNavy * uHighlight * 1.6;
`;

/** Set the battery glow (0–1). A helper so per-frame code doesn't assign to scene objects directly. */
export function setHighlight(recolour: Recolour, amount: number): void {
  recolour.highlight.value = amount;
}

/** Patch a material so its texture colours follow `uniforms`. Returns the uniforms to animate. */
export function applyRecolour(material: MeshStandardMaterial): Recolour {
  const uniforms: Recolour = {
    frame: { value: new Color() },
    accent: { value: new Color() },
    highlight: { value: 0 },
  };
  material.onBeforeCompile = (shader: WebGLProgramParametersWithUniforms) => {
    shader.uniforms.uFrameColour = uniforms.frame;
    shader.uniforms.uAccentColour = uniforms.accent;
    shader.uniforms.uHighlight = uniforms.highlight;
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${HELPERS}`)
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>\n${RECOLOUR}`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>\n${GLOW}`,
      );
  };
  material.customProgramCacheKey = () => "lumira-recolour-v2";
  return uniforms;
}
