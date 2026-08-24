'use client'
// src/components/admin/AdminNav.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/admin', label: 'Overview', icon: '◈' },
  { href: '/admin/inventory', label: 'Paintings', icon: '⊞' },
  { href: '/admin/orders', label: 'Orders', icon: '🖼' },
  { href: '/admin/inquiries', label: 'Inquiries', icon: '✉' },
]

export default function AdminNav() {
  const path = usePathname()

  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    window.location.href = '/admin/login'
  }

  return (
    <aside className="w-full md:w-56 md:shrink-0 border-b md:border-b-0 md:border-r border-whisper md:min-h-screen flex flex-col bg-vellum/40">
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:p-6 md:border-b border-whisper">
        <div className="min-w-0">
          <p className="font-display text-lg text-gold leading-none truncate">Studio Admin</p>
          <p className="text-xs text-dusk/45 font-body tracking-widest uppercase mt-0.5 truncate">
            Art Crawford
          </p>
        </div>
        {/* Mobile-only sign out (desktop keeps it in the footer below) */}
        <button
          onClick={logout}
          className="md:hidden shrink-0 text-xs text-dusk/45 hover:text-blush transition-colors font-body"
        >
          Sign out
        </button>
      </div>

      <nav className="flex md:flex-col md:flex-1 gap-1 px-2 pb-2 md:p-4 overflow-x-auto">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 md:gap-3 whitespace-nowrap px-4 py-2.5 md:py-3 text-sm font-body transition-all duration-200 md:border-l-2 ${
              path === link.href
                ? 'text-gold bg-gold/8 md:border-gold'
                : 'text-dusk/65 hover:text-ink hover:bg-ink/5 md:border-transparent'
            }`}
          >
            <span className="text-base">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="hidden md:flex flex-col gap-3 p-4 border-t border-whisper">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-dusk/45 hover:text-dusk/70 transition-colors font-body"
        >
          <span>←</span> View Public Site
        </Link>
        <button
          onClick={logout}
          className="text-left text-xs text-dusk/45 hover:text-blush transition-colors font-body"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
