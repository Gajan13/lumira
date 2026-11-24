import {
  Color,
  MeshStandardMaterial,
  type WebGLProgramParametersWithUniforms,
} from "three";
import { describe, expect, it } from "vitest";
import { applyRecolour } from "./recolour";

function compile(material: MeshStandardMaterial) {
  const shader = {
    uniforms: {} as Record<string, unknown>,
    vertexShader: "",
    fragmentShader:
      "#include <common>\nvoid main() {\n#include <map_fragment>\n}",
  };
  material.onBeforeCompile(
    shader as unknown as WebGLProgramParametersWithUniforms,
    null as never,
  );
  return shader;
}

describe("applyRecolour", () => {
  it("hands back the frame, accent and highlight values to animate", () => {
    const recolour = applyRecolour(new MeshStandardMaterial());
    expect(recolour.frame.value).toBeInstanceOf(Color);
    expect(recolour.accent.value).toBeInstanceOf(Color);
    expect(recolour.highlight.value).toBe(0);
  });

  it("adds the battery glow after the emissive step", () => {
    const material = new MeshStandardMaterial();
    applyRecolour(material);
    const shader = {
      uniforms: {} as Record<string, unknown>,
      vertexShader: "",
      fragmentShader:
        "#include <common>\n#include <map_fragment>\n#include <emissivemap_fragment>",
    };
    material.onBeforeCompile(
      shader as unknown as WebGLProgramParametersWithUniforms,
      null as never,
    );
    expect(shader.fragmentShader.indexOf("emissivemap_fragment")).toBeLessThan(
      shader.fragmentShader.indexOf("uHighlight *"),
    );
  });

  it("wires the same uniform objects into the shader", () => {
    const material = new MeshStandardMaterial();
    const recolour = applyRecolour(material);
    const shader = compile(material);
    expect(shader.uniforms.uFrameColour).toBe(recolour.frame);
    expect(shader.uniforms.uAccentColour).toBe(recolour.accent);
  });

  it("injects the helpers and the recolour step after the texture sample", () => {
    const material = new MeshStandardMaterial();
    applyRecolour(material);
    const { fragmentShader } = compile(material);
    expect(fragmentShader).toContain("lumiraRgb2Hsv");
    expect(fragmentShader.indexOf("#include <map_fragment>")).toBeLessThan(
      fragmentShader.indexOf("lumiraAsAccent"),
    );
  });

  it("uses a stable program cache key so every material shares one shader", () => {
    const a = new MeshStandardMaterial();
    const b = new MeshStandardMaterial();
    applyRecolour(a);
    applyRecolour(b);
    expect(a.customProgramCacheKey()).toBe(b.customProgramCacheKey());
  });
});
