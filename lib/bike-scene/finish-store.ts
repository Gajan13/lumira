"use client";

// Tiny shared store so the colour picker (DOM) and the 3D scene (a separate
// React root inside <Canvas>) stay in sync without extra dependencies.
import { useSyncExternalStore } from "react";
import { DEFAULT_FINISH_ID, type FinishId } from "./finishes";

let currentFinishId: FinishId = DEFAULT_FINISH_ID;
const listeners = new Set<() => void>();

export function getFinishId(): FinishId {
  return currentFinishId;
}

export function setFinishId(id: FinishId): void {
  if (id === currentFinishId) return;
  currentFinishId = id;
  listeners.forEach((listener) => listener());
}

export function subscribeFinish(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useFinishId(): FinishId {
  return useSyncExternalStore(
    subscribeFinish,
    getFinishId,
    () => DEFAULT_FINISH_ID,
  );
}

// Test helper: put the store back to its default.
export function resetFinishStore(): void {
  currentFinishId = DEFAULT_FINISH_ID;
  listeners.clear();
}
