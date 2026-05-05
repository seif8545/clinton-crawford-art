// src/app/checkout/success/page.tsx
// Retained as a redirect — old order-confirmation links land at /inquire.
import { redirect } from 'next/navigation'

export const runtime = 'edge'

export default function SuccessPage() {
  redirect('/inquire')
}
