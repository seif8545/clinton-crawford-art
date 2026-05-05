// src/app/api/orders/[id]/route.ts
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

const GONE = {
  error:
    'Orders have been retired. Buyers should submit a private inquiry at /inquire instead.',
}

export async function GET() {
  return NextResponse.json(GONE, { status: 410 })
}

export async function PATCH() {
  return NextResponse.json(GONE, { status: 410 })
}
