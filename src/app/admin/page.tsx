// src/app/admin/page.tsx
export const runtime = 'edge'

import { getRequestContext } from '@cloudflare/next-on-pages'
import { getAnalytics } from '@/lib/db'
import type { CloudflareEnv } from '@/types'

const statCards = [
  { key: 'total_revenue', label: 'Total Revenue', format: 'currency', color: 'text-gold' },
  { key: 'total_orders', label: 'All Orders', format: 'number', color: 'text-ink' },
  { key: 'orders_pending', label: 'Pending', format: 'number', color: 'text-ember' },
  { key: 'artworks_available', label: 'Available Works', format: 'number', color: 'text-celestial' },
  { key: 'artworks_sold', label: 'Works Sold', format: 'number', color: 'text-blush' },
  { key: 'total_clients', label: 'Collectors', format: 'number', color: 'text-gold' },
]

export default async function AdminDashboard() {
  let analytics: Awaited<ReturnType<typeof getAnalytics>> | null = null

  try {
    const env = getRequestContext().env as CloudflareEnv
    analytics = await getAnalytics(env.DB)
  } catch {}

  function fmt(value: number, format: string) {
    if (format === 'currency') return `$${value.toLocaleString(undefined, { minimumFractionDigits: 0 })}`
    return value.toLocaleString()
  }

  const statusColors: Record<string, string> = {
    pending: 'text-ember', paid: 'text-gold', shipped: 'text-celestial',
    delivered: 'text-green-400', cancelled: 'text-blush', refunded: 'text-blush',
  }

  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="font-display text-4xl text-ink mb-1">Analytics</h1>
        <p className="text-sm text-dusk/50 font-body">Studio overview</p>
      </div>

      {analytics ? (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
            {statCards.map(card => (
              <div key={card.key} className="glass-card p-6">
                <p className="text-xs text-dusk/50 tracking-widest uppercase font-body mb-2">{card.label}</p>
                <p className={`font-display text-4xl ${card.color}`}>
                        {fmt((analytics as unknown as Record<string, number>)[card.key] ?? 0, card.format)}
                    </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

            {/* Top artworks */}
            <div className="glass-card p-6">
              <h2 className="font-display text-2xl text-gold mb-5">Top Works</h2>
              {analytics.top_artworks.length > 0 ? (
                <div className="space-y-3">
                  {analytics.top_artworks.map((a, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-whisper text-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-display text-gold/40 w-5 shrink-0">{i + 1}</span>
                        <span className="text-dusk/70 font-body truncate">{a.title}</span>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-dusk/50 font-body">{a.total_sold} sold</span>
                        <span className="text-gold font-body">${a.revenue?.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-dusk/40 font-body text-sm">No sales data yet.</p>
              )}
            </div>

            {/* Recent orders */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-2xl text-gold">Recent Orders</h2>
                <a href="/admin/orders" className="text-xs text-dusk/50 hover:text-dusk/70 font-body transition-colors">View all →</a>
              </div>
              {analytics.recent_orders.length > 0 ? (
                <div className="space-y-3">
                  {analytics.recent_orders.map((o: Record<string, unknown>, i: number) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-whisper text-sm">
                      <div className="min-w-0">
                        <p className="text-ink/80 font-body truncate">{o.order_number as string}</p>
                        <p className="text-dusk/50 font-body text-xs truncate">{o.first_name as string} {o.last_name as string}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-xs font-body capitalize ${statusColors[o.status as string] ?? 'text-dusk/50'}`}>
                          {o.status as string}
                        </span>
                        <span className="text-gold font-body">${(o.total as number)?.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-dusk/40 font-body text-sm">No orders yet.</p>
              )}
            </div>

          </div>
        </>
      ) : (
        <div className="glass-card p-12 text-center">
          <p className="font-display text-2xl text-dusk/40">Database not connected</p>
          <p className="text-dusk/30 font-body text-sm mt-2">Run <code className="font-mono text-gold/60">npm run db:init:local</code> to initialize</p>
        </div>
      )}
    </div>
  )
}
