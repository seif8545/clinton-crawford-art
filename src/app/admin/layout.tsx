// src/app/admin/layout.tsx
import { cookies } from 'next/headers'
import AdminNav from '@/components/admin/AdminNav'

export const runtime = 'edge'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  
  // Check if they are logged in, but DO NOT redirect if they aren't!
  const isAuthenticated = session?.value === 'authenticated'

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-parchment text-ink">
      {/* Only show the admin navigation if they are actually logged in.
          Top bar on mobile, left sidebar on desktop. */}
      {isAuthenticated && <AdminNav />}

      <div className="flex-1 min-w-0 overflow-auto">
        {children}
      </div>
    </div>
  )
}