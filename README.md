# PalettePix: Image Color Picker

PalettePix is a browser-based image palette extractor built with Next.js. It lets you upload an image, drag and drop a file, or choose one of the built-in sample scenes, then extract a curated set of dominant colors from the image and copy them with a single click.

## What it does

- Upload or drag-and-drop images in common formats such as PNG, JPG, WebP, GIF, SVG, and AVIF
- Display the selected image in a polished full-width preview area
- Extract a six-color dominant palette using a Canvas-based algorithm in the browser
- Show each color as a swatch with its HEX and RGB values
- Copy an individual color or the entire palette to the clipboard
- Save favorite palettes locally in the browser with a bookmark drawer
- Explore curated inspiration samples for quick palette ideas

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- lucide-react

## Getting started

Install dependencies:

```bash
npm install
```

Run the app locally:

```bash
npm run dev

Open http://localhost:3000 in your browser.
```

## Production build

```bash
npm run build
```

Then start the production server:

```bash
npm run start
```

## Project structure

```text
app/
  globals.css
  layout.tsx
  page.tsx
components/
  image/
  layout/
  palette/
hooks/
  useImageDropper.ts
lib/
  bookmarks.ts
  color-extractor.ts
  inspiration-samples.ts
types/
  image.ts
```

---