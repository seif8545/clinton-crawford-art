// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/components/CartProvider'

export const metadata: Metadata = {
  title: {
    default: 'Dr. Clinton Crawford | Portals to Other Dimensions',
    template: '%s | Clinton Crawford Art',
  },
  description:
    'Original paintings by Dr. Clinton Crawford — Professor Emeritus, MFA. Works in magical realism exploring the threshold between the real and the otherworldly. Born in Guyana.',
  keywords: ['Clinton Crawford', 'magical realism', 'fine art', 'paintings', 'Guyana artist', 'Portals to Other Dimensions'],
  openGraph: {
    type: 'website',
    siteName: 'Clinton Crawford Art',
    title: 'Dr. Clinton Crawford | Portals to Other Dimensions',
    description: 'Original paintings exploring the threshold between real and imagined worlds.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Lora:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font-cormorant: 'Cormorant Garamond', Georgia, serif;
            --font-lora: 'Lora', Georgia, serif;
            --font-mono: 'JetBrains Mono', monospace;
          }
        `}</style>
      </head>
      <body className="bg-parchment text-ink font-body antialiased">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
