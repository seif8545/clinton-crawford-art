// src/app/api/orders/[id]/route.ts
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getOrderById, updateOrderStatus } from '@/lib/db'
import type { CloudflareEnv } from '@/types'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const env = getRequestContext().env as CloudflareEnv
    const order = await getOrderById(env.DB, parseInt(params.id))
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ order })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const env = getRequestContext().env as CloudflareEnv
    const { status } = await request.json()
    const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    await updateOrderStatus(env.DB, parseInt(params.id), status)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
