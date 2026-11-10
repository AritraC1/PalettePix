export interface ExtractedColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  rgbString: string;
}

export interface UploadedImage {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  width?: number;
  height?: number;
  createdAt: number;
  isSample?: boolean;
}

export interface InspirationSample {
  id: string;
  title: string;
  imageUrl: string;
  colors: string[];
}
