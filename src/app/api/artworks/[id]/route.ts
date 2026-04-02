// src/app/api/artworks/[id]/route.ts
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getArtworkById, updateArtwork, deleteArtwork } from '@/lib/db'
import { deleteFromR2 } from '@/lib/r2'
import type { CloudflareEnv, Artwork } from '@/types'

// Next.js 15 requires params to be a Promise
type Ctx = {
    params: Promise<{ id: string }>
}

export async function GET(_: NextRequest, ctx: Ctx) {
    try {
        // Await params as required in Next.js 15
        const { id } = await ctx.params
        const env = getRequestContext().env as CloudflareEnv
        const artwork = await getArtworkById(env.DB, parseInt(id))

        if (!artwork) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 })
        }

        return NextResponse.json({ artwork })
    } catch (error) {
        console.error('GET Error:', error)
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
    try {
        const { id } = await ctx.params
        const env = getRequestContext().env as CloudflareEnv

        // Cast body to Partial<Artwork> for the update utility
        const body = (await request.json()) as Partial<Artwork>

        await updateArtwork(env.DB, parseInt(id), body)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('PATCH Error:', error)
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    }
}

export async function DELETE(_: NextRequest, ctx: Ctx) {
    try {
        const { id } = await ctx.params
        const env = getRequestContext().env as CloudflareEnv
        const artworkId = parseInt(id)

        const artwork = await getArtworkById(env.DB, artworkId)

        // Clean up R2 images before deleting DB record
        if (artwork?.images) {
            for (const img of artwork.images) {
                await deleteFromR2(env.BUCKET, img.r2_key)
            }
        }

        await deleteArtwork(env.DB, artworkId)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('DELETE Error:', error)
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
    }
}
