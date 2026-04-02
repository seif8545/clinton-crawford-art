// src/app/gallery/page.tsx
export const runtime = 'edge'
import type { Metadata } from 'next'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getArtworks } from '@/lib/db'
import { r2KeyToUrl } from '@/lib/r2'
import type { CloudflareEnv, Artwork } from '@/types'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArtworkCard from '@/components/ArtworkCard'

export const metadata: Metadata = {
    title: 'Gallery',
    description: 'Original paintings by Dr. Clinton Crawford — available for acquisition.',
}

// In Next.js 15, searchParams must be a Promise
interface Props {
    searchParams: Promise<{ series?: string; status?: string }>
}

export default async function GalleryPage({ searchParams }: Props) {
    // Await the searchParams at the start of the component
    const params = await searchParams
    const activeStatus = params.status ?? 'all'
    const activeSeries = params.series ?? 'all'

    let artworks: Artwork[] = []
    let seriesList: string[] = []

    try {
        const ctx = getRequestContext()
        const env = ctx.env as CloudflareEnv
        const r2PublicUrl = env.R2_PUBLIC_URL ?? ''

        // Use the awaited params for the database query
        const all = await getArtworks(env.DB, {
            status: params.status,
            series: params.series,
        })

        artworks = all.map(a => ({
            ...a,
            primary_image_url: a.images?.[0]?.r2_key
                ? r2KeyToUrl(r2PublicUrl, a.images[0].r2_key)
                : undefined,
        }))

        // Collect unique series for filter
        const allForSeries = await getArtworks(env.DB)
        seriesList = [...new Set(allForSeries.map(a => a.series).filter(Boolean) as string[])]
    } catch (error) {
        console.error("Gallery Data Fetch Error:", error)
        // Dev fallback or error state handling
    }

    return (
        <>
            <Navbar />
            <main className="pt-32 pb-24">

                {/* ── Page Header ──────────────────────────────────────────── */}
                <div className="max-w-7xl mx-auto px-6 mb-16">
                    <p className="text-xs text-gold tracking-[0.3em] uppercase font-body mb-3">
                        Original Paintings
                    </p>
                    <h1 className="font-display text-6xl md:text-8xl text-ink mb-4">Gallery</h1>
                    <p className="text-dusk/60 font-body max-w-xl">
                        Oils and acrylics on canvas. Each work is an original, signed, with a
                        certificate of authenticity. Worldwide shipping available.
                    </p>
                </div>

                {/* ── Filters ──────────────────────────────────────────────── */}
                <div className="max-w-7xl mx-auto px-6 mb-12">
                    <div className="flex flex-wrap gap-4 items-center border-b border-whisper pb-6">

                        {/* Status filter */}
                        <div className="flex items-center gap-2">
                            {[
                                { value: 'all', label: 'All Works' },
                                { value: 'available', label: 'Available' },
                                { value: 'sold', label: 'Sold' },
                            ].map(f => (
                                <a
                                    key={f.value}
                                    href={`/gallery${buildQuery({ ...params, status: f.value === 'all' ? undefined : f.value })}`}
                                    className={`text-xs px-4 py-2 tracking-[0.15em] uppercase font-body border transition-all duration-200 ${activeStatus === f.value
                                            ? 'border-gold/40 text-gold bg-gold/5'
                                            : 'border-whisper text-dusk/50 hover:text-dusk/70 hover:border-gold/20'
                                        }`}
                                >
                                    {f.label}
                                </a>
                            ))}
                        </div>

                        {/* Series filter */}
                        {seriesList.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-dusk/40 font-body">Series:</span>
                                <a
                                    href={`/gallery${buildQuery({ ...params, series: undefined })}`}
                                    className={`text-xs px-4 py-2 tracking-[0.15em] uppercase font-body border transition-all duration-200 ${activeSeries === 'all'
                                            ? 'border-gold/40 text-gold bg-gold/5'
                                            : 'border-whisper text-dusk/50 hover:text-dusk/70'
                                        }`}
                                >
                                    All Series
                                </a>
                                {seriesList.map(s => (
                                    <a
                                        key={s}
                                        href={`/gallery${buildQuery({ ...params, series: s })}`}
                                        className={`text-xs px-4 py-2 tracking-[0.15em] uppercase font-body border transition-all duration-200 ${activeSeries === s
                                                ? 'border-mauve/40 text-blush bg-mauve/5'
                                                : 'border-whisper text-dusk/50 hover:text-dusk/70'
                                            }`}
                                    >
                                        {s}
                                    </a>
                                ))}
                            </div>
                        )}

                        {/* Count */}
                        <span className="ml-auto text-xs text-dusk/40 font-body">
                            {artworks.length} work{artworks.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                {/* ── Grid ─────────────────────────────────────────────────── */}
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
                            <p className="font-display text-3xl text-dusk/40 mb-4">No works found</p>
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