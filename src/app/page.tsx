// src/app/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getPaintings } from '@/lib/supabase'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const all = await getPaintings()
  const featured = all.filter(p => p.featured).slice(0, 8)
  const heroPainting = featured[0] ?? all[0]
  const stripPaintings = all.slice(0, 12)

  return (
    <>
      <Navbar />
      <main>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center overflow-hidden bg-parchment">
          {/* Hero image */}
          {heroPainting && (
            <Image
              src={heroPainting.image}
              alt={heroPainting.title}
              fill
              priority
              sizes="100vw"
              className="object-cover lg:object-right"
            />
          )}
          
          {/* Gradient veil: Solid on the text side, fading out to reveal the painting */}
          <div className="absolute inset-0 bg-gradient-to-b from-parchment via-parchment/95 to-transparent lg:bg-gradient-to-r lg:from-parchment lg:via-parchment/80 lg:to-transparent" />
          
          {/* Subtle atmospheric color blooms */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 25% 35%, rgba(184,168,204,0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(143,174,200,0.18) 0%, transparent 55%)',
            }}
          />

          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <p className="font-body text-xs tracking-[0.45em] uppercase text-dusk/55 mb-6">
                Original Paintings · Dr. Clinton Crawford · Guyana / United States
              </p>
              <h1
                className="font-display text-ink mb-6 leading-[0.88]"
                style={{ fontSize: 'clamp(4rem, 11vw, 9rem)' }}
              >
                Art<br />
                <span className="text-gold-shimmer">Crawford</span>
              </h1>
              <div className="flex items-center gap-5 mb-8">
                <div className="h-px bg-gold/40 w-20" />
                <p className="font-display text-xl md:text-2xl text-dusk/75 italic tracking-wide">
                  A painter&rsquo;s record of the threshold between waking and dream.
                </p>
              </div>
              <p className="font-body text-base md:text-lg text-dusk/70 max-w-xl mb-10 leading-relaxed">
                The painting practice of Dr. Clinton Crawford — magical realism in
                acrylic and oil on canvas. Sky and water are interchangeable, land
                belongs to imagined geographies, and the viewer is invited to step
                through.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/gallery" className="btn-portal">View the Gallery</Link>
                <Link href="/inquire" className="btn-ghost">Buy / Inquire</Link>
              </div>
            </div>

            {/* Floating mini-feature card */}
            {heroPainting && (
              <div className="lg:col-span-5">
                <Link
                  href={`/artwork/${heroPainting.slug}`}
                  className="group block glass-card overflow-hidden"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={heroPainting.image}
                      alt={heroPainting.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 border-t border-whisper">
                    <p className="text-xs text-gold tracking-[0.25em] uppercase font-body mb-1">
                      Featured · {heroPainting.series ?? 'Originals'}
                    </p>
                    <p className="font-display text-2xl text-ink group-hover:text-gold transition-colors leading-tight">
                      {heroPainting.title}
                    </p>
                    <p className="text-xs text-dusk/55 font-body mt-1">
                      {heroPainting.medium} · {heroPainting.dimensions}
                    </p>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── ARTIST QUOTE ──────────────────────────────────────────────── */}
        <section className="py-24 px-6 border-y border-whisper relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(196,32,64,0.07) 0%, rgba(232,114,138,0.05) 40%, rgba(196,32,64,0.07) 100%)',
            }}
          />
          <div className="absolute inset-0 bg-vellum -z-10" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div
              className="font-display leading-none mb-4 select-none"
              style={{ fontSize: '5rem', color: 'rgba(196,32,64,0.2)' }}
            >
              &ldquo;
            </div>
            <blockquote
              className="font-display text-2xl md:text-4xl italic leading-snug mb-6"
              style={{ color: 'rgba(44,31,20,0.78)' }}
            >
              Generally I let my canvas and initial brush strokes guide my composition.
              The images evince from the uncensored interplay with my dream consciousness
              state and my lived experiences.
            </blockquote>
            <div
              className="w-16 h-px mx-auto mb-5"
              style={{ background: 'linear-gradient(to right, transparent, rgba(196,32,64,0.5), transparent)' }}
            />
            <cite
              className="text-sm tracking-[0.2em] uppercase font-body not-italic"
              style={{ color: 'rgba(196,32,64,0.6)' }}
            >
              — Dr. Clinton Crawford
            </cite>
          </div>
        </section>

        {/* ── FEATURED WORKS ───────────────────────────────────────────── */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="text-xs text-gold tracking-[0.3em] uppercase font-body mb-3">
                Selected Paintings
              </p>
              <h2 className="font-display text-5xl md:text-7xl text-ink leading-none">
                Featured Works
              </h2>
            </div>
            <Link href="/gallery" className="btn-ghost shrink-0">
              View All 31 Paintings →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.map((p, i) => (
              <Link
                key={p.id}
                href={`/artwork/${p.slug}`}
                className="group block bg-vellum border border-whisper overflow-hidden transition-all duration-500 hover:border-gold/30"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={i < 3}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="badge-available">Available</span>
                  </div>
                </div>
                <div className="p-5 border-t border-whisper">
                  <p className="font-display text-xl text-ink group-hover:text-gold transition-colors leading-tight line-clamp-2">
                    {p.title}
                  </p>
                  <p className="text-xs text-dusk/55 font-body mt-1">
                    {p.medium} · {p.year ?? 'n.d.'}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-dusk/45 font-body">{p.dimensions}</p>
                    <p className="font-display text-base text-gold italic">Price upon request</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── MAGICAL REALISM SECTION ──────────────────────────────────── */}
        <section className="py-24 px-6 border-t border-whisper bg-vellum/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs text-gold tracking-[0.3em] uppercase font-body mb-4">The Work</p>
                <h2 className="font-display text-5xl md:text-6xl text-ink mb-6 leading-none">
                  Magical<br /><span className="text-blush italic">Realism</span>
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
                </p>
                <Link href="/about" className="btn-ghost">Read the Artist Statement →</Link>
              </div>
              <div className="glass-card p-10">
                <h3 className="font-display text-3xl text-gold mb-2">Three Series, One Practice</h3>
                <p className="text-xs text-dusk/50 tracking-widest uppercase mb-6 font-body">
                  Portals · Symbolic Logic · Land of Waters
                </p>
                <p className="text-dusk/70 font-body leading-relaxed mb-8">
                  Across thirty-one current works, the studio moves between literal
                  thresholds, recurring symbols, and the early landscapes of the
                  artist&rsquo;s Atlantic-coast childhood.
                </p>
                <div className="grid grid-cols-3 gap-6 border-t border-whisper pt-8">
                  <div>
                    <div className="font-display text-3xl text-ink">31</div>
                    <div className="text-xs text-dusk/50 tracking-widest uppercase font-body mt-1">Paintings</div>
                  </div>
                  <div>
                    <div className="font-display text-3xl text-ink">3</div>
                    <div className="text-xs text-dusk/50 tracking-widest uppercase font-body mt-1">Series</div>
                  </div>
                  <div>
                    <div className="font-display text-3xl text-ink">∞</div>
                    <div className="text-xs text-dusk/50 tracking-widest uppercase font-body mt-1">Originals</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PAINTING STRIP ───────────────────────────────────────────── */}
        <section className="py-12 border-y border-whisper bg-parchment overflow-hidden">
          <div className="flex gap-4 overflow-x-auto px-6 max-w-[100vw]" style={{ scrollbarWidth: 'none' }}>
            {stripPaintings.map(p => (
              <Link
                key={p.id}
                href={`/artwork/${p.slug}`}
                className="relative flex-shrink-0 w-44 h-56 group block bg-vellum border border-whisper overflow-hidden"
              >
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="176px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-parchment font-display text-sm leading-tight line-clamp-2">{p.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── PROVENANCE STRIP ─────────────────────────────────────────── */}
        <section className="py-14 px-6 border-b border-whisper overflow-hidden bg-parchment">
          <div
            className="flex items-center gap-16 whitespace-nowrap"
            style={{ animation: 'marquee 24s linear infinite' }}
          >
            {[
              'Born in Guyana, South America','·','MFA · UC Santa Barbara','·',
              'Professor Emeritus','·','Specialist in Classical African Civilizations','·',
              'Travels to the Nile Valley','·','Self-Taught from Age 7','·','Works in Magical Realism','·',
              'Born in Guyana, South America','·','MFA · UC Santa Barbara','·',
              'Professor Emeritus','·','Specialist in Classical African Civilizations','·',
              'Travels to the Nile Valley','·','Self-Taught from Age 7','·','Works in Magical Realism','·',
            ].map((item, i) => (
              <span
                key={i}
                className={`font-display text-lg shrink-0 ${item === '·' ? 'text-gold' : 'text-dusk/30'}`}
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* ── ACQUISITION CTA ──────────────────────────────────────────── */}
        <section className="py-32 px-6 text-center relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at center, rgba(212,149,138,0.12) 0%, transparent 70%)' }}
          />
          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="text-xs text-gold tracking-[0.4em] uppercase font-body mb-6">
              Acquire a Work
            </p>
            <h2 className="font-display text-5xl md:text-7xl text-ink mb-6">Own an Original Crawford</h2>
            <p className="text-dusk/60 font-body max-w-xl mx-auto mb-10 leading-relaxed">
              Each painting is offered at price upon request. Tell the studio which work
              has caught your eye — pricing, framing, shipping and commissions are all handled
              directly with Dr. Crawford&rsquo;s studio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/gallery" className="btn-portal">Browse the Gallery</Link>
              <Link href="/inquire" className="btn-ghost">Send an Inquiry</Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}