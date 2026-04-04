// src/app/api/orders/[id]/route.ts
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getOrderById, updateOrderStatus } from '@/lib/db'
import type { CloudflareEnv } from '@/types'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_: NextRequest, ctx: Ctx) {
    try {
        const { id } = await ctx.params
        // NEW (Add this)
        const env = process.env as any;        const order = await getOrderById(env.DB, parseInt(id))

        if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        return NextResponse.json({ order })
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
    try {
        const { id } = await ctx.params
        // NEW (Add this)
        const env = process.env as any;
        // FIX: Explicitly cast the JSON body to access the status property
        const body = (await request.json()) as { status?: string }
        const status = body.status

        const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded']

        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
        }

        await updateOrderStatus(env.DB, parseInt(id), status)
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    }
}