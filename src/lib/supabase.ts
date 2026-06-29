// src/lib/supabase.ts
//
// Tiny, dependency-free Supabase data layer (works on the Cloudflare edge).
// Reads use the public anon/publishable key; writes use the server-only
// service-role key. The gallery falls back to the bundled seed catalogue if
// Supabase is not configured, so the site never breaks.

import { getSeedPaintings, type Painting, type PaintingStatus } from '@/lib/paintings'

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? ''
const READ_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? ''
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

const TABLE = 'paintings'
const BUCKET = 'paintings'

export function supabaseReadReady(): boolean {
  return Boolean(SUPABASE_URL && READ_KEY)
}

export function supabaseWriteReady(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_KEY)
}

interface Row {
  id: number
  slug: string
  title: string
  year: number | null
  medium: string
  dimensions: string
  series: string | null
  description: string | null
  price: number | string
  price_label: string | null
  status: string
  featured: number
  sort_order: number
  image: string
  images: string[] | null
}

function rowToPainting(r: Row): Painting {
  return {
    id: Number(r.id),
    slug: r.slug,
    title: r.title,
    year: r.year === null ? null : Number(r.year),
    medium: r.medium,
    dimensions: r.dimensions ?? '',
    series: r.series,
    description: r.description,
    price: Number(r.price) || 0,
    price_label: r.price_label,
    status: r.status as PaintingStatus,
    featured: r.featured ? 1 : 0,
    sort_order: Number(r.sort_order) || 0,
    image: r.image,
    images: Array.isArray(r.images) ? r.images.filter(Boolean) : [],
  }
}

function paintingToRow(p: Painting): Row {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    year: p.year,
    medium: p.medium,
    dimensions: p.dimensions,
    series: p.series ?? null,
    description: p.description ?? null,
    price: p.price,
    price_label: p.price_label ?? null,
    status: p.status,
    featured: p.featured ? 1 : 0,
    sort_order: p.sort_order,
    image: p.image,
    images: p.images ?? [],
  }
}

/**
 * The live catalogue. Reads from Supabase; falls back to the bundled seed if
 * Supabase isn't configured or is unreachable. Safe to call from server
 * components and route handlers.
 */
export async function getPaintings(): Promise<Painting[]> {
  if (!supabaseReadReady()) return getSeedPaintings()
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}?select=*&order=sort_order.asc`,
      {
        headers: {
          apikey: READ_KEY,
          Authorization: `Bearer ${READ_KEY}`,
        },
        cache: 'no-store',
      }
    )
    if (!res.ok) return getSeedPaintings()
    const rows = (await res.json()) as Row[]
    if (!Array.isArray(rows) || rows.length === 0) return getSeedPaintings()
    return rows.map(rowToPainting).sort((a, b) => a.sort_order - b.sort_order)
  } catch {
    return getSeedPaintings()
  }
}

/** Insert or update a single painting (matched on id). Service-role only. */
export async function upsertPainting(p: Painting): Promise<Painting> {
  if (!supabaseWriteReady()) {
    throw new Error('Supabase write key is not configured on the server.')
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?on_conflict=id`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify([paintingToRow(p)]),
  })
  if (!res.ok) {
    throw new Error(`Save failed (${res.status}): ${await res.text()}`)
  }
  const rows = (await res.json()) as Row[]
  return rowToPainting(rows[0])
}

/** Delete a painting by id. Service-role only. */
export async function deletePainting(id: number): Promise<void> {
  if (!supabaseWriteReady()) {
    throw new Error('Supabase write key is not configured on the server.')
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?id=eq.${id}`, {
    method: 'DELETE',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
  })
  if (!res.ok) {
    throw new Error(`Delete failed (${res.status}): ${await res.text()}`)
  }
}

/**
 * Upload an image to the public storage bucket and return its public URL.
 * Service-role only.
 */
export async function uploadImage(
  bytes: ArrayBuffer,
  contentType: string,
  ext: string
): Promise<string> {
  if (!supabaseWriteReady()) {
    throw new Error('Supabase write key is not configured on the server.')
  }
  const safeExt = (ext || 'jpg').replace(/[^a-z0-9]/gi, '').toLowerCase() || 'jpg'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`,
    {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': contentType || 'application/octet-stream',
        'x-upsert': 'true',
        'cache-control': '31536000',
      },
      body: bytes,
    }
  )
  if (!res.ok) {
    throw new Error(`Upload failed (${res.status}): ${await res.text()}`)
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`
}
