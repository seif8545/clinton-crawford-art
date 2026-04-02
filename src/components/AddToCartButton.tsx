'use client'
// src/components/AddToCartButton.tsx
import { useState } from 'react'
import { useCartStore } from '@/components/CartProvider'
import type { Artwork } from '@/types'

interface Props {
  artwork: Artwork
}

export default function AddToCartButton({ artwork }: Props) {
  const { addItem, items } = useCartStore()
  const [added, setAdded] = useState(false)

  const inCart = items.some(i => i.artwork_id === artwork.id)

  function handleAdd() {
    addItem({
      artwork_id: artwork.id,
      title: artwork.title,
      price: artwork.price,
      quantity: 1,
      primary_image_url: artwork.primary_image_url,
      dimensions: artwork.dimensions,
      medium: artwork.medium,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  if (artwork.status !== 'available') {
    return (
      <div className="w-full py-4 text-center font-display text-lg tracking-widest uppercase text-dusk/50 border border-mauve/20">
        {artwork.status === 'sold' ? 'Sold' : 'Currently Reserved'}
      </div>
    )
  }

  if (inCart) {
    return (
      <div className="flex flex-col gap-3 w-full">
        <div className="w-full py-4 text-center font-display text-lg tracking-widest uppercase text-gold border border-gold/30 bg-gold/8">
          ✓ In Your Collection
        </div>
        <a href="/cart" className="text-center text-sm text-dusk/60 hover:text-ivory transition-colors underline underline-offset-4">
          View Cart
        </a>
      </div>
    )
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full btn-portal text-center justify-center transition-all duration-300 ${
        added ? 'opacity-80' : ''
      }`}
    >
      {added ? '✓ Added to Collection' : 'Add to Collection'}
    </button>
  )
}
