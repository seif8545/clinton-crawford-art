'use client'
// src/app/admin/orders/page.tsx
import { useState, useEffect } from 'react'
import type { Order } from '@/types'

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-ember border-ember/30 bg-ember/5',
  paid: 'text-gold border-gold/30 bg-gold/5',
  shipped: 'text-celestial border-celestial/30 bg-celestial/5',
  delivered: 'text-green-400 border-green-400/30 bg-green-400/5',
  cancelled: 'text-blush border-mauve/30 bg-mauve/5',
  refunded: 'text-blush border-mauve/30 bg-mauve/5',
}

const NEXT_STATUS: Record<string, string> = {
  pending: 'paid', paid: 'shipped', shipped: 'delivered',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState<number | null>(null)

  async function load() {
    setLoading(true)
    const qs = filter !== 'all' ? `?status=${filter}` : ''
    const res = await fetch(`/api/orders${qs}`)
    const data = await res.json()
    setOrders(data.orders ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [filter])

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    load()
  }

  const filters = ['all', 'pending', 'paid', 'shipped', 'delivered', 'cancelled']

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-ink mb-1">Orders</h1>
        <p className="text-sm text-dusk/50 font-body">{orders.length} orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-4 py-2 tracking-widest uppercase font-body border transition-all capitalize ${
              filter === f ? 'border-gold/40 text-gold bg-gold/5' : 'border-whisper text-dusk/40 hover:text-ink/60'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-vellum animate-pulse border border-whisper" />)}</div>
      ) : orders.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <p className="font-display text-2xl text-dusk/40">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => {
            const o = order as Order & Record<string, unknown>
            const isOpen = expanded === order.id
            const nextStatus = NEXT_STATUS[order.status]
            return (
              <div key={order.id} className="border border-whisper hover:border-gold/20 transition-colors">
                {/* Summary row */}
                <div
                  className="flex flex-wrap items-center gap-4 px-5 py-4 cursor-pointer"
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="font-body text-ink">{order.order_number}</span>
                      <span className={`text-xs px-2 py-0.5 border capitalize ${STATUS_COLORS[order.status] ?? ''}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-dusk/50 font-body mt-0.5">
                      {(o.first_name as string) ?? ''} {(o.last_name as string) ?? ''} · {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="font-display text-xl text-gold">${order.total.toLocaleString()}</div>
                  <span className="text-dusk/40 text-sm">{isOpen ? '▲' : '▼'}</span>
                </div>

                {/* Expanded details */}
                {isOpen && (
                  <div className="border-t border-whisper px-5 py-5 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm font-body">
                      <div>
                        <p className="text-xs text-dusk/40 tracking-widest uppercase mb-1">Client</p>
                        <p className="text-dusk/70">{(o.first_name as string) ?? ''} {(o.last_name as string) ?? ''}</p>
                        <p className="text-dusk/50">{(o.email as string) ?? ''}</p>
                      </div>
                      <div>
                        <p className="text-xs text-dusk/40 tracking-widest uppercase mb-1">Shipping</p>
                        {order.shipping_address ? (
                          <div className="text-dusk/60 text-xs space-y-0.5">
                            <p>{order.shipping_address.line1}</p>
                            {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                            <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</p>
                            <p>{order.shipping_address.country}</p>
                          </div>
                        ) : <p className="text-dusk/40 text-xs">No address</p>}
                      </div>
                      <div>
                        <p className="text-xs text-dusk/40 tracking-widest uppercase mb-1">Financials</p>
                        <p className="text-dusk/60 text-xs">Subtotal: ${order.subtotal.toLocaleString()}</p>
                        <p className="text-dusk/60 text-xs">Shipping: ${order.shipping_cost.toLocaleString()}</p>
                        <p className="text-gold text-sm">Total: ${order.total.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {nextStatus && (
                        <button onClick={() => updateStatus(order.id, nextStatus)}
                          className="btn-portal py-2 px-5 text-sm capitalize">
                          Mark as {nextStatus} →
                        </button>
                      )}
                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <button onClick={() => updateStatus(order.id, 'cancelled')}
                          className="btn-ghost py-2 px-5 text-sm text-blush-deep border-blush/30 hover:bg-blush/5">
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
