// src/app/api/artworks/[id]/route.ts
//
// GET    — public read of a single painting by id or slug.
// DELETE — admin only: remove a painting. Publishes instantly.

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getPaintings, deletePainting } from '@/lib/supabase'
import { findById, findBySlug } from '@/lib/paintings'
import { isAdmin } from '@/lib/admin-auth'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const list = await getPaintings()
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }
  try {
    const { id } = await params
    const numeric = Number.parseInt(id, 10)
    if (!Number.isFinite(numeric)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }
    await deletePainting(numeric)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE artwork error:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete painting'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
