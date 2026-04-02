// src/app/checkout/success/page.tsx
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface Props { searchParams: { order?: string } }

export default function SuccessPage({ searchParams }: Props) {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24 min-h-screen flex items-center justify-center">
        <div className="max-w-lg mx-auto px-6 text-center">

          {/* Animated gold circle */}
          <div className="w-24 h-24 mx-auto mb-8 rounded-full border border-gold/30 flex items-center justify-center animate-pulse-gold">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <p className="text-xs text-gold tracking-[0.4em] uppercase font-body mb-4">Order Confirmed</p>
          <h1 className="font-display text-5xl text-ink mb-4">Thank You</h1>

          {searchParams.order && (
            <p className="text-dusk/60 font-body mb-2">
              Order <span className="text-gold font-body">{searchParams.order}</span>
            </p>
          )}

          <p className="text-dusk/60 font-body leading-relaxed mb-10">
            You will receive a confirmation email shortly. Dr. Crawford's studio will
            be in touch regarding shipping and the certificate of authenticity.
          </p>

          <div className="glass-card p-6 mb-8 text-left space-y-3 text-sm">
            <p className="font-display text-lg text-gold">What happens next?</p>
            {[
              'You\'ll receive an email confirmation within a few minutes.',
              'The studio will carefully package and insure your work.',
              'A signed certificate of authenticity will accompany the piece.',
              'Tracking information will be sent once shipped.',
            ].map((step, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-gold/50 font-display">{i + 1}.</span>
                <span className="text-dusk/65 font-body">{step}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            <Link href="/gallery" className="btn-ghost">Continue Browsing</Link>
            <Link href="/" className="btn-portal">Home</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
