// src/app/api/admin/print-orders/route.ts
//
// GET   — admin only: list all print orders, newest first.
// PATCH — admin only: update an order's fulfillment status.
//
// Deliberately its own route rather than reusing the legacy
// /api/orders (that one is retired D1/Cloudflare-era code, now a 410).

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getPrintOrders, updatePrintOrderStatus } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin-auth'
import type { PrintOrderStatus } from '@/lib/orders'

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }
  const orders = await getPrintOrders()
  return NextResponse.json({ orders })
}

export async function PATCH(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }
  try {
    const body = (await request.json()) as {
      order_number?: string
      status?: PrintOrderStatus
    }
    const validStatuses: PrintOrderStatus[] = [
      'pending',
      'confirmed',
      'in_production',
      'shipped',
      'delivered',
      'cancelled',
    ]
    if (!body.order_number || !body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'order_number and a valid status are required' }, { status: 400 })
    }
    const ok = await updatePrintOrderStatus(body.order_number, body.status)
    if (!ok) {
      return NextResponse.json({ error: 'Update failed — is Supabase configured?' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PATCH print order error:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
