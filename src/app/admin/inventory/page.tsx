'use client'
// src/app/admin/inventory/page.tsx
import { useEffect, useRef, useState } from 'react'
import {
  getLivePaintings,
  saveLivePaintings,
  resetLivePaintings,
  autoSlug,
  nextId,
  priceDisplay,
  type Painting,
  type PaintingStatus,
} from '@/lib/paintings'

export const runtime = 'edge'

const STATUS_COLORS: Record<string, string> = {
  available: 'text-gold border-gold/30 bg-gold/5',
  sold: 'text-dusk border-dusk/30 bg-dusk/5',
  reserved: 'text-celestial border-celestial/30 bg-celestial/5',
  not_for_sale: 'text-dusk/40 border-whisper',
}

interface FormState {
  id: number | null
  title: string
  slug: string
  year: string
  medium: string
  dimensions: string
  description: string
  series: string
  price: string
  price_label: string
  status: PaintingStatus
  featured: boolean
  image: string
}

const EMPTY: FormState = {
  id: null,
  title: '',
  slug: '',
  year: '',
  medium: 'Acrylic on Canvas',
  dimensions: '',
  description: '',
  series: 'Portals to Other Dimensions',
  price: '',
  price_label: 'Price upon request',
  status: 'available',
  featured: false,
  image: '',
}

export default function InventoryPage() {
  const [paintings, setPaintings] = useState<Painting[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>({ ...EMPTY })
  const [msg, setMsg] = useState('')
  const [busyImage, setBusyImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPaintings(getLivePaintings())
    setLoading(false)
  }, [])

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  function openCreate() {
    setForm({ ...EMPTY })
    setShowForm(true)
  }

  function openEdit(p: Painting) {
    setForm({
      id: p.id,
      title: p.title,
      slug: p.slug,
      year: p.year?.toString() ?? '',
      medium: p.medium,
      dimensions: p.dimensions,
      description: p.description ?? '',
      series: p.series ?? '',
      price: p.price > 0 ? p.price.toString() : '',
      price_label: p.price_label ?? '',
      status: p.status,
      featured: !!p.featured,
      image: p.image,
    })
    setShowForm(true)
  }

  function persist(next: Painting[]) {
    setPaintings(next)
    saveLivePaintings(next)
  }

  function handleSave() {
    if (!form.title.trim()) {
      setMsg('Title is required.')
      return
    }
    if (!form.image.trim()) {
      setMsg('Please upload or paste an image URL for the painting.')
      return
    }

    const slug = (form.slug.trim() || autoSlug(form.title)).trim()
    const next: Painting = {
      id: form.id ?? nextId(paintings),
      slug,
      title: form.title.trim(),
      year: form.year ? parseInt(form.year, 10) : null,
      medium: form.medium.trim() || 'Acrylic on Canvas',
      dimensions: form.dimensions.trim(),
      description: form.description.trim() || null,
      series: form.series.trim() || null,
      price: form.price ? parseFloat(form.price) : 0,
      price_label: form.price_label.trim() || null,
      status: form.status,
      featured: form.featured ? 1 : 0,
      sort_order: form.id ?? nextId(paintings),
      image: form.image.trim(),
    }

    let updated: Painting[]
    if (form.id) {
      updated = paintings.map(p => (p.id === form.id ? next : p))
    } else {
      updated = [...paintings, next]
    }
    persist(updated)
    setMsg(`Saved “${next.title}”.`)
    setShowForm(false)
  }

  function handleDelete(p: Painting) {
    if (!confirm(`Delete "${p.title}"? This only affects your local browser.`)) return
    persist(paintings.filter(x => x.id !== p.id))
    setMsg(`Removed “${p.title}”.`)
  }

  function handleResetSeed() {
    if (!confirm('Reset to the original 31 paintings? Your local edits will be lost.')) return
    resetLivePaintings()
    setPaintings(getLivePaintings())
    setMsg('Reset to original paintings.')
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify({ paintings }, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'paintings.json'
    a.click()
    URL.revokeObjectURL(url)
    setMsg('Exported paintings.json — replace src/data/paintings.json to publish.')
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as { paintings?: Painting[] } | Painting[]
        const list = Array.isArray(parsed) ? parsed : parsed.paintings
        if (!Array.isArray(list)) throw new Error()
        persist(list)
        setMsg(`Imported ${list.length} paintings.`)
      } catch {
        setMsg('Could not parse JSON file.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusyImage(true)
    try {
      // Read as data URL — works on Cloudflare edge, no upload server needed.
      const dataUrl: string = await new Promise((resolve, reject) => {
        const r = new FileReader()
        r.onload = () => resolve(String(r.result))
        r.onerror = reject
        r.readAsDataURL(file)
      })
      set('image', dataUrl)
      setMsg(`Loaded image (${(file.size / 1024).toFixed(0)} KB).`)
    } catch {
      setMsg('Could not read the image file.')
    } finally {
      setBusyImage(false)
      e.target.value = ''
    }
  }

  const inputCls = 'admin-input'
  const labelCls = 'block text-xs text-dusk/55 tracking-widest uppercase mb-2 font-body'

  return (
    <div className="p-8">
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="font-display text-4xl text-ink mb-1">Paintings</h1>
          <p className="text-sm text-dusk/55 font-body">{paintings.length} works in your local catalogue</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={openCreate} className="btn-portal">+ Add Painting</button>
          <button
            onClick={handleExport}
            className="text-xs text-dusk/65 hover:text-ink px-4 py-2 border border-whisper hover:border-gold/30 transition-colors uppercase tracking-widest font-body"
          >
            Export JSON
          </button>
          <label className="text-xs text-dusk/65 hover:text-ink px-4 py-2 border border-whisper hover:border-gold/30 transition-colors uppercase tracking-widest font-body cursor-pointer">
            Import JSON
            <input type="file" accept="application/json" onChange={handleImport} className="hidden" />
          </label>
          <button
            onClick={handleResetSeed}
            className="text-xs text-dusk/65 hover:text-blush px-4 py-2 border border-whisper hover:border-blush/30 transition-colors uppercase tracking-widest font-body"
          >
            Reset to Seed
          </button>
        </div>
      </div>

      <div className="border border-gold/15 bg-gold/5 px-5 py-4 mb-6 text-xs text-dusk/65 font-body leading-relaxed">
        Edits are saved to your browser&rsquo;s local storage so you can preview changes immediately.
        To publish them on the live site, click <span className="text-gold">Export JSON</span>{' '}
        and replace <code>src/data/paintings.json</code> in the repo, then re-deploy.
      </div>

      {msg && (
        <p className={`mb-4 text-sm font-body ${msg.toLowerCase().includes('could not') || msg.toLowerCase().includes('required') ? 'text-blush' : 'text-gold'}`}>
          {msg}
        </p>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/30 backdrop-blur-sm overflow-y-auto py-10 px-4">
          <div className="w-full max-w-3xl glass-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl text-gold">
                {form.id ? 'Edit Painting' : 'Add New Painting'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-dusk/45 hover:text-ink">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className={labelCls}>Title</label>
                <input
                  value={form.title}
                  onChange={e => {
                    set('title', e.target.value)
                    if (!form.id) set('slug', autoSlug(e.target.value))
                  }}
                  className={inputCls}
                  placeholder="Threshold of Returning Light"
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>URL Slug</label>
                <input value={form.slug} onChange={e => set('slug', e.target.value)} className={inputCls} placeholder="threshold-of-returning-light" />
              </div>

              <div>
                <label className={labelCls}>Year</label>
                <input value={form.year} onChange={e => set('year', e.target.value)} className={inputCls} placeholder="2024" />
              </div>
              <div>
                <label className={labelCls}>Medium</label>
                <input value={form.medium} onChange={e => set('medium', e.target.value)} className={inputCls} placeholder="Acrylic on Canvas" />
              </div>
              <div>
                <label className={labelCls}>Dimensions</label>
                <input value={form.dimensions} onChange={e => set('dimensions', e.target.value)} className={inputCls} placeholder="24 × 30 in (61 × 76 cm)" />
              </div>
              <div>
                <label className={labelCls}>Series</label>
                <input value={form.series} onChange={e => set('series', e.target.value)} className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Status</label>
                <select
                  value={form.status}
                  onChange={e => set('status', e.target.value as PaintingStatus)}
                  className={`${inputCls} admin-select`}
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                  <option value="not_for_sale">Not for sale</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 mb-2">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={e => set('featured', e.target.checked)}
                    className="accent-gold w-4 h-4"
                  />
                  <span className="text-sm text-dusk/65 font-body">Feature on homepage</span>
                </label>
              </div>

              <div>
                <label className={labelCls}>Numeric Price (optional)</label>
                <input value={form.price} onChange={e => set('price', e.target.value)} className={inputCls} placeholder="3800" />
                <p className="text-xs text-dusk/45 mt-1 font-body">Leave blank to show the label below.</p>
              </div>
              <div>
                <label className={labelCls}>Price Label</label>
                <input value={form.price_label} onChange={e => set('price_label', e.target.value)} className={inputCls} placeholder="Price upon request" />
              </div>

              <div className="md:col-span-2">
                <label className={labelCls}>Description</label>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  className={inputCls}
                  rows={4}
                  placeholder="A short note about the work."
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelCls}>Image</label>
                <div className="flex flex-col md:flex-row gap-3 items-stretch">
                  <input
                    value={form.image.startsWith('data:') ? '(uploaded image)' : form.image}
                    onChange={e => set('image', e.target.value)}
                    className={inputCls}
                    placeholder="/images/painting-1.jpeg or https://..."
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-dusk/65 hover:text-ink px-4 py-2 border border-whisper hover:border-gold/30 transition-colors uppercase tracking-widest font-body whitespace-nowrap"
                    disabled={busyImage}
                  >
                    {busyImage ? 'Reading…' : 'Upload File'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageFile}
                  />
                </div>
                <p className="text-xs text-dusk/45 mt-2 font-body">
                  You can paste a path under <code>/images/</code>, paste any public URL, or upload a
                  file directly — the file is embedded in your local catalogue.
                </p>
                {form.image && (
                  <div className="mt-3 w-32 aspect-[3/4] border border-whisper bg-vellum overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={handleSave} className="btn-portal">
                {form.id ? 'Save Changes' : 'Add Painting'}
              </button>
              <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-vellum animate-pulse border border-whisper" />
          ))}
        </div>
      ) : paintings.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <p className="font-display text-2xl text-dusk/40 mb-4">No paintings yet</p>
          <button onClick={openCreate} className="btn-portal">Add Your First Work</button>
        </div>
      ) : (
        <div className="border border-whisper overflow-x-auto bg-parchment/40">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-whisper bg-vellum/40">
                {['Image', 'Title', 'Series', 'Year', 'Price', 'Status', 'Featured', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-dusk/45 tracking-widest uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paintings.map(p => (
                <tr key={p.id} className="border-b border-whisper hover:bg-vellum transition-colors group">
                  <td className="px-4 py-3">
                    <div className="w-12 h-14 bg-vellum border border-whisper overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-ink font-body">{p.title}</p>
                    <p className="text-dusk/45 text-xs">/{p.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-dusk/55">{p.series ?? '—'}</td>
                  <td className="px-4 py-3 text-dusk/55">{p.year ?? '—'}</td>
                  <td className="px-4 py-3 text-gold font-body">{priceDisplay(p)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 border capitalize ${STATUS_COLORS[p.status] ?? ''}`}>
                      {p.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gold">{p.featured ? '★' : ''}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="text-xs text-dusk/55 hover:text-gold px-2 py-1 border border-whisper hover:border-gold/30 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="text-xs text-dusk/55 hover:text-blush px-2 py-1 border border-whisper hover:border-blush/30 transition-colors"
                      >
                        Delete
                      </button>
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
