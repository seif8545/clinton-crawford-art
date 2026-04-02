'use client'
// src/app/checkout/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/components/CartProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface FormData {
    first_name: string; last_name: string; email: string; phone: string
    line1: string; line2: string; city: string; state: string; zip: string; country: string
    card_number: string; card_expiry: string; card_cvc: string
}

const empty: FormData = {
    first_name: '', last_name: '', email: '', phone: '',
    line1: '', line2: '', city: '', state: '', zip: '', country: 'United States',
    card_number: '', card_expiry: '', card_cvc: '',
}

export default function CheckoutPage() {
    const router = useRouter()
    const { items, total, clearCart } = useCartStore()
    const cartTotal = total()
    const [form, setForm] = useState<FormData>(empty)
    const [step, setStep] = useState<'info' | 'payment'>('info')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    if (items.length === 0) {
        return (
            <>
                <Navbar />
                <main className="pt-28 pb-24 min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <p className="font-display text-3xl text-dusk/50 mb-6">Your cart is empty</p>
                        <Link href="/gallery" className="btn-portal">Browse Gallery</Link>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    function set(field: keyof FormData, value: string) {
        setForm(f => ({ ...f, [field]: value }))
    }

    async function handleSubmit() {
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: form.first_name,
                    last_name: form.last_name,
                    email: form.email,
                    phone: form.phone,
                    shipping_address: {
                        line1: form.line1, line2: form.line2,
                        city: form.city, state: form.state,
                        zip: form.zip, country: form.country,
                    },
                    items: items.map(i => ({
                        artwork_id: i.artwork_id,
                        title: i.title,
                        price: i.price,
                        quantity: i.quantity,
                    })),
                }),
            })

            if (!res.ok) throw new Error('Order failed')

            // THE FIX: Explicitly cast the JSON response to bypass the 'unknown' type error
            const { order_number } = (await res.json()) as { order_number: string }

            clearCart()
            router.push(`/checkout/success?order=${order_number}`)
        } catch (err) {
            console.error('Checkout error:', err)
            setError('Something went wrong. Please try again or contact us directly.')
        } finally {
            setLoading(false)
        }
    }

    const inputClass = 'admin-input'

    return (
        <>
            <Navbar />
            <main className="pt-28 pb-24 min-h-screen">
                <div className="max-w-5xl mx-auto px-6">

                    <div className="mb-10">
                        <p className="text-xs text-gold tracking-[0.3em] uppercase font-body mb-3">Final Step</p>
                        <h1 className="font-display text-5xl text-ink">Checkout</h1>
                    </div>

                    {/* Step tabs */}
                    <div className="flex items-center gap-6 mb-10 border-b border-whisper pb-4">
                        {(['info', 'payment'] as const).map((s, i) => (
                            <button key={s} onClick={() => s === 'payment' && setStep('payment')}
                                className={`font-display text-lg transition-colors ${step === s ? 'text-gold' : 'text-dusk/40'}`}>
                                {i + 1}. {s === 'info' ? 'Your Details' : 'Payment'}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

                        {/* Form */}
                        <div className="lg:col-span-3 space-y-8">

                            {step === 'info' && (
                                <>
                                    <div>
                                        <h2 className="font-display text-2xl text-ink mb-5">Contact</h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="block text-xs text-dusk/50 tracking-widest uppercase mb-2 font-body">First Name</label><input value={form.first_name} onChange={e => set('first_name', e.target.value)} className={inputClass} placeholder="Clinton" /></div>
                                            <div><label className="block text-xs text-dusk/50 tracking-widest uppercase mb-2 font-body">Last Name</label><input value={form.last_name} onChange={e => set('last_name', e.target.value)} className={inputClass} placeholder="Crawford" /></div>
                                            <div className="col-span-2"><label className="block text-xs text-dusk/50 tracking-widest uppercase mb-2 font-body">Email</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputClass} placeholder="you@example.com" /></div>
                                            <div className="col-span-2"><label className="block text-xs text-dusk/50 tracking-widest uppercase mb-2 font-body">Phone (optional)</label><input value={form.phone} onChange={e => set('phone', e.target.value)} className={inputClass} placeholder="+1 (555) 000-0000" /></div>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="font-display text-2xl text-ink mb-5">Shipping Address</h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2"><label className="block text-xs text-dusk/50 tracking-widest uppercase mb-2 font-body">Street Address</label><input value={form.line1} onChange={e => set('line1', e.target.value)} className={inputClass} placeholder="123 Gallery Lane" /></div>
                                            <div className="col-span-2"><label className="block text-xs text-dusk/50 tracking-widest uppercase mb-2 font-body">Apt, Suite (optional)</label><input value={form.line2} onChange={e => set('line2', e.target.value)} className={inputClass} /></div>
                                            <div><label className="block text-xs text-dusk/50 tracking-widest uppercase mb-2 font-body">City</label><input value={form.city} onChange={e => set('city', e.target.value)} className={inputClass} placeholder="New York" /></div>
                                            <div><label className="block text-xs text-dusk/50 tracking-widest uppercase mb-2 font-body">State</label><input value={form.state} onChange={e => set('state', e.target.value)} className={inputClass} placeholder="NY" /></div>
                                            <div><label className="block text-xs text-dusk/50 tracking-widest uppercase mb-2 font-body">ZIP</label><input value={form.zip} onChange={e => set('zip', e.target.value)} className={inputClass} placeholder="10001" /></div>
                                            <div><label className="block text-xs text-dusk/50 tracking-widest uppercase mb-2 font-body">Country</label><input value={form.country} onChange={e => set('country', e.target.value)} className={inputClass} /></div>
                                        </div>
                                    </div>

                                    <button onClick={() => setStep('payment')} className="btn-portal w-full justify-center">
                                        Continue to Payment →
                                    </button>
                                </>
                            )}

                            {step === 'payment' && (
                                <>
                                    <div>
                                        <h2 className="font-display text-2xl text-ink mb-2">Payment</h2>
                                        <p className="text-sm text-dusk/50 font-body mb-5">
                                            This is a simulated checkout — no real charge will occur.
                                        </p>
                                        <div className="space-y-4">
                                            <div><label className="block text-xs text-dusk/50 tracking-widest uppercase mb-2 font-body">Card Number</label><input value={form.card_number} onChange={e => set('card_number', e.target.value)} className={inputClass} placeholder="4242 4242 4242 4242" maxLength={19} /></div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div><label className="block text-xs text-dusk/50 tracking-widest uppercase mb-2 font-body">Expiry</label><input value={form.card_expiry} onChange={e => set('card_expiry', e.target.value)} className={inputClass} placeholder="MM / YY" maxLength={7} /></div>
                                                <div><label className="block text-xs text-dusk/50 tracking-widest uppercase mb-2 font-body">CVC</label><input value={form.card_cvc} onChange={e => set('card_cvc', e.target.value)} className={inputClass} placeholder="123" maxLength={4} /></div>
                                            </div>
                                        </div>
                                    </div>

                                    {error && <p className="text-blush-deep text-sm font-body">{error}</p>}

                                    <button onClick={handleSubmit} disabled={loading} className="btn-portal w-full justify-center disabled:opacity-50">
                                        {loading ? 'Processing…' : `Place Order · $${cartTotal.toLocaleString()}`}
                                    </button>
                                    <button onClick={() => setStep('info')} className="block text-center text-sm text-dusk/40 hover:text-dusk/65 transition-colors w-full font-body">
                                        ← Back to details
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Summary sidebar */}
                        <div className="lg:col-span-2">
                            <div className="glass-card p-6 sticky top-28">
                                <h3 className="font-display text-xl text-gold mb-5">Your Order</h3>
                                <div className="space-y-4 mb-5">
                                    {items.map(item => (
                                        <div key={item.artwork_id} className="flex justify-between gap-3 text-sm">
                                            <span className="text-dusk/70 font-body leading-tight line-clamp-2">{item.title}</span>
                                            <span className="text-ink font-body shrink-0">${item.price.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-whisper pt-4 flex justify-between">
                                    <span className="font-display text-lg text-ink">Total</span>
                                    <span className="font-display text-xl text-gold">${cartTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}