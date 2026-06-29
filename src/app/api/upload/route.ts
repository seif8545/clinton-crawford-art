// src/app/api/upload/route.ts
//
// Admin only: accepts an image file and stores it in the public Supabase
// bucket, returning its public URL. Used by the inventory editor so the
// painter can upload a new image and have it appear live immediately.

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin-auth'

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: 'Image is larger than 10 MB. Please use a smaller file.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const url = await uploadImage(bytes, file.type, ext)
    return NextResponse.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    const message = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
