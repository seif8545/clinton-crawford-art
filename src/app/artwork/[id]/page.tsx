// src/app/artwork/[id]/page.tsx
export const runtime = 'edge'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArtworkBySlug, getArtworks } from '@/lib/db'
import type { CloudflareEnv } from '@/types'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AddToCartButton from '@/components/AddToCartButton'
import ArtworkCard from '@/components/ArtworkCard'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params
      // NEW (Add this)
      const env = process.env as any;    const artwork = await getArtworkBySlug(env.DB, id)
    if (!artwork) return { title: 'Artwork Not Found' }
    return {
      title: artwork.title,
      description: artwork.description ?? `${artwork.medium} · ${artwork.dimensions}`,
    }
  } catch {
    return { title: 'Artwork' }
  }
}

export default async function ArtworkPage({ params }: Props) {
  const { id } = await params
  let artwork: Awaited<ReturnType<typeof getArtworkBySlug>> = null
  let related: Awaited<ReturnType<typeof getArtworks>> = []

  try {
      // NEW (Add this)
      const env = process.env as any;    artwork = await getArtworkBySlug(env.DB, id)
    if (!artwork) notFound()

    // r2_key now stores the full image URL directly
    if (artwork.images) {
      artwork.images = artwork.images.map(img => ({ ...img, url: img.r2_key }))
    }
    artwork.primary_image_url = artwork.images?.find(i => i.is_primary)?.url
      ?? artwork.images?.[0]?.url

    const allInSeries = await getArtworks(env.DB, { series: artwork.series ?? undefined })
    related = allInSeries
      .filter(a => a.id !== artwork!.id)
      .slice(0, 3)
      .map(a => ({ ...a, primary_image_url: a.images?.[0]?.r2_key ?? undefined }))
  } catch (e) {
    if ((e as { digest?: string })?.digest?.includes('NEXT_NOT_FOUND')) notFound()
  }

  if (!artwork) notFound()

  const primaryImg = artwork.primary_image_url ?? '/placeholder-artwork.svg'
  const additionalImgs = artwork.images?.filter(i => i.url !== primaryImg).slice(0, 3) ?? []

  return (
    <>
      <Navbar />
      <main className="pt-28 bg-parchment">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-xs text-dusk/40 font-body">
          <Link href="/" className="hover:text-dusk/70 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/gallery" className="hover:text-dusk/70 transition-colors">Gallery</Link>
          <span>/</span>
          <span className="text-dusk/60 truncate">{artwork.title}</span>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

            {/* Image panel */}
            <div className="space-y-4">
              <div className="relative aspect-[4/5] overflow-hidden bg-vellum border border-whisper shadow-card group">
                <Image src={primaryImg} alt={artwork.title} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority sizes="(max-width: 1024px) 100vw, 50vw" />
                {artwork.status === 'sold' && (
                  <div className="absolute inset-0 bg-parchment/60 flex items-center justify-center">
                    <span className="font-display text-4xl text-dusk/60 tracking-widest uppercase rotate-[-15deg]">Sold</span>
                  </div>
                )}
              </div>
              {additionalImgs.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {additionalImgs.map((img, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden bg-vellum border border-whisper">
                      <Image src={img.url!} alt={`${artwork.title} detail ${i + 1}`} fill
                        className="object-cover hover:scale-105 transition-transform duration-500" sizes="15vw" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info panel */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                {artwork.series && (
                  <Link href={`/gallery?series=${encodeURIComponent(artwork.series)}`}
                    className="text-xs tracking-widest uppercase hover:text-ink transition-colors font-body"
                    style={{ color: 'rgba(143,174,200,0.9)' }}>
                    {artwork.series}
                  </Link>
                )}
                <span className="text-gold/30">·</span>
                <span className={
                  artwork.status === 'available' ? 'badge-available' :
                  artwork.status === 'sold' ? 'badge-sold' : 'badge-reserved'
                }>{artwork.status}</span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl text-ink mb-4 leading-tight">{artwork.title}</h1>
              <div className="w-16 h-px mb-8" style={{ background: 'rgba(196,32,64,0.3)' }} />

              <div className="grid grid-cols-2 gap-x-8 gap-y-5 mb-8">
                {[
                  { label: 'Medium', value: artwork.medium },
                  { label: 'Year', value: artwork.year?.toString() ?? 'n.d.' },
                  { label: 'Dimensions', value: artwork.dimensions },
                  { label: 'Framed', value: 'Gold Float Frame Included' },
                ].map(field => (
                  <div key={field.label}>
                    <p className="text-xs text-dusk/50 tracking-[0.2em] uppercase font-body mb-1">{field.label}</p>
                    <p className="font-body text-ink/80">{field.value}</p>
                  </div>
                ))}
              </div>

              {artwork.description && (
                <div className="mb-8 border-l-2 pl-5" style={{ borderColor: 'rgba(196,32,64,0.2)' }}>
                  <p className="font-body text-dusk/65 leading-relaxed italic">{artwork.description}</p>
                </div>
              )}

              {artwork.status === 'available' && (
                <div className="mb-6">
                  <p className="text-xs text-dusk/50 tracking-[0.2em] uppercase font-body mb-1">Price</p>
                  <p className="font-display text-5xl text-gold">${artwork.price.toLocaleString()}</p>
                  <p className="text-xs text-dusk/40 font-body mt-1">Certificate of authenticity · Free worldwide shipping</p>
                </div>
              )}

              <div className="mb-8"><AddToCartButton artwork={artwork} /></div>

              <div className="glass-card p-5 text-sm">
                <p className="font-display text-lg text-gold mb-2">Acquire This Work</p>
                <p className="text-dusk/60 font-body text-sm mb-3">Questions, installment plans, or international shipping?</p>
                <a href={`mailto:inquiries@clintoncrawfordart.com?subject=Inquiry: ${artwork.title}`}
                  className="text-blush hover:text-gold transition-colors text-sm underline underline-offset-4">
                  Contact the studio →
                </a>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 py-20 border-t border-whisper mt-10">
            <h2 className="font-display text-4xl text-ink mb-10">
              More from <span className="text-gold italic">{artwork.series ?? 'the Collection'}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(a => <ArtworkCard key={a.id} artwork={a} />)}
            </div>
          </section>
        )}

      </main>
      <Footer />
    </>
  )
}
