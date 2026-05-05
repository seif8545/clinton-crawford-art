// src/app/admin/clients/page.tsx
// Collector CRM is folded into the inquiries view for now — every collector
// arrives via an inquiry first.
import { redirect } from 'next/navigation'

export const runtime = 'edge'

export default function ClientsPage() {
  redirect('/admin/inquiries')
}
