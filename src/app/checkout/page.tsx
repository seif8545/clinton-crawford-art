// src/app/checkout/success/page.tsx

import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SuccessContent from './SuccessContent';

export const runtime = 'edge';

export default function SuccessPage() {
    return (
        <>
            <Navbar />
            <main className="pt-32 pb-24 min-h-screen flex items-center justify-center">
                <Suspense fallback={<div className="text-center font-body text-dusk/40 animate-pulse">Loading order details...</div>}>
                    <SuccessContent />
                </Suspense>
            </main>
            <Footer />
        </>
    );
}