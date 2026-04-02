'use client'
// src/app/admin/clients/page.tsx
import { useState, useEffect } from 'react'
import type { Client } from '@/types'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<number | null>(null)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/clients')
    const data = await res.json()
    setClients(data.clients ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const filtered = clients.filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      c.first_name.toLowerCase().includes(q) ||
      c.last_name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    )
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-ink mb-1">Collectors</h1>
          <p className="text-sm text-dusk/50 font-body">{clients.length} clients on record</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="admin-input max-w-sm"
        />
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-vellum animate-pulse border border-whisper" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <p className="font-display text-2xl text-dusk/40">
            {search ? 'No clients match your search' : 'No clients yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(client => {
            const isOpen = expanded === client.id
            return (
              <div key={client.id} className="border border-whisper hover:border-gold/20 transition-colors">
                <div
                  className="flex flex-wrap items-center gap-4 px-5 py-4 cursor-pointer"
                  onClick={() => setExpanded(isOpen ? null : client.id)}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-vellum border border-gold/20 flex items-center justify-center shrink-0">
                    <span className="font-display text-gold text-lg">
                      {client.first_name[0]}{client.last_name[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-ink">{client.first_name} {client.last_name}</p>
                    <p className="text-xs text-dusk/50 font-body">{client.email}</p>
                  </div>
                  <div className="flex items-center gap-6 shrink-0 text-sm font-body">
                    <div className="text-center">
                      <p className="font-display text-xl text-ink">{client.order_count ?? 0}</p>
                      <p className="text-xs text-dusk/40 uppercase tracking-widest">Orders</p>
                    </div>
                    <div className="text-center">
                      <p className="font-display text-xl text-gold">${((client.total_spent ?? 0) as number).toLocaleString()}</p>
                      <p className="text-xs text-dusk/40 uppercase tracking-widest">Spent</p>
                    </div>
                  </div>
                  <span className="text-dusk/40 text-sm">{isOpen ? '▲' : '▼'}</span>
                </div>

                {/* Expanded details */}
                {isOpen && (
                  <div className="border-t border-whisper px-5 py-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm font-body">
                      <div>
                        <p className="text-xs text-dusk/40 tracking-widest uppercase mb-2">Contact</p>
                        <p className="text-dusk/70">{client.first_name} {client.last_name}</p>
                        <a href={`mailto:${client.email}`} className="text-gold hover:underline block">{client.email}</a>
                        {client.phone && <p className="text-dusk/50">{client.phone}</p>}
                      </div>
                      <div>
                        <p className="text-xs text-dusk/40 tracking-widest uppercase mb-2">Shipping Address</p>
                        {client.shipping_address ? (
                          <div className="text-dusk/60 text-xs space-y-0.5">
                            <p>{client.shipping_address.line1}</p>
                            {client.shipping_address.line2 && <p>{client.shipping_address.line2}</p>}
                            <p>{client.shipping_address.city}, {client.shipping_address.state} {client.shipping_address.zip}</p>
                            <p>{client.shipping_address.country}</p>
                          </div>
                        ) : <p className="text-dusk/40 text-xs">Not on file</p>}
                      </div>
                      <div>
                        <p className="text-xs text-dusk/40 tracking-widest uppercase mb-2">Client Since</p>
                        <p className="text-dusk/60 text-xs">{new Date(client.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        {client.notes && (
                          <>
                            <p className="text-xs text-dusk/40 tracking-widest uppercase mt-3 mb-1">Notes</p>
                            <p className="text-dusk/50 text-xs leading-relaxed">{client.notes}</p>
                          </>
                        )}
                      </div>
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
