// src/app/api/artworks/route.ts
//
// GET  — public read of the live catalogue (Supabase, seed fallback).
// POST — admin only: create or update a single painting. Publishes instantly.

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getPaintings, upsertPainting } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin-auth'
import { autoSlug, nextId, type Painting, type PaintingStatus } from '@/lib/paintings'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const series = searchParams.get('series')
    const featured = searchParams.get('featured')

    let list = await getPaintings()
    if (status) list = list.filter(p => p.status === status)
    if (series) list = list.filter(p => p.series === series)
    if (featured === 'true') list = list.filter(p => p.featured)

    return NextResponse.json({ artworks: list })
  } catch (error) {
    console.error('GET artworks error:', error)
    return NextResponse.json({ error: 'Failed to fetch artworks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }
  try {
    const body = (await request.json()) as Partial<Painting>

    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: 'Title is required.' }, { status: 400 })
    }
    if (!body.image || !body.image.trim()) {
      return NextResponse.json({ error: 'An image is required.' }, { status: 400 })
    }

    const existing = await getPaintings()
    const id = body.id ?? nextId(existing)
    const slug = (body.slug?.trim() || autoSlug(body.title)).trim()

    const painting: Painting = {
      id,
      slug,
      title: body.title.trim(),
      year:
        body.year === null || body.year === undefined || Number.isNaN(Number(body.year))
          ? null
          : Number(body.year),
      medium: (body.medium ?? 'Acrylic on Canvas').toString().trim() || 'Acrylic on Canvas',
      dimensions: (body.dimensions ?? '').toString().trim(),
      description: body.description?.toString().trim() || null,
      series: body.series?.toString().trim() || null,
      price: body.price ? Number(body.price) || 0 : 0,
      price_label: body.price_label?.toString().trim() || null,
      status: (body.status as PaintingStatus) ?? 'available',
      featured: body.featured ? 1 : 0,
      sort_order: body.sort_order ?? id,
      image: body.image.trim(),
      images: Array.isArray(body.images)
        ? body.images.map(s => String(s).trim()).filter(Boolean)
        : [],
    }

    const saved = await upsertPainting(painting)
    return NextResponse.json({ artwork: saved })
  } catch (error) {
    console.error('POST artwork error:', error)
    const message = error instanceof Error ? error.message : 'Failed to save painting'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
