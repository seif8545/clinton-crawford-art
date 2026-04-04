// src/app/api/artworks/[id]/route.ts
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getArtworkById, updateArtwork, deleteArtwork } from '@/lib/db'
import type { CloudflareEnv, Artwork } from '@/types'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
      // NEW (Add this)
      const env = process.env as any;    const artwork = await getArtworkById(env.DB, parseInt(id))
    if (!artwork) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ artwork })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
      // NEW (Add this)
      const env = process.env as any;    const body = await request.json() as Partial<Artwork>
    await updateArtwork(env.DB, parseInt(id), body)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
      // NEW (Add this)
      const env = process.env as any;    await deleteArtwork(env.DB, parseInt(id))
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
