// src/app/artwork/[id]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { findBySlug, priceDisplay } from '@/lib/paintings'
import { getPaintings } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import InquireButton from '@/components/InquireButton'
import ArtworkGallery from '@/components/ArtworkGallery'
import Image from 'next/image'
import Link from 'next/link'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const painting = findBySlug(await getPaintings(), id)
  if (!painting) return { title: 'Painting Not Found' }
  return {
    title: painting.title,
    description: painting.description ?? `${painting.medium} · ${painting.dimensions}`,
  }
}

export default async function ArtworkPage({ params }: Props) {
  const { id } = await params
  const all = await getPaintings()
  const painting = findBySlug(all, id)
  if (!painting) notFound()

  const related = all
    .filter(p => p.id !== painting.id && p.series && p.series === painting.series)
    .slice(0, 3)

  return (
    <>
      <Navbar />
      <main className="pt-28 bg-parchment">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-xs text-dusk/40 font-body">
          <Link href="/" className="hover:text-dusk/70 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/gallery" className="hover:text-dusk/70 transition-colors">Gallery</Link>
          <span>/</span>
          <span className="text-dusk/60 truncate">{painting.title}</span>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

            {/* Image panel */}
            <ArtworkGallery
              images={[painting.image, ...(painting.images ?? [])]}
              title={painting.title}
              sold={painting.status === 'sold'}
            />

            {/* Info panel */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                {painting.series && (
                  <Link href={`/gallery?series=${encodeURIComponent(painting.series)}`}
                    className="text-xs tracking-widest uppercase hover:text-ink transition-colors font-body"
                    style={{ color: 'rgba(143,174,200,0.9)' }}>
                    {painting.series}
                  </Link>
                )}
                <span className="text-gold/30">·</span>
                <span className={
                  painting.status === 'available' ? 'badge-available' :
                  painting.status === 'sold' ? 'badge-sold' : 'badge-reserved'
                }>{painting.status}</span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl text-ink mb-4 leading-tight">
                {painting.title}
              </h1>
              <div className="w-16 h-px mb-8" style={{ background: 'rgba(196,32,64,0.3)' }} />

              <div className="grid grid-cols-2 gap-x-8 gap-y-5 mb-8">
                {[
                  { label: 'Medium', value: painting.medium },
                  { label: 'Year', value: painting.year?.toString() ?? 'n.d.' },
                  { label: 'Dimensions', value: painting.dimensions },
                  { label: 'Framed', value: 'Available framed on request' },
                ].map(field => (
                  <div key={field.label}>
                    <p className="text-xs text-dusk/50 tracking-[0.2em] uppercase font-body mb-1">{field.label}</p>
                    <p className="font-body text-ink/80">{field.value}</p>
                  </div>
                ))}
              </div>

              {painting.description && (
                <div className="mb-8 border-l-2 pl-5" style={{ borderColor: 'rgba(196,32,64,0.2)' }}>
                  <p className="font-body text-dusk/65 leading-relaxed italic">{painting.description}</p>
                </div>
              )}

              {painting.status === 'available' && (
                <div className="mb-6">
                  <p className="text-xs text-dusk/50 tracking-[0.2em] uppercase font-body mb-1">Price</p>
                  <p className="font-display text-4xl text-gold">{priceDisplay(painting)}</p>
                  <p className="text-xs text-dusk/40 font-body mt-1">
                    Certificate of authenticity included · Worldwide shipping arranged
                  </p>
                </div>
              )}

              <div className="mb-8"><InquireButton painting={painting} /></div>

              <div className="glass-card p-5 text-sm">
                <p className="font-display text-lg text-gold mb-2">Acquire this work</p>
                <p className="text-dusk/60 font-body text-sm mb-3">
                  Questions, framing, installment plans or international shipping?
                </p>
                <Link
                  href={`/inquire?painting=${encodeURIComponent(painting.slug)}`}
                  className="text-blush hover:text-gold transition-colors text-sm underline underline-offset-4"
                >
                  Send a private inquiry →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 py-20 border-t border-whisper mt-10">
            <h2 className="font-display text-4xl text-ink mb-10">
              More from <span className="text-gold italic">{painting.series ?? 'the Collection'}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(p => (
                <Link key={p.id} href={`/artwork/${p.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-vellum border border-whisper">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-display text-lg text-ink group-hover:text-gold transition-colors">{p.title}</p>
                    <p className="text-xs text-dusk/55 font-body mt-1">{p.medium} · {p.year ?? 'n.d.'}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>
      <Footer />
    </>
  )
}
