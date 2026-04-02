// src/app/api/orders/route.ts
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getOrders, createOrder, getOrCreateClient } from '@/lib/db'
import type { CloudflareEnv } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const env = getRequestContext().env as CloudflareEnv
    const status = new URL(request.url).searchParams.get('status') ?? undefined
    const orders = await getOrders(env.DB, status)
    return NextResponse.json({ orders })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const env = getRequestContext().env as CloudflareEnv
    const body = await request.json()

    const { first_name, last_name, email, phone, shipping_address, items } = body

    if (!email || !items?.length) {
      return NextResponse.json({ error: 'Email and items are required' }, { status: 400 })
    }

    // Create/update client
    const { id: client_id } = await getOrCreateClient(env.DB, {
      first_name, last_name, email, phone, shipping_address,
    })

    // Create order
    const { id, order_number } = await createOrder(env.DB, {
      client_id, items, shipping_address, shipping_cost: 0,
    })

    return NextResponse.json({ id, order_number }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
