// src/lib/admin-auth.ts
import type { NextRequest } from 'next/server'

/** True when the request carries a valid admin session cookie. */
export function isAdmin(request: NextRequest): boolean {
  return request.cookies.get('admin_session')?.value === 'authenticated'
}
