'use client'
// src/app/admin/page.tsx
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { type Painting } from '@/lib/paintings'

export const runtime = 'edge'

interface Inquiry {
  name: string
  email: string
  phone?: string
  painting_slug?: string
  painting_title?: string | null
  message: string
  created_at: string
}

export default function AdminDashboard() {
  const [paintings, setPaintings] = useState<Painting[]>([])
  const [inquiries, setInquiries] = useState<Inquiry[]>([])

  useEffect(() => {
    fetch('/api/artworks', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: { artworks?: Painting[] }) => setPaintings(d.artworks ?? []))
      .catch(() => setPaintings([]))
    try {
      const raw = window.localStorage.getItem('art-crawford-inquiries-v1')
      setInquiries(raw ? (JSON.parse(raw) as Inquiry[]) : [])
    } catch {
      setInquiries([])
    }
  }, [])

  const total = paintings.length
  const available = paintings.filter(p => p.status === 'available').length
  const sold = paintings.filter(p => p.status === 'sold').length
  const featured = paintings.filter(p => p.featured).length

  const cards: { label: string; value: string | number; tone: string }[] = [
    { label: 'Paintings', value: total, tone: 'text-ink' },
    { label: 'Available', value: available, tone: 'text-gold' },
    { label: 'Sold', value: sold, tone: 'text-dusk' },
    { label: 'Featured on home', value: featured, tone: 'text-blush' },
  ]

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-10">
        <h1 className="font-display text-4xl text-ink mb-1">Studio Overview</h1>
        <p className="text-sm text-dusk/55 font-body">
          Welcome back. Manage paintings, review inquiries, and publish updates.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {cards.map(c => (
          <div key={c.label} className="glass-card p-6">
            <p className="text-xs text-dusk/45 tracking-widest uppercase font-body mb-2">{c.label}</p>
            <p className={`font-display text-4xl ${c.tone}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Recent inquiries */}
        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-ink">Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-xs text-gold uppercase tracking-widest hover:underline">
              View all
            </Link>
          </div>

          {inquiries.length === 0 ? (
            <p className="text-sm text-dusk/45 font-body py-10 text-center">
              No inquiries yet. Once visitors submit through{' '}
              <Link href="/inquire" className="text-gold underline">/inquire</Link>, they will appear here.
            </p>
          ) : (
            <div className="space-y-4">
              {inquiries.slice(0, 5).map((inq, i) => (
                <div key={i} className="flex justify-between items-start gap-3 py-3 border-b border-whisper last:border-0 text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="text-ink font-body truncate">{inq.name}</p>
                    <p className="text-xs text-dusk/55 font-body truncate">
                      {inq.email}
                      {inq.painting_title ? ` · ${inq.painting_title}` : ''}
                    </p>
                  </div>
                  <p className="text-xs text-dusk/45 font-body whitespace-nowrap">
                    {new Date(inq.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="glass-card p-8 bg-vellum/30">
          <h2 className="font-display text-xl text-ink mb-6">Studio Management</h2>
          <div className="grid grid-cols-1 gap-3">
            <Link
              href="/admin/inventory"
              className="flex items-center justify-between p-4 bg-parchment border border-whisper hover:border-gold/30 transition-colors group"
            >
              <span className="font-body text-sm text-dusk/70 group-hover:text-ink">Manage Paintings</span>
              <span className="text-gold">→</span>
            </Link>
            <Link
              href="/admin/inquiries"
              className="flex items-center justify-between p-4 bg-parchment border border-whisper hover:border-gold/30 transition-colors group"
            >
              <span className="font-body text-sm text-dusk/70 group-hover:text-ink">Review Inquiries</span>
              <span className="text-gold">→</span>
            </Link>
            <Link
              href="/inquire"
              className="flex items-center justify-between p-4 bg-parchment border border-whisper hover:border-gold/30 transition-colors group"
            >
              <span className="font-body text-sm text-dusk/70 group-hover:text-ink">Open Public Inquiry Form</span>
              <span className="text-gold">→</span>
            </Link>
            <div className="p-4 border border-gold/15 bg-gold/5 mt-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold mb-1 font-body">How publishing works</p>
              <p className="text-xs text-dusk/65 font-body leading-relaxed">
                Edits publish instantly. On the{' '}
                <Link href="/admin/inventory" className="text-gold underline">Paintings</Link> page,
                change the text, upload a new image, or rename a work, then press Save — it&rsquo;s
                live on the site right away.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
