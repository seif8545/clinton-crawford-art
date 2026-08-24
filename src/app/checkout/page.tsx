'use client'
// src/app/checkout/page.tsx
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCartStore } from '@/components/CartProvider'
import { estimateShipping, hasPhysicalItem } from '@/lib/orders'

export const runtime = 'edge'

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore(s => s.items)
  const subtotal = useCartStore(s => s.subtotal())
  const clearCart = useCartStore(s => s.clearCart)

  const needsShipping = useMemo(() => hasPhysicalItem(items), [items])
  const shippingCost = useMemo(() => estimateShipping(items), [items])
  const total = subtotal + shippingCost

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [line1, setLine1] = useState('')
  const [line2, setLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [country, setCountry] = useState('United States')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-24 bg-parchment min-h-screen">
          <div className="max-w-xl mx-auto px-6 text-center">
            <p className="font-display text-3xl text-ink mb-4">Your cart is empty</p>
            <Link href="/gallery" className="btn-portal inline-flex">
              Browse the Gallery
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch('/api/print-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name,
          customer_email: email,
          customer_phone: phone || undefined,
          shipping_address: needsShipping
            ? { name, line1, line2: line2 || undefined, city, state, zip, country }
            : null,
          items: items.map(i => ({
            painting_slug: i.painting_slug,
            option_id: i.option_id,
            quantity: i.quantity,
          })),
          notes: notes || undefined,
        }),
      })

      const data = (await res.json()) as {
        success?: boolean
        order_number?: string
        error?: string
      }

      if (!res.ok || !data.success) {
        setError(data.error ?? 'Something went wrong placing your order. Please try again.')
        setSubmitting(false)
        return
      }

      clearCart()
      router.push(`/checkout/success?order=${encodeURIComponent(data.order_number ?? '')}`)
    } catch {
      setError('Something went wrong placing your order. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 bg-parchment min-h-screen">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs text-gold tracking-[0.3em] uppercase font-body mb-3">
            Almost there
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-ink leading-none mb-10">
            Checkout
          </h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <fieldset className="border border-whisper bg-vellum/40 p-6">
                <legend className="font-display text-lg text-gold px-1">Contact</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <label className="block">
                    <span className="text-xs text-dusk/55 font-body">Full name</span>
                    <input
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="mt-1 w-full border border-whisper bg-parchment px-3 py-2 font-body text-ink focus:outline-none focus:border-gold/50"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-dusk/55 font-body">Email</span>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="mt-1 w-full border border-whisper bg-parchment px-3 py-2 font-body text-ink focus:outline-none focus:border-gold/50"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-xs text-dusk/55 font-body">Phone (optional)</span>
                    <input
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="mt-1 w-full border border-whisper bg-parchment px-3 py-2 font-body text-ink focus:outline-none focus:border-gold/50"
                    />
                  </label>
                </div>
              </fieldset>

              {needsShipping && (
                <fieldset className="border border-whisper bg-vellum/40 p-6">
                  <legend className="font-display text-lg text-gold px-1">Shipping Address</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <label className="block sm:col-span-2">
                      <span className="text-xs text-dusk/55 font-body">Address line 1</span>
                      <input
                        required
                        value={line1}
                        onChange={e => setLine1(e.target.value)}
                        className="mt-1 w-full border border-whisper bg-parchment px-3 py-2 font-body text-ink focus:outline-none focus:border-gold/50"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="text-xs text-dusk/55 font-body">Address line 2 (optional)</span>
                      <input
                        value={line2}
                        onChange={e => setLine2(e.target.value)}
                        className="mt-1 w-full border border-whisper bg-parchment px-3 py-2 font-body text-ink focus:outline-none focus:border-gold/50"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-dusk/55 font-body">City</span>
                      <input
                        required
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="mt-1 w-full border border-whisper bg-parchment px-3 py-2 font-body text-ink focus:outline-none focus:border-gold/50"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-dusk/55 font-body">State / Province</span>
                      <input
                        required
                        value={state}
                        onChange={e => setState(e.target.value)}
                        className="mt-1 w-full border border-whisper bg-parchment px-3 py-2 font-body text-ink focus:outline-none focus:border-gold/50"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-dusk/55 font-body">ZIP / Postal code</span>
                      <input
                        required
                        value={zip}
                        onChange={e => setZip(e.target.value)}
                        className="mt-1 w-full border border-whisper bg-parchment px-3 py-2 font-body text-ink focus:outline-none focus:border-gold/50"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-dusk/55 font-body">Country</span>
                      <input
                        required
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                        className="mt-1 w-full border border-whisper bg-parchment px-3 py-2 font-body text-ink focus:outline-none focus:border-gold/50"
                      />
                    </label>
                  </div>
                </fieldset>
              )}

              <fieldset className="border border-whisper bg-vellum/40 p-6">
                <legend className="font-display text-lg text-gold px-1">Notes (optional)</legend>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Gift note, framing preference, delivery instructions…"
                  className="mt-3 w-full border border-whisper bg-parchment px-3 py-2 font-body text-ink focus:outline-none focus:border-gold/50"
                />
              </fieldset>

              <p className="text-xs text-dusk/40 font-body">
                Payment is arranged directly with the studio after your order is received —
                you&rsquo;ll get a confirmation email with next steps.
              </p>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-28">
                <p className="font-display text-xl text-ink mb-5">Order Summary</p>
                <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
                  {items.map(item => (
                    <div key={item.key} className="flex justify-between text-sm font-body gap-3">
                      <span className="text-dusk/65">
                        {item.quantity} × {item.painting_title}
                        <span className="block text-xs text-dusk/40">
                          {item.format}, {item.size}
                        </span>
                      </span>
                      <span className="text-ink whitespace-nowrap">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-whisper pt-4 space-y-2 text-sm font-body">
                  <div className="flex justify-between">
                    <span className="text-dusk/60">Subtotal</span>
                    <span className="text-ink">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dusk/60">Shipping</span>
                    <span className="text-ink">
                      {shippingCost > 0 ? `$${shippingCost.toLocaleString()}` : 'Free'}
                    </span>
                  </div>
                  <div className="flex justify-between font-display text-lg text-gold pt-2">
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>

                {error && <p className="text-sm text-blush font-body mt-4">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-portal w-full justify-center mt-6 disabled:opacity-50"
                >
                  {submitting ? 'Placing Order…' : 'Place Order'}
                </button>
                <Link
                  href="/cart"
                  className="block text-center text-xs text-dusk/50 hover:text-ink transition-colors font-body mt-4 tracking-wide"
                >
                  ← Back to cart
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
