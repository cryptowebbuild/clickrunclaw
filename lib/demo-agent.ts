import { GoogleGenAI } from '@google/genai'

export type DemoMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type GeminiTurn = {
  role: 'user' | 'model'
  parts: [{ text: string }]
}

export const DEMO_SYSTEM_PROMPT = `You are ClickRunClaw's EU AI Automation Consultant.
Your mission is to help EU and global businesses automate repetitive workflows with sovereign, GDPR-compliant AI agents.

STRICT OPERATIONAL RULES:
1. 100% ENGLISH ONLY. Concise, punchy responses strictly under 120 words.
2. ZERO CALLS / ZERO MEETINGS: Never propose, agree to, or reference phone calls, Zoom meetings, Google Meets, or calendar links. ClickRunClaw operates 100% asynchronously: Project Brief -> Written Email Architecture Proposal -> Interactive Live Sandbox Preview -> Production Deployment.
3. PRICING TIERS (USD ONLY - Cite exactly when asked):
   - Starter: $799 setup + $149/mo (Single production workflow like customer triage or invoice processing; deployed in 3-5 business days).
   - Growth Funnel: $1,799 setup + $299/mo (Multi-stage pipeline, CRM/ERP bi-directional sync, custom memory; deployed in 5-8 business days).
   - Full AI Partner: $3,499+ setup + $599/mo (Bespoke architecture, multi-agent fleet, private models; deployed in 10-14 business days).
4. DATA SOVEREIGNTY & INFRASTRUCTURE:
   - Dedicated EU infrastructure hosted in Germany (Frankfurt) and Finland (Helsinki).
   - Isolated container sandboxes per client.
   - Zero training on client business data.
   - Optional local EU LLM routing (e.g. Mistral / European sovereign endpoints).
5. CONTACT: Direct all formal project briefs and inquiries to support@clickrunclaw.com.
6. Absolutely zero Bengali text, zero BDT currency, and zero +880 numbers.`

/* ==========================================================================
   Rate Limiting (Sliding Window: 20 requests per 10 minutes per IP)
   ========================================================================== */

interface DemoRateLimitEntry {
  timestamps: number[]
}

const demoRateLimitStore = new Map<string, DemoRateLimitEntry>()

export const DEMO_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
export const DEMO_RATE_LIMIT_MAX_REQUESTS = 20

export function checkDemoRateLimit(
  key: string,
  now: number = Date.now()
): { allowed: boolean; retryAfterSec: number } {
  const windowStart = now - DEMO_RATE_LIMIT_WINDOW_MS
  const entry = demoRateLimitStore.get(key) || { timestamps: [] }

  const validTimestamps = entry.timestamps.filter((ts) => ts > windowStart)

  if (validTimestamps.length >= DEMO_RATE_LIMIT_MAX_REQUESTS) {
    const oldest = validTimestamps[0]
    const retryAfterSec = Math.max(
      1,
      Math.ceil((oldest + DEMO_RATE_LIMIT_WINDOW_MS - now) / 1000)
    )
    entry.timestamps = validTimestamps
    demoRateLimitStore.set(key, entry)
    return { allowed: false, retryAfterSec }
  }

  validTimestamps.push(now)
  entry.timestamps = validTimestamps
  demoRateLimitStore.set(key, entry)
  return { allowed: true, retryAfterSec: 0 }
}

export function resetDemoRateLimitStore(): void {
  demoRateLimitStore.clear()
}

/* ==========================================================================
   Multi-Turn Conversation Normalization (Gemini Schema Compliance)
   ========================================================================== */

/**
 * Normalizes multi-turn chat history so that:
 * 1. Leading assistant/model turns are dropped (history begins with 'user').
 * 2. Consecutive same-role turns are merged/deduplicated so roles strictly alternate ('user' -> 'model').
 * 3. If history ends on 'user', it merges with or trims before the incoming message so the final contents array
 *    strictly alternates user -> model -> user -> ... -> user and starts with 'user'.
 */
export function normalizeDemoChat(
  history: DemoMessage[],
  currentMessage: string
): {
  normalizedHistory: DemoMessage[]
  normalizedMessage: string
  contents: GeminiTurn[]
} {
  const trimmedCurrent = currentMessage.trim()

  // 1. Drop leading assistant turns
  const nonLeading = [...history]
  while (nonLeading.length > 0 && nonLeading[0].role === 'assistant') {
    nonLeading.shift()
  }

  // 2. Merge consecutive same-role turns in history
  const alternated: DemoMessage[] = []
  for (const turn of nonLeading) {
    if (alternated.length === 0) {
      if (turn.role === 'user') {
        alternated.push({ role: 'user', content: turn.content })
      }
    } else {
      const last = alternated[alternated.length - 1]
      if (last.role === turn.role) {
        last.content = `${last.content}\n\n${turn.content}`.slice(0, 800)
      } else {
        alternated.push({ role: turn.role, content: turn.content })
      }
    }
  }

  // 3. Ensure the turn right before currentMessage is 'assistant' (model).
  // If alternated ends on 'user', merge it into currentMessage so alternated ends on assistant
  let finalMessage = trimmedCurrent
  if (alternated.length > 0 && alternated[alternated.length - 1].role === 'user') {
    const trailingUser = alternated.pop()!
    finalMessage = `${trailingUser.content}\n\n${trimmedCurrent}`.slice(0, 800)
  }

  // Build Gemini contents: alternating user -> model, ending on finalMessage
  const contents: GeminiTurn[] = [
    ...alternated.map((turn) => ({
      role: (turn.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
      parts: [{ text: turn.content }] as [{ text: string }],
    })),
    {
      role: 'user',
      parts: [{ text: finalMessage }],
    },
  ]

  return {
    normalizedHistory: alternated,
    normalizedMessage: finalMessage,
    contents,
  }
}

export function buildGeminiContents(
  history: DemoMessage[],
  currentMessage: string
): GeminiTurn[] {
  return normalizeDemoChat(history, currentMessage).contents
}

/* ==========================================================================
   Request Validation
   ========================================================================== */

/**
 * Validates and sanitizes incoming demo requests.
 * Clamps history to last 6 valid turns and enforces 800 character limits.
 */
export function validateDemoRequest(
  raw: unknown
): { ok: true; message: string; history: DemoMessage[] } | { ok: false; error: string } {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return { ok: false, error: 'Request body must be a JSON object' }
  }

  const candidate = raw as Record<string, unknown>

  if (typeof candidate.message !== 'string') {
    return { ok: false, error: 'Message is required and must be a string' }
  }

  const trimmedMessage = candidate.message.trim()
  if (trimmedMessage.length === 0) {
    return { ok: false, error: 'Message cannot be empty' }
  }

  if (trimmedMessage.length > 800 || candidate.message.length > 800) {
    return { ok: false, error: 'Message exceeds maximum length of 800 characters' }
  }

  let sanitizedHistory: DemoMessage[] = []
  if (candidate.history !== undefined && candidate.history !== null) {
    if (!Array.isArray(candidate.history)) {
      return { ok: false, error: 'History must be an array' }
    }

    for (const item of candidate.history) {
      if (
        typeof item === 'object' &&
        item !== null &&
        (item.role === 'user' || item.role === 'assistant') &&
        typeof item.content === 'string'
      ) {
        const trimmedContent = item.content.trim()
        if (trimmedContent.length > 0) {
          sanitizedHistory.push({
            role: item.role,
            content: trimmedContent.slice(0, 800),
          })
        }
      }
    }

    // Clamp to last 6 turns
    if (sanitizedHistory.length > 6) {
      sanitizedHistory = sanitizedHistory.slice(-6)
    }
  }

  return {
    ok: true,
    message: trimmedMessage,
    history: sanitizedHistory,
  }
}

/**
 * Deterministic, contextual fallback reply generator used when GEMINI_API_KEY
 * is unconfigured, rate-limited, times out, or fails.
 */
export function buildFallbackDemoReply(message: string): string {
  const lower = (message || '').toLowerCase()

  // 1. EU / Data residency / GDPR / Hosting
  if (
    lower.includes('eu') ||
    lower.includes('gdpr') ||
    lower.includes('germany') ||
    lower.includes('finland') ||
    lower.includes('data center') ||
    lower.includes('datacenter') ||
    lower.includes('sovereign') ||
    lower.includes('privacy') ||
    lower.includes('residency') ||
    lower.includes('where') ||
    lower.includes('store') ||
    lower.includes('host')
  ) {
    return (
      'All ClickRunClaw agent automation containers and persistent data reside exclusively ' +
      'in dedicated EU data centers in Germany (Frankfurt) and Finland (Helsinki). We enforce ' +
      'zero model training on client business data, strict GDPR compliance, and isolated container ' +
      'sandboxes. Optional local EU LLM routing (such as Mistral or European sovereign endpoints) ' +
      'is available upon request. For technical DPAs, email us at support@clickrunclaw.com.'
    )
  }

  // 2. Pricing / Packages / Rates / Cost / Comparison
  if (
    lower.includes('price') ||
    lower.includes('pricing') ||
    lower.includes('cost') ||
    lower.includes('plan') ||
    lower.includes('tier') ||
    lower.includes('rate') ||
    lower.includes('compare') ||
    lower.includes('799') ||
    lower.includes('1,799') ||
    lower.includes('1799') ||
    lower.includes('3,499') ||
    lower.includes('3499') ||
    lower.includes('package')
  ) {
    return (
      'ClickRunClaw offers 3 transparent USD packages with zero hidden retainers:\n\n' +
      '• Starter ($799 setup + $149/mo): Single production workflow (invoicing, lead triage, or support) deployed in 3-5 business days.\n' +
      '• Growth Funnel ($1,799 setup + $299/mo): Multi-stage autonomous agent pipeline, CRM/ERP bi-directional sync, custom memory, priority SLAs (5-8 days).\n' +
      '• Full AI Partner ($3,499+ setup + $599/mo): Bespoke enterprise architecture, multi-agent fleet, private model tuning (10-14 days).\n\n' +
      'All plans run on isolated EU containers. Submit your brief or email support@clickrunclaw.com to start.'
    )
  }

  // 3. Calls / Meetings / Sync / Zoom / Google Meet
  if (
    lower.includes('call') ||
    lower.includes('meeting') ||
    lower.includes('phone') ||
    lower.includes('video') ||
    lower.includes('zoom') ||
    lower.includes('meet') ||
    lower.includes('talk') ||
    lower.includes('schedule')
  ) {
    return (
      'We operate 100% asynchronously with zero phone or video calls. Our high-velocity workflow is completely written: ' +
      '1) Submit your Project Brief -> 2) Receive a detailed Email Architecture Proposal within 24 hours -> ' +
      '3) Test in an Interactive Live Sandbox Preview -> 4) Production Deployment. ' +
      'This eliminates calendar bottlenecks and gives you an auditable trail. Reach our lead engineer directly at support@clickrunclaw.com.'
    )
  }

  // 4. Timeline / Turnaround / Delivery
  if (
    lower.includes('timeline') ||
    lower.includes('turnaround') ||
    lower.includes('how long') ||
    lower.includes('delivery') ||
    lower.includes('when') ||
    lower.includes('days') ||
    lower.includes('fast')
  ) {
    return (
      'Our asynchronous delivery timelines are guaranteed:\n' +
      '• Starter ($799 setup + $149/mo): Production live in 3-5 business days.\n' +
      '• Growth Funnel ($1,799 setup + $299/mo): Production live in 5-8 business days.\n' +
      '• Full AI Partner ($3,499+ setup + $599/mo): Production live in 10-14 business days.\n\n' +
      'You receive private sandbox preview links at each milestone. Contact support@clickrunclaw.com to review your timeline.'
    )
  }

  // 5. Default welcoming response
  return (
    "Hello! I am ClickRunClaw's EU AI Automation Consultant. We build, host, and deploy production " +
    'AI agents on isolated EU container sandboxes located in Germany and Finland with strict GDPR compliance ' +
    'and zero training on client data. We operate 100% asynchronously with zero meetings. ' +
    'Packages start at $799 setup + $149/mo for Starter, $1,799 setup + $299/mo for Growth, and $3,499+ setup + $599/mo ' +
    'for Full AI Partner. What business process would you like to automate? You can also email us at support@clickrunclaw.com.'
  )
}

/**
 * Generates a demo reply using Gemini 2.5 Flash, or falls back to deterministic
 * sandbox output if GEMINI_API_KEY is missing, rejected, or times out (>8s).
 */
export async function generateDemoReply(input: {
  message: string
  history: DemoMessage[]
  apiKey?: string
  fetchFn?: (input: { message: string; history: DemoMessage[]; apiKey: string }) => Promise<string>
  timeoutMs?: number
}): Promise<{ reply: string; mode: 'live' | 'sandbox' }> {
  // Explicit empty apiKey takes precedence over environment variable
  const rawApiKey = input.apiKey !== undefined ? input.apiKey : process.env.GEMINI_API_KEY
  const apiKey = typeof rawApiKey === 'string' ? rawApiKey.trim() : ''
  const timeoutLimit = input.timeoutMs ?? 8000

  if (!apiKey) {
    return {
      mode: 'sandbox',
      reply: buildFallbackDemoReply(input.message),
    }
  }

  // Normalize multi-turn chat to guarantee valid Gemini schema
  const { normalizedHistory, normalizedMessage, contents } = normalizeDemoChat(
    input.history,
    input.message
  )

  // If a custom fetch function is provided (e.g., in unit tests or custom integrations)
  if (input.fetchFn) {
    let timer: NodeJS.Timeout | undefined
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`Demo agent request timed out after ${timeoutLimit}ms`)),
          timeoutLimit
        )
      })

      const callPromise = input.fetchFn({
        message: normalizedMessage,
        history: normalizedHistory,
        apiKey: apiKey,
      })

      const responseText = await Promise.race([callPromise, timeoutPromise])
      if (typeof responseText === 'string' && responseText.trim().length > 0) {
        return {
          mode: 'live',
          reply: responseText.trim(),
        }
      }
      return {
        mode: 'sandbox',
        reply: buildFallbackDemoReply(input.message),
      }
    } catch {
      return {
        mode: 'sandbox',
        reply: buildFallbackDemoReply(input.message),
      }
    } finally {
      if (timer) clearTimeout(timer)
    }
  }

  // Default production integration: @google/genai with gemini-2.5-flash
  let timer: NodeJS.Timeout | undefined
  try {
    const ai = new GoogleGenAI({ apiKey: apiKey })

    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new Error(`Gemini API request timed out after ${timeoutLimit}ms`)),
        timeoutLimit
      )
    })

    const callPromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: DEMO_SYSTEM_PROMPT,
        maxOutputTokens: 300,
        temperature: 0.7,
      },
    })

    const response = await Promise.race([callPromise, timeoutPromise])
    const replyText = response.text
    if (replyText && replyText.trim().length > 0) {
      return {
        mode: 'live',
        reply: replyText.trim(),
      }
    }

    return {
      mode: 'sandbox',
      reply: buildFallbackDemoReply(input.message),
    }
  } catch {
    return {
      mode: 'sandbox',
      reply: buildFallbackDemoReply(input.message),
    }
  } finally {
    if (timer) clearTimeout(timer)
  }
}
