// src/lib/paintings.ts
//
// Painting type + helpers. The live catalogue is stored in Supabase
// (see src/lib/supabase.ts); the bundled seed below is used only as a
// fallback if Supabase is unreachable, so the site never renders empty.

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
  /** primary image shown in listings and as the first detail image */
  image: string
  /** extra detail images (closeups, alternate angles) shown after the main one */
  images?: string[]
}

const SEED_PAINTINGS: Painting[] = (seedData as { paintings: Painting[] }).paintings

/**
 * Returns the seed paintings shipped with the bundle. Used only as a fallback
 * by the Supabase data layer when the live store is unreachable.
 */
export function getSeedPaintings(): Painting[] {
  return [...SEED_PAINTINGS].sort((a, b) => a.sort_order - b.sort_order)
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
