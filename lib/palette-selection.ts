"use client";

import type { SavedPalette } from "@/lib/bookmarks";

// Tiny event bus so the bookmarks drawer (rendered from the layout's navbar)
// can ask the picker page to open a saved palette, without a global
// state-manager for the picker's image state.

const listeners = new Set<(palette: SavedPalette) => void>();

export function selectSavedPalette(palette: SavedPalette) {
  for (const listener of listeners) listener(palette);
}

export function onSavedPaletteSelected(listener: (palette: SavedPalette) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
