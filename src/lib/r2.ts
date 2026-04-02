// ═══════════════════════════════════════════════════════════
//  src/lib/r2.ts — Cloudflare R2 helpers
// ═══════════════════════════════════════════════════════════

export function r2KeyToUrl(r2PublicUrl: string, r2Key: string): string {
  return `${r2PublicUrl.replace(/\/$/, '')}/${r2Key}`
}

export async function uploadToR2(
  bucket: R2Bucket,
  key: string,
  body: ArrayBuffer,
  contentType: string
): Promise<void> {
  await bucket.put(key, body, {
    httpMetadata: { contentType },
  })
}

export async function deleteFromR2(bucket: R2Bucket, key: string): Promise<void> {
  await bucket.delete(key)
}

export function generateR2Key(artworkId: number, filename: string): string {
  const ext = filename.split('.').pop() ?? 'jpg'
  const ts = Date.now()
  return `artworks/${artworkId}/${ts}.${ext}`
}

// Hydrate artwork images with full public URLs
export function hydrateImageUrls<T extends { r2_key?: string; images?: { r2_key: string; url?: string }[] }>(
  r2PublicUrl: string,
  item: T
): T {
  if (item.images) {
    item.images = item.images.map(img => ({
      ...img,
      url: r2KeyToUrl(r2PublicUrl, img.r2_key),
    }))
  }
  return item
}
