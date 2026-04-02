// src/app/api/upload/route.ts
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { uploadToR2, generateR2Key } from '@/lib/r2'
import { addArtworkImage } from '@/lib/db'
import type { CloudflareEnv } from '@/types'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

export async function POST(request: NextRequest) {
  try {
    const env = getRequestContext().env as CloudflareEnv
    const formData = await request.formData()

    const file = formData.get('file') as File | null
    const artworkIdStr = formData.get('artwork_id') as string | null
    const isPrimary = formData.get('is_primary') === '1'

    if (!file || !artworkIdStr) {
      return NextResponse.json({ error: 'file and artwork_id are required' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Use JPEG, PNG, WebP, or AVIF.' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum 10 MB.' }, { status: 400 })
    }

    const artworkId = parseInt(artworkIdStr)
    const r2Key = generateR2Key(artworkId, file.name)
    const buffer = await file.arrayBuffer()

    await uploadToR2(env.BUCKET, r2Key, buffer, file.type)
    await addArtworkImage(env.DB, artworkId, r2Key, isPrimary)

    const publicUrl = `${(env.R2_PUBLIC_URL ?? '').replace(/\/$/, '')}/${r2Key}`
    return NextResponse.json({ r2Key, url: publicUrl }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
