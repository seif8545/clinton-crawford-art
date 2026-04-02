'use client'
// src/app/admin/login/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      setError('Incorrect password.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-display text-4xl text-gold mb-1">Studio</p>
          <p className="text-xs text-dusk/40 tracking-[0.3em] uppercase font-body">Admin Access</p>
        </div>
        <div className="glass-card p-8 space-y-5">
          <div>
            <label className="block text-xs text-dusk/50 tracking-widest uppercase mb-2 font-body">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="admin-input"
              placeholder="Enter admin password"
              autoFocus
            />
          </div>
          {error && <p className="text-blush-deep text-sm font-body">{error}</p>}
          <button onClick={handleLogin} disabled={loading} className="btn-portal w-full justify-center disabled:opacity-50">
            {loading ? 'Verifying…' : 'Enter Studio'}
          </button>
        </div>
      </div>
    </div>
  )
}
