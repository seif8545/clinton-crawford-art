// src/app/api/clients/route.ts
export const runtime = 'edge'

import { NextResponse } from 'next/server'
import { getClients } from '@/lib/db'
import type { CloudflareEnv } from '@/types'

export async function GET() {
  try {
      // NEW (Add this)
      const env = process.env as any;
      const clients = await getClients(env.DB)
    return NextResponse.json({ clients })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
