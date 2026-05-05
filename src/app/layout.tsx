// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Art Crawford | Original Paintings by Dr. Clinton Crawford',
    template: '%s | Art Crawford',
  },
  description:
    'Art Crawford — the painting practice of Dr. Clinton Crawford. Original works in magical realism exploring the threshold between the real and the otherworldly. Born in Guyana.',
  keywords: [
    'Art Crawford',
    'Clinton Crawford',
    'magical realism',
    'fine art',
    'original paintings',
    'Guyana artist',
    'Portals to Other Dimensions',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Art Crawford',
    title: 'Art Crawford | Original Paintings by Dr. Clinton Crawford',
    description:
      'Original paintings exploring the threshold between real and imagined worlds.',
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
        {children}
      </body>
    </html>
  )
}
