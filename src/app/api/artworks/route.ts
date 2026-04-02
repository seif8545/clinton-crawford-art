// src/app/api/artworks/route.ts
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getArtworks, createArtwork } from '@/lib/db'
import { r2KeyToUrl } from '@/lib/r2'
import type { CloudflareEnv } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const env = getRequestContext().env as CloudflareEnv
    const { searchParams } = new URL(request.url)

    const artworks = await getArtworks(env.DB, {
      status: searchParams.get('status') ?? undefined,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      series: searchParams.get('series') ?? undefined,
    })

    const r2PublicUrl = env.R2_PUBLIC_URL ?? ''
    const hydrated = artworks.map(a => ({
      ...a,
      primary_image_url: a.images?.[0]?.r2_key
        ? r2KeyToUrl(r2PublicUrl, a.images[0].r2_key)
        : null,
    }))

    return NextResponse.json({ artworks: hydrated })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch artworks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const env = getRequestContext().env as CloudflareEnv
    const body = await request.json()

    if (!body.title || !body.slug || !body.medium || !body.dimensions || !body.price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { id } = await createArtwork(env.DB, body)
    return NextResponse.json({ id }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create artwork' }, { status: 500 })
  }
}
