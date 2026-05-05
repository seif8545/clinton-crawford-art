// src/app/api/admin/login/route.ts
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_PASSWORD = 'studio'

export async function POST(request: NextRequest) {
  try {
    const env = process.env as Record<string, string | undefined>
    const expected = env.ADMIN_PASSWORD ?? DEFAULT_PASSWORD

    const { password } = (await request.json()) as { password?: string }
    if (!password || password !== expected) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin_session')
  return response
}
