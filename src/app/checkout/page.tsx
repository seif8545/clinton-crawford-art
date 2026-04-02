// src/app/checkout/success/page.tsx
export const runtime = 'edge';

import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SuccessContent from './SuccessContent';

export default function SuccessPage() {
    return (
        <>
            <Navbar />
            <main className="pt-32 pb-24 min-h-screen flex items-center justify-center">
                <Suspense fallback={<div className="text-center font-body text-dusk/40 animate-pulse">Verifying Order...</div>}>
                    <SuccessContent />
                </Suspense>
            </main>
            <Footer />
        </>
    );
}