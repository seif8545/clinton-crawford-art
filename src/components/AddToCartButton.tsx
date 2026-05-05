// src/components/AddToCartButton.tsx
// Compatibility shim — the cart has been replaced with an inquiry flow.
// This re-exports InquireButton so any older imports continue to render the
// new "Buy / Inquire" button without breaking the build.
import InquireButton from '@/components/InquireButton'
import type { Artwork } from '@/types'
import type { Painting } from '@/lib/paintings'

interface Props { artwork: Artwork }

export default function AddToCartButton({ artwork }: Props) {
  const painting: Painting = {
    id: artwork.id,
    slug: artwork.slug,
    title: artwork.title,
    year: artwork.year,
    medium: artwork.medium,
    dimensions: artwork.dimensions,
    series: artwork.series,
    description: artwork.description,
    price: artwork.price,
    price_label: artwork.price > 0 ? null : 'Price upon request',
    status: artwork.status,
    featured: (artwork.featured ? 1 : 0) as 0 | 1,
    sort_order: artwork.sort_order,
    image: artwork.primary_image_url ?? '',
  }
  return <InquireButton painting={painting} />
}
