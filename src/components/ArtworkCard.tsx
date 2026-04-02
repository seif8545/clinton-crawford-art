// src/components/ArtworkCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import type { Artwork } from '@/types'

interface Props { artwork: Artwork; priority?: boolean }

export default function ArtworkCard({ artwork, priority = false }: Props) {
  const imgSrc = artwork.primary_image_url ?? '/placeholder-artwork.svg'
  const isAvailable = artwork.status === 'available'

  return (
    <Link href={`/artwork/${artwork.slug}`} className="group block" aria-label={`View ${artwork.title}`}>
      <article className="relative overflow-hidden bg-vellum border border-whisper transition-all duration-500 group-hover:border-gold/30 group-hover:shadow-card-hover">

        <div className="relative aspect-[3/4] overflow-hidden bg-whisper">
          <Image src={imgSrc} alt={artwork.title} fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={priority} />

          <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="absolute top-3 left-3">
            {artwork.status === 'available' && <span className="badge-available">Available</span>}
            {artwork.status === 'sold' && <span className="badge-sold">Sold</span>}
            {artwork.status === 'reserved' && <span className="badge-reserved">Reserved</span>}
          </div>

          {artwork.series && (
            <div className="absolute top-3 right-3">
              <span className="text-xs text-parchment/70 tracking-widest uppercase bg-ink/20 backdrop-blur-sm px-2 py-0.5">
                {artwork.series.split(' ').slice(-2).join(' ')}
              </span>
            </div>
          )}

          <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <span className="font-display text-parchment tracking-[0.2em] uppercase text-sm">View Work →</span>
          </div>
        </div>

        <div className="p-5 border-t border-whisper">
          <h3 className="font-display text-xl text-ink mb-1 group-hover:text-gold transition-colors duration-200 line-clamp-2 leading-tight">
            {artwork.title}
          </h3>
          <p className="text-xs text-dusk/60 tracking-wide mb-3 font-body">
            {artwork.medium} · {artwork.year ?? 'n.d.'}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-xs text-dusk/40 font-body">{artwork.dimensions}</p>
            {isAvailable ? (
              <p className="font-display text-lg text-gold">${artwork.price.toLocaleString()}</p>
            ) : (
              <p className="font-display text-base text-dusk/50 italic">
                {artwork.status === 'sold' ? 'Sold' : 'Reserved'}
              </p>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </article>
    </Link>
  )
}
