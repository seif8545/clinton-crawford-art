'use client';
// src/app/checkout/success/SuccessContent.tsx
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessContent() {
    const searchParams = useSearchParams();
    const order = searchParams.get('order');

    return (
        <div className="max-w-xl mx-auto px-6 text-center">
            <div className="mb-10">
                <span className="text-6xl mb-6 block">✨</span>
                <h1 className="font-display text-5xl text-ink mb-4">Order Received</h1>
                <p className="text-lg text-dusk/60 font-body">
                    Order <span className="text-gold font-bold">#{order || '...'}</span> has been placed successfully.
                </p>
            </div>

            <div className="glass-card p-8 border border-whisper mb-10">
                <p className="text-sm text-dusk/50 font-body leading-relaxed">
                    A confirmation email will be sent shortly. We will contact you once your artwork is ready for shipping.
                </p>
            </div>

            <Link href="/gallery" className="btn-portal inline-flex">
                Continue Browsing
            </Link>
        </div>
    );
}