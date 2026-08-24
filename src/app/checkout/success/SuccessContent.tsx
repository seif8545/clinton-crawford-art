'use client'
// src/app/checkout/success/SuccessContent.tsx
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function SuccessContent() {
  const params = useSearchParams()
  const orderNumber = params.get('order')

  return (
    <div className="max-w-xl mx-auto px-6 text-center">
      <p className="text-xs text-gold tracking-[0.3em] uppercase font-body mb-4">
        Order Confirmed
      </p>
      <h1 className="font-display text-5xl text-ink mb-4">Thank You</h1>
      <p className="text-lg text-dusk/60 font-body mb-2">
        Your order has been received and the studio has been notified.
      </p>
      {orderNumber && (
        <p className="text-sm text-dusk/45 font-body mb-8">
          Order number <span className="text-ink">{orderNumber}</span> — a confirmation email
          with payment and next steps will follow shortly.
        </p>
      )}
      <div className="flex items-center justify-center gap-4 mt-4">
        <Link href="/gallery" className="btn-portal inline-flex">
          Continue Browsing
        </Link>
      </div>
    </div>
  )
}
