"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface PaletteStripProps {
  colors: string[];
  className?: string;
  heightClass?: string;
  interactive?: boolean;
}

export function PaletteStrip({
  colors,
  className = "",
  heightClass = "h-3",
  interactive = false,
}: PaletteStripProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string, e: React.MouseEvent) => {
    if (!interactive) return;
    e.stopPropagation();
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => {
      setCopiedHex((curr) => (curr === hex ? null : curr));
    }, 1500);
  };

  return (
    <div
      className={`flex w-full overflow-hidden ${heightClass} ${className}`}
      role="group"
      aria-label="Color palette swatches"
    >
      {colors.map((hex, index) => {
        const isCopied = copiedHex === hex;
        return (
          <div
            key={`${hex}-${index}`}
            onClick={(e) => handleCopy(hex, e)}
            title={interactive ? `Click to copy ${hex}` : hex}
            style={{ backgroundColor: hex }}
            className={`group/swatch relative flex-1 transition-transform ${
              interactive
                ? "cursor-pointer hover:z-10 hover:scale-y-125 hover:shadow-sm"
                : ""
            }`}
          >
            {interactive && isCopied && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                <Check className="size-3" />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
