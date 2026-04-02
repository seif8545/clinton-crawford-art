'use client'
// src/components/Navbar.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/components/CartProvider'

export default function Navbar() {
  const pathname = usePathname()
  const count = useCartStore(s => s.count)()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '/gallery', label: 'Gallery' },
    { href: '/about', label: 'Artist' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-parchment/95 backdrop-blur-md border-b border-whisper shadow-sm py-3'
        : 'bg-transparent py-6'
    }`}>
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        <Link href="/" className="group flex flex-col">
          <span className="font-display text-2xl text-ink tracking-wide group-hover:text-gold transition-colors duration-300">
            Clinton Crawford
          </span>
          <span className="text-xs text-dusk/60 tracking-[0.2em] uppercase font-body -mt-0.5">
            Portals to Other Dimensions
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {links.map(link => (
            <Link key={link.href} href={link.href}
              className={`font-display text-lg tracking-wider transition-colors duration-200 ${
                pathname === link.href ? 'text-gold' : 'text-ink/60 hover:text-ink'
              }`}>
              {link.label}
            </Link>
          ))}
          <Link href="/cart"
            className="relative flex items-center gap-2 text-ink/60 hover:text-gold transition-colors duration-200"
            aria-label="Shopping cart">
            <CartIcon />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-ink text-parchment text-xs font-body font-bold rounded-full">
                {count}
              </span>
            )}
          </Link>
        </div>

        <button className="md:hidden text-ink/60 hover:text-gold transition-colors"
          onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-parchment/98 backdrop-blur-md border-t border-whisper px-6 py-6 flex flex-col gap-5">
          {links.map(link => (
            <Link key={link.href} href={link.href}
              className="font-display text-2xl text-ink/80 hover:text-gold transition-colors"
              onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/cart"
            className="flex items-center gap-2 font-display text-2xl text-ink/80 hover:text-gold transition-colors"
            onClick={() => setMenuOpen(false)}>
            Cart {count > 0 && <span className="text-gold text-lg">({count})</span>}
          </Link>
        </div>
      )}
    </header>
  )
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}
function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}
function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
