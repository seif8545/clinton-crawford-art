// src/app/admin/orders/page.tsx
// The order/payment pipeline has been replaced by an inquiry flow.
// Old admin links are forwarded to the new inquiries view.
import { redirect } from 'next/navigation'

export const runtime = 'edge'

export default function OrdersPage() {
  redirect('/admin/inquiries')
}
