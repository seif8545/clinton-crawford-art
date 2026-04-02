'use client'
// src/app/admin/page.tsx
import { useState, useEffect } from 'react'
import type { Order, Artwork, Client } from '@/types'
import Link from 'next/link'

interface AnalyticsSummary {
    total_revenue: number
    total_orders: number
    total_clients: number
    available_artworks: number
    recent_orders: Order[]
}

export default function AdminDashboard() {
    const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null)
    const [loading, setLoading] = useState(true)

    async function load() {
        try {
            setLoading(true)
            const res = await fetch('/api/analytics')
            const data = (await res.json()) as { summary: AnalyticsSummary }
            setAnalytics(data.summary)
        } catch (error) {
            console.error("Failed to load analytics:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    const fmt = (val: number, type?: 'currency') => {
        if (type === 'currency') return `$${val.toLocaleString()}`
        return val.toLocaleString()
    }

    const cards = [
        { key: 'total_revenue', label: 'Total Revenue', color: 'text-gold', format: 'currency' as const },
        { key: 'total_orders', label: 'Orders', color: 'text-ink', format: undefined },
        { key: 'total_clients', label: 'Collectors', color: 'text-ink', format: undefined },
        { key: 'available_artworks', label: 'Available Works', color: 'text-ink', format: undefined },
    ]

    if (loading) return <div className="p-8 animate-pulse text-dusk/40 font-body">Loading overview...</div>
    if (!analytics) return <div className="p-8 text-blush font-body">Failed to load dashboard.</div>

    return (
        <div className="p-8">
            <div className="mb-10">
                <h1 className="font-display text-4xl text-ink mb-1">Overview</h1>
                <p className="text-sm text-dusk/50 font-body">Studio performance and recent activity</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {cards.map((card) => (
                    <div key={card.key} className="glass-card p-6 border border-whisper">
                        <p className="text-xs text-dusk/40 tracking-widest uppercase font-body mb-2">{card.label}</p>
                        <p className={`font-display text-4xl ${card.color}`}>
                            {/* Double cast to bypass strict Record overlap check */}
                            {fmt((analytics as unknown as Record<string, number>)[card.key] ?? 0, card.format)}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="glass-card p-8 border border-whisper">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-display text-xl text-ink">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-xs text-gold uppercase tracking-widest hover:underline">View All</Link>
                    </div>

                    {analytics.recent_orders.length > 0 ? (
                        <div className="space-y-4">
                            {analytics.recent_orders.map((o: Order, i: number) => (
                                <div key={i} className="flex justify-between items-center py-3 border-b border-whisper last:border-0 text-sm">
                                    <div className="min-w-0">
                                        <p className="text-ink font-body truncate">{o.order_number}</p>
                                        <p className="text-xs text-dusk/40 font-body">{new Date(o.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gold font-body">${o.total.toLocaleString()}</p>
                                        <p className="text-[10px] uppercase tracking-tighter text-dusk/40">{o.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-dusk/30 font-body py-10 text-center">No recent orders</p>
                    )}
                </div>

                {/* Quick Links / Status */}
                <div className="glass-card p-8 border border-whisper bg-vellum/30">
                    <h2 className="font-display text-xl text-ink mb-6">Studio Management</h2>
                    <div className="grid grid-cols-1 gap-3">
                        <Link href="/admin/inventory" className="flex items-center justify-between p-4 bg-white border border-whisper hover:border-gold/30 transition-colors group">
                            <span className="font-body text-sm text-dusk/70 group-hover:text-ink">Manage Inventory</span>
                            <span className="text-gold">→</span>
                        </Link>
                        <Link href="/admin/clients" className="flex items-center justify-between p-4 bg-white border border-whisper hover:border-gold/30 transition-colors group">
                            <span className="font-body text-sm text-dusk/70 group-hover:text-ink">View Collectors</span>
                            <span className="text-gold">→</span>
                        </Link>
                        <div className="p-4 border border-gold/10 bg-gold/5 rounded-sm mt-4">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-gold mb-1 font-body">System Status</p>
                            <p className="text-xs text-dusk/60 font-body leading-relaxed">
                                Connected to Cloudflare D1 and R2 Storage. Next.js 15 Edge Runtime active.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}