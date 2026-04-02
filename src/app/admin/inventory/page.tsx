'use client'
// src/app/admin/inventory/page.tsx
import { useState, useEffect, useRef } from 'react'
import type { Artwork } from '@/types'
import Link from 'next/link'

const STATUS_COLORS: Record<string, string> = {
  available: 'text-gold border-gold/30 bg-gold/5',
  sold: 'text-blush border-mauve/30 bg-mauve/5',
  reserved: 'text-celestial border-celestial/30 bg-celestial/5',
  not_for_sale: 'text-dusk/40 border-ivory/10',
}

const EMPTY_FORM = {
  title: '', slug: '', year: '', medium: 'Acrylic on Canvas', dimensions: '',
  description: '', series: 'Portals to Other Dimensions', price: '',
  status: 'available', featured: false,
}

export default function InventoryPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [msg, setMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/artworks')
    const data = await res.json()
    setArtworks(data.artworks ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function set(k: string, v: string | boolean) { setForm(f => ({ ...f, [k]: v })) }

  function autoSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  function openCreate() {
    setForm({ ...EMPTY_FORM })
    setEditId(null)
    setImageFile(null)
    setShowForm(true)
  }

  function openEdit(a: Artwork) {
    setForm({
      title: a.title, slug: a.slug, year: a.year?.toString() ?? '',
      medium: a.medium, dimensions: a.dimensions, description: a.description ?? '',
      series: a.series ?? '', price: a.price.toString(),
      status: a.status, featured: !!a.featured,
    })
    setEditId(a.id)
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    setMsg('')
    try {
      const payload = {
        ...form,
        year: form.year ? parseInt(form.year) : null,
        price: parseFloat(form.price),
        featured: form.featured ? 1 : 0,
      }
      let artworkId = editId

      if (editId) {
        await fetch(`/api/artworks/${editId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        const res = await fetch('/api/artworks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const d = await res.json()
        artworkId = d.id
      }

      // Upload image if selected
      if (imageFile && artworkId) {
        const fd = new FormData()
        fd.append('file', imageFile)
        fd.append('artwork_id', artworkId.toString())
        fd.append('is_primary', '1')
        await fetch('/api/upload', { method: 'POST', body: fd })
      }

      setMsg('Saved successfully')
      setShowForm(false)
      load()
    } catch {
      setMsg('Error saving. Please try again.')
    }
    setSaving(false)
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    await fetch(`/api/artworks/${id}`, { method: 'DELETE' })
    load()
  }

  const inputCls = 'admin-input'
  const labelCls = 'block text-xs text-dusk/50 tracking-widest uppercase mb-2 font-body'

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-ink mb-1">Inventory</h1>
          <p className="text-sm text-dusk/50 font-body">{artworks.length} works total</p>
        </div>
        <button onClick={openCreate} className="btn-portal">+ Add Work</button>
      </div>

      {msg && <p className={`mb-4 text-sm font-body ${msg.includes('Error') ? 'text-blush-deep' : 'text-gold'}`}>{msg}</p>}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-parchment/90 backdrop-blur-sm overflow-y-auto py-10 px-4">
          <div className="w-full max-w-2xl glass-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl text-gold">{editId ? 'Edit Work' : 'Add New Work'}</h2>
              <button onClick={() => setShowForm(false)} className="text-dusk/40 hover:text-ink">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2"><label className={labelCls}>Title</label>
                <input value={form.title} onChange={e => { set('title', e.target.value); if (!editId) set('slug', autoSlug(e.target.value)) }} className={inputCls} /></div>
              <div className="col-span-2"><label className={labelCls}>Slug</label>
                <input value={form.slug} onChange={e => set('slug', e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Year</label><input value={form.year} onChange={e => set('year', e.target.value)} className={inputCls} placeholder="2024" /></div>
              <div><label className={labelCls}>Price ($)</label><input value={form.price} onChange={e => set('price', e.target.value)} className={inputCls} placeholder="3800" /></div>
              <div><label className={labelCls}>Medium</label><input value={form.medium} onChange={e => set('medium', e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Dimensions</label><input value={form.dimensions} onChange={e => set('dimensions', e.target.value)} className={inputCls} placeholder="24 × 30 in" /></div>
              <div><label className={labelCls}>Series</label><input value={form.series} onChange={e => set('series', e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)} className={`${inputCls} admin-select`}>
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                  <option value="not_for_sale">Not for Sale</option>
                </select>
              </div>
              <div className="col-span-2"><label className={labelCls}>Description</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} className={inputCls} rows={4} /></div>
              <div className="col-span-2">
                <label className={labelCls}>Primary Image</label>
                <input ref={fileRef} type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] ?? null)} className="hidden" />
                <button onClick={() => fileRef.current?.click()} className="btn-ghost text-sm py-2 px-4">
                  {imageFile ? `✓ ${imageFile.name}` : 'Choose Image'}
                </button>
              </div>
              <div className="col-span-2 flex items-center gap-3">
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="accent-gold w-4 h-4" />
                <label htmlFor="featured" className="text-sm text-ink/60 font-body">Feature on homepage</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving} className="btn-portal disabled:opacity-50">
                {saving ? 'Saving…' : 'Save Work'}
              </button>
              <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-vellum animate-pulse border border-whisper" />)}</div>
      ) : artworks.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <p className="font-display text-2xl text-dusk/40 mb-4">No artworks yet</p>
          <button onClick={openCreate} className="btn-portal">Add First Work</button>
        </div>
      ) : (
        <div className="border border-whisper overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-whisper">
                {['Title', 'Series', 'Medium', 'Price', 'Status', 'Featured', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-dusk/40 tracking-widest uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {artworks.map(a => (
                <tr key={a.id} className="border-b border-whisper hover:bg-ink/2 transition-colors group">
                  <td className="px-4 py-3">
                    <p className="text-ink font-body">{a.title}</p>
                    <p className="text-dusk/40 text-xs">{a.year ?? 'n.d.'} · {a.dimensions}</p>
                  </td>
                  <td className="px-4 py-3 text-dusk/50">{a.series ?? '—'}</td>
                  <td className="px-4 py-3 text-dusk/50">{a.medium}</td>
                  <td className="px-4 py-3 text-gold font-body">${a.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 border capitalize ${STATUS_COLORS[a.status] ?? ''}`}>{a.status}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-gold">{a.featured ? '★' : ''}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(a)} className="text-xs text-dusk/60 hover:text-gold px-2 py-1 border border-whisper hover:border-gold/30 transition-colors">Edit</button>
                      <button onClick={() => handleDelete(a.id, a.title)} className="text-xs text-dusk/60 hover:text-blush-deep px-2 py-1 border border-whisper hover:border-blush/30 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
