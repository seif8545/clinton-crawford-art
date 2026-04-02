// src/app/page.tsx
export const runtime = 'edge'

import { getRequestContext } from '@cloudflare/next-on-pages'
import { getArtworks } from '@/lib/db'
import { r2KeyToUrl } from '@/lib/r2'
import type { CloudflareEnv } from '@/types'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArtworkCard from '@/components/ArtworkCard'
import Link from 'next/link'

export default async function HomePage() {
  let featuredArtworks: Awaited<ReturnType<typeof getArtworks>> = []

  try {
    const ctx = getRequestContext()
    const env = ctx.env as CloudflareEnv
    const r2PublicUrl = env.R2_PUBLIC_URL ?? ''
    const artworks = await getArtworks(env.DB, { featured: true })
    featuredArtworks = artworks.map(a => ({
      ...a,
      primary_image_url: a.images?.[0]?.r2_key ? r2KeyToUrl(r2PublicUrl, a.images[0].r2_key) : undefined,
    }))
  } catch { /* dev fallback */ }

  return (
    <>
      <Navbar />
      <main>

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

          {/* Warm parchment base with soft colour washes */}
          <div className="absolute inset-0 bg-parchment" />
          <div className="absolute inset-0" style={{
                      background: 'radial-gradient(ellipse at 20% 30%, rgba(184,168,204,0.25) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(143,174,200,0.2) 0%, transparent 55%), radial-gradient(ellipse at 50% 10%, rgba(196,32,64,0.12) 0%, transparent 50%)'         }} />

          {/* Subtle horizontal rule lines — like a canvas grain */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"
                style={{ top: `${15 + i * 14}%` }} />
            ))}
          </div>

          {/* Floating ink dots */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="absolute rounded-full"
                style={{
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  background: i % 3 === 0 ? '#B8882A' : i % 3 === 1 ? '#D4958A' : '#8FAEC8',
                  opacity: Math.random() * 0.3 + 0.1,
                  animation: `float ${Math.random() * 4 + 4}s ease-in-out ${Math.random() * 2}s infinite`,
                }} />
            ))}
          </div>

          {/* Hero content */}
          <div className="relative z-10 text-center max-w-5xl mx-auto px-6 py-32">
            <p className="font-body text-xs tracking-[0.45em] uppercase text-dusk/50 mb-6 animate-fade-up opacity-0 animate-delay-100">
              Professor Emeritus · MFA · Guyana / United States
            </p>

            <h1 className="font-display text-ink mb-4 animate-fade-up opacity-0 animate-delay-200"
              style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', lineHeight: '0.88', letterSpacing: '-0.01em' }}>
              Clinton
              <br />
              <span className="text-gold-shimmer">Crawford</span>
            </h1>

            <div className="flex items-center justify-center gap-6 my-10 animate-fade-up opacity-0 animate-delay-300">
              <div className="divider-gold w-24" />
              <p className="font-display text-xl md:text-2xl text-dusk/70 italic tracking-wide">
                Portals to Other Dimensions
              </p>
              <div className="divider-gold w-24" />
            </div>

            <p className="font-body text-base md:text-lg text-dusk/65 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up opacity-0 animate-delay-400">
              Works in magical realism where sky and water are interchangeable,
              land formations belong to imagined geographies, and the viewer
              is invited to step through the canvas into an otherworldly consciousness.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up opacity-0 animate-delay-500">
              <Link href="/gallery" className="btn-portal">Enter the Gallery</Link>
              <Link href="/about" className="btn-ghost">About the Artist</Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30" style={{ animation: 'float 3s ease-in-out infinite' }}>
            <span className="text-xs text-dusk tracking-[0.3em] uppercase font-body">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent" />
          </div>
        </section>

              {/* ── ARTIST QUOTE ───────────────────────────────────────────── */}
              <section className="py-24 px-6 border-y border-whisper relative overflow-hidden">
                  {/* Crimson wash background */}
                  <div className="absolute inset-0" style={{
                      background: 'linear-gradient(135deg, rgba(196,32,64,0.07) 0%, rgba(232,114,138,0.05) 40%, rgba(196,32,64,0.07) 100%)'
                  }} />
                  {/* Soft parchment base underneath */}
                  <div className="absolute inset-0 bg-vellum -z-10" />

                  {/* Decorative crimson side rules */}
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{
                      background: 'linear-gradient(to bottom, transparent, rgba(196,32,64,0.3), transparent)'
                  }} />
                  <div className="absolute right-0 top-0 bottom-0 w-1" style={{
                      background: 'linear-gradient(to bottom, transparent, rgba(196,32,64,0.3), transparent)'
                  }} />

                  <div className="max-w-4xl mx-auto text-center relative z-10">
                      {/* Opening quote mark in crimson */}
                      <div className="font-display leading-none mb-4 select-none"
                          style={{ fontSize: '5rem', color: 'rgba(196,32,64,0.2)' }}>
                          "
                      </div>

                      <blockquote className="font-display text-2xl md:text-4xl italic leading-snug mb-6"
                          style={{ color: 'rgba(44,31,20,0.78)' }}>
                          Generally I let my canvas and initial brush strokes guide my composition.
                          The images evince from the uncensored interplay with my dream consciousness
                          state and my lived experiences.
                      </blockquote>

                      {/* Crimson divider line */}
                      <div className="w-16 h-px mx-auto mb-5" style={{
                          background: 'linear-gradient(to right, transparent, rgba(196,32,64,0.5), transparent)'
                      }} />

                      <cite className="text-sm tracking-[0.2em] uppercase font-body not-italic"
                          style={{ color: 'rgba(196,32,64,0.6)' }}>
                          — Dr. Clinton Crawford
                      </cite>
                  </div>
              </section>

        {/* ── FEATURED WORKS ─────────────────────────────────────────── */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="text-xs text-gold tracking-[0.3em] uppercase font-body mb-3">Current Series</p>
              <h2 className="font-display text-5xl md:text-7xl text-ink leading-none">Featured Works</h2>
            </div>
            <Link href="/gallery" className="btn-ghost shrink-0">View All Works →</Link>
          </div>

          {featuredArtworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredArtworks.map((artwork, i) => (
                <ArtworkCard key={artwork.id} artwork={artwork} priority={i < 3} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-vellum border border-whisper animate-pulse" />
              ))}
            </div>
          )}
        </section>

        {/* ── MAGICAL REALISM SECTION ─────────────────────────────────── */}
        <section className="py-24 px-6 border-t border-whisper bg-vellum/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs text-gold tracking-[0.3em] uppercase font-body mb-4">The Work</p>
                <h2 className="font-display text-5xl md:text-6xl text-ink mb-6 leading-none">
                  Magical<br />
                  <span className="text-blush italic">Realism</span>
                </h2>
                <div className="w-12 h-px bg-gold/40 mb-6" />
                <p className="text-dusk/70 font-body leading-relaxed mb-4">
                  A juxtaposition of what we commonly call the real world alongside
                  the world of an otherworldly consciousness. Sky and water are no
                  longer separate entities — they become fluid and interchangeable.
                </p>
                <p className="text-dusk/70 font-body leading-relaxed mb-8">
                  Symbolic logic is at the base of every creation. Life begins with
                  an egg — it reoccurs throughout. Without water, there is no life.
                  The viewer is given space to let their own imagination roam freely.
                </p>
                <Link href="/about" className="btn-ghost">Read the Artist Statement →</Link>
              </div>

              <div className="glass-card p-10">
                <h3 className="font-display text-3xl text-gold mb-2">Portals to Other Dimensions</h3>
                <p className="text-xs text-dusk/50 tracking-widest uppercase mb-6 font-body">Series of Twelve · Acrylics on Canvas</p>
                <p className="text-dusk/70 font-body leading-relaxed mb-8">
                  Each work in this series illustrates a threshold — a portal —
                  between the known world and realms that exist only in the space
                  between waking and dreaming, between memory and imagination.
                </p>
                <div className="grid grid-cols-3 gap-6 border-t border-whisper pt-8">
                  {[{ label: 'Works', value: '12' }, { label: 'Medium', value: 'Acrylic' }, { label: 'Year', value: '2023–24' }].map(stat => (
                    <div key={stat.label}>
                      <div className="font-display text-3xl text-ink">{stat.value}</div>
                      <div className="text-xs text-dusk/50 tracking-widest uppercase font-body mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PROVENANCE STRIP ────────────────────────────────────────── */}
        <section className="py-14 px-6 border-y border-whisper overflow-hidden bg-parchment">
          <div className="flex items-center gap-16 whitespace-nowrap" style={{ animation: 'marquee 24s linear infinite' }}>
            {[
              'Born in Guyana, South America', '·', 'MFA · UC Santa Barbara', '·',
              'Professor Emeritus', '·', 'Specialist in Classical African Civilizations', '·',
              'Travels to the Nile Valley', '·', 'Self-Taught from Age 7', '·',
              'Works in Magical Realism', '·',
              'Born in Guyana, South America', '·', 'MFA · UC Santa Barbara', '·',
              'Professor Emeritus', '·', 'Specialist in Classical African Civilizations', '·',
              'Travels to the Nile Valley', '·', 'Self-Taught from Age 7', '·',
              'Works in Magical Realism', '·',
            ].map((item, i) => (
              <span key={i} className={`font-display text-lg shrink-0 ${item === '·' ? 'text-gold' : 'text-dusk/30'}`}>
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* ── ACQUISITION CTA ─────────────────────────────────────────── */}
        <section className="py-32 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(212,149,138,0.12) 0%, transparent 70%)' }} />
          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="text-xs text-gold tracking-[0.4em] uppercase font-body mb-6">Acquire a Work</p>
            <h2 className="font-display text-5xl md:text-7xl text-ink mb-6">Own a Portal</h2>
            <p className="text-dusk/60 font-body max-w-xl mx-auto mb-10 leading-relaxed">
              Each piece is an original, signed work. Certificates of authenticity
              included. Worldwide shipping with full insurance.
            </p>
            <Link href="/gallery" className="btn-portal">Browse Available Works</Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
