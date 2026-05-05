// src/app/api/artworks/[id]/route.ts
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getSeedPaintings, findById, findBySlug } from '@/lib/paintings'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const list = getSeedPaintings()
    const numeric = Number.parseInt(id, 10)
    const painting = Number.isFinite(numeric)
      ? findById(list, numeric) ?? findBySlug(list, id)
      : findBySlug(list, id)
    if (!painting) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ artwork: painting })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PATCH() {
  return NextResponse.json(
    { error: 'Edit paintings from /admin/inventory and re-publish src/data/paintings.json.' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Edit paintings from /admin/inventory and re-publish src/data/paintings.json.' },
    { status: 405 }
  )
}
