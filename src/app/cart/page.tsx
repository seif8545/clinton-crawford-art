'use client'
// src/app/cart/page.tsx
import { useCartStore } from '@/components/CartProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeItem, total, count } = useCartStore()
  const cartTotal = total()
  const cartCount = count()
  const SHIPPING = cartCount > 0 ? 0 : 0 // Free shipping

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24 min-h-screen">
        <div className="max-w-6xl mx-auto px-6">

          {/* Header */}
          <div className="mb-12">
            <p className="text-xs text-gold tracking-[0.3em] uppercase font-body mb-3">Your Collection</p>
            <h1 className="font-display text-6xl md:text-7xl text-ink">Cart</h1>
          </div>

          {cartCount === 0 ? (
            <div className="text-center py-32 border border-whisper">
              <p className="font-display text-4xl text-dusk/40 mb-4">Your collection is empty</p>
              <p className="text-dusk/30 font-body mb-10">Discover original works by Dr. Clinton Crawford</p>
              <Link href="/gallery" className="btn-portal">Enter the Gallery</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* Items */}
              <div className="lg:col-span-2 space-y-5">
                {items.map(item => (
                  <div key={item.artwork_id} className="flex gap-5 glass-card p-5 group">
                    <div className="relative w-24 h-28 shrink-0 bg-vellum border border-whisper overflow-hidden">
                      {item.primary_image_url ? (
                        <Image src={item.primary_image_url} alt={item.title} fill className="object-cover" sizes="96px" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-nebula/20 to-cobalt/10" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/artwork/${item.artwork_id}`} className="font-display text-xl text-ink hover:text-gold transition-colors line-clamp-2 leading-tight block">
                        {item.title}
                      </Link>
                      <p className="text-xs text-dusk/50 font-body mt-1">{item.medium} · {item.dimensions}</p>
                      <p className="font-display text-2xl text-gold mt-3">${item.price.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.artwork_id)}
                      className="text-dusk/30 hover:text-blush-deep transition-colors self-start shrink-0 p-1"
                      aria-label="Remove"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="glass-card p-6 sticky top-28">
                  <h2 className="font-display text-2xl text-gold mb-6">Order Summary</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-dusk/65">Subtotal ({cartCount} work{cartCount > 1 ? 's' : ''})</span>
                      <span className="text-ink">${cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-dusk/65">Shipping</span>
                      <span className="text-gold">Free</span>
                    </div>
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-dusk/65">Insurance</span>
                      <span className="text-gold">Included</span>
                    </div>
                  </div>
                  <div className="border-t border-gold/15 pt-5 mb-6 flex justify-between">
                    <span className="font-display text-xl text-ink">Total</span>
                    <span className="font-display text-2xl text-gold">${cartTotal.toLocaleString()}</span>
                  </div>
                  <Link href="/checkout" className="btn-portal w-full text-center justify-center block">
                    Proceed to Checkout
                  </Link>
                  <Link href="/gallery" className="block text-center text-sm text-dusk/40 hover:text-dusk/65 transition-colors mt-4 font-body">
                    Continue Browsing
                  </Link>
                  <div className="mt-6 pt-5 border-t border-whisper space-y-2">
                    <p className="text-xs text-dusk/40 font-body flex items-center gap-2">
                      <span>🔒</span> Secure checkout · SSL encrypted
                    </p>
                    <p className="text-xs text-dusk/40 font-body flex items-center gap-2">
                      <span>📦</span> Free worldwide shipping
                    </p>
                    <p className="text-xs text-dusk/40 font-body flex items-center gap-2">
                      <span>📜</span> Certificate of authenticity included
                    </p>
                  </div>
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
