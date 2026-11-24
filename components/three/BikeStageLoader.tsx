"use client";

// Loads the 3D stage only on capable devices, after the page is idle, so the
// static hero photo paints first and weak phones never download three.js.
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { canRun3d, detectEnvironment } from "@/lib/bike-scene/eligibility";

const BikeStage = dynamic(() => import("./BikeStage"), { ssr: false });

export function BikeStageLoader() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (!canRun3d(detectEnvironment())) return;
    const enable = () => setIsEnabled(true);
    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(enable, { timeout: 2000 });
      return () => window.cancelIdleCallback(handle);
    }
    const handle = window.setTimeout(enable, 300);
    return () => window.clearTimeout(handle);
  }, []);

  return isEnabled ? <BikeStage /> : null;
}
