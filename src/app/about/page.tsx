// src/app/about/page.tsx
export const runtime = 'edge'

import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About the Artist',
  description: 'Dr. Clinton Crawford — Professor Emeritus, MFA, painter of magical realism. Born in Guyana. Self-taught from age 7. Works explore portals between real and imagined worlds.',
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24">

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-hero-texture opacity-40" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-gold/20 via-gold/5 to-transparent" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <p className="text-xs text-gold tracking-[0.4em] uppercase font-body mb-6">The Artist</p>
            <h1 className="font-display text-7xl md:text-9xl text-ink mb-4 leading-none">
              Dr. Clinton<br />
              <span className="text-gold-shimmer">Crawford</span>
            </h1>
            <p className="font-display text-xl text-dusk/60 italic mt-6">
              Professor Emeritus · MFA · Painter · Guyana / United States
            </p>
          </div>
        </section>

        {/* ── BIOGRAPHY ─────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

            {/* Sidebar */}
            <aside className="lg:col-span-4 sticky top-28">
              {/* Portrait placeholder */}
              <div className="aspect-[3/4] bg-vellum border border-gold/15 mb-6 relative overflow-hidden flex items-end">
                <div className="absolute inset-0 bg-gradient-to-br from-nebula/30 via-cobalt/20 to-void" />
                <div className="relative z-10 p-6">
                  <p className="font-display text-2xl text-ink">Dr. Clinton Crawford</p>
                  <p className="text-xs text-dusk/50 tracking-widest uppercase font-body mt-1">Born, Guyana, S.A.</p>
                </div>
              </div>

              {/* Credentials */}
              <div className="glass-card p-6 space-y-4">
                <h3 className="font-display text-xl text-gold">Credentials</h3>
                {[
                  { label: 'Degree', value: 'MFA, UC Santa Barbara' },
                  { label: 'Undergraduate', value: 'BA, Communication & Arts' },
                  { label: 'Position', value: 'Professor Emeritus' },
                  { label: 'Specialty', value: 'Classical African Civilizations' },
                  { label: 'Origin', value: 'Guyana, South America' },
                  { label: 'Practice', value: 'Oils & Acrylics on Canvas' },
                  { label: 'Movement', value: 'Magical Realism' },
                ].map(c => (
                  <div key={c.label} className="flex justify-between text-sm border-b border-whisper pb-3">
                    <span className="text-dusk/50 font-body tracking-wide">{c.label}</span>
                    <span className="text-ink/80 font-body text-right max-w-[55%]">{c.value}</span>
                  </div>
                ))}
              </div>
            </aside>

            {/* Main biography */}
            <div className="lg:col-span-8 space-y-10">

              <div>
                <p className="text-xs text-gold tracking-[0.3em] uppercase font-body mb-4">Origins</p>
                <h2 className="font-display text-4xl text-ink mb-6">
                  Born into Humble Beginnings,<br />
                  <span className="text-blush italic">with a Gift</span>
                </h2>
                <div className="space-y-4 text-ink/65 font-body leading-relaxed">
                  <p>
                    I was born into very humble beginnings with my gift and insights. At age 8 or 9,
                    my grandmother who raised me bought a set of paints and brushes — she was tired
                    of me painting every possible space under our elevated home on concrete blocks.
                    From the onset of this simple and not so obvious present, my journey as an artist
                    began without the aid of any formal training.
                  </p>
                  <p>
                    I always determined to myself to be an artist of note. My grandmother and
                    childhood friends saw in me something special, even when I doubted my path.
                  </p>
                  <p>
                    With all of the distractions of growing into adulthood, I never relinquished my
                    desire to create scenes from my immediate green lushness and very colorful
                    surroundings. I was and still am an avid devotee of sunsets and unusual
                    land formations.
                  </p>
                </div>
              </div>

              <div className="w-full h-px bg-gradient-to-r from-gold/20 via-gold/10 to-transparent" />

              <div>
                <p className="text-xs text-gold tracking-[0.3em] uppercase font-body mb-4">The Journey</p>
                <h2 className="font-display text-4xl text-ink mb-6">
                  From the Atlantic Coast<br />
                  <span className="text-celestial italic">to Santa Barbara</span>
                </h2>
                <div className="space-y-4 text-ink/65 font-body leading-relaxed">
                  <p>
                    My early career was identified with landscapes and seascapes. I was born on the
                    Atlantic coast of South America in a small country called Guyana — land of waters.
                    By my late 20s I migrated to the United States to pursue an undergraduate degree
                    in Communication and the Arts, which I completed successfully.
                  </p>
                  <p>
                    I then moved to graduate school at the University of California at Santa Barbara,
                    where I completed my Master of Fine Arts. It was during this foray that my artwork
                    took what some called a dramatic detour into the world of magical realism — a
                    juxtaposition of what we commonly call the real world alongside the world of an
                    otherworldly consciousness.
                  </p>
                  <p>
                    I identified with the freedom to express myself in ways that were not governed
                    by the conventions of classical and contemporary western art parlance and expression.
                  </p>
                </div>
              </div>

              <div className="w-full h-px bg-gradient-to-r from-gold/20 via-gold/10 to-transparent" />

              <div>
                <p className="text-xs text-gold tracking-[0.3em] uppercase font-body mb-4">The Philosophy</p>
                <h2 className="font-display text-4xl text-ink mb-6">
                  Symbolic Logic &<br />
                  <span className="text-ember italic">Dream Consciousness</span>
                </h2>
                <div className="space-y-4 text-ink/65 font-body leading-relaxed">
                  <p>
                    The creation of symbolic logic took center stage as I reflected on objects I was
                    familiar with but turned them into symbols of how I viewed the world — in a word,
                    my consciousness. Sky and water were no longer separate entities; they became
                    fluid and interchangeable for me. Land formations and atmospheric conditions were
                    assigned to different locations in the world I created from my imagination.
                  </p>
                  <p>
                    The vivid, vibrant colors in my work are influenced by being born near the equator,
                    where light plays a dominant role in one's sensibilities. My palette is reflective
                    of that experience, even though I am more than four decades removed from that
                    tropical sphere.
                  </p>
                  <p>
                    Generally I let my canvas and initial brush strokes guide my composition. The
                    images evince from the uncensored interplay with my dream consciousness state and
                    my lived experiences. Light and dark contrasts are used to create a dramatic
                    platform upon which the viewer can be a participant.
                  </p>
                </div>
              </div>

              <div className="w-full h-px bg-gradient-to-r from-gold/20 via-gold/10 to-transparent" />

              {/* Artist Statement */}
              <div className="glass-card p-8">
                <p className="text-xs text-gold tracking-[0.3em] uppercase font-body mb-4">Artist Statement</p>
                <div className="space-y-4 text-dusk/70 font-body leading-relaxed">
                  <p>
                    These works belong to a series of twelve that illustrate <em>Portals to Other
                    Dimensions</em>. I am aligned with a literary and artistic philosophical tradition
                    called Magical Realism: a juxtaposition of real and imagined worlds.
                  </p>
                  <p>
                    Born in Guyana, South America, I have been a painter from the early age of seven.
                    My voluminous collection is largely done with oils on canvas. However, the works
                    in the <em>Portals</em> series are acrylics on canvas.
                  </p>
                  <p>
                    As a specialist in classical African Civilizations, my works are also informed
                    by my travels to the Nile Valley and beyond. Symbolic logic is at the base of my
                    creation — life begins with an egg of some sort, hence it reoccurs in my expression.
                    Without water, there is no life.
                  </p>
                  <p className="font-display text-xl text-ink/80 italic border-l-2 border-gold/30 pl-4 ml-0">
                    "Now in my mid-seventies, I continue to learn and heed the voice from within.
                    I have learnt to let go and not insist on controlling the outcome.
                    It's the most liberating feeling one can experience."
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-whisper">
                  <p className="font-display text-xl text-gold">Dr. Clinton Crawford</p>
                  <p className="text-xs text-dusk/50 font-body tracking-widest uppercase mt-1">
                    Professor Emeritus · Painter · Scholar
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/gallery" className="btn-portal">Browse the Gallery</Link>
                <a href="mailto:inquiries@clintoncrawfordart.com" className="btn-ghost">
                  Commission a Work
                </a>
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
