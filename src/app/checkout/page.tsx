// src/app/checkout/page.tsx
// Checkout has been retired — buyers now submit a private inquiry instead.
import { redirect } from 'next/navigation'

export const runtime = 'edge'

export default function CheckoutPage() {
  redirect('/inquire')
}
