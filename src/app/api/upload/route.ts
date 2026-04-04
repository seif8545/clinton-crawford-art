// src/app/api/upload/route.ts
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { addArtworkImage } from '@/lib/db'
import type { CloudflareEnv } from '@/types'

// R2 removed. Images must be hosted externally (e.g. Cloudflare Images, imgbb, etc.)
// and their full URL passed as `image_url` in the request body.

export async function POST(request: NextRequest) {
  try {
      // NEW (Add this)
      const env = process.env as any;    const body = await request.json() as { artwork_id: string; image_url: string; is_primary?: boolean }

    const { artwork_id, image_url, is_primary = false } = body

    if (!artwork_id || !image_url) {
      return NextResponse.json({ error: 'artwork_id and image_url are required' }, { status: 400 })
    }

    await addArtworkImage(env.DB, parseInt(artwork_id), image_url, is_primary)

    return NextResponse.json({ url: image_url }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to save image' }, { status: 500 })
  }
}
