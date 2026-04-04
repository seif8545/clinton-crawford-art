// src/app/api/artworks/route.ts
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getArtworks, createArtwork } from '@/lib/db'
import type { CloudflareEnv, Artwork } from '@/types'

export async function GET(request: NextRequest) {
    try {
        // NEW (Add this)
        const env = process.env as any;        const { searchParams } = new URL(request.url)

        const status = searchParams.get('status')
        const series = searchParams.get('series')

        const artworks = await getArtworks(env.DB, {
            status: status || undefined,
            series: series || undefined
        })

        return NextResponse.json({ artworks })
    } catch (error) {
        console.error('GET Artworks Error:', error)
        return NextResponse.json({ error: 'Failed to fetch artworks' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        // NEW (Add this)
        const env = process.env as any;
        // THE FIX: Explicitly cast the body as Partial<Artwork> 
        // to resolve the 'unknown' type error
        const body = (await request.json()) as Partial<Artwork>

        const result = await createArtwork(env.DB, body)
        return NextResponse.json(result)
    } catch (error) {
        console.error('POST Artwork Error:', error)
        return NextResponse.json({ error: 'Failed to create artwork' }, { status: 500 })
    }
}