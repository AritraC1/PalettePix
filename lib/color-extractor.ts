/**
 * Client-side color extraction using Canvas API.
 * Extracts dominant, vibrant colors from an image without external dependencies.
 */
import type { ExtractedColor } from "@/types/image";

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace("#", "");
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function hexToExtractedColor(hex: string): ExtractedColor {
  const rgb = hexToRgb(hex);
  return {
    hex: hex.toUpperCase(),
    rgb,
    rgbString: `RGB ${rgb.r}, ${rgb.g}, ${rgb.b}`,
  };
}

function getLuminance(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getSaturation(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === 0) return 0;
  return (max - min) / max;
}

export async function extractDominantColors(
  dataUrl: string,
  colorCount: number = 6
): Promise<ExtractedColor[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(getDefaultPalette());
          return;
        }

        // Downscale to 120x120 for fast processing
        const width = 120;
        const height = Math.max(1, Math.round((img.height / img.width) * 120));
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // Group pixels by color quantizing (step of 20 for RGB)
        const colorBins: Record<string, { r: number; g: number; b: number; count: number }> = {};

        for (let i = 0; i < data.length; i += 4) {
          const a = data[i + 3];
          if (a < 128) continue; // Skip transparent pixels

          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Quantize
          const qR = Math.round(r / 20) * 20;
          const qG = Math.round(g / 20) * 20;
          const qB = Math.round(b / 20) * 20;
          const key = `${qR},${qG},${qB}`;

          if (!colorBins[key]) {
            colorBins[key] = { r, g, b, count: 1 };
          } else {
            colorBins[key].count++;
            colorBins[key].r = Math.round((colorBins[key].r + r) / 2);
            colorBins[key].g = Math.round((colorBins[key].g + g) / 2);
            colorBins[key].b = Math.round((colorBins[key].b + b) / 2);
          }
        }

        const bins = Object.values(colorBins);
        if (bins.length === 0) {
          resolve(getDefaultPalette());
          return;
        }

        // Score colors: balance between frequency and saturation
        bins.sort((a, b) => {
          const satA = getSaturation(a.r, a.g, a.b);
          const satB = getSaturation(b.r, b.g, b.b);
          const scoreA = a.count * (1 + satA * 2.5);
          const scoreB = b.count * (1 + satB * 2.5);
          return scoreB - scoreA;
        });

        // Filter out colors that are too similar
        const selected: { r: number; g: number; b: number }[] = [];
        for (const bin of bins) {
          if (selected.length >= colorCount) break;

          const isDistinct = selected.every((s) => {
            const dist = Math.sqrt(
              Math.pow(s.r - bin.r, 2) +
                Math.pow(s.g - bin.g, 2) +
                Math.pow(s.b - bin.b, 2)
            );
            return dist > 40; // Minimum color distance
          });

          if (isDistinct) {
            selected.push(bin);
          }
        }

        // Fill remaining if needed
        for (const bin of bins) {
          if (selected.length >= colorCount) break;
          if (!selected.includes(bin)) {
            selected.push(bin);
          }
        }

        // Sort selected colors by luminance for pleasing gradient
        selected.sort(
          (a, b) => getLuminance(b.r, b.g, b.b) - getLuminance(a.r, a.g, a.b)
        );

        const result: ExtractedColor[] = selected.map((c) => {
          const hex = rgbToHex(c.r, c.g, c.b);
          return {
            hex,
            rgb: { r: c.r, g: c.g, b: c.b },
            rgbString: `RGB ${c.r}, ${c.g}, ${c.b}`,
          };
        });

        resolve(result.length > 0 ? result : getDefaultPalette());
      } catch {
        resolve(getDefaultPalette());
      }
    };

    img.onerror = () => {
      resolve(getDefaultPalette());
    };

    img.src = dataUrl;
  });
}

function getDefaultPalette(): ExtractedColor[] {
  return [
    "#F7D9C4",
    "#261815",
    "#B78A71",
    "#7F6056",
    "#8A6F5A",
    "#A68895",
  ].map(hexToExtractedColor);
}
