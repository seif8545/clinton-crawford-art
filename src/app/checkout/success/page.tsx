// src/app/checkout/success/page.tsx
import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SuccessContent from './SuccessContent'

export const runtime = 'edge'

export default function SuccessPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 bg-parchment min-h-screen flex items-center">
        <Suspense fallback={null}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
