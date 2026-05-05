// src/app/api/clients/route.ts
// Collector CRM has been retired. Inquiries are the new collector-of-record.
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    {
      error:
        'The collector CRM is being rebuilt around inquiries. See /admin/inquiries for the new view.',
    },
    { status: 410 }
  )
}
