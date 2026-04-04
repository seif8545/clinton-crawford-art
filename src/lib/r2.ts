// src/lib/r2.ts
// R2 removed — images are served via public URL stored directly in artwork_images.r2_key
// r2_key now stores a full URL or a relative /public path instead of an R2 object key.

export function r2KeyToUrl(_r2PublicUrl: string, r2Key: string): string {
  // If r2_key is already a full URL, return as-is
  if (r2Key.startsWith('http')) return r2Key
  // Otherwise treat as a public folder path
  return r2Key
}
