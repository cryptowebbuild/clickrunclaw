import { NextResponse } from 'next/server'
import {
  validateLeadInput,
  isHoneypotTriggered,
  checkRateLimit,
  dispatchLeadNotification,
} from '@/lib/lead'

export const runtime = 'edge'

export async function POST(req: Request): Promise<NextResponse> {
  // 1. Safely parse JSON payload
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  // 2. Honeypot check: silent 200 for bot submissions without triggering delivery
  if (isHoneypotTriggered(body)) {
    return NextResponse.json({ ok: true, received: true }, { status: 200 })
  }

  // 3. Rate limiting check (max 5 per 10 minutes per IP)
  const forwarded = req.headers.get('x-forwarded-for')
  const clientIp = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  const rateLimit = checkRateLimit(clientIp)
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfterSec),
        },
      }
    )
  }

  // 4. Validate and sanitize input
  const validation = validateLeadInput(body)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  // 5. Dispatch notification via Edge HTTP API (Resend or MailChannels)
  const result = await dispatchLeadNotification(validation.data)
  return NextResponse.json(
    {
      ok: result.ok,
      message: result.message,
    },
    { status: result.status }
  )
}
