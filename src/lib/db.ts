// ═══════════════════════════════════════════════════════════════════════════
//  src/lib/db.ts
//  Compatibility shim. The Art Crawford site is now backed by a static JSON
//  seed (src/data/paintings.json) plus localStorage edits in the admin.
//  These exports remain for files that haven't been migrated yet — they
//  read from the seed and ignore any incoming D1 binding.
// ═══════════════════════════════════════════════════════════════════════════

import {
    getSeedPaintings,
    findBySlug,
    findById,
    type Painting,
} from '@/lib/paintings'
import type { Artwork, ArtworkImage } from '@/types'

function paintingToArtwork(p: Painting): Artwork {
    const image: ArtworkImage = {
        id: p.id,
        artwork_id: p.id,
        r2_key: p.image,
        is_primary: 1,
        sort_order: 0,
        url: p.image,
    }
    return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        year: p.year,
        medium: p.medium,
        dimensions: p.dimensions,
        description: p.description,
        series: p.series,
        price: p.price,
        status: p.status,
        featured: p.featured,
        sort_order: p.sort_order,
        created_at: '',
        updated_at: '',
        images: [image],
        primary_image_url: p.image,
    }
}

// ─── ARTWORKS ───────────────────────────────────────────────────────────────

export async function getArtworks(
    _db: unknown,
    opts: { status?: string; featured?: boolean; series?: string } = {}
): Promise<Artwork[]> {
    let list = getSeedPaintings()
    if (opts.status) list = list.filter(p => p.status === opts.status)
    if (opts.featured !== undefined) list = list.filter(p => Boolean(p.featured) === opts.featured)
    if (opts.series) list = list.filter(p => p.series === opts.series)
    return list.map(paintingToArtwork)
}

export async function getArtworkBySlug(_db: unknown, slug: string): Promise<Artwork | null> {
    const p = findBySlug(getSeedPaintings(), slug)
    return p ? paintingToArtwork(p) : null
}

export async function getArtworkById(_db: unknown, id: number): Promise<Artwork | null> {
    const p = findById(getSeedPaintings(), id)
    return p ? paintingToArtwork(p) : null
}

export async function createArtwork(_db: unknown, _data: Partial<Artwork>): Promise<{ id: number }> {
    return { id: 0 }
}

export async function updateArtwork(_db: unknown, _id: number, _data: Partial<Artwork>): Promise<void> {
    /* writes happen client-side via localStorage in the admin */
}

export async function deleteArtwork(_db: unknown, _id: number): Promise<void> {
    /* writes happen client-side via localStorage in the admin */
}

export async function addArtworkImage(
    _db: unknown,
    _artworkId: number,
    _r2Key: string,
    _isPrimary = false
): Promise<void> {
    /* writes happen client-side via localStorage in the admin */
}
