'use client'
// src/components/admin/AdminNav.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/admin', label: 'Analytics', icon: '◈' },
  { href: '/admin/inventory', label: 'Inventory', icon: '⊞' },
  { href: '/admin/orders', label: 'Orders', icon: '◉' },
  { href: '/admin/clients', label: 'Clients', icon: '◎' },
]

export default function AdminNav() {
  const path = usePathname()
  return (
    <aside className="w-56 shrink-0 border-r border-whisper min-h-screen flex flex-col">
      <div className="p-6 border-b border-whisper">
        <p className="font-display text-lg text-gold">Studio Admin</p>
        <p className="text-xs text-dusk/40 font-body tracking-widest uppercase mt-0.5">Clinton Crawford</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-body transition-all duration-200 rounded-none ${
              path === link.href
                ? 'text-gold bg-gold/8 border-l-2 border-gold'
                : 'text-dusk/60 hover:text-ink hover:bg-ink/3 border-l-2 border-transparent'
            }`}
          >
            <span className="text-base">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-whisper">
        <Link href="/" className="flex items-center gap-2 text-xs text-dusk/35 hover:text-dusk/60 transition-colors font-body">
          <span>←</span> View Public Site
        </Link>
      </div>
    </aside>
  )
}
