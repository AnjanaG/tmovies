export const TMDB_API_BASE_URL: string | undefined = import.meta.env
  .VITE_TMDB_API_BASE_URL;
export const API_KEY: string | undefined = import.meta.env.VITE_API_KEY;

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
export const GOOGLE_AD_SLOT=import.meta.env.VITE_GOOGLE_AD_SLOT;
export const GOOGLE_AD_CLIENT=import.meta.env.VITE_GOOGLE_AD_CLIENT

export const THROTTLE_DELAY = 150;

// Launch Analyzer — ANTHROPIC_API_KEY is read server-side in /api/analyze-launch.ts
// Set this in Vercel environment variables (not prefixed with VITE_)
// For local dev: add ANTHROPIC_API_KEY to a .env file at root (not committed)
