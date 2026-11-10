"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Upload,
  Bookmark,
  Check,
  X,
  Lock,
  Image as ImageIcon,
} from "lucide-react";
import type { UploadedImage, ExtractedColor } from "@/types/image";
import { ExtractedPaletteView } from "@/components/palette/ExtractedPaletteView";
import { useBookmarks } from "@/lib/bookmarks";

interface ExtractedImageViewProps {
  image: UploadedImage;
  colors: ExtractedColor[];
  isDragging: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onChangeImage: () => void;
  onClose: () => void;
}

export function ExtractedImageView({
  image,
  colors,
  isDragging,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onChangeImage,
  onClose,
}: ExtractedImageViewProps) {
  const { palettes, addPalette, removePalette } = useBookmarks();
  const [justBookmarked, setJustBookmarked] = useState(false);

  // Check if current image/palette is already bookmarked
  const existingBookmark = palettes.find(
    (p) => p.name === image.name || p.id === image.id
  );
  const isBookmarked = !!existingBookmark || justBookmarked;

  const handleToggleBookmark = () => {
    if (existingBookmark) {
      removePalette(existingBookmark.id);
      setJustBookmarked(false);
    } else {
      addPalette({
        id: image.id,
        name: image.name.replace(/\.[^/.]+$/, "") || "Palette",
        thumbnailUrl: image.dataUrl,
        colors: colors.map((c) => ({ hex: c.hex })),
        createdAt: Date.now(),
      });
      setJustBookmarked(true);
      setTimeout(() => setJustBookmarked(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-10">
      {/* Top Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-600 sm:text-xs">
            A palette, uniquely yours
          </p>
          <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl md:text-[34px]">
            Your image. Your colors.
          </h1>
        </div>

        {/* Private by default badge */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-400 sm:mt-0 sm:text-sm">
          <Lock className="size-3.5 text-brand-600" aria-hidden="true" />
          <span>Private by default</span>
        </div>
      </div>

      {/* Action Toolbar above Image */}
      <div className="mt-6 sm:mt-8 flex items-center justify-between gap-3">
        {/* File name on left */}
        <div className="flex items-center gap-2 text-xs font-normal text-neutral-500 sm:text-sm truncate">
          <ImageIcon className="size-4 shrink-0 text-neutral-400" aria-hidden="true" />
          <span className="truncate">{image.name}</span>
        </div>

        {/* Actions on right */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Change Image Button */}
          <button
            type="button"
            onClick={onChangeImage}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200/90 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-50 hover:text-black cursor-pointer"
          >
            <Upload className="size-3.5 text-neutral-500" />
            <span>Change image</span>
          </button>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={handleToggleBookmark}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium text-white shadow-2xs transition-colors cursor-pointer ${
              isBookmarked
                ? "bg-[#256345] ring-2 ring-brand-200"
                : "bg-brand-600 hover:bg-[#256345]"
            }`}
          >
            {isBookmarked ? (
              <>
                <Check className="size-3.5" />
                <span>Bookmarked</span>
              </>
            ) : (
              <>
                <Bookmark className="size-3.5" />
                <span>Bookmark</span>
              </>
            )}
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 cursor-pointer"
            aria-label="Close and return to dropper"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative mt-3 flex min-h-80 sm:min-h-110 max-h-130 w-full items-center justify-center overflow-hidden rounded-2xl bg-[#f4f4f4] p-4 sm:p-6 transition-all ${
          isDragging ? "ring-4 ring-brand-500/30" : ""
        }`}
      >
        <div className="relative h-full max-h-115 w-full flex items-center justify-center">
          <Image
            src={image.dataUrl}
            alt={image.name}
            width={image.width || 800}
            height={image.height || 600}
            className="max-h-75 sm:max-h-105 w-auto max-w-full rounded-lg object-contain shadow-2xs"
            unoptimized={image.dataUrl.startsWith("data:")}
            priority
          />
        </div>

        {/* Drag overlay on stage */}
        {isDragging && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-brand-50/85 backdrop-blur-2xs">
            <p className="text-sm font-semibold text-brand-600 sm:text-base">
              Drop image here to replace
            </p>
          </div>
        )}
      </div>

      {/* Extracted Palette Section */}
      <div className="mt-8 sm:mt-10">
        <ExtractedPaletteView colors={colors} />
      </div>
    </div>
  );
}

