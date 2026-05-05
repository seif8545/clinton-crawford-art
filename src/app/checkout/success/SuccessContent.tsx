'use client'
// src/app/checkout/success/SuccessContent.tsx
// Legacy stub. Order confirmation has been retired with the cart flow.
import Link from 'next/link'

export default function SuccessContent() {
  return (
    <div className="max-w-xl mx-auto px-6 text-center">
      <h1 className="font-display text-5xl text-ink mb-4">Inquiry Received</h1>
      <p className="text-lg text-dusk/60 font-body mb-8">
        Thank you. Dr. Crawford&rsquo;s studio will be in touch shortly.
      </p>
      <Link href="/gallery" className="btn-portal inline-flex">
        Continue Browsing
      </Link>
    </div>
  )
}
