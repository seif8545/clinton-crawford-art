// src/app/api/orders/[id]/route.ts
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server'
import { getOrderById, updateOrderStatus } from '@/lib/db'
import type { CloudflareEnv } from '@/types'

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        // NEW (Add this)
        const env = process.env as any;
        const order = await getOrderById(env.DB, parseInt(id))

        if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        return NextResponse.json({ order })
    } catch (error) {
        console.error('GET Order Error:', error)
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        // NEW (Add this)
        const env = process.env as any;
        // THE FIX: Explicitly cast the JSON body to access 'status'
        const { status } = (await request.json()) as { status: string }

        const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded']

        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
        }

        await updateOrderStatus(env.DB, parseInt(id), status)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('PATCH Order Error:', error)
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}