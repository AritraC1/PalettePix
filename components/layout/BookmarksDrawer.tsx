"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bookmark, Check, Lock, Pencil, Search, Trash2, X } from "lucide-react";
import type { SavedPalette } from "@/lib/bookmarks";

type BookmarksDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  palettes: SavedPalette[];
  onSelect: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onRemove: (id: string) => void;
};

const dayFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function BookmarksDrawer({
  open,
  onOpenChange,
  palettes,
  onSelect,
  onRename,
  onRemove,
}: BookmarksDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  // Lock page scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  // Newest first, filtered by search, grouped by day.
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byDay = new Map<string, SavedPalette[]>();
    [...palettes]
      .filter((p) => fuzzyMatch(p.name, q))
      .sort((a, b) => b.createdAt - a.createdAt)
      .forEach((p) => {
        const day = dayFormat.format(p.createdAt).toUpperCase();
        byDay.set(day, [...(byDay.get(day) ?? []), p]);
      });
    return [...byDay.entries()];
  }, [palettes, query]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="bookmarks-title"
      onClose={() => onOpenChange(false)}
      onClick={(e) => {
        // Clicks on the dimmed backdrop land on the <dialog> itself.
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
      className={[
        "fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-105 sm:max-w-110 overflow-hidden bg-white p-0 text-neutral-900 shadow-2xl",
        // slide in / out
        "translate-x-full transition-[translate,overlay,display] transition-discrete duration-300 ease-out",
        "open:translate-x-0 starting:open:translate-x-full",
        // dimmed backdrop
        "backdrop:bg-black/0 backdrop:transition-[background-color,overlay,display] backdrop:transition-discrete backdrop:duration-300",
        "open:backdrop:bg-black/25 starting:open:backdrop:bg-black/0",
      ].join(" ")}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="px-6 pt-6 sm:px-7 sm:pt-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
                <Bookmark className="size-4" strokeWidth={2} aria-hidden="true" />
                YOUR COLLECTION
              </p>
              <h2
                id="bookmarks-title"
                className="mt-3.5 flex items-center gap-3 text-2xl font-bold tracking-tight text-neutral-900"
              >
                Saved Palettes
                <span className="rounded-md bg-brand-50 px-2 py-0.5 text-sm font-semibold leading-none text-brand-600">
                  {palettes.length}
                </span>
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                A little library of colors you love.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Close saved palettes"
              className="-mr-1 -mt-1 grid size-9 shrink-0 place-items-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>

          {palettes.length > 0 && (
            <label className="relative mt-6 block">
              <span className="sr-only">Find a palette</span>
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find a palette..."
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
              />
            </label>
          )}
        </div>

        {/* List */}
        <div className="mt-6 flex-1 space-y-6 overflow-y-auto px-6 pb-6 sm:px-7">
          {palettes.length === 0 ? (
            <div className="flex flex-col items-center px-4 pt-16 text-center">
              <div className="grid size-14 place-items-center rounded-2xl border border-neutral-200 text-brand-600">
                <Bookmark className="size-6" strokeWidth={1.75} aria-hidden="true" />
              </div>
              <p className="mt-5 text-base font-semibold text-neutral-900">No saved palettes yet</p>
              <p className="mt-2 text-sm text-neutral-500">
                Save a palette from the picker and it will show up here.
              </p>
            </div>
          ) : groups.length === 0 ? (
            <p className="pt-8 text-center text-sm text-neutral-500">
              No palettes match “{query.trim()}”.
            </p>
          ) : (
            groups.map(([day, items]) => (
              <section key={day} aria-label={day}>
                <h3 className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
                  <span>{day}</span>
                  <span>{items.length}</span>
                </h3>
                <ul className="mt-3 space-y-3">
                  {items.map((palette) => (
                    <PaletteRow
                      key={palette.id}
                      palette={palette}
                      onSelect={onSelect}
                      onRename={onRename}
                      onRemove={onRemove}
                    />
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-neutral-200/80 px-6 py-5 pb-6 text-center sm:px-7">
          <p className="inline-flex items-center gap-2 text-xs sm:text-[13px] text-neutral-400">
            <Lock className="size-3.5 stroke-[1.75]" aria-hidden="true" />
            <span>Saved on this device. Always private.</span>
          </p>
        </div>
      </div>
    </dialog>
  );
}

/* ---------- fuzzy search ---------- */

/** True when the name loosely matches every whitespace-separated word.
 *  A word matches if it's a substring of the name, or if all of its
 *  characters appear in order (subsequence). */
function fuzzyMatch(name: string, query: string): boolean {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const hay = name.toLowerCase();
  return words.every((word) =>
    hay.includes(word) || isSubsequence(word, hay),
  );
}

function isSubsequence(needle: string, hay: string): boolean {
  let i = 0;
  for (const char of hay) {
    if (char === needle[i]) i += 1;
    if (i === needle.length) return true;
  }
  return false;
}

/* ---------- palette row ---------- */

function PaletteRow({
  palette,
  onSelect,
  onRename,
  onRemove,
}: {
  palette: SavedPalette;
  onSelect: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onRemove: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(palette.name);
  const trimmed = draft.trim();
  const hexes = palette.colors.map((c) => c.hex);

  const startEditing = () => {
    setDraft(palette.name);
    setEditing(true);
  };

  const save = () => {
    if (!trimmed) return; // names can't be empty
    if (trimmed !== palette.name) onRename(palette.id, trimmed);
    setEditing(false);
  };

  return (
    <li className="rounded-2xl border border-neutral-200/90 bg-white p-4">
      <div className="flex items-start gap-3.5">
        <button
          type="button"
          onClick={() => onSelect(palette.id)}
          aria-label={`Open ${palette.name}`}
          className="size-18 shrink-0 overflow-hidden rounded-xl bg-neutral-100 transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          {palette.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={palette.thumbnailUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <span
              className="block size-full"
              style={{
                background:
                  hexes.length > 1
                    ? `linear-gradient(135deg, ${hexes.join(", ")})`
                    : hexes[0] || "#e5e7eb",
              }}
            />
          )}
        </button>

        <div className="min-w-0 flex-1">
          {editing ? (
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  save();
                } else if (e.key === "Escape") {
                  // Cancel the edit without also closing the drawer.
                  e.preventDefault();
                  e.stopPropagation();
                  setEditing(false);
                }
              }}
              onFocus={(e) => e.currentTarget.select()}
              autoFocus
              maxLength={40}
              aria-label="Palette name"
              aria-invalid={!trimmed}
              className="w-full rounded-md border border-brand-600/50 bg-white px-2 py-0.5 text-[15px] font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
          ) : (
            <button
              type="button"
              onClick={() => onSelect(palette.id)}
              className="block max-w-full truncate text-left text-[15px] font-semibold text-neutral-900 transition-colors hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              {palette.name}
            </button>
          )}

          <p className="mt-1 text-xs text-neutral-400">
            {timeFormat.format(palette.createdAt)} · {palette.colors.length}{" "}
            {palette.colors.length === 1 ? "color" : "colors"}
          </p>

          <div
            role="img"
            aria-label={`Colors: ${hexes.join(", ")}`}
            className="mt-3 flex h-3.5 w-full overflow-hidden rounded-sm"
          >
            {hexes.map((hex, i) => (
              <span
                key={`${hex}-${i}`}
                className="h-full flex-1"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-3 text-neutral-400">
        {editing ? (
          <>
            <button
              type="button"
              onClick={() => setEditing(false)}
              aria-label="Cancel rename"
              className="p-1 text-neutral-400 transition-colors hover:text-neutral-600"
            >
              <X className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={save}
              disabled={!trimmed}
              aria-label="Save name"
              className="p-1 text-brand-600 transition-colors hover:text-brand-700 disabled:opacity-40"
            >
              <Check className="size-4" strokeWidth={2} aria-hidden="true" />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={startEditing}
              aria-label={`Rename ${palette.name}`}
              className="p-1 text-neutral-400 transition-colors hover:text-neutral-600"
            >
              <Pencil className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onRemove(palette.id)}
              aria-label={`Remove ${palette.name}`}
              className="p-1 text-neutral-400 transition-colors hover:text-neutral-600"
            >
              <Trash2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </li>
  );
}
