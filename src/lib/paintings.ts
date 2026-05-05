// src/lib/paintings.ts
//
// Single source of truth for the gallery's listings.
// The seed data is statically imported so it works on the Cloudflare edge runtime.
// On the client (admin), localStorage edits are layered on top of the seed
// so the painter can manage listings without a backend.

import seedData from '@/data/paintings.json'

export type PaintingStatus = 'available' | 'sold' | 'reserved' | 'not_for_sale'

export interface Painting {
  id: number
  slug: string
  title: string
  year: number | null
  medium: string
  dimensions: string
  series: string | null
  description: string | null
  /** numeric price, or 0 when price_label is shown instead */
  price: number
  /** when set, shown in place of a numeric price (e.g. "Price upon request") */
  price_label?: string | null
  status: PaintingStatus
  featured: 0 | 1
  sort_order: number
  image: string
}

const SEED_PAINTINGS: Painting[] = (seedData as { paintings: Painting[] }).paintings

const STORAGE_KEY = 'art-crawford-paintings-v1'

/**
 * Returns the seed paintings shipped with the bundle. Used by all server
 * components — these run on the edge and cannot read localStorage.
 */
export function getSeedPaintings(): Painting[] {
  return [...SEED_PAINTINGS].sort((a, b) => a.sort_order - b.sort_order)
}

/**
 * Returns paintings the painter (admin) has saved locally, or the seed if none.
 * Only safe to call from a client component / inside useEffect.
 */
export function getLivePaintings(): Painting[] {
  if (typeof window === 'undefined') return getSeedPaintings()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return getSeedPaintings()
    const parsed = JSON.parse(raw) as Painting[]
    if (!Array.isArray(parsed) || parsed.length === 0) return getSeedPaintings()
    return [...parsed].sort((a, b) => a.sort_order - b.sort_order)
  } catch {
    return getSeedPaintings()
  }
}

export function saveLivePaintings(paintings: Painting[]): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(paintings))
}

export function resetLivePaintings(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}

export function findBySlug(paintings: Painting[], slug: string): Painting | null {
  return paintings.find(p => p.slug === slug) ?? null
}

export function findById(paintings: Painting[], id: number): Painting | null {
  return paintings.find(p => p.id === id) ?? null
}

export function uniqueSeries(paintings: Painting[]): string[] {
  return Array.from(new Set(paintings.map(p => p.series).filter(Boolean) as string[]))
}

export function nextId(paintings: Painting[]): number {
  return paintings.length === 0 ? 1 : Math.max(...paintings.map(p => p.id)) + 1
}

export function autoSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function priceDisplay(p: Painting): string {
  if (p.price_label && p.price_label.trim().length > 0) return p.price_label
  if (p.price > 0) return `$${p.price.toLocaleString()}`
  return 'Price upon request'
}
