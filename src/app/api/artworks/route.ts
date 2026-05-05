// src/app/api/artworks/route.ts
//
// Public read endpoint. Returns the seed catalogue from src/data/paintings.json.
// Admin writes happen entirely in the browser via localStorage — see
// src/app/admin/inventory/page.tsx — so POST is a no-op for now.

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getSeedPaintings } from '@/lib/paintings'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const series = searchParams.get('series')
    const featured = searchParams.get('featured')

    let list = getSeedPaintings()
    if (status) list = list.filter(p => p.status === status)
    if (series) list = list.filter(p => p.series === series)
    if (featured === 'true') list = list.filter(p => p.featured)

    return NextResponse.json({ artworks: list })
  } catch (error) {
    console.error('GET artworks error:', error)
    return NextResponse.json({ error: 'Failed to fetch artworks' }, { status: 500 })
  }
}

export async function POST() {
  return NextResponse.json(
    {
      error:
        'The public artwork API is read-only. Manage paintings from /admin/inventory and re-publish src/data/paintings.json.',
    },
    { status: 405 }
  )
}
