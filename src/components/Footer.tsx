// src/components/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative border-t border-whisper bg-vellum">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          <div>
            <h3 className="font-display text-3xl text-ink mb-2">Clinton Crawford</h3>
            <p className="text-xs text-dusk/50 tracking-[0.25em] uppercase mb-4">Professor Emeritus · MFA · Artist</p>
            <p className="text-sm text-dusk/70 font-body leading-relaxed max-w-xs">
              Born in Guyana, South America. Works in magical realism exploring
              portals between real and imagined worlds.
            </p>
          </div>

          <div>
            <h4 className="font-display text-xl text-gold mb-4 tracking-wide">Explore</h4>
            <ul className="space-y-2">
              {[
                { href: '/gallery', label: 'Gallery' },
                { href: '/gallery?series=Portals+to+Other+Dimensions', label: 'Portals Series' },
                { href: '/about', label: 'About the Artist' },
                { href: '/cart', label: 'Cart' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-dusk/60 hover:text-ink text-sm font-body transition-colors duration-200 tracking-wide">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xl text-gold mb-4 tracking-wide">Acquire a Work</h4>
            <p className="text-sm text-dusk/60 font-body mb-4 leading-relaxed">
              Interested in a piece or a commission? All inquiries are handled with care.
            </p>
            <a href="mailto:inquiries@clintoncrawfordart.com"
              className="inline-flex items-center gap-2 text-sm text-blush hover:text-gold transition-colors duration-200">
              <span>inquiries@clintoncrawfordart.com</span><span>→</span>
            </a>
            <p className="text-xs text-dusk/40 mt-4 font-body">Based in the United States. Ships worldwide.</p>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-dusk/40 font-body tracking-wide">
            © {new Date().getFullYear()} Dr. Clinton Crawford. All rights reserved.
          </p>
          <p className="text-xs text-dusk/35 font-body italic">
            "I have learnt to let go and not insist on controlling the outcome."
          </p>
        </div>
      </div>
    </footer>
  )
}
