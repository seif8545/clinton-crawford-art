// src/app/api/inquiry/route.ts
//
// Receives inquiries from the public inquire form and forwards them to the
// studio mailbox at info@artcrawford.com.
//
// Two delivery channels are supported, both edge-runtime safe:
//
//   1. RESEND_API_KEY  — preferred. Sends the email through https://resend.com.
//   2. INQUIRY_WEBHOOK_URL — falls back to a generic POST webhook (e.g. Zapier,
//      Slack incoming webhook, Make.com, etc.).
//
// If neither is configured the inquiry is logged to the platform logs and the
// caller still receives a 200 — the painter can also see every submission in
// the admin panel (mirrored to localStorage by the form).

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

const STUDIO_EMAIL = 'info@artcrawford.com'

interface IncomingInquiry {
  name?: string
  email?: string
  phone?: string
  painting_slug?: string
  painting_title?: string | null
  message?: string
}

export async function POST(request: NextRequest) {
  let body: IncomingInquiry = {}
  try {
    body = (await request.json()) as IncomingInquiry
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const name = (body.name ?? '').trim()
  const email = (body.email ?? '').trim()
  const message = (body.message ?? '').trim()

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'name, email and message are required' },
      { status: 400 }
    )
  }

  const env = (process.env ?? {}) as Record<string, string | undefined>
  const subject = body.painting_title
    ? `New inquiry: ${body.painting_title}`
    : 'New inquiry from artcrawford.com'

  const lines = [
    `New inquiry from the Art Crawford website`,
    ``,
    `Name:    ${name}`,
    `Email:   ${email}`,
    body.phone ? `Phone:   ${body.phone}` : null,
    body.painting_title ? `Work:    ${body.painting_title}` : null,
    body.painting_slug ? `Slug:    ${body.painting_slug}` : null,
    ``,
    `Message:`,
    message,
  ].filter(Boolean) as string[]
  const text = lines.join('\n')

  console.log('[Art Crawford] inquiry received →', STUDIO_EMAIL, { name, email, subject })

  // 1. Try Resend
  const resendKey = env.RESEND_API_KEY
  if (resendKey) {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.RESEND_FROM ?? 'Art Crawford <inquiries@artcrawford.com>',
          to: [STUDIO_EMAIL],
          reply_to: email,
          subject,
          text,
        }),
      })
      if (r.ok) {
        return NextResponse.json({ success: true, channel: 'resend' })
      }
      console.warn('[Art Crawford] Resend send failed:', r.status, await r.text())
    } catch (err) {
      console.warn('[Art Crawford] Resend send threw:', err)
    }
  }

  // 2. Fallback webhook
  const webhook = env.INQUIRY_WEBHOOK_URL
  if (webhook) {
    try {
      const r = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: STUDIO_EMAIL, subject, text, inquiry: body }),
      })
      if (r.ok) {
        return NextResponse.json({ success: true, channel: 'webhook' })
      }
      console.warn('[Art Crawford] Webhook failed:', r.status)
    } catch (err) {
      console.warn('[Art Crawford] Webhook threw:', err)
    }
  }

  // 3. Logged-only — still return success so the visitor sees the thank-you
  //    state. The painter has the full record in the admin panel mirror.
  return NextResponse.json({ success: true, channel: 'logged' })
}
