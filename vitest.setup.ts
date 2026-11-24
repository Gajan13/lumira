import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// jsdom has no canvas or WebGL. Report "unsupported" quietly (like a browser
// without WebGL) instead of logging "not implemented" noise.
if (typeof HTMLCanvasElement !== "undefined") {
  HTMLCanvasElement.prototype.getContext = () => null;
}

// jsdom has no layout, so a ResizeObserver would never fire anyway.
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

afterEach(() => {
  cleanup();
});
