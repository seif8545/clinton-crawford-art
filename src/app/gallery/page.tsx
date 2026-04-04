
import type { Metadata } from 'next'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getArtworks } from '@/lib/db'
import type { CloudflareEnv, Artwork } from '@/types'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArtworkCard from '@/components/ArtworkCard'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Original paintings by Dr. Clinton Crawford — available for acquisition.',
}

interface Props {
  searchParams: Promise<{ series?: string; status?: string }>
}

export default async function GalleryPage({ searchParams }: Props) {
  const { series, status } = await searchParams
  let artworks: Artwork[] = []
  let seriesList: string[] = []

  try {
    const env = getRequestContext().env as CloudflareEnv

    const all = await getArtworks(env.DB, { status, series })
    artworks = all.map(a => ({
      ...a,
      primary_image_url: a.images?.[0]?.r2_key ?? undefined,
    }))

    const allForSeries = await getArtworks(env.DB)
    seriesList = [...new Set(allForSeries.map(a => a.series).filter(Boolean) as string[])]
  } catch { /* dev fallback */ }

  const activeStatus = status ?? 'all'
  const activeSeries = series ?? 'all'

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 bg-parchment">

        <div className="max-w-7xl mx-auto px-6 mb-16">
          <p className="text-xs text-gold tracking-[0.3em] uppercase font-body mb-3">Original Paintings</p>
          <h1 className="font-display text-6xl md:text-8xl text-ink mb-4">Gallery</h1>
          <p className="text-dusk/60 font-body max-w-xl">
            Oils and acrylics on canvas. Each work is an original, signed, with a certificate of authenticity.
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
                <a key={f.value}
                  href={`/gallery${buildQuery({ status: f.value === 'all' ? undefined : f.value, series })}`}
                  className={`text-xs px-4 py-2 tracking-[0.15em] uppercase font-body border transition-all duration-200 ${
                    activeStatus === f.value || (f.value === 'all' && !status)
                      ? 'border-gold/40 text-gold bg-gold/5'
                      : 'border-whisper text-dusk/50 hover:text-ink hover:border-gold/20'
                  }`}>
                  {f.label}
                </a>
              ))}
            </div>

            {seriesList.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-dusk/30 font-body">Series:</span>
                <a href={`/gallery${buildQuery({ status })}`}
                  className={`text-xs px-4 py-2 tracking-[0.15em] uppercase font-body border transition-all duration-200 ${
                    !series ? 'border-gold/40 text-gold bg-gold/5' : 'border-whisper text-dusk/50 hover:text-ink'
                  }`}>
                  All
                </a>
                {seriesList.map(s => (
                  <a key={s} href={`/gallery${buildQuery({ status, series: s })}`}
                    className={`text-xs px-4 py-2 tracking-[0.15em] uppercase font-body border transition-all duration-200 ${
                      activeSeries === s
                        ? 'border-blush/40 text-blush bg-blush/5'
                        : 'border-whisper text-dusk/50 hover:text-ink'
                    }`}>
                    {s}
                  </a>
                ))}
              </div>
            )}

            <span className="ml-auto text-xs text-dusk/30 font-body">
              {artworks.length} work{artworks.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-6">
          {artworks.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {artworks.map((artwork, i) => (
                <div key={artwork.id} className="break-inside-avoid">
                  <ArtworkCard artwork={artwork} priority={i < 4} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <p className="font-display text-3xl text-dusk/30 mb-4">No works found</p>
              <p className="text-dusk/20 font-body">Try adjusting your filters</p>
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
