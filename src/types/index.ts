// ═══════════════════════════════════════════════════════════
//  src/types/index.ts — Shared TypeScript interfaces
// ═══════════════════════════════════════════════════════════

export interface ArtworkImage {
  id: number
  artwork_id: number
  r2_key: string
  is_primary: number
  sort_order: number
  url?: string // Hydrated on the server from R2_PUBLIC_URL + r2_key
}

export interface Artwork {
  id: number
  title: string
  slug: string
  year: number | null
  medium: string
  dimensions: string
  description: string | null
  series: string | null
  price: number
  status: 'available' | 'sold' | 'reserved' | 'not_for_sale'
  featured: number
  sort_order: number
  created_at: string
  updated_at: string
  images?: ArtworkImage[]
  primary_image_url?: string // convenience field
}

export interface Client {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string | null
  shipping_address: ShippingAddress | null
  notes: string | null
  created_at: string
  updated_at: string
  order_count?: number
  total_spent?: number
}

export interface ShippingAddress {
  line1: string
  line2?: string
  city: string
  state: string
  zip: string
  country: string
}

export interface OrderItem {
  id: number
  order_id: number
  artwork_id: number
  title: string
  price: number
  quantity: number
  primary_image_url?: string
}

export interface Order {
  id: number
  order_number: string
  client_id: number | null
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  subtotal: number
  shipping_cost: number
  total: number
  shipping_address: ShippingAddress | null
  stripe_payment_intent: string | null
  notes: string | null
  created_at: string
  updated_at: string
  client?: Client
  items?: OrderItem[]
}

// Cart (client-side only, managed by Zustand)
export interface CartItem {
  artwork_id: number
  title: string
  price: number
  quantity: number
  primary_image_url?: string
  dimensions: string
  medium: string
}

export interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (artwork_id: number) => void
  updateQty: (artwork_id: number, qty: number) => void
  clearCart: () => void
  total: () => number
  count: () => number
}

// Analytics
export interface AnalyticsSummary {
  total_revenue: number
  total_orders: number
  orders_pending: number
  orders_paid: number
  total_artworks: number
  artworks_available: number
  artworks_sold: number
  total_clients: number
  top_artworks: { title: string; total_sold: number; revenue: number }[]
  recent_orders: Order[]
}

// Cloudflare env bindings
export interface CloudflareEnv {
  DB: D1Database
  BUCKET: R2Bucket
  R2_PUBLIC_URL: string
  ADMIN_PASSWORD: string
  ADMIN_SECRET_KEY: string
}
