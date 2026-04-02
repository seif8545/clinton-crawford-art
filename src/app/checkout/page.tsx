'use client'

// 1. THIS MUST BE AT THE TOP (EXACTLY LIKE THIS)
export const runtime = 'edge';

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

// 2. Wrap searchParams logic in a separate component for Suspense
function SuccessContent() {
    const searchParams = useSearchParams()
    const orderNumber = searchParams.get('order')

    return (
        <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="mb-10">
                <span className="text-6xl mb-6 block">✨</span>
                <h1 className="font-display text-5xl text-ink mb-4">Order Confirmed</h1>
                <p className="text-lg text-dusk/60 font-body">
                    Thank you for your purchase. Your order <span className="text-gold font-bold">#{orderNumber}</span> has been received.
                </p>
            </div>

            <div className="glass-card p-8 mb-10">
                <p className="text-sm text-dusk/50 font-body leading-relaxed">
                    A confirmation email has been sent to your inbox. We will notify you once your artwork has been prepared and shipped.
                </p>
            </div>

            <Link href="/gallery" className="btn-portal">
                Return to Gallery
            </Link>
        </div>
    )
}

export default function CheckoutSuccessPage() {
    return (
        <>
            <Navbar />
            <main className="pt-40 pb-24 min-h-screen">
                <Suspense fallback={<div className="text-center font-body text-dusk/40">Loading order details...</div>}>
                    <SuccessContent />
                </Suspense>
            </main>
            <Footer />
        </>
    )
}