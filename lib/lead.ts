export type PackageTier = 'starter' | 'growth' | 'enterprise' | 'custom'

export type LeadInput = {
  name: string
  email: string
  company?: string
  packageTier: PackageTier
  workflowGoal: string
  euResidencyOnly?: boolean
  websiteHoneypot?: string
}

export const TIER_CONFIG: Record<
  PackageTier,
  { name: string; pricing: string; description: string }
> = {
  starter: {
    name: 'Starter Automation',
    pricing: '$799 setup + $149/mo',
    description: '1 targeted n8n or Python automation workflow with standard integrations',
  },
  growth: {
    name: 'Growth Funnel',
    pricing: '$1,799 setup + $299/mo',
    description: 'Multi-step AI pipeline with CRM syncing, validation, and auto-triage',
  },
  enterprise: {
    name: 'Full AI Partner',
    pricing: '$3,499+ setup + $599/mo',
    description: 'Custom end-to-end multi-agent system with human-in-the-loop and dedicated support',
  },
  custom: {
    name: 'Custom Architecture',
    pricing: 'Custom Scoped Proposal',
    description: 'Tailored enterprise AI automation and dedicated infrastructure',
  },
}

const VALID_TIERS: ReadonlySet<string> = new Set<PackageTier>([
  'starter',
  'growth',
  'enterprise',
  'custom',
])

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function stripHeaderControls(value: string): string {
  return value.replace(/[\r\n\x00-\x1F\x7F]+/g, ' ').trim()
}

export function isHoneypotTriggered(raw: unknown): boolean {
  if (typeof raw !== 'object' || raw === null) {
    return false
  }

  const record = raw as Record<string, unknown>
  if (typeof record.websiteHoneypot === 'string') {
    return record.websiteHoneypot.trim().length > 0
  }

  return false
}

export function validateLeadInput(
  raw: unknown
): { ok: true; data: LeadInput } | { ok: false; error: string } {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return { ok: false, error: 'Invalid request body: expected an object' }
  }

  const record = raw as Record<string, unknown>

  // Name validation
  if (typeof record.name !== 'string') {
    return { ok: false, error: 'Name is required' }
  }
  if (/[\r\n]/.test(record.name)) {
    return { ok: false, error: 'Name contains invalid control characters' }
  }
  const name = record.name.trim()
  if (name.length === 0) {
    return { ok: false, error: 'Name cannot be empty' }
  }
  if (name.length > 100) {
    return { ok: false, error: 'Name cannot exceed 100 characters' }
  }

  // Email validation
  if (typeof record.email !== 'string') {
    return { ok: false, error: 'Email is required' }
  }
  if (/[\r\n]/.test(record.email)) {
    return { ok: false, error: 'Email contains invalid control characters' }
  }
  const email = record.email.trim()
  if (!EMAIL_REGEX.test(email)) {
    return { ok: false, error: 'Please provide a valid email address' }
  }

  // Company validation (optional)
  let company: string | undefined
  if (typeof record.company === 'string') {
    if (/[\r\n]/.test(record.company)) {
      return { ok: false, error: 'Company contains invalid control characters' }
    }
    const trimmed = record.company.trim()
    if (trimmed.length > 0) {
      if (trimmed.length > 100) {
        return { ok: false, error: 'Company cannot exceed 100 characters' }
      }
      company = trimmed
    }
  }

  // Package Tier validation
  if (typeof record.packageTier !== 'string' || !VALID_TIERS.has(record.packageTier)) {
    return {
      ok: false,
      error: 'Invalid package tier. Allowed options: starter, growth, enterprise, custom',
    }
  }
  const packageTier = record.packageTier as PackageTier

  // Workflow Goal validation
  if (typeof record.workflowGoal !== 'string') {
    return { ok: false, error: 'Workflow goal description is required' }
  }
  const workflowGoal = record.workflowGoal.trim()
  if (workflowGoal.length < 10) {
    return {
      ok: false,
      error: 'Please describe your workflow goal in at least 10 characters',
    }
  }
  if (workflowGoal.length > 5000) {
    return {
      ok: false,
      error: 'Workflow goal description cannot exceed 5000 characters',
    }
  }

  // EU Residency validation (optional boolean)
  const euResidencyOnly = Boolean(record.euResidencyOnly)

  // Honeypot field (optional string)
  const websiteHoneypot =
    typeof record.websiteHoneypot === 'string' ? record.websiteHoneypot.trim() : undefined

  return {
    ok: true,
    data: {
      name,
      email,
      company,
      packageTier,
      workflowGoal,
      euResidencyOnly,
      ...(websiteHoneypot ? { websiteHoneypot } : {}),
    },
  }
}

export function buildOwnerLeadEmail(data: LeadInput): {
  subject: string
  text: string
  html: string
} {
  const tier = TIER_CONFIG[data.packageTier]
  const cleanName = stripHeaderControls(data.name)
  const isDemo =
    /\b(demo|test)\b/i.test(data.name) ||
    /\b(demo|test)\b/i.test(data.workflowGoal) ||
    /\b(demo|test)\b/i.test(data.company || '')

  const subjectPrefix = isDemo ? '[DEMO TEST - DO NOT REPLY] ' : '[New Agency Brief] '
  const subject = `${subjectPrefix}${cleanName} - ${tier.name}`

  const safeName = escapeHtml(data.name)
  const safeEmail = escapeHtml(data.email)
  const safeCompany = data.company ? escapeHtml(data.company) : 'Not specified'
  const safeGoal = escapeHtml(data.workflowGoal).replace(/\n/g, '<br />')
  const residencyText = data.euResidencyOnly ? 'Yes (EU Data Residency Only)' : 'No (Standard Global)'

  const demoNoticeText = isDemo
    ? '*** NOTICE: THIS IS A DEMO / TEST BRIEF. DO NOT REPLY AS TO A REAL CLIENT. ***\n\n'
    : ''

  const demoNoticeHtml = isDemo
    ? `<div style="background-color: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 12px 16px; border-radius: 6px; margin-bottom: 20px; font-weight: bold; font-size: 13px;">
        ⚠️ DEMO TEST SUBMISSION: This is an internal or simulated test brief. Not a real client.
       </div>`
    : ''

  const text = `
${demoNoticeText}New Agency Lead Brief Received

Name: ${data.name}
Email: ${data.email}
Company: ${data.company || 'Not specified'}
Selected Tier: ${tier.name} (${tier.pricing})
EU Data Residency Only: ${residencyText}

Workflow Goal & Automation Scope:
${data.workflowGoal}

Direct Client Reply:
mailto:${data.email}

Delivery Model:
100% Async Written Delivery (Brief -> Email Proposal -> Live Sandbox Preview -> Deployment)
`.trim()

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #111827; background-color: #f9fafb; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 32px;">
    ${demoNoticeHtml}
    <h2 style="color: #059669; margin-top: 0;">New Agency Lead Brief</h2>
    <p style="font-size: 14px; color: #4b5563; margin-bottom: 24px;">
      A new client has submitted their AI automation scope.
    </p>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; width: 160px;"><strong>Client Name:</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${safeName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;"><strong>Email Address:</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #111827;"><a href="mailto:${safeEmail}" style="color: #059669; text-decoration: none;">${safeEmail}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;"><strong>Company:</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${safeCompany}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;"><strong>Selected Tier:</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #111827;"><strong>${escapeHtml(tier.name)}</strong> (${escapeHtml(tier.pricing)})</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;"><strong>EU Data Residency:</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${escapeHtml(residencyText)}</td>
      </tr>
    </table>

    <div style="background-color: #f9fafb; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
      <h4 style="margin-top: 0; margin-bottom: 8px; color: #374151; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Workflow Goal & Automation Scope</h4>
      <div style="font-size: 14px; color: #111827; white-space: pre-wrap;">${safeGoal}</div>
    </div>

    <div style="text-align: center; margin-bottom: 24px;">
      <a href="mailto:${safeEmail}?subject=Re:%20Project%20Brief%20-%20Click%20Run%20Claw" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; padding: 12px 24px; border-radius: 6px;">
        ✉️ Reply to ${safeName} (${safeEmail})
      </a>
    </div>

    <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; font-size: 12px; color: #6b7280;">
      Delivery Protocol: 100% Async Written Delivery (Brief &rarr; Email Proposal &rarr; Live Sandbox Preview &rarr; Deployment). Zero meetings required.
    </div>
  </div>
</body>
</html>
`.trim()

  return { subject, text, html }
}

export function buildClientAckEmail(data: LeadInput): {
  subject: string
  text: string
  html: string
} {
  const tier = TIER_CONFIG[data.packageTier]
  const subject = 'We received your AI automation brief - Click Run Claw'
  const safeName = escapeHtml(data.name)
  const safeGoal = escapeHtml(data.workflowGoal).replace(/\n/g, '<br />')

  const text = `
Hi ${data.name},

Thank you for submitting your AI automation brief to Click Run Claw.

We operate strictly as a 100% async engineering agency. Our senior automation engineers are reviewing your workflow requirements and will send you a detailed written technical proposal, system architecture blueprint, and live sandbox preview link within 24-48 business hours.

Your Submission Details:
- Package Tier: ${tier.name} (${tier.pricing})
- EU Data Residency: ${data.euResidencyOnly ? 'Yes (Strict EU Residency)' : 'Standard Global'}
- Workflow Scope:
${data.workflowGoal}

Next Steps (Zero-Meeting Async Flow):
1. Written Proposal: You will receive an exact architectural breakdown, toolchain selection (n8n / Python / LangGraph), and fixed pricing.
2. Live Sandbox Preview: We deploy an interactive, working sandbox preview with mock data for your written sign-off.
3. Production Deployment: Once approved, we ship to your infrastructure or EU cloud environment.

If you have additional API documentation, schema files, or process diagrams to share, simply reply to this email or reach us directly at support@clickrunclaw.com.

Best regards,
Engineering Team
Click Run Claw | support@clickrunclaw.com
`.trim()

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #111827; background-color: #f9fafb; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 32px;">
    <div style="margin-bottom: 24px;">
      <span style="font-size: 20px; font-weight: 700; color: #059669; letter-spacing: -0.025em;">Click Run Claw</span>
      <span style="font-size: 13px; color: #6b7280; margin-left: 8px;">Autonomous AI Automation</span>
    </div>

    <h2 style="color: #111827; margin-top: 0; font-size: 20px;">We received your AI automation brief</h2>
    <p style="font-size: 15px; color: #374151;">
      Hi ${safeName},
    </p>
    <p style="font-size: 14px; color: #4b5563;">
      Thank you for contacting Click Run Claw. We have received your project details and our engineering team is reviewing your automation scope.
    </p>

    <div style="background-color: #f9fafb; border-left: 4px solid #059669; padding: 16px; margin: 24px 0; border-radius: 0 6px 6px 0;">
      <h4 style="margin-top: 0; margin-bottom: 8px; color: #111827; font-size: 14px;">Summary of Your Request</h4>
      <p style="margin: 4px 0; font-size: 13px; color: #4b5563;"><strong>Package Tier:</strong> ${escapeHtml(tier.name)} (${escapeHtml(tier.pricing)})</p>
      <p style="margin: 4px 0; font-size: 13px; color: #4b5563;"><strong>EU Data Residency:</strong> ${data.euResidencyOnly ? 'Yes (Strict EU Residency)' : 'Standard Global'}</p>
      <div style="margin-top: 8px; font-size: 13px; color: #374151;">
        <strong>Automation Goal:</strong>
        <p style="margin: 4px 0 0 0; color: #4b5563; font-style: italic;">${safeGoal}</p>
      </div>
    </div>

    <h3 style="color: #111827; font-size: 16px; margin-top: 24px; margin-bottom: 12px;">What Happens Next? (100% Async Delivery)</h3>
    <ol style="font-size: 14px; color: #4b5563; padding-left: 20px; margin: 0 0 24px 0;">
      <li style="margin-bottom: 8px;"><strong>Written Architecture Proposal:</strong> Within 24-48 business hours, you will receive our written technical plan, toolchain analysis, and turnaround schedule.</li>
      <li style="margin-bottom: 8px;"><strong>Live Sandbox Preview:</strong> We deploy an interactive, working sandbox prototype so you can test real workflow inputs and outputs asynchronously.</li>
      <li style="margin-bottom: 8px;"><strong>Production Rollout:</strong> Following written approval, we deliver and install the automation directly into your environment.</li>
    </ol>

    <p style="font-size: 14px; color: #4b5563; margin-bottom: 24px;">
      Zero video calls or calendar scheduling needed. If you have additional requirements, API schemas, or process flows, simply reply directly to this email or reach us at <a href="mailto:support@clickrunclaw.com" style="color: #059669; text-decoration: none; font-weight: 500;">support@clickrunclaw.com</a>.
    </p>

    <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; font-size: 13px; color: #6b7280;">
      <strong>Click Run Claw Engineering</strong><br />
      Async Autonomous AI Workflow Systems &bull; <a href="mailto:support@clickrunclaw.com" style="color: #6b7280; text-decoration: underline;">support@clickrunclaw.com</a>
    </div>
  </div>
</body>
</html>
`.trim()

  return { subject, text, html }
}

// In-Memory Rate Limiter (sliding window of 10 minutes, max 5 submissions)
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5
const rateLimitMap = new Map<string, number[]>()

export function checkRateLimit(
  key: string,
  now: number = Date.now()
): { allowed: boolean; retryAfterSec: number } {
  const windowStart = now - RATE_LIMIT_WINDOW_MS

  // Defensive eviction: prune expired entries if map grows
  if (rateLimitMap.size > 2000) {
    for (const [k, timestamps] of rateLimitMap.entries()) {
      if (!timestamps.some((ts) => ts > windowStart)) {
        rateLimitMap.delete(k)
      }
    }
  }

  const history = rateLimitMap.get(key) || []

  // Filter timestamps within current window
  const activeTimestamps = history.filter((ts) => ts > windowStart)

  if (activeTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldestTimestamp = activeTimestamps[0]
    const resetTime = oldestTimestamp + RATE_LIMIT_WINDOW_MS
    const retryAfterSec = Math.max(1, Math.ceil((resetTime - now) / 1000))
    rateLimitMap.set(key, activeTimestamps)
    return { allowed: false, retryAfterSec }
  }

  activeTimestamps.push(now)
  rateLimitMap.set(key, activeTimestamps)
  return { allowed: true, retryAfterSec: 0 }
}

export function resetRateLimitStore(): void {
  rateLimitMap.clear()
}

export interface SendEmailOptions {
  fetchFn?: typeof fetch
  resendApiKey?: string
  fromEmail?: string
  toEmail?: string
  telegramBotToken?: string
  telegramChatId?: string
  webhookUrl?: string
  brevoApiKey?: string
}

export interface DispatchResult {
  ok: boolean
  status: number
  message: string
  deliveredChannels: string[]
  channelErrors?: Record<string, string>
  error?: string
}

export function getEnvVar(key: string): string | undefined {
  try {
    const symbol = Symbol.for('__cloudflare-request-context__')
    const ctx = (
      globalThis as unknown as Record<symbol, { env?: Record<string, string> }>
    )[symbol]
    if (ctx?.env && typeof ctx.env[key] === 'string' && ctx.env[key].length > 0) {
      return ctx.env[key]
    }
  } catch {
    // Ignore fallback to process.env
  }

  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key]
  }

  return undefined
}

export function buildTelegramMessage(data: LeadInput): string {
  const tier = TIER_CONFIG[data.packageTier]
  const safeName = escapeHtml(data.name)
  const safeEmail = escapeHtml(data.email)
  const safeCompany = data.company ? escapeHtml(data.company) : 'Not specified'
  const safeGoal = escapeHtml(data.workflowGoal)
  const residency = data.euResidencyOnly
    ? 'Yes (EU Data Residency Only)'
    : 'Standard Global'

  const isDemo =
    /\b(demo|test)\b/i.test(data.name) ||
    /\b(demo|test)\b/i.test(data.workflowGoal) ||
    /\b(demo|test)\b/i.test(data.company || '')

  const header = isDemo
    ? '🧪 <b>[DEMO TEST - DO NOT REPLY] Project Brief</b>'
    : '🚀 <b>New Agency Project Brief</b>'

  return `${header}

👤 <b>Client:</b> ${safeName}
📧 <b>Email:</b> <a href="mailto:${safeEmail}">${safeEmail}</a>
🏢 <b>Company:</b> ${safeCompany}
📦 <b>Package:</b> ${escapeHtml(tier.name)} (<code>${escapeHtml(tier.pricing)}</code>)
🔒 <b>Data Residency:</b> ${residency}

📝 <b>Workflow Scope & Goal:</b>
<blockquote>${safeGoal}</blockquote>

⚡ <i>Delivered via Click Run Claw Async Engine &bull; Reply via Zoho Mail</i>`.trim()
}

export async function sendTelegramNotification(
  data: LeadInput,
  botToken: string,
  chatId: string,
  fetchFn: typeof fetch = globalThis.fetch
): Promise<{ ok: boolean; error?: string }> {
  try {
    const text = buildTelegramMessage(data)
    let res = await fetchFn(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })

    // If Telegram rejects due to HTML parsing error (400), retry in raw plain text
    if (!res.ok && res.status === 400) {
      const tier = TIER_CONFIG[data.packageTier]
      const isDemo =
        /\b(demo|test)\b/i.test(data.name) ||
        /\b(demo|test)\b/i.test(data.workflowGoal) ||
        /\b(demo|test)\b/i.test(data.company || '')
      const plainHeader = isDemo ? '[DEMO TEST - DO NOT REPLY] Project Brief' : 'New Agency Project Brief'
      const plainText = `${plainHeader}\n\nClient: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || 'Not specified'}\nTier: ${tier.name} (${tier.pricing})\nResidency: ${data.euResidencyOnly ? 'EU Only' : 'Standard'}\n\nGoal:\n${data.workflowGoal}\n\nReply via Zoho Mail: mailto:${data.email}`

      const fallbackRes = await fetchFn(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: plainText,
          disable_web_page_preview: true,
        }),
      })
      if (fallbackRes.ok) {
        return { ok: true }
      }
    }

    if (res.ok) {
      return { ok: true }
    }
    const errText = await res.text()
    return { ok: false, error: `Telegram error (${res.status}): ${errText}` }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown Telegram error',
    }
  }
}

export async function sendWebhookNotification(
  data: LeadInput,
  webhookUrl: string,
  fetchFn: typeof fetch = globalThis.fetch
): Promise<{ ok: boolean; error?: string }> {
  try {
    const tier = TIER_CONFIG[data.packageTier]
    const isDiscord = webhookUrl.includes('discord.com/api/webhooks')
    const isSlack = webhookUrl.includes('hooks.slack.com')

    let body: unknown
    if (isDiscord) {
      body = {
        content: `🚀 **New Agency Project Brief Received**\n**Name:** ${data.name}\n**Email:** ${data.email}\n**Company:** ${data.company || 'Not specified'}\n**Tier:** ${tier.name} (${tier.pricing})\n**EU Residency:** ${data.euResidencyOnly ? 'Yes' : 'No'}\n\n**Workflow Scope:**\n${data.workflowGoal}`,
      }
    } else if (isSlack) {
      body = {
        text: `🚀 *New Agency Project Brief Received*\n*Name:* ${data.name}\n*Email:* ${data.email}\n*Company:* ${data.company || 'Not specified'}\n*Tier:* ${tier.name} (${tier.pricing})\n*Workflow Scope:*\n${data.workflowGoal}`,
      }
    } else {
      body = {
        event: 'lead.created',
        lead: {
          name: data.name,
          email: data.email,
          company: data.company,
          packageTier: data.packageTier,
          workflowGoal: data.workflowGoal,
          euResidencyOnly: data.euResidencyOnly,
        },
        tier: tier,
        createdAt: new Date().toISOString(),
      }
    }

    const res = await fetchFn(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      return { ok: true }
    }
    return { ok: false, error: `Webhook error (${res.status})` }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown Webhook error',
    }
  }
}

export async function sendBrevoNotification(
  data: LeadInput,
  apiKey: string,
  fromEmail: string,
  toEmail: string,
  fetchFn: typeof fetch = globalThis.fetch
): Promise<{ ok: boolean; error?: string }> {
  try {
    const ownerEmail = buildOwnerLeadEmail(data)
    const res = await fetchFn('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Click Run Claw Leads', email: fromEmail },
        to: [{ email: toEmail, name: 'Click Run Claw Admin' }],
        replyTo: { email: data.email, name: data.name },
        subject: ownerEmail.subject,
        htmlContent: ownerEmail.html,
        textContent: ownerEmail.text,
      }),
    })
    if (res.ok) {
      return { ok: true }
    }
    const errText = await res.text()
    return { ok: false, error: `Brevo error (${res.status}): ${errText}` }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown Brevo error',
    }
  }
}

export async function dispatchLeadNotification(
  data: LeadInput,
  options?: SendEmailOptions
): Promise<DispatchResult> {
  const fetchImpl = options?.fetchFn || globalThis.fetch
  const fromEmail =
    options?.fromEmail || getEnvVar('LEAD_FROM_EMAIL') || 'support@clickrunclaw.com'
  const toEmail =
    options?.toEmail || getEnvVar('LEAD_TO_EMAIL') || 'support@clickrunclaw.com'
  const resendApiKey = options?.resendApiKey || getEnvVar('RESEND_API_KEY')
  const telegramBotToken =
    options?.telegramBotToken || getEnvVar('TELEGRAM_BOT_TOKEN')
  const telegramChatId =
    options?.telegramChatId || getEnvVar('TELEGRAM_CHAT_ID')
  const webhookUrl =
    options?.webhookUrl ||
    getEnvVar('LEAD_WEBHOOK_URL') ||
    getEnvVar('DISCORD_WEBHOOK_URL')
  const brevoApiKey = options?.brevoApiKey || getEnvVar('BREVO_API_KEY')

  const safeEmail = stripHeaderControls(data.email)
  const ownerEmail = buildOwnerLeadEmail(data)
  const clientEmail = buildClientAckEmail(data)
  const deliveredChannels: string[] = []
  const channelErrors: Record<string, string> = {}
  const dispatchTasks: Promise<void>[] = []

  // 1. Resend API Dispatch
  if (resendApiKey && typeof fetchImpl === 'function') {
    dispatchTasks.push(
      (async () => {
        try {
      let ownerRes = await fetchImpl('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: toEmail,
          reply_to: safeEmail,
          subject: ownerEmail.subject,
          text: ownerEmail.text,
          html: ownerEmail.html,
        }),
      })

      // If custom domain is not yet verified on Resend, retry with send.clickrunclaw.com or onboarding@resend.dev
      if (!ownerRes.ok && !fromEmail.includes('send.clickrunclaw.com')) {
        const subRes = await fetchImpl('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Click Run Claw <briefs@send.clickrunclaw.com>',
            to: toEmail,
            reply_to: safeEmail,
            subject: ownerEmail.subject,
            text: ownerEmail.text,
            html: ownerEmail.html,
          }),
        })
        if (subRes.ok) {
          ownerRes = subRes
        }
      }

      if (!ownerRes.ok && fromEmail !== 'onboarding@resend.dev') {
        const fallbackRes = await fetchImpl('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Click Run Claw <onboarding@resend.dev>',
            to: toEmail,
            reply_to: safeEmail,
            subject: ownerEmail.subject,
            text: ownerEmail.text,
            html: ownerEmail.html,
          }),
        })
        ownerRes = fallbackRes
      }

      // If Resend free tier is in sandbox mode, it only allows sending to the registered account email
      if (!ownerRes.ok) {
        const errClone = ownerRes.clone()
        const errText = await errClone.text().catch(() => '')
        const match = errText.match(/own email address \(([^)]+)\)/)
        if (match && match[1]) {
          const registeredOwnerEmail = match[1].trim()
          const sandboxRetryRes = await fetchImpl('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'Click Run Claw <onboarding@resend.dev>',
              to: registeredOwnerEmail,
              reply_to: safeEmail,
              subject: ownerEmail.subject,
              text: ownerEmail.text,
              html: ownerEmail.html,
            }),
          })
          if (sandboxRetryRes.ok) {
            ownerRes = sandboxRetryRes
          }
        }
      }

      if (ownerRes.ok) {
        deliveredChannels.push('resend')

        // Dispatch client acknowledgment (non-blocking best-effort)
        await fetchImpl('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail.includes('resend.dev')
              ? 'Click Run Claw <onboarding@resend.dev>'
              : fromEmail,
            to: safeEmail,
            subject: clientEmail.subject,
            text: clientEmail.text,
            html: clientEmail.html,
          }),
        }).catch(() => null)
      } else {
        const errText = await ownerRes.text()
        channelErrors['resend'] = `HTTP ${ownerRes.status}: ${errText}`
        console.error(`Resend API delivery failed (${ownerRes.status}):`, errText)
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error'
      channelErrors['resend'] = errMsg
      console.error('Resend API error:', errMsg)
    }
      })()
    )
  }

  // 2. Telegram Bot Dispatch (Instant mobile push alert in parallel)
  if (telegramBotToken && telegramChatId && typeof fetchImpl === 'function') {
    dispatchTasks.push(
      (async () => {
        const tgResult = await sendTelegramNotification(
          data,
          telegramBotToken,
          telegramChatId,
          fetchImpl
        )
        if (tgResult.ok) {
          deliveredChannels.push('telegram')
        } else {
          channelErrors['telegram'] = tgResult.error || 'Unknown error'
          console.error('Telegram notification error:', tgResult.error)
        }
      })()
    )
  }

  // 3. Webhook Dispatch (Discord / Slack / n8n in parallel)
  if (webhookUrl && typeof fetchImpl === 'function') {
    dispatchTasks.push(
      (async () => {
        const whResult = await sendWebhookNotification(data, webhookUrl, fetchImpl)
        if (whResult.ok) {
          deliveredChannels.push('webhook')
        } else {
          channelErrors['webhook'] = whResult.error || 'Unknown error'
          console.error('Webhook notification error:', whResult.error)
        }
      })()
    )
  }

  // Wait for all parallel dispatchers to finish
  if (dispatchTasks.length > 0) {
    await Promise.allSettled(dispatchTasks)
  }

  // 4. Brevo API (Sendinblue) Dispatch
  if (brevoApiKey && typeof fetchImpl === 'function' && !deliveredChannels.includes('resend')) {
    const brevoResult = await sendBrevoNotification(
      data,
      brevoApiKey,
      fromEmail,
      toEmail,
      fetchImpl
    )
    if (brevoResult.ok) {
      deliveredChannels.push('brevo')
    } else {
      channelErrors['brevo'] = brevoResult.error || 'Unknown error'
      console.error('Brevo notification error:', brevoResult.error)
    }
  }

  // 5. Fallback: MailChannels (legacy HTTP API)
  if (deliveredChannels.length === 0 && typeof fetchImpl === 'function') {
    try {
      const mcOwnerRes = await fetchImpl('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: toEmail }] }],
          from: { email: fromEmail, name: 'ClickRunClaw Leads' },
          reply_to: { email: safeEmail, name: data.name },
          subject: ownerEmail.subject,
          content: [
            { type: 'text/plain', value: ownerEmail.text },
            { type: 'text/html', value: ownerEmail.html },
          ],
        }),
      })

      const mcClientRes = await fetchImpl('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: safeEmail, name: data.name }] }],
          from: { email: fromEmail, name: 'ClickRunClaw' },
          subject: clientEmail.subject,
          content: [
            { type: 'text/plain', value: clientEmail.text },
            { type: 'text/html', value: clientEmail.html },
          ],
        }),
      })

      if (mcOwnerRes.ok || mcClientRes.ok) {
        deliveredChannels.push('mailchannels')
      }
    } catch {
      // Ignored
    }
  }

  if (deliveredChannels.length === 0) {
    // A brief that reached no channel was not delivered. Reporting success here
    // silently loses revenue, so the API surfaces a failure instead.
    console.error(
      '[ClickRunClaw Leads] No channel accepted the brief. Configure RESEND_API_KEY, TELEGRAM_BOT_TOKEN or LEAD_WEBHOOK_URL in Cloudflare Pages.'
    )

    return {
      ok: false,
      status: 502,
      deliveredChannels,
      channelErrors:
        Object.keys(channelErrors).length > 0
          ? channelErrors
          : { dispatch: 'no_channel_configured' },
      message:
        'The brief could not be delivered to the studio inbox. Email support@clickrunclaw.com directly.',
    }
  }

  return {
    ok: true,
    status: 200,
    deliveredChannels,
    channelErrors: Object.keys(channelErrors).length > 0 ? channelErrors : undefined,
    message:
      'Thank you. Your automation brief has been received. Our team will review and reply with a written proposal.',
  }
}
