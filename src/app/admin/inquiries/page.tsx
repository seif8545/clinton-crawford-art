'use client'
// src/app/admin/inquiries/page.tsx
import { useEffect, useState } from 'react'

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

const STORAGE_KEY = 'art-crawford-inquiries-v1'

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [open, setOpen] = useState<number | null>(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      setInquiries(raw ? (JSON.parse(raw) as Inquiry[]) : [])
    } catch {
      setInquiries([])
    }
  }, [])

  function clearAll() {
    if (!confirm('Clear all inquiries from this browser?')) return
    window.localStorage.removeItem(STORAGE_KEY)
    setInquiries([])
    setMsg('Inquiries cleared from this browser.')
  }

  function exportCsv() {
    const header = ['Date', 'Name', 'Email', 'Phone', 'Painting', 'Message']
    const rows = inquiries.map(i => [
      new Date(i.created_at).toISOString(),
      i.name,
      i.email,
      i.phone ?? '',
      i.painting_title ?? '',
      i.message.replace(/\s+/g, ' '),
    ])
    const csv = [header, ...rows]
      .map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'art-crawford-inquiries.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl text-ink mb-1">Inquiries</h1>
          <p className="text-sm text-dusk/55 font-body">
            {inquiries.length} inquir{inquiries.length === 1 ? 'y' : 'ies'} captured locally.
            All submissions are also delivered to <span className="text-gold">info@artcrawford.com</span>.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCsv}
            disabled={inquiries.length === 0}
            className="text-xs text-dusk/65 hover:text-ink px-4 py-2 border border-whisper hover:border-gold/30 transition-colors uppercase tracking-widest font-body disabled:opacity-50"
          >
            Export CSV
          </button>
          <button
            onClick={clearAll}
            disabled={inquiries.length === 0}
            className="text-xs text-dusk/65 hover:text-blush px-4 py-2 border border-whisper hover:border-blush/30 transition-colors uppercase tracking-widest font-body disabled:opacity-50"
          >
            Clear All
          </button>
        </div>
      </div>

      {msg && <p className="mb-4 text-sm text-gold font-body">{msg}</p>}

      {inquiries.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <p className="font-display text-2xl text-dusk/40 mb-4">No inquiries yet</p>
          <p className="text-dusk/55 font-body">
            When a visitor submits the public inquiry form, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq, i) => (
            <div key={i} className="border border-whisper bg-parchment/40">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-vellum transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg text-ink leading-tight">{inq.name}</p>
                  <p className="text-xs text-dusk/55 font-body truncate">
                    {inq.email}
                    {inq.painting_title ? ` · interested in “${inq.painting_title}”` : ''}
                  </p>
                </div>
                <p className="text-xs text-dusk/45 font-body whitespace-nowrap">
                  {new Date(inq.created_at).toLocaleString()}
                </p>
                <span className="text-gold">{open === i ? '▾' : '▸'}</span>
              </button>
              {open === i && (
                <div className="px-5 pb-5 pt-1 border-t border-whisper bg-vellum/40 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-dusk/45 tracking-widest uppercase font-body">Email</p>
                      <a href={`mailto:${inq.email}`} className="text-blush hover:text-gold transition-colors break-all">
                        {inq.email}
                      </a>
                    </div>
                    {inq.phone && (
                      <div>
                        <p className="text-xs text-dusk/45 tracking-widest uppercase font-body">Phone</p>
                        <p className="text-ink/80 font-body">{inq.phone}</p>
                      </div>
                    )}
                    {inq.painting_title && (
                      <div>
                        <p className="text-xs text-dusk/45 tracking-widest uppercase font-body">Painting</p>
                        <p className="text-ink/80 font-body">{inq.painting_title}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-dusk/45 tracking-widest uppercase font-body mb-2">Message</p>
                    <p className="text-ink/80 font-body whitespace-pre-wrap leading-relaxed">{inq.message}</p>
                  </div>
                  <a
                    href={`mailto:${inq.email}?subject=${encodeURIComponent(
                      inq.painting_title ? `Re: ${inq.painting_title}` : 'Re: your inquiry'
                    )}`}
                    className="inline-block text-xs uppercase tracking-widest text-gold hover:text-ink transition-colors font-body"
                  >
                    Reply by email →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
