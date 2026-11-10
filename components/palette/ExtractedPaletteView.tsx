"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { ExtractedColor } from "@/types/image";

interface ExtractedPaletteViewProps {
  colors: ExtractedColor[];
}

export function ExtractedPaletteView({ colors }: ExtractedPaletteViewProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopySingle = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => {
      setCopiedHex((curr) => (curr === hex ? null : curr));
    }, 1500);
  };

  const handleCopyAll = () => {
    const paletteString = colors.map((c) => c.hex).join(", ");
    navigator.clipboard.writeText(paletteString);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between py-1">
        <div className="flex items-baseline gap-2">
          <h2 className="text-sm font-semibold text-neutral-800 sm:text-[15px]">
            Extracted palette
          </h2>
          <span className="text-xs text-neutral-400 font-normal">
            {colors.length} colors
          </span>
        </div>

        {/* Copy All Button */}
        <button
          type="button"
          onClick={handleCopyAll}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-900 cursor-pointer"
        >
          {copiedAll ? (
            <>
              <Check className="size-3.5 text-brand-600" />
              <span className="text-brand-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span>Copy palette</span>
            </>
          )}
        </button>
      </div>

      {/* 6 Color Cards Grid */}
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 sm:gap-3.5">
        {colors.map((color, index) => {
          const isCopied = copiedHex === color.hex;

          return (
            <div
              key={`${color.hex}-${index}`}
              onClick={() => handleCopySingle(color.hex)}
              className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-2xs transition-all hover:border-neutral-300 hover:shadow-xs cursor-pointer text-left"
              title={`Click to copy ${color.hex}`}
            >
              {/* Color Block */}
              <div
                className="relative h-24 sm:h-28 w-full transition-transform duration-200 group-hover:opacity-95"
                style={{ backgroundColor: color.hex }}
              >
                {isCopied && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25 text-white animate-in fade-in">
                    <Check className="size-5" />
                  </div>
                )}
              </div>

              {/* Info Footer */}
              <div className="flex flex-col justify-between p-2.5 sm:p-3 bg-white">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-neutral-800 uppercase sm:text-[13px]">
                    {color.hex}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopySingle(color.hex);
                    }}
                    className="text-neutral-400 transition-colors hover:text-neutral-700"
                    aria-label={`Copy ${color.hex}`}
                  >
                    {isCopied ? (
                      <Check className="size-3 text-brand-600" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </button>
                </div>
                <span className="mt-1 font-mono text-[10px] text-neutral-400 truncate">
                  {color.rgbString}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

