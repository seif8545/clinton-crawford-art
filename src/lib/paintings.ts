// src/lib/paintings.ts
//
// Painting type + helpers. The live catalogue is stored in Supabase
// (see src/lib/supabase.ts); the bundled seed below is used only as a
// fallback if Supabase is unreachable, so the site never renders empty.

import seedData from '@/data/paintings.json'

export type PaintingStatus = 'available' | 'sold' | 'reserved' | 'not_for_sale'

/** A single purchasable print/reproduction SKU for a painting. */
export interface PrintOption {
  /** stable id, unique within a painting — used as the cart line key */
  id: string
  format: 'Digital Download' | 'Fine Art Paper' | 'Canvas Print'
  /** human size label, e.g. "16 × 20 in" — empty string for digital-only */
  size: string
  price: number
}

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
  /**
   * Print/reproduction SKUs available for this work. When unset or empty,
   * `printOptionsFor()` falls back to the studio-wide default ladder so
   * every painting is sellable as a print without per-work data entry.
   * Prints are sold independently of the original's `status` — a sold or
   * not-for-sale original can still be reproduced as a print.
   */
  print_options?: PrintOption[]
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

/**
 * Studio-wide default print ladder. Used for any painting that doesn't
 * define its own `print_options`. Edit prices here to change them
 * everywhere at once; override per-painting via `print_options` in
 * Supabase (or the seed JSON) for special cases.
 */
export function defaultPrintOptions(): PrintOption[] {
  return [
    { id: 'digital', format: 'Digital Download', size: 'High-res digital file', price: 45 },
    { id: 'paper-11x14', format: 'Fine Art Paper', size: '11 × 14 in', price: 85 },
    { id: 'paper-16x20', format: 'Fine Art Paper', size: '16 × 20 in', price: 135 },
    { id: 'paper-24x30', format: 'Fine Art Paper', size: '24 × 30 in', price: 225 },
    { id: 'canvas-16x20', format: 'Canvas Print', size: '16 × 20 in', price: 195 },
    { id: 'canvas-24x30', format: 'Canvas Print', size: '24 × 30 in', price: 325 },
    { id: 'canvas-30x40', format: 'Canvas Print', size: '30 × 40 in', price: 465 },
  ]
}

/** The print SKUs to offer for a given painting — its own, or the default ladder. */
export function printOptionsFor(p: Painting): PrintOption[] {
  return p.print_options && p.print_options.length > 0 ? p.print_options : defaultPrintOptions()
}

export function findPrintOption(p: Painting, optionId: string): PrintOption | null {
  return printOptionsFor(p).find(o => o.id === optionId) ?? null
}

/** "Prints from $45" — the cheapest print SKU, for gallery-card teasers. */
export function printsFromLabel(p: Painting): string {
  const options = printOptionsFor(p)
  if (options.length === 0) return ''
  const cheapest = Math.min(...options.map(o => o.price))
  return `Prints from $${cheapest.toLocaleString()}`
}
