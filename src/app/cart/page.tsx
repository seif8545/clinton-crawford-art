// src/app/cart/page.tsx
// The cart-based purchase flow has been replaced by an inquiry flow.
// This stub redirects any leftover links to /inquire.
import { redirect } from 'next/navigation'

export const runtime = 'edge'

export default function CartPage() {
  redirect('/inquire')
}
