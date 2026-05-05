// src/components/InquireButton.tsx
import Link from 'next/link'
import type { Painting } from '@/lib/paintings'

interface Props {
  painting: Painting
  variant?: 'primary' | 'inline'
}

export default function InquireButton({ painting, variant = 'primary' }: Props) {
  if (painting.status === 'sold') {
    return (
      <div className="w-full py-4 text-center font-display text-lg tracking-widest uppercase text-dusk/50 border border-whisper">
        Sold
      </div>
    )
  }
  if (painting.status === 'reserved') {
    return (
      <div className="w-full py-4 text-center font-display text-lg tracking-widest uppercase text-celestial border border-celestial/30 bg-celestial/5">
        Currently Reserved
      </div>
    )
  }
  if (painting.status === 'not_for_sale') {
    return (
      <div className="w-full py-4 text-center font-display text-lg tracking-widest uppercase text-dusk/50 border border-whisper">
        Not for Sale
      </div>
    )
  }

  const href = `/inquire?painting=${encodeURIComponent(painting.slug)}`

  if (variant === 'inline') {
    return (
      <Link href={href} className="text-blush hover:text-gold transition-colors text-sm underline underline-offset-4">
        Inquire about this work →
      </Link>
    )
  }

  return (
    <Link href={href} className="w-full btn-portal text-center justify-center">
      Buy / Inquire
    </Link>
  )
}
