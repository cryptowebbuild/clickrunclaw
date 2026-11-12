import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import {
  validateLeadInput,
  isHoneypotTriggered,
  checkRateLimit,
  stripHeaderControls,
  buildOwnerLeadEmail,
  buildClientAckEmail,
} from '@/lib/lead'

export const runtime = 'nodejs'

export async function POST(req: Request): Promise<NextResponse> {
  // 1. Safely parse JSON payload
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  // 2. Honeypot check: silent 200 for bot submissions without triggering SMTP
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
  const data = validation.data

  // 5. Read SMTP configuration
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = Number(process.env.SMTP_PORT) || 587
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const smtpSecure =
    process.env.SMTP_SECURE === 'true' || smtpPort === 465

  const leadToEmail = process.env.LEAD_TO_EMAIL || 'support@clickrunclaw.com'
  const leadFromEmail =
    process.env.LEAD_FROM_EMAIL || smtpUser || 'support@clickrunclaw.com'

  // If required SMTP credentials are not configured, fail safely with 503 without leaking env vars
  if (!smtpHost || !smtpUser || !smtpPass) {
    return NextResponse.json(
      {
        error:
          'Email intake is temporarily unavailable. Please email support@clickrunclaw.com directly.',
      },
      { status: 503 }
    )
  }

  // 6. Build and send emails via nodemailer
  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    const safeEmail = stripHeaderControls(data.email)
    const ownerEmail = buildOwnerLeadEmail(data)
    const clientEmail = buildClientAckEmail(data)

    // Send owner lead alert
    await transporter.sendMail({
      from: leadFromEmail,
      to: leadToEmail,
      replyTo: safeEmail,
      subject: ownerEmail.subject,
      text: ownerEmail.text,
      html: ownerEmail.html,
    })

    // Send client acknowledgment
    await transporter.sendMail({
      from: leadFromEmail,
      to: safeEmail,
      subject: clientEmail.subject,
      text: clientEmail.text,
      html: clientEmail.html,
    })

    return NextResponse.json(
      {
        ok: true,
        message:
          'Thank you. Your automation brief has been received. Our team will review and reply with a written proposal.',
      },
      { status: 200 }
    )
  } catch (error) {
    // Log generic error server-side without leaking credentials or internal stack details
    console.error('Lead intake SMTP delivery error occurred:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      {
        error:
          'Failed to deliver lead notification. Please email support@clickrunclaw.com directly.',
      },
      { status: 502 }
    )
  }
}
