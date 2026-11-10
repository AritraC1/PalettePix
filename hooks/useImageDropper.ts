"use client";

import { useState, useCallback, useRef } from "react";
import type { UploadedImage, InspirationSample, ExtractedColor } from "@/types/image";
import type { SavedPalette } from "@/lib/bookmarks";
import { extractDominantColors, hexToExtractedColor } from "@/lib/color-extractor";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

export function useImageDropper() {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dragCounter = useRef(0);

  const processFile = useCallback((file: File) => {
    setError(null);

    // Validation
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WebP, SVG, etc.).");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large. Maximum supported size is 20 MB.");
      return;
    }

    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;

      // Extract image dimensions
      const img = new Image();
      img.onload = async () => {
        const newImage: UploadedImage = {
          id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl,
          width: img.naturalWidth,
          height: img.naturalHeight,
          createdAt: Date.now(),
        };

        setUploadedImage(newImage);

        // Extract dominant colors
        try {
          const colors = await extractDominantColors(dataUrl, 6);
          setExtractedColors(colors);
        } catch {
          const fallback = [
            "#F7D9C4",
            "#261815",
            "#B78A71",
            "#7F6056",
            "#8A6F5A",
            "#A68895",
          ].map(hexToExtractedColor);
          setExtractedColors(fallback);
        } finally {
          setIsLoading(false);
        }
      };

      img.onerror = () => {
        setError("Failed to load image. Please try another file.");
        setIsLoading(false);
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      setError("Failed to read the file. Please try again.");
      setIsLoading(false);
    };

    reader.readAsDataURL(file);
  }, []);

  const handleSelectSample = useCallback((sample: InspirationSample) => {
    setError(null);
    setIsLoading(true);

    const newImage: UploadedImage = {
      id: sample.id,
      name: `${sample.title}.svg`,
      size: 15420,
      type: "image/svg+xml",
      dataUrl: sample.imageUrl,
      createdAt: Date.now(),
      isSample: true,
    };

    setUploadedImage(newImage);
    setExtractedColors(sample.colors.map(hexToExtractedColor));
    setIsLoading(false);
  }, []);

  // Reopen an image from a saved bookmark, restoring its exact colors
  // (no re-extraction — the bookmark is the source of truth).
  const handleSelectSavedPalette = useCallback((palette: SavedPalette) => {
    setError(null);
    setIsLoading(true);

    // Palettes saved without a snapshot get a placeholder built from
    // their own colors, mirroring the drawer's fallback thumbnail.
    const dataUrl =
      palette.thumbnailUrl ?? buildPalettePlaceholder(palette.colors.map((c) => c.hex));

    const commit = (width?: number, height?: number) => {
      setUploadedImage({
        id: palette.id,
        name: palette.name,
        size: 0,
        type: /^data:([^;,]+)/.exec(dataUrl)?.[1] ?? "image/png",
        dataUrl,
        width,
        height,
        createdAt: palette.createdAt,
      });
      setExtractedColors(
        palette.colors.map((c) => hexToExtractedColor(c.hex))
      );
      setIsLoading(false);
    };

    // Measure so the restored image keeps its real aspect ratio.
    const img = new Image();
    img.onload = () => commit(img.naturalWidth, img.naturalHeight);
    img.onerror = () => commit();
    img.src = dataUrl;
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  const clearImage = useCallback(() => {
    setUploadedImage(null);
    setExtractedColors(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
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
  };
}

/** Palette-only bookmarks have no image snapshot; show the colors themselves. */
function buildPalettePlaceholder(hexes: string[]): string {
  const stripes = hexes
    .map(
      (hex, i) =>
        `<rect x="${(i * 100) / hexes.length}" y="0" width="${
          100 / hexes.length
        }" height="100" fill="${hex}"/>`
    )
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${stripes}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
