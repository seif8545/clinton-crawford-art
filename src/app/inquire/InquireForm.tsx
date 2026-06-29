'use client'
// src/app/inquire/InquireForm.tsx
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { type Painting, priceDisplay } from '@/lib/paintings'

const INQUIRY_EMAIL = 'info@artcrawford.com'

interface FormState {
  name: string
  email: string
  phone: string
  painting_slug: string
  message: string
}

const EMPTY: FormState = {
  name: '',
  email: '',
  phone: '',
  painting_slug: '',
  message: '',
}

export default function InquireForm() {
  const searchParams = useSearchParams()
  const initialSlug = searchParams.get('painting') ?? ''

  const [paintings, setPaintings] = useState<Painting[]>([])
  const [form, setForm] = useState<FormState>({ ...EMPTY, painting_slug: initialSlug })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/artworks', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: { artworks?: Painting[] }) => setPaintings(d.artworks ?? []))
      .catch(() => setPaintings([]))
  }, [])

  const selected = useMemo(
    () => paintings.find(p => p.slug === form.painting_slug) ?? null,
    [paintings, form.painting_slug]
  )

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in your name, email, and a short message.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          painting_title: selected?.title ?? null,
        }),
      })
      if (!res.ok) throw new Error('Inquiry failed')

      // Mirror to localStorage so the painter can also see inquiries inside admin.
      try {
        const key = 'art-crawford-inquiries-v1'
        const existing = JSON.parse(window.localStorage.getItem(key) ?? '[]') as unknown[]
        existing.unshift({
          ...form,
          painting_title: selected?.title ?? null,
          created_at: new Date().toISOString(),
        })
        window.localStorage.setItem(key, JSON.stringify(existing.slice(0, 200)))
      } catch {
        /* ignore */
      }

      setSubmitted(true)
    } catch {
      setError(
        'Something went wrong sending your inquiry. Please email ' +
          INQUIRY_EMAIL +
          ' directly.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    const subject = selected
      ? `Re: Your inquiry about "${selected.title}"`
      : 'Re: Your inquiry'
    return (
      <div className="glass-card p-10 text-center">
        <p className="text-xs text-gold tracking-[0.3em] uppercase font-body mb-3">Thank you</p>
        <h2 className="font-display text-4xl text-ink mb-4">Inquiry Received</h2>
        <p className="text-dusk/70 font-body leading-relaxed mb-6">
          Your message has been sent to the studio at{' '}
          <span className="text-gold">{INQUIRY_EMAIL}</span>. Dr. Crawford or his
          studio will be in touch with pricing, availability, and next steps.
        </p>
        <p className="text-xs text-dusk/40 font-body italic">
          Reference subject: &ldquo;{subject}&rdquo;
        </p>
      </div>
    )
  }

  const labelCls = 'block text-xs text-dusk/55 tracking-widest uppercase mb-2 font-body'
  const inputCls = 'admin-input'

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 space-y-6">
      {selected && (
        <div className="flex items-start gap-4 border border-gold/20 bg-gold/5 p-4">
          {selected.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selected.image}
              alt={selected.title}
              className="w-20 h-24 object-cover border border-whisper"
            />
          )}
          <div className="min-w-0">
            <p className="text-xs text-gold tracking-widest uppercase font-body mb-1">
              Inquiring about
            </p>
            <p className="font-display text-xl text-ink leading-tight">{selected.title}</p>
            <p className="text-xs text-dusk/55 font-body mt-1">
              {selected.medium} · {selected.dimensions}
            </p>
            <p className="text-xs text-gold font-body mt-1">{priceDisplay(selected)}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Your name</label>
          <input
            value={form.name}
            onChange={e => set('name', e.target.value)}
            className={inputCls}
            placeholder="Jane Collector"
            autoComplete="name"
            required
          />
        </div>
        <div>
          <label className={labelCls}>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            className={inputCls}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Phone (optional)</label>
          <input
            value={form.phone}
            onChange={e => set('phone', e.target.value)}
            className={inputCls}
            placeholder="+1 (555) 000-0000"
            autoComplete="tel"
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Painting of interest</label>
          <select
            value={form.painting_slug}
            onChange={e => set('painting_slug', e.target.value)}
            className={`${inputCls} admin-select`}
          >
            <option value="">— No specific work / general inquiry —</option>
            {paintings.map(p => (
              <option key={p.id} value={p.slug}>
                {p.title}
                {p.year ? ` (${p.year})` : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Message</label>
          <textarea
            value={form.message}
            onChange={e => set('message', e.target.value)}
            className={inputCls}
            rows={5}
            placeholder="Tell the studio about your interest — pricing, shipping destination, framing preferences, or anything else."
            required
          />
        </div>
      </div>

      {error && <p className="text-blush text-sm font-body">{error}</p>}

      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
        <button type="submit" disabled={submitting} className="btn-portal disabled:opacity-50">
          {submitting ? 'Sending…' : 'Send Inquiry'}
        </button>
        <a
          href={`mailto:${INQUIRY_EMAIL}?subject=${encodeURIComponent(
            selected ? `Inquiry: ${selected.title}` : 'Inquiry from artcrawford.com'
          )}`}
          className="text-sm text-dusk/55 hover:text-gold transition-colors font-body"
        >
          Or email {INQUIRY_EMAIL} directly →
        </a>
      </div>
    </form>
  )
}
