"use client";

import { useSyncExternalStore } from "react";

export type SavedPalette = {
  id: string;
  name: string;
  /** Object URL or data URL. Falls back to a gradient of the palette colors. */
  thumbnailUrl?: string;
  colors: { hex: string }[];
  createdAt: number;
};

const STORAGE_KEY = "palettepix.bookmarks";

const EMPTY: SavedPalette[] = [];

let state: SavedPalette[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function getSnapshot() {
  return state;
}

// During SSR / hydration the store is empty on purpose; it re-renders right
// after hydration with whatever is stored on the device.
function getServerSnapshot() {
  return EMPTY;
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed)) state = parsed as SavedPalette[];
  } catch {
    // Corrupted storage should never break the app.
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be unavailable (private mode, quota); ignore.
  }
}

function addPalette(palette: SavedPalette) {
  state = [palette, ...state.filter((p) => p.id !== palette.id)];
  persist();
  emit();
}

function renamePalette(id: string, name: string) {
  state = state.map((p) => (p.id === id ? { ...p, name } : p));
  persist();
  emit();
}

function removePalette(id: string) {
  state = state.filter((p) => p.id !== id);
  persist();
  emit();
}

export function useBookmarks() {
  const palettes = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { palettes, addPalette, renamePalette, removePalette };
}
