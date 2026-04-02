// src/app/not-found.tsx
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-texture" />
        <div className="absolute inset-0 " />

        <div className="relative z-10 text-center max-w-xl">
          <p className="font-display leading-none text-gold/15 select-none mb-0" style={{ fontSize: 'clamp(6rem,20vw,14rem)' }}>
            404
          </p>
          <div className="mt-[-2rem] mb-8">
            <h1 className="font-display text-4xl md:text-5xl text-ink mb-3">
              Portal Not Found
            </h1>
            <p className="text-ink/50 font-body leading-relaxed">
              This dimension does not exist — or perhaps it has shifted.
              The threshold between the real and the imagined is not always
              where we expect to find it.
            </p>
          </div>
          <div className="w-16 h-px bg-gold/30 mx-auto mb-8" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-portal">Return Home</Link>
            <Link href="/gallery" className="btn-ghost">Browse the Gallery</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
