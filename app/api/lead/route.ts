import { NextResponse } from 'next/server'
import {
  validateLeadInput,
  isHoneypotTriggered,
  checkRateLimit,
  dispatchLeadNotification,
} from '@/lib/lead'

export const runtime = 'edge'

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://clickrunclaw.com'

/**
 * Only the marketing site may post a brief. A wildcard CORS policy on a public
 * lead endpoint turns it into a spam relay for anyone who reads the source.
 */
function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('origin')
  const allowed = origin && origin === SITE_ORIGIN

  return allowed
    ? {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        Vary: 'Origin',
      }
    : { Vary: 'Origin' }
}

export async function OPTIONS(request: Request): Promise<NextResponse> {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) })
}

/**
 * Health probe. Deliberately reports status only: which providers are
 * configured is operational detail and does not belong on a public endpoint.
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { service: 'ClickRunClaw lead intake', status: 'ok', runtime: 'edge' },
    { status: 200, headers: { 'Cache-Control': 'no-store' } }
  )
}

export async function POST(req: Request): Promise<NextResponse> {
  const headers = corsHeaders(req)

  const contentLength = Number(req.headers.get('content-length') ?? 0)
  if (contentLength > 20_000) {
    return NextResponse.json({ error: 'Payload too large.' }, { status: 413, headers })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400, headers })
  }

  // Bots that fill the hidden field get a normal-looking 200 and nothing else.
  if (isHoneypotTriggered(body)) {
    return NextResponse.json({ ok: true, received: true }, { status: 200, headers })
  }

  const forwarded = req.headers.get('x-forwarded-for')
  const clientIp = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  const rateLimit = checkRateLimit(clientIp)
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { ...headers, 'Retry-After': String(rateLimit.retryAfterSec) },
      }
    )
  }

  const validation = validateLeadInput(body)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400, headers })
  }

  const result = await dispatchLeadNotification(validation.data)

  if (!result.ok) {
    // Provider errors stay in the logs. The visitor gets one clear next step.
    console.error('lead_dispatch_failed', result.channelErrors)
    return NextResponse.json(
      {
        error:
          'We could not deliver the brief. Email it to support@clickrunclaw.com and it will reach the same inbox.',
      },
      { status: 502, headers }
    )
  }

  return NextResponse.json({ ok: true }, { status: 200, headers })
}
