import { NextResponse } from 'next/server'
import {
  validateDemoRequest,
  generateDemoReply,
  buildFallbackDemoReply,
} from '@/lib/demo-agent'

export const runtime = 'nodejs'

export async function POST(req: Request): Promise<NextResponse> {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const validation = validateDemoRequest(body)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

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
