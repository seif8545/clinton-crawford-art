// src/app/api/clients/route.ts
export const runtime = 'edge'

import { NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getClients } from '@/lib/db'
import type { CloudflareEnv } from '@/types'

export async function GET() {
  try {
    const env = getRequestContext().env as CloudflareEnv
    const clients = await getClients(env.DB)
    return NextResponse.json({ clients })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
