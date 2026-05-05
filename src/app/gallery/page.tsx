// src/app/gallery/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getSeedPaintings, uniqueSeries, priceDisplay } from '@/lib/paintings'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Original paintings by Dr. Clinton Crawford — magical realism in acrylic and oil on canvas. Each work is offered at price upon request.',
}

interface Props {
  searchParams: Promise<{ series?: string; status?: string }>
}

export default async function GalleryPage({ searchParams }: Props) {
  const { series, status } = await searchParams
  const activeStatus = status ?? 'all'
  const activeSeries = series ?? 'all'

  const all = getSeedPaintings()
  let paintings = [...all]

  if (activeStatus !== 'all') {
    paintings = paintings.filter(p => p.status === activeStatus)
  }
  if (activeSeries !== 'all') {
    paintings = paintings.filter(p => p.series === activeSeries)
  }

  const seriesList = uniqueSeries(all)

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 bg-parchment">

        <div className="max-w-7xl mx-auto px-6 mb-16">
          <p className="text-xs text-gold tracking-[0.3em] uppercase font-body mb-3">
            The Collection
          </p>
          <h1 className="font-display text-6xl md:text-8xl text-ink mb-4">Gallery</h1>
          <p className="text-dusk/65 font-body max-w-2xl leading-relaxed">
            Thirty-one original paintings by Dr. Clinton Crawford. Acrylic and oil
            on canvas. Each work is signed, offered at price upon request, and shipped
            with a certificate of authenticity.
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="flex flex-wrap gap-4 items-center border-b border-whisper pb-6">
            <div className="flex items-center gap-2">
              {[
                { value: 'all', label: 'All Works' },
                { value: 'available', label: 'Available' },
                { value: 'sold', label: 'Sold' },
              ].map(f => (
                <a
                  key={f.value}
                  href={`/gallery${buildQuery({ status: f.value === 'all' ? undefined : f.value, series })}`}
                  className={`text-xs px-4 py-2 tracking-[0.15em] uppercase font-body border transition-all duration-200 ${
                    activeStatus === f.value || (f.value === 'all' && !status)
                      ? 'border-gold/40 text-gold bg-gold/5'
                      : 'border-whisper text-dusk/50 hover:text-ink hover:border-gold/20'
                  }`}
                >
                  {f.label}
                </a>
              ))}
            </div>

            {seriesList.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-dusk/30 font-body">Series:</span>
                <a
                  href={`/gallery${buildQuery({ status })}`}
                  className={`text-xs px-4 py-2 tracking-[0.15em] uppercase font-body border transition-all duration-200 ${
                    !series ? 'border-gold/40 text-gold bg-gold/5' : 'border-whisper text-dusk/50 hover:text-ink'
                  }`}
                >
                  All
                </a>
                {seriesList.map(s => (
                  <a
                    key={s}
                    href={`/gallery${buildQuery({ status, series: s })}`}
                    className={`text-xs px-4 py-2 tracking-[0.15em] uppercase font-body border transition-all duration-200 ${
                      activeSeries === s
                        ? 'border-blush/40 text-blush bg-blush/5'
                        : 'border-whisper text-dusk/50 hover:text-ink'
                    }`}
                  >
                    {s}
                  </a>
                ))}
              </div>
            )}

            <span className="ml-auto text-xs text-dusk/30 font-body">
              {paintings.length} work{paintings.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-6">
          {paintings.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {paintings.map((p, i) => (
                <div key={p.id} className="break-inside-avoid">
                  <Link href={`/artwork/${p.slug}`} className="group block" aria-label={`View ${p.title}`}>
                    <article className="relative overflow-hidden bg-vellum border border-whisper transition-all duration-500 group-hover:border-gold/30">
                      <div className="relative aspect-[3/4] overflow-hidden bg-whisper">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          priority={i < 4}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-3 left-3">
                          {p.status === 'available' && <span className="badge-available">Available</span>}
                          {p.status === 'sold' && <span className="badge-sold">Sold</span>}
                          {p.status === 'reserved' && <span className="badge-reserved">Reserved</span>}
                          {p.status === 'not_for_sale' && <span className="badge-sold">Not for sale</span>}
                        </div>
                        {p.series && (
                          <div className="absolute top-3 right-3">
                            <span className="text-xs text-parchment/85 tracking-widest uppercase bg-ink/30 backdrop-blur-sm px-2 py-0.5">
                              {p.series.split(' ').slice(-2).join(' ')}
                            </span>
                          </div>
                        )}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                          <span className="font-display text-parchment tracking-[0.2em] uppercase text-sm">
                            View Work →
                          </span>
                        </div>
                      </div>
                      <div className="p-5 border-t border-whisper">
                        <h3 className="font-display text-xl text-ink mb-1 group-hover:text-gold transition-colors duration-200 line-clamp-2 leading-tight">
                          {p.title}
                        </h3>
                        <p className="text-xs text-dusk/60 tracking-wide mb-3 font-body">
                          {p.medium} · {p.year ?? 'n.d.'}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-dusk/45 font-body">{p.dimensions}</p>
                          <p className="font-display text-base text-gold italic">{priceDisplay(p)}</p>
                        </div>
                      </div>
                    </article>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <p className="font-display text-3xl text-dusk/30 mb-4">No works found</p>
              <p className="text-dusk/30 font-body">Try adjusting your filters</p>
            </div>
          )}
        </div>

      </main>
      <Footer />
    </>
  )
}

function buildQuery(params: Record<string, string | undefined>): string {
  const filtered = Object.entries(params).filter(([, v]) => v !== undefined)
  if (!filtered.length) return ''
  return '?' + new URLSearchParams(filtered as [string, string][]).toString()
}
