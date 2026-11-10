"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { INSPIRATION_SAMPLES } from "@/lib/inspiration-samples";
import { PaletteStrip } from "@/components/palette/PaletteStrip";
import type { InspirationSample } from "@/types/image";

interface InspirationGalleryProps {
  onSelectSample: (sample: InspirationSample) => void;
  selectedSampleId?: string;
}

export function InspirationGallery({
  onSelectSample,
  selectedSampleId,
}: InspirationGalleryProps) {
  return (
    <section aria-label="Inspiration samples" className="w-full">
      {/* Divider with label */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-normal text-neutral-400">
          Or, try a little inspiration
        </span>
        <div className="h-px flex-1 bg-neutral-200/80" />
      </div>

      {/* 3 Inspiration Cards */}
      <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {INSPIRATION_SAMPLES.map((sample) => {
          const isSelected = selectedSampleId === sample.id;

          return (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSelectSample(sample)}
              className={`group flex flex-col overflow-hidden rounded-xl border bg-white text-left transition-all hover:border-neutral-300 hover:shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 cursor-pointer ${
                isSelected
                  ? "border-brand-600 ring-2 ring-brand-600/20"
                  : "border-neutral-200/80"
              }`}
            >
              {/* Image preview */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                <Image
                  src={sample.imageUrl}
                  alt={sample.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 240px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>

              {/* 6-Color Palette Strip */}
              <PaletteStrip colors={sample.colors} heightClass="h-2.5" />

              {/* Card Footer with Title and Chevron */}
              <div className="flex items-center justify-between px-3 py-2.5">
                <span className="text-xs font-medium text-neutral-800 transition-colors group-hover:text-black">
                  {sample.title}
                </span>
                <ChevronRight
                  className="size-3.5 text-neutral-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-neutral-600"
                  aria-hidden="true"
                />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

