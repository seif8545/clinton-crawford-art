// src/lib/orders.ts
//
// Types and small pure helpers for print orders. This is deliberately
// separate from the legacy src/types/index.ts (D1/Cloudflare-era Order
// types that are no longer wired to anything live) — that file is unused
// dead code left over from an earlier architecture; this one backs the
// current Supabase-based print-purchase flow.

export interface ShippingAddress {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  zip: string
  country: string
}

export type PrintFormat = 'Digital Download' | 'Fine Art Paper' | 'Canvas Print'

export interface PrintOrderItem {
  painting_slug: string
  painting_title: string
  painting_image: string
  option_id: string
  format: PrintFormat
  size: string
  /** unit price, snapshotted at time of order (source of truth is server-side lookup, not the client) */
  price: number
  quantity: number
}

export type PrintOrderStatus =
  | 'pending'
  | 'confirmed'
  | 'in_production'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface PrintOrder {
  id?: number
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone?: string | null
  /** null when every item in the order is a digital download */
  shipping_address: ShippingAddress | null
  items: PrintOrderItem[]
  subtotal: number
  shipping_cost: number
  total: number
  status: PrintOrderStatus
  notes?: string | null
  created_at?: string
}

/** ACP-2026-X7QJ2 style order number — short, unique enough, easy to read back over email. */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `ACP-${year}-${rand}`
}

export function hasPhysicalItem(items: PrintOrderItem[]): boolean {
  return items.some(i => i.format !== 'Digital Download')
}

export function computeTotals(items: PrintOrderItem[], shippingCost = 0) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  return { subtotal, shipping_cost: shippingCost, total: subtotal + shippingCost }
}

/** Flat-rate domestic shipping placeholder — replace with real rates whenever ready. */
export function estimateShipping(items: PrintOrderItem[]): number {
  if (!hasPhysicalItem(items)) return 0
  const physicalCount = items
    .filter(i => i.format !== 'Digital Download')
    .reduce((sum, i) => sum + i.quantity, 0)
  if (physicalCount === 0) return 0
  return 15 + Math.max(0, physicalCount - 1) * 8
}
