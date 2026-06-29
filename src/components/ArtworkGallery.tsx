'use client'
// src/components/ArtworkGallery.tsx
//
// Detail-page image viewer: a large main image with a thumbnail strip, and a
// click-to-open fullscreen lightbox with prev/next for closeups and angles.
import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'

interface Props {
  images: string[]
  title: string
  sold?: boolean
}

export default function ArtworkGallery({ images, title, sold = false }: Props) {
  // De-duplicate and drop empties; always keep at least the first image.
  const gallery = Array.from(new Set(images.filter(Boolean)))
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const count = gallery.length
  const safeActive = Math.min(active, Math.max(count - 1, 0))

  const next = useCallback(() => setActive(i => (i + 1) % count), [count])
  const prev = useCallback(() => setActive(i => (i - 1 + count) % count), [count])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false)
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox, next, prev])

  if (count === 0) return null

  return (
    <div className="space-y-4">
      {/* Main image */}
      <button
        type="button"
        onClick={() => setLightbox(true)}
        className="relative block w-full aspect-[4/5] overflow-hidden bg-vellum border border-whisper shadow-card group cursor-zoom-in"
        aria-label="Open full-size image"
      >
        <Image
          src={gallery[safeActive]}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {sold && (
          <div className="absolute inset-0 bg-parchment/60 flex items-center justify-center">
            <span className="font-display text-4xl text-dusk/60 tracking-widest uppercase rotate-[-15deg]">
              Sold
            </span>
          </div>
        )}
        {/* Expand hint */}
        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-ink/55 text-parchment text-xs font-body tracking-wide px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <ExpandIcon /> {count > 1 ? `View ${count} images` : 'View full size'}
        </span>
      </button>

      {/* Thumbnail strip */}
      {count > 1 && (
        <div className="flex flex-wrap gap-3">
          {gallery.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative w-16 h-20 overflow-hidden border bg-vellum transition-all ${
                i === safeActive ? 'border-gold ring-1 ring-gold/40' : 'border-whisper hover:border-gold/40'
              }`}
              aria-label={`Show image ${i + 1}`}
            >
              <Image src={src} alt={`${title} view ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-ink/92 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-parchment/80 hover:text-parchment text-2xl"
            aria-label="Close"
          >
            ✕
          </button>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); prev() }}
                className="absolute left-2 sm:left-6 w-11 h-11 flex items-center justify-center text-parchment/80 hover:text-parchment bg-ink/40 hover:bg-ink/60 rounded-full text-2xl"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); next() }}
                className="absolute right-2 sm:right-6 w-11 h-11 flex items-center justify-center text-parchment/80 hover:text-parchment bg-ink/40 hover:bg-ink/60 rounded-full text-2xl"
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}

          {/* Stop clicks on the image from closing the lightbox */}
          <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gallery[safeActive]}
              alt={`${title} — image ${safeActive + 1} of ${count}`}
              className="max-w-full max-h-[85vh] object-contain shadow-2xl"
            />
          </div>

          {count > 1 && (
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-parchment/70 text-sm font-body tracking-widest">
              {safeActive + 1} / {count}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function ExpandIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  )
}
