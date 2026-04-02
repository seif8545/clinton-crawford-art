'use client'
// src/components/CartProvider.tsx
import { createContext, useContext, useRef } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartState, CartItem } from '@/types'

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: CartItem) => {
        const existing = get().items.find(i => i.artwork_id === item.artwork_id)
        if (existing) return // Artworks are unique — one per cart
        set(state => ({ items: [...state.items, { ...item, quantity: 1 }] }))
      },

      removeItem: (artwork_id: number) =>
        set(state => ({ items: state.items.filter(i => i.artwork_id !== artwork_id) })),

      updateQty: (artwork_id: number, qty: number) =>
        set(state => ({
          items: state.items.map(i =>
            i.artwork_id === artwork_id ? { ...i, quantity: Math.max(1, qty) } : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      total: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),

      count: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    {
      name: 'cc-cart',
      version: 1,
    }
  )
)

// Export a hook for use in client components
export { useCartStore }

// Provider wrapper (just renders children — Zustand doesn't need a provider,
// but this gives us a place to add initialization logic in the future)
export function CartProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
