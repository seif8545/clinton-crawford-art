// src/app/api/orders/route.ts
// The order pipeline has been retired in favour of an inquiry flow.
// These stubs keep the route building on the edge runtime so old links still
// answer with a useful 410 Gone response.

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

export async function POST() {
  return NextResponse.json(GONE, { status: 410 })
}
