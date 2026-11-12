import { NextResponse } from 'next/server'
import {
  validateDemoRequest,
  generateDemoReply,
  buildFallbackDemoReply,
  checkDemoRateLimit,
} from '@/lib/demo-agent'

export const runtime = 'nodejs'

export async function POST(req: Request): Promise<NextResponse> {
  // 1. Parse JSON payload
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  // 2. Sliding-window IP rate limiting (20 requests per 10 minutes per IP)
  const forwarded = req.headers.get('x-forwarded-for')
  const clientIp = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  const rateLimit = checkDemoRateLimit(clientIp)
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

  // 3. Validate request schema and length bounds
  const validation = validateDemoRequest(body)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  // 4. Generate AI reply or fallback
  try {
    const result = await generateDemoReply({
      message: validation.message,
      history: validation.history,
      apiKey: process.env.GEMINI_API_KEY,
    })

    return NextResponse.json(
      {
        reply: result.reply,
        mode: result.mode,
      },
      { status: 200 }
    )
  } catch (err) {
    // Fail-safe graceful fallback: never crash the live interactive demo
    console.error('Unhandled demo route exception:', err)
    return NextResponse.json(
      {
        reply: buildFallbackDemoReply(validation.message),
        mode: 'sandbox',
      },
      { status: 200 }
    )
  }
}
