// src/components/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative border-t border-whisper bg-vellum">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          <div>
            <h3 className="font-display text-3xl text-ink mb-2">Art Crawford</h3>
            <p className="text-xs text-dusk/50 tracking-[0.25em] uppercase mb-4">Dr. Clinton Crawford · Painter</p>
            <p className="text-sm text-dusk/70 font-body leading-relaxed max-w-xs">
              Original paintings in magical realism. Born in Guyana, painting from
              the equator out — into the threshold between waking and dream.
            </p>
          </div>

          <div>
            <h4 className="font-display text-xl text-gold mb-4 tracking-wide">Explore</h4>
            <ul className="space-y-2">
              {[
                { href: '/gallery', label: 'Gallery' },
                { href: '/gallery?series=Portals+to+Other+Dimensions', label: 'Portals Series' },
                { href: '/about', label: 'About the Artist' },
                { href: '/inquire', label: 'Inquire about a Work' },
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
              Each painting is offered at price upon request. Inquiries, commissions
              and studio visits are handled with care.
            </p>
            <a href="mailto:info@artcrawford.com"
              className="inline-flex items-center gap-2 text-sm text-blush hover:text-gold transition-colors duration-200">
              <span>info@artcrawford.com</span><span>→</span>
            </a>
            <p className="text-xs text-dusk/40 mt-4 font-body">Based in the United States. Ships worldwide.</p>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-dusk/40 font-body tracking-wide">
            © {new Date().getFullYear()} Art Crawford · Dr. Clinton Crawford. All rights reserved.
          </p>
          <p className="text-xs text-dusk/35 font-body italic">
            &ldquo;I have learnt to let go and not insist on controlling the outcome.&rdquo;
          </p>
        </div>
      </div>
    </footer>
  )
}
