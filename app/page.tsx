"use client";

import { useEffect, useRef, type ChangeEvent } from "react";
import { useImageDropper } from "@/hooks/useImageDropper";
import { onSavedPaletteSelected } from "@/lib/palette-selection";
import { ImageDropper } from "@/components/image/ImageDropper";
import { InspirationGallery } from "@/components/image/InspirationGallery";
import { ExtractedImageView } from "@/components/image/ExtractedImageView";

export default function Home() {
  const {
    uploadedImage,
    extractedColors,
    isDragging,
    isLoading,
    error,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    processFile,
    handleSelectSample,
    handleSelectSavedPalette,
    clearImage,
    clearError,
  } = useImageDropper();

  // Opening a saved palette from the bookmarks drawer restores it here.
  useEffect(
    () => onSavedPaletteSelected(handleSelectSavedPalette),
    [handleSelectSavedPalette]
  );

  const changeImageInputRef = useRef<HTMLInputElement>(null);

  const handleGlobalInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
    e.target.value = "";
  };

  const handleTriggerChangeImage = () => {
    changeImageInputRef.current?.click();
  };

  return (
    <>
      {/* Hidden global input for change image actions */}
      <input
        ref={changeImageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
        className="sr-only"
        onChange={handleGlobalInputChange}
        aria-label="Change image file"
      />

      {uploadedImage && extractedColors ? (
        /* Extracted Palette View (Matches Screenshot 2) */
        <ExtractedImageView
          image={uploadedImage}
          colors={extractedColors}
          isDragging={isDragging}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onChangeImage={handleTriggerChangeImage}
          onClose={clearImage}
        />
      ) : (
        /* Image Dropper Initial View (Matches Screenshot 1) */
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-start px-4 pt-10 pb-20 sm:pt-14 sm:pb-24">
          {/* Top Branding / Hero Header */}
          <div className="flex flex-col items-center text-center">
            {/* Logo Mark with Sparkles */}
            <div className="relative mb-5 inline-block">
              <svg
                viewBox="0 0 40 40"
                className="size-12 sm:size-13"
                aria-hidden="true"
              >
                <rect
                  x="2"
                  y="7"
                  width="15"
                  height="15"
                  rx="4"
                  fill="#2f7a56"
                  transform="rotate(-8 9.5 14.5)"
                />
                <rect
                  x="20"
                  y="2"
                  width="15"
                  height="15"
                  rx="4"
                  fill="#8fc5a0"
                  transform="rotate(6 27.5 9.5)"
                />
                <rect
                  x="4"
                  y="25"
                  width="14"
                  height="14"
                  rx="4"
                  fill="#ecd391"
                  transform="rotate(-6 11 32)"
                />
                <rect
                  x="21"
                  y="21"
                  width="15"
                  height="15"
                  rx="4"
                  fill="#d98b6f"
                  transform="rotate(8 28.5 28.5)"
                />
              </svg>

              {/* Sparkles Cluster on top right */}
              <svg
                viewBox="0 0 24 24"
                className="absolute -top-1.5 -right-3.5 size-5 text-brand-600"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 0L13.5 4.5L18 6L13.5 7.5L12 12L10.5 7.5L6 6L10.5 4.5L12 0Z" />
                <path d="M19 12L19.8 14.2L22 15L19.8 15.8L19 18L18.2 15.8L16 15L18.2 14.2L19 12Z" />
                <circle cx="7" cy="14" r="1.5" />
              </svg>
            </div>

            {/* Eyebrow */}
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-600 sm:text-xs">
              A little inspiration. Six beautiful colors.
            </p>

            {/* Main Headline */}
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-[44px]">
              Extract colors from any image<span className="text-brand-600">.</span>
            </h1>

            {/* Subhead */}
            <p className="mt-2.5 max-w-lg text-sm text-neutral-500 sm:text-base">
              Upload an image and discover its dominant color palette.
            </p>
          </div>

          {/* Main Content Area */}
          <div className="mt-8 flex w-full max-w-155 flex-col items-center gap-7 sm:mt-10">
            {/* Dropper Box */}
            <ImageDropper
              isDragging={isDragging}
              isLoading={isLoading}
              error={error}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onFileSelect={processFile}
              onClearError={clearError}
            />

            {/* Inspiration Cards */}
            <InspirationGallery
              onSelectSample={handleSelectSample}
              selectedSampleId={uploadedImage?.isSample ? uploadedImage.id : undefined}
            />
          </div>
        </div>
      )}
    </>
  );
}
