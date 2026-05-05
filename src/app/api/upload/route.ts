// src/app/api/upload/route.ts
//
// Image storage has been pulled in-process: the admin reads files as base64
// data URLs in the browser and stores them in localStorage. This endpoint
// remains so older form posts still get a clean response.

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    {
      error:
        'Image uploads now happen in the admin panel directly — no backend upload is required.',
    },
    { status: 410 }
  )
}
