'use client'
// src/components/PrintPurchase.tsx
//
// "Order a Print" — format/size picker + Add to Cart for reproductions of
// a painting. Deliberately separate from InquireButton, which handles
// inquiries about the original one-of-a-kind work. A painting that's sold
// or not for sale as an original can still be ordered as a print.

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/components/CartProvider'
import type { Painting, PrintOption } from '@/lib/paintings'

interface Props {
  painting: Painting
  options: PrintOption[]
}

const FORMAT_ORDER: PrintOption['format'][] = ['Canvas Print', 'Fine Art Paper', 'Digital Download']

export default function PrintPurchase({ painting, options }: Props) {
  const formats = useMemo(
    () => FORMAT_ORDER.filter(f => options.some(o => o.format === f)),
    [options]
  )
  const [format, setFormat] = useState<PrintOption['format'] | undefined>(formats[0])
  const sizesForFormat = useMemo(
    () => options.filter(o => o.format === format),
    [options, format]
  )
  const [optionId, setOptionId] = useState(sizesForFormat[0]?.id ?? '')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const addItem = useCartStore(s => s.addItem)
  const selected = options.find(o => o.id === optionId) ?? sizesForFormat[0]

  function handleFormat(f: PrintOption['format']) {
    setFormat(f)
    const first = options.find(o => o.format === f)
    setOptionId(first?.id ?? '')
    setAdded(false)
  }

  function handleAdd() {
    if (!selected) return
    addItem(
      {
        key: `${painting.slug}:${selected.id}`,
        painting_slug: painting.slug,
        painting_title: painting.title,
        painting_image: painting.image,
        option_id: selected.id,
        format: selected.format,
        size: selected.size,
        price: selected.price,
      },
      qty
    )
    setAdded(true)
  }

  if (!selected) return null

  return (
    <div className="border border-whisper bg-vellum/50 p-6">
      <p className="font-display text-lg text-gold mb-1">Order a Print</p>
      <p className="text-xs text-dusk/55 font-body mb-5">
        A reproduction of this work, printed and shipped to you.
      </p>

      {/* Format tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {formats.map(f => (
          <button
            key={f}
            type="button"
            onClick={() => handleFormat(f)}
            className={`text-xs px-3 py-2 tracking-[0.1em] uppercase font-body border transition-all duration-200 ${
              format === f
                ? 'border-gold/40 text-gold bg-gold/5'
                : 'border-whisper text-dusk/55 hover:text-ink hover:border-gold/20'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Size chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {sizesForFormat.map(o => (
          <button
            key={o.id}
            type="button"
            onClick={() => {
              setOptionId(o.id)
              setAdded(false)
            }}
            className={`text-sm px-4 py-2.5 font-body border transition-all duration-200 text-left ${
              optionId === o.id
                ? 'border-ink text-ink bg-parchment'
                : 'border-whisper text-dusk/70 hover:border-ink/30'
            }`}
          >
            <span className="block">{o.size}</span>
            <span className="block text-xs text-dusk/50 mt-0.5">
              ${o.price.toLocaleString()}
            </span>
          </button>
        ))}
      </div>

      {/* Quantity + Add to cart */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center border border-whisper">
          <button
            type="button"
            onClick={() => setQty(q => Math.max(1, q - 1))}
            className="w-9 h-10 flex items-center justify-center text-dusk/60 hover:text-ink"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center font-body text-ink">{qty}</span>
          <button
            type="button"
            onClick={() => setQty(q => Math.min(20, q + 1))}
            className="w-9 h-10 flex items-center justify-center text-dusk/60 hover:text-ink"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="btn-portal flex-1 sm:flex-none justify-center"
        >
          Add to Cart — ${(selected.price * qty).toLocaleString()}
        </button>
      </div>

      {added && (
        <p className="mt-4 text-sm text-gold font-body">
          Added to cart.{' '}
          <Link href="/cart" className="underline underline-offset-4 hover:text-ink">
            View cart →
          </Link>
        </p>
      )}

      <p className="text-xs text-dusk/40 font-body mt-4">
        {selected.format === 'Digital Download'
          ? 'Delivered by email as a high-resolution file.'
          : 'Printed and shipped — production and shipping times vary by size.'}
      </p>
    </div>
  )
}
