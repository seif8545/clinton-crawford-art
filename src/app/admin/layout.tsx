// src/app/admin/layout.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminNav from '@/components/admin/AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
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
