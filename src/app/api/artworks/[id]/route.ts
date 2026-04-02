// src/app/api/artworks/[id]/route.ts
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getArtworkById, updateArtwork, deleteArtwork } from '@/lib/db'
import { deleteFromR2 } from '@/lib/r2'
import type { CloudflareEnv } from '@/types'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const env = getRequestContext().env as CloudflareEnv
    const artwork = await getArtworkById(env.DB, parseInt(id))
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
    const env = getRequestContext().env as CloudflareEnv
    const body = await request.json()
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
    const env = getRequestContext().env as CloudflareEnv
    const artworkId = parseInt(id)

    const artwork = await getArtworkById(env.DB, artworkId)
    if (artwork?.images) {
      for (const img of artwork.images) {
        await deleteFromR2(env.BUCKET, img.r2_key)
      }
    }

    await deleteArtwork(env.DB, artworkId)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
