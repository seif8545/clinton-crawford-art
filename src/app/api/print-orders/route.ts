// src/app/api/print-orders/route.ts
//
// Receives a cart from /checkout, re-derives every price server-side from
// the painting's own print_options (never trusts prices sent by the
// client — a tampered request just gets the correct price silently
// substituted), then:
//
//   1. Notifies the studio — same two channels as /api/inquiry
//      (RESEND_API_KEY, else PRINT_ORDER_WEBHOOK_URL / INQUIRY_WEBHOOK_URL).
//   2. Persists the order to Supabase print_orders, if configured
//      (see supabase-print-orders.sql) — best-effort; a checkout still
//      succeeds even if this table hasn't been created yet, since the
//      studio still gets the email/webhook.
//
// Returns the order number so the buyer can be shown a confirmation and
// the studio can locate the order later even without the orders table.

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getPaintings, createPrintOrder } from '@/lib/supabase'
import { printOptionsFor } from '@/lib/paintings'
import {
  generateOrderNumber,
  computeTotals,
  estimateShipping,
  hasPhysicalItem,
  type PrintOrder,
  type PrintOrderItem,
  type ShippingAddress,
} from '@/lib/orders'

const STUDIO_EMAIL = 'info@artcrawford.com'

interface IncomingItem {
  painting_slug?: string
  option_id?: string
  quantity?: number
}

interface IncomingOrder {
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  shipping_address?: ShippingAddress | null
  items?: IncomingItem[]
  notes?: string
}

export async function POST(request: NextRequest) {
  let body: IncomingOrder = {}
  try {
    body = (await request.json()) as IncomingOrder
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const customer_name = (body.customer_name ?? '').trim()
  const customer_email = (body.customer_email ?? '').trim()
  const incomingItems = Array.isArray(body.items) ? body.items : []

  if (!customer_name || !customer_email || incomingItems.length === 0) {
    return NextResponse.json(
      { error: 'customer_name, customer_email and at least one item are required' },
      { status: 400 }
    )
  }

  // Re-derive every line item from the live catalogue — the source of
  // truth for price is always the server, never the request body.
  const paintings = await getPaintings()
  const items: PrintOrderItem[] = []
  const problems: string[] = []

  for (const raw of incomingItems) {
    const painting = paintings.find(p => p.slug === raw.painting_slug)
    if (!painting) {
      problems.push(`Unknown painting: ${raw.painting_slug}`)
      continue
    }
    const option = printOptionsFor(painting).find(o => o.id === raw.option_id)
    if (!option) {
      problems.push(`Unknown print option "${raw.option_id}" for ${painting.title}`)
      continue
    }
    const quantity = Math.max(1, Math.min(50, Math.floor(raw.quantity ?? 1)))
    items.push({
      painting_slug: painting.slug,
      painting_title: painting.title,
      painting_image: painting.image,
      option_id: option.id,
      format: option.format,
      size: option.size,
      price: option.price, // server-side price — client's number is ignored
      quantity,
    })
  }

  if (items.length === 0) {
    return NextResponse.json(
      { error: 'No valid items in cart', details: problems },
      { status: 400 }
    )
  }

  const needsShipping = hasPhysicalItem(items)
  const shipping_address = needsShipping ? body.shipping_address ?? null : null

  if (needsShipping) {
    const a = shipping_address
    if (!a || !a.name || !a.line1 || !a.city || !a.state || !a.zip || !a.country) {
      return NextResponse.json(
        { error: 'A complete shipping address is required for printed items' },
        { status: 400 }
      )
    }
  }

  const shipping_cost = estimateShipping(items)
  const { subtotal, total } = computeTotals(items, shipping_cost)
  const order_number = generateOrderNumber()

  const order: PrintOrder = {
    order_number,
    customer_name,
    customer_email,
    customer_phone: body.customer_phone?.trim() || null,
    shipping_address,
    items,
    subtotal,
    shipping_cost,
    total,
    status: 'pending',
    notes: body.notes?.trim() || null,
    created_at: new Date().toISOString(),
  }

  const env = (process.env ?? {}) as Record<string, string | undefined>
  const subject = `New print order ${order_number} — $${total.toLocaleString()}`
  const lines = [
    `New print order from the Art Crawford website`,
    ``,
    `Order:   ${order_number}`,
    `Name:    ${customer_name}`,
    `Email:   ${customer_email}`,
    order.customer_phone ? `Phone:   ${order.customer_phone}` : null,
    ``,
    `Items:`,
    ...items.map(
      i => `  · ${i.quantity} × ${i.painting_title} — ${i.format}, ${i.size} — $${i.price} ea`
    ),
    ``,
    `Subtotal: $${subtotal.toLocaleString()}`,
    `Shipping: $${shipping_cost.toLocaleString()}`,
    `Total:    $${total.toLocaleString()}`,
    ``,
    shipping_address
      ? [
          `Ship to:`,
          shipping_address.name,
          shipping_address.line1,
          shipping_address.line2 ?? '',
          `${shipping_address.city}, ${shipping_address.state} ${shipping_address.zip}`,
          shipping_address.country,
        ]
          .filter(Boolean)
          .join('\n')
      : `Digital delivery only — no shipping required.`,
    order.notes ? `\nNotes:\n${order.notes}` : null,
  ].filter(Boolean) as string[]
  const text = lines.join('\n')

  console.log('[Art Crawford] print order received →', order_number, {
    customer_email,
    total,
  })

  let notified = false

  // 1. Try Resend
  const resendKey = env.RESEND_API_KEY
  if (resendKey) {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.RESEND_FROM ?? 'Art Crawford <orders@artcrawford.com>',
          to: [STUDIO_EMAIL],
          reply_to: customer_email,
          subject,
          text,
        }),
      })
      if (r.ok) {
        notified = true
      } else {
        console.warn('[Art Crawford] Resend send failed:', r.status, await r.text())
      }
    } catch (err) {
      console.warn('[Art Crawford] Resend send threw:', err)
    }
  }

  // 2. Fallback webhook
  if (!notified) {
    const webhook = env.PRINT_ORDER_WEBHOOK_URL ?? env.INQUIRY_WEBHOOK_URL
    if (webhook) {
      try {
        const r = await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: STUDIO_EMAIL, subject, text, order }),
        })
        if (r.ok) notified = true
        else console.warn('[Art Crawford] Order webhook failed:', r.status)
      } catch (err) {
        console.warn('[Art Crawford] Order webhook threw:', err)
      }
    }
  }

  // 3. Persist to Supabase (best-effort — doesn't block the response)
  const saved = await createPrintOrder(order)

  return NextResponse.json({
    success: true,
    order_number,
    total,
    notified,
    persisted: Boolean(saved),
  })
}
