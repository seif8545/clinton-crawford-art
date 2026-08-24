'use client'
// src/components/CartProvider.tsx
//
// Print-purchase cart. A previous version of this file stubbed cart/
// checkout out entirely — that was the right call for buying *originals*
// (one-of-a-kind, price-upon-request works stay inquiry-only, see
// InquireButton). This revives it specifically for *print* purchases,
// which are a repeatable, priced, self-serve product.

import { useEffect } from 'react'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { PrintFormat } from '@/lib/orders'

export interface CartItem {
  /** unique cart line key: `${painting_slug}:${option_id}` */
  key: string
  painting_slug: string
  painting_title: string
  painting_image: string
  option_id: string
  format: PrintFormat
  size: string
  price: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void
  removeItem: (key: string) => void
  updateQty: (key: string, qty: number) => void
  clearCart: () => void
  subtotal: () => number
  count: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, qty = 1) =>
        set(state => {
          const existing = state.items.find(i => i.key === item.key)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.key === item.key ? { ...i, quantity: i.quantity + qty } : i
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity: qty }] }
        }),

      removeItem: key =>
        set(state => ({ items: state.items.filter(i => i.key !== key) })),

      updateQty: (key, qty) =>
        set(state => ({
          items:
            qty <= 0
              ? state.items.filter(i => i.key !== key)
              : state.items.map(i => (i.key === key ? { ...i, quantity: qty } : i)),
        })),

      clearCart: () => set({ items: [] }),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'art-crawford-print-cart-v1',
      storage: createJSONStorage(() => localStorage),
      // Never touch localStorage during SSR/edge render — rehydrate
      // manually on mount instead (see CartProvider below).
      skipHydration: true,
    }
  )
)

/**
 * Rehydrates the persisted cart once the app has mounted in the browser.
 * Wraps the app body in the root layout — every page gets a live cart
 * without each one needing to remember to call rehydrate() itself.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useCartStore.persist.rehydrate()
  }, [])
  return <>{children}</>
}
