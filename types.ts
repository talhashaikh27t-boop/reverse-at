export interface ProcessedImage {
  original: string; // Base64 Data URI
  generated: string | null; // Base64 Data URI
  prompt: string;
}

export enum AppMode {
  REVERSE = 'REVERSE',
  AGE = 'AGE',
  STYLE = 'STYLE',
  COUNTRY = 'COUNTRY',
}

export interface GenerationConfig {
  prompt: string;
  image: string; // Base64 string (no header)
}