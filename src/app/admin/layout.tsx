// src/app/admin/layout.tsx
export const runtime = 'edge'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminNav from '@/components/admin/AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Simple cookie-based auth — set via /api/admin/login
  const cookieStore = cookies()
  const session = cookieStore.get('admin_session')
  if (!session?.value || session.value !== 'authenticated') {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-parchment text-ink">
      <AdminNav />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}
