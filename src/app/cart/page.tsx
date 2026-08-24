'use client'
// src/app/cart/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCartStore } from '@/components/CartProvider'

export const runtime = 'edge'

export default function CartPage() {
  const items = useCartStore(s => s.items)
  const updateQty = useCartStore(s => s.updateQty)
  const removeItem = useCartStore(s => s.removeItem)
  const subtotal = useCartStore(s => s.subtotal())

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 bg-parchment min-h-screen">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs text-gold tracking-[0.3em] uppercase font-body mb-3">
            Your Selections
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-ink leading-none mb-10">Cart</h1>

          {items.length === 0 ? (
            <div className="glass-card p-16 text-center">
              <p className="font-display text-2xl text-dusk/40 mb-4">Your cart is empty</p>
              <p className="text-dusk/55 font-body mb-8">
                Browse the gallery to order a print of any work.
              </p>
              <Link href="/gallery" className="btn-portal inline-flex">
                Browse the Gallery
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Line items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map(item => (
                  <div
                    key={item.key}
                    className="flex gap-4 border border-whisper bg-vellum/40 p-4"
                  >
                    <Link
                      href={`/artwork/${item.painting_slug}`}
                      className="relative w-20 h-24 shrink-0 overflow-hidden bg-whisper border border-whisper"
                    >
                      {item.painting_image && (
                        <Image
                          src={item.painting_image}
                          alt={item.painting_title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      )}
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/artwork/${item.painting_slug}`}
                        className="font-display text-lg text-ink hover:text-gold transition-colors leading-tight"
                      >
                        {item.painting_title}
                      </Link>
                      <p className="text-xs text-dusk/55 font-body mt-1">
                        {item.format} · {item.size}
                      </p>
                      <p className="text-sm text-gold font-body mt-1">
                        ${item.price.toLocaleString()}
                      </p>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border border-whisper">
                          <button
                            type="button"
                            onClick={() => updateQty(item.key, item.quantity - 1)}
                            className="w-8 h-9 flex items-center justify-center text-dusk/60 hover:text-ink"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-body text-ink">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.key, item.quantity + 1)}
                            className="w-8 h-9 flex items-center justify-center text-dusk/60 hover:text-ink"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          className="text-xs text-dusk/45 hover:text-blush transition-colors uppercase tracking-widest font-body"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <p className="font-body text-ink/80 text-sm whitespace-nowrap">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="glass-card p-6 sticky top-28">
                  <p className="font-display text-xl text-ink mb-5">Order Summary</p>
                  <div className="flex items-center justify-between text-sm font-body mb-2">
                    <span className="text-dusk/60">Subtotal</span>
                    <span className="text-ink">${subtotal.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-dusk/40 font-body mb-6">
                    Shipping (for printed works) is calculated at checkout.
                  </p>
                  <Link href="/checkout" className="btn-portal w-full justify-center">
                    Proceed to Checkout
                  </Link>
                  <Link
                    href="/gallery"
                    className="block text-center text-xs text-dusk/50 hover:text-ink transition-colors font-body mt-4 tracking-wide"
                  >
                    ← Continue browsing
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
