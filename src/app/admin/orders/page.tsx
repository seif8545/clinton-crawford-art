'use client'
// src/app/admin/orders/page.tsx
//
// Real print-order management. This route used to redirect to
// /admin/inquiries (back when the cart/checkout flow was retired). Now
// that print purchases are back, it shows orders pulled live from
// Supabase (src/lib/orders.ts + supabase-print-orders.sql) — not a
// localStorage mirror, so it's the same list on every device.

import { useEffect, useState } from 'react'
import type { PrintOrder, PrintOrderStatus } from '@/lib/orders'

export const runtime = 'edge'

const STATUSES: PrintOrderStatus[] = [
  'pending',
  'confirmed',
  'in_production',
  'shipped',
  'delivered',
  'cancelled',
]

const STATUS_LABEL: Record<PrintOrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_production: 'In Production',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<PrintOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/print-orders', { cache: 'no-store' })
      const data = (await res.json()) as { orders?: PrintOrder[]; error?: string }
      if (!res.ok) {
        setError(data.error ?? 'Failed to load orders')
        setOrders([])
      } else {
        setOrders(data.orders ?? [])
        setError(null)
      }
    } catch {
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function setStatus(order_number: string, status: PrintOrderStatus) {
    setOrders(prev => prev.map(o => (o.order_number === order_number ? { ...o, status } : o)))
    await fetch('/api/admin/print-orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_number, status }),
    })
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-ink mb-1">Print Orders</h1>
        <p className="text-sm text-dusk/55 font-body">
          {loading ? 'Loading…' : `${orders.length} order${orders.length === 1 ? '' : 's'}`} — every
          order is also emailed to <span className="text-gold">info@artcrawford.com</span> as it comes in.
        </p>
      </div>

      {error && (
        <div className="glass-card p-6 mb-6 text-sm text-blush font-body">
          {error}. If you haven&rsquo;t run <code className="text-ink">supabase-print-orders.sql</code> yet,
          orders will still arrive by email but won&rsquo;t show up here.
        </div>
      )}

      {!loading && orders.length === 0 && !error && (
        <div className="glass-card p-16 text-center">
          <p className="font-display text-2xl text-dusk/40 mb-4">No orders yet</p>
          <p className="text-dusk/55 font-body">
            When a visitor completes a print purchase, it will appear here.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {orders.map(order => (
          <div key={order.order_number} className="border border-whisper bg-parchment/40">
            <button
              onClick={() => setOpen(open === order.order_number ? null : order.order_number)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-vellum transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg text-ink leading-tight">
                  {order.order_number} — {order.customer_name}
                </p>
                <p className="text-xs text-dusk/55 font-body truncate">
                  {order.customer_email} · {order.items.length} item
                  {order.items.length === 1 ? '' : 's'} · ${order.total.toLocaleString()}
                </p>
              </div>
              <span className="text-xs uppercase tracking-widest font-body text-gold whitespace-nowrap">
                {STATUS_LABEL[order.status]}
              </span>
              <p className="text-xs text-dusk/45 font-body whitespace-nowrap hidden sm:block">
                {order.created_at ? new Date(order.created_at).toLocaleString() : ''}
              </p>
              <span className="text-gold">{open === order.order_number ? '▾' : '▸'}</span>
            </button>

            {open === order.order_number && (
              <div className="px-5 pb-5 pt-1 border-t border-whisper bg-vellum/40 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm pt-4">
                  <div>
                    <p className="text-xs text-dusk/45 tracking-widest uppercase font-body">Contact</p>
                    <a
                      href={`mailto:${order.customer_email}`}
                      className="text-blush hover:text-gold transition-colors break-all"
                    >
                      {order.customer_email}
                    </a>
                    {order.customer_phone && (
                      <p className="text-ink/80 font-body">{order.customer_phone}</p>
                    )}
                  </div>
                  {order.shipping_address ? (
                    <div>
                      <p className="text-xs text-dusk/45 tracking-widest uppercase font-body">Ship to</p>
                      <p className="text-ink/80 font-body">
                        {order.shipping_address.name}
                        <br />
                        {order.shipping_address.line1}
                        {order.shipping_address.line2 ? <><br />{order.shipping_address.line2}</> : null}
                        <br />
                        {order.shipping_address.city}, {order.shipping_address.state}{' '}
                        {order.shipping_address.zip}
                        <br />
                        {order.shipping_address.country}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-dusk/45 tracking-widest uppercase font-body">Delivery</p>
                      <p className="text-ink/80 font-body">Digital only — no shipping</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-dusk/45 tracking-widest uppercase font-body">Status</p>
                    <select
                      value={order.status}
                      onChange={e => setStatus(order.order_number, e.target.value as PrintOrderStatus)}
                      className="mt-1 border border-whisper bg-parchment px-2 py-1.5 font-body text-sm text-ink focus:outline-none focus:border-gold/50"
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-dusk/45 tracking-widest uppercase font-body mb-2">Items</p>
                  <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm font-body">
                        <span className="text-ink/80">
                          {item.quantity} × {item.painting_title} — {item.format}, {item.size}
                        </span>
                        <span className="text-ink/60">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm font-body mt-2 pt-2 border-t border-whisper">
                    <span className="text-dusk/55">Subtotal / Shipping / Total</span>
                    <span className="text-ink">
                      ${order.subtotal.toLocaleString()} + ${order.shipping_cost.toLocaleString()} = $
                      {order.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {order.notes && (
                  <div>
                    <p className="text-xs text-dusk/45 tracking-widest uppercase font-body mb-1">Notes</p>
                    <p className="text-ink/80 font-body whitespace-pre-wrap">{order.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
