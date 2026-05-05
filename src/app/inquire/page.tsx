// src/app/inquire/page.tsx
import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import InquireForm from './InquireForm'

export const runtime = 'edge'

export const metadata = {
  title: 'Inquire',
  description:
    'Buy or inquire about an original painting by Dr. Clinton Crawford. Each work is offered at price upon request.',
}

export default function InquirePage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 bg-parchment min-h-screen">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-10">
            <p className="text-xs text-gold tracking-[0.3em] uppercase font-body mb-3">
              Acquire a Work
            </p>
            <h1 className="font-display text-5xl md:text-7xl text-ink leading-none mb-5">
              Buy &amp; Inquiry
            </h1>
            <p className="text-dusk/65 font-body max-w-xl leading-relaxed">
              Each painting is an original, signed and offered at price upon request. Tell us
              which work has caught your eye and we&rsquo;ll be in touch from the studio with
              pricing, framing, shipping and any commission options.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="glass-card p-10 text-center text-dusk/40 font-body">
                Loading the inquiry form…
              </div>
            }
          >
            <InquireForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
