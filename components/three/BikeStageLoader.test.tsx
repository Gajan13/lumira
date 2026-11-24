import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BikeStageLoader } from "./BikeStageLoader";

describe("BikeStageLoader", () => {
  it("renders nothing where WebGL is unavailable, so the hero photo stays", () => {
    const { container } = render(<BikeStageLoader />);
    expect(container).toBeEmptyDOMElement();
  });
});
