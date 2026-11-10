"use client";

import { useRef, type ChangeEvent } from "react";
import {
  Upload,
  ImagePlus,
  ChevronRight,
  X,
  AlertCircle,
} from "lucide-react";

interface ImageDropperProps {
  isDragging: boolean;
  isLoading: boolean;
  error: string | null;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (file: File) => void;
  onClearError: () => void;
}

export function ImageDropper({
  isDragging,
  isLoading,
  error,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect,
  onClearError,
}: ImageDropperProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
    e.target.value = "";
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
        className="sr-only"
        onChange={handleInputChange}
        aria-label="Upload image file"
      />

      {/* Error notification */}
      {error && (
        <div
          role="alert"
          className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-800 animate-in fade-in"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={onClearError}
            className="rounded-md p-1 text-red-600 hover:bg-red-100 transition-colors"
            aria-label="Dismiss error"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Main Dropper Box */}
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-12 text-center transition-all sm:rounded-3xl sm:px-10 sm:py-14 ${
          isDragging
            ? "border-brand-600 bg-brand-50/70 ring-4 ring-brand-100 scale-[1.01]"
            : "border-neutral-300 bg-white/70 hover:border-neutral-400 hover:bg-white/90"
        }`}
      >
        {/* Mint Icon Badge */}
        <div
          className={`flex size-12 items-center justify-center rounded-xl border transition-colors ${
            isDragging
              ? "border-brand-600 bg-brand-100 text-brand-600"
              : "border-brand-100 bg-[#edf7f0] text-brand-600"
          }`}
        >
          <ImagePlus className="size-6" strokeWidth={1.75} aria-hidden="true" />
        </div>

        {/* Heading */}
        <h2 className="mt-4 text-[17px] font-semibold text-neutral-800 sm:text-lg">
          Your next palette starts here
        </h2>

        {/* Subtitle */}
        <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
          Drag and drop an image, or choose one from your device
        </p>

        {/* Upload Button */}
        <button
          type="button"
          onClick={handleTriggerUpload}
          disabled={isLoading}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-xs transition-colors hover:bg-[#256345] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 active:scale-95 cursor-pointer disabled:opacity-60"
        >
          <Upload className="size-4" strokeWidth={2} aria-hidden="true" />
          <span>Upload Image</span>
          <ChevronRight className="size-4 opacity-80" strokeWidth={2} aria-hidden="true" />
        </button>

        {/* Supported formats / size hint */}
        <p className="mt-4 text-[11px] text-neutral-400 sm:text-xs">
          JPG, PNG, WebP and more · Up to 20 MB
        </p>

        {/* Overlay when dragging */}
        {isDragging && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-brand-50/80 backdrop-blur-[1px] sm:rounded-3xl">
            <p className="text-sm font-semibold text-brand-600 sm:text-base">
              Drop your image here to extract colors
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
