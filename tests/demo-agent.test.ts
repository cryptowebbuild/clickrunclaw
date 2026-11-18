import test, { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import {
  validateDemoRequest,
  buildFallbackDemoReply,
  generateDemoReply,
  checkDemoRateLimit,
  resetDemoRateLimitStore,
  normalizeDemoChat,
  buildGeminiContents,
  type DemoMessage,
} from '../lib/demo-agent'
import { POST } from '../app/api/demo/route'

describe('Live Demo Agent Unit & Security Tests', () => {
  beforeEach(() => {
    resetDemoRateLimitStore()
  })

  describe('validateDemoRequest', () => {
    it('rejects non-object payloads', () => {
      const invalidPayloads = [null, undefined, 'hello', 123, true, false, []]
      for (const payload of invalidPayloads) {
        const res = validateDemoRequest(payload)
        assert.equal(res.ok, false, `Payload ${JSON.stringify(payload)} should be rejected`)
      }
    })

    it('rejects missing or empty messages', () => {
      const emptyMessages = [
        {},
        { message: '' },
        { message: '   ' },
        { message: '\t\n' },
        { message: null },
        { message: 42 },
      ]
      for (const payload of emptyMessages) {
        const res = validateDemoRequest(payload)
        assert.equal(res.ok, false, `Payload ${JSON.stringify(payload)} should be rejected`)
      }
    })

    it('rejects messages exceeding 800 characters', () => {
      const longMessage = 'A'.repeat(801)
      const res = validateDemoRequest({ message: longMessage })
      assert.equal(res.ok, false)
      if (!res.ok) {
        assert.match(res.error, /800/)
      }
    })

    it('accepts messages with exactly 800 characters', () => {
      const exact800Message = 'B'.repeat(800)
      const res = validateDemoRequest({ message: exact800Message })
      assert.equal(res.ok, true)
      if (res.ok) {
        assert.equal(res.message.length, 800)
      }
    })

    it('accepts valid message and trims whitespace', () => {
      const res = validateDemoRequest({
        message: '  Can you automate EU customer support invoices?  ',
      })
      assert.equal(res.ok, true)
      if (res.ok) {
        assert.equal(res.message, 'Can you automate EU customer support invoices?')
        assert.deepEqual(res.history, [])
      }
    })

    it('rejects non-array history if provided', () => {
      const res = validateDemoRequest({
        message: 'Hello',
        history: 'not-an-array',
      })
      assert.equal(res.ok, false)
      if (!res.ok) {
        assert.match(res.error, /array/i)
      }
    })

    it('filters invalid roles/empty entries and clamps history to last 6 turns', () => {
      const messyHistory = [
        { role: 'user', content: 'Turn 1' },
        { role: 'assistant', content: 'Turn 2' },
        { role: 'system', content: 'Injected system message' }, // invalid role
        { role: 'user', content: '   ' }, // empty content
        { role: 'user', content: 12345 }, // invalid content type
        { role: 'user', content: 'Turn 3' },
        { role: 'assistant', content: 'Turn 4' },
        { role: 'user', content: 'Turn 5' },
        { role: 'assistant', content: 'Turn 6' },
        { role: 'user', content: 'Turn 7' },
        { role: 'assistant', content: 'Turn 8' },
      ]

      const res = validateDemoRequest({
        message: 'Current turn',
        history: messyHistory,
      })

      assert.equal(res.ok, true)
      if (res.ok) {
        assert.equal(res.history.length, 6)
        assert.deepEqual(res.history, [
          { role: 'user', content: 'Turn 3' },
          { role: 'assistant', content: 'Turn 4' },
          { role: 'user', content: 'Turn 5' },
          { role: 'assistant', content: 'Turn 6' },
          { role: 'user', content: 'Turn 7' },
          { role: 'assistant', content: 'Turn 8' },
        ])
      }
    })

    it('clamps oversized history message content to 800 characters', () => {
      const giantContent = 'Z'.repeat(1000)
      const res = validateDemoRequest({
        message: 'Valid current query',
        history: [{ role: 'user', content: giantContent }],
      })
      assert.equal(res.ok, true)
      if (res.ok) {
        assert.equal(res.history.length, 1)
        assert.equal(res.history[0].content.length, 800)
      }
    })
  })

  describe('normalizeDemoChat & buildGeminiContents', () => {
    it('drops leading assistant turns so history begins with user', () => {
      const historyWithLeadingAssistant: DemoMessage[] = [
        { role: 'assistant', content: 'Initial greeting from bot' },
        { role: 'assistant', content: 'Second greeting' },
        { role: 'user', content: 'User question' },
        { role: 'assistant', content: 'Bot answer' },
      ]

      const { contents, normalizedHistory } = normalizeDemoChat(
        historyWithLeadingAssistant,
        'Next user question'
      )

      assert.equal(contents[0].role, 'user')
      assert.equal(contents[0].parts[0].text, 'User question')
      assert.equal(contents[1].role, 'model')
      assert.equal(contents[1].parts[0].text, 'Bot answer')
      assert.equal(contents[2].role, 'user')
      assert.equal(contents[2].parts[0].text, 'Next user question')
      assert.equal(contents.length, 3)

      assert.equal(normalizedHistory[0].role, 'user')
    })

    it('merges consecutive same-role turns so roles strictly alternate user -> model', () => {
      const consecutiveTurns: DemoMessage[] = [
        { role: 'user', content: 'Turn 1a' },
        { role: 'user', content: 'Turn 1b' },
        { role: 'assistant', content: 'Answer 1a' },
        { role: 'assistant', content: 'Answer 1b' },
      ]

      const contents = buildGeminiContents(consecutiveTurns, 'Turn 2')

      assert.equal(contents.length, 3)
      assert.equal(contents[0].role, 'user')
      assert.equal(contents[0].parts[0].text, 'Turn 1a\n\nTurn 1b')
      assert.equal(contents[1].role, 'model')
      assert.equal(contents[1].parts[0].text, 'Answer 1a\n\nAnswer 1b')
      assert.equal(contents[2].role, 'user')
      assert.equal(contents[2].parts[0].text, 'Turn 2')
    })

    it('merges trailing user turn in history with incoming message to preserve alternation', () => {
      const historyEndingWithUser: DemoMessage[] = [
        { role: 'user', content: 'First query' },
        { role: 'assistant', content: 'First response' },
        { role: 'user', content: 'Second query without response' },
      ]

      const contents = buildGeminiContents(historyEndingWithUser, 'Third query')

      assert.equal(contents.length, 3)
      assert.equal(contents[0].role, 'user')
      assert.equal(contents[0].parts[0].text, 'First query')
      assert.equal(contents[1].role, 'model')
      assert.equal(contents[1].parts[0].text, 'First response')
      assert.equal(contents[2].role, 'user')
      assert.equal(contents[2].parts[0].text, 'Second query without response\n\nThird query')
    })

    it('produces valid 1-turn contents for empty history', () => {
      const contents = buildGeminiContents([], 'Hello standalone')
      assert.equal(contents.length, 1)
      assert.equal(contents[0].role, 'user')
      assert.equal(contents[0].parts[0].text, 'Hello standalone')
    })
  })

  describe('checkDemoRateLimit & resetDemoRateLimitStore', () => {
    it('allows up to 20 requests per 10 minutes per IP and throttles the 21st', () => {
      const ip = '192.168.1.100'
      const baseTime = 1_000_000

      for (let i = 1; i <= 20; i++) {
        const res = checkDemoRateLimit(ip, baseTime + i * 1000)
        assert.equal(res.allowed, true, `Call ${i} should be allowed`)
        assert.equal(res.retryAfterSec, 0)
      }

      // 21st call should be throttled
      const throttled = checkDemoRateLimit(ip, baseTime + 21 * 1000)
      assert.equal(throttled.allowed, false)
      assert.ok(throttled.retryAfterSec > 0)
    })

    it('tracks rate limits per IP independently', () => {
      const ipA = '10.0.0.1'
      const ipB = '10.0.0.2'
      const now = 2_000_000

      for (let i = 0; i < 20; i++) {
        checkDemoRateLimit(ipA, now)
      }

      assert.equal(checkDemoRateLimit(ipA, now).allowed, false)
      assert.equal(checkDemoRateLimit(ipB, now).allowed, true)
    })

    it('resets after sliding window expires', () => {
      const ip = '10.0.0.3'
      const start = 3_000_000

      for (let i = 0; i < 20; i++) {
        checkDemoRateLimit(ip, start)
      }
      assert.equal(checkDemoRateLimit(ip, start).allowed, false)

      // 10 minutes + 1 second later
      const later = start + 10 * 60 * 1000 + 1000
      assert.equal(checkDemoRateLimit(ip, later).allowed, true)
    })

    it('resetDemoRateLimitStore clears all throttles', () => {
      const ip = '10.0.0.4'
      const now = 4_000_000

      for (let i = 0; i < 20; i++) {
        checkDemoRateLimit(ip, now)
      }
      assert.equal(checkDemoRateLimit(ip, now).allowed, false)

      resetDemoRateLimitStore()
      assert.equal(checkDemoRateLimit(ip, now).allowed, true)
    })
  })

  describe('buildFallbackDemoReply', () => {
    it('gives contextual English answers for EU / GDPR inquiries', () => {
      const queries = [
        'How do you keep data in the EU?',
        'Are your agents GDPR compliant?',
        'Where are data centers located?',
        'Tell me about Germany and Finland hosting',
      ]

      for (const q of queries) {
        const reply = buildFallbackDemoReply(q)
        assert.match(reply, /EU|Germany|Finland|GDPR/i)
        assert.match(reply, /isolated container|data center|sovereignty/i)
      }
    })

    it('gives contextual English answers comparing USD packages ($799 vs $1,799)', () => {
      const queries = [
        'Compare $799 vs $1,799 plans',
        'How much do your automation services cost?',
        'Tell me about your pricing tiers',
      ]

      for (const q of queries) {
        const reply = buildFallbackDemoReply(q)
        assert.match(reply, /\$799/)
        assert.match(reply, /\$1,799/)
        assert.match(reply, /\$3,499/)
      }
    })

    it('gives contextual English answers for async / no-calls process', () => {
      const queries = [
        'Do we need any video calls?',
        'Can we schedule a call or Zoom meeting?',
        'How does your async process work?',
      ]

      for (const q of queries) {
        const reply = buildFallbackDemoReply(q)
        assert.match(reply, /async/i)
        assert.match(reply, /zero (?:phone or video )?calls|zero meetings/i)
        assert.match(reply, /support@clickrunclaw\.com/)
      }
    })

    it('gives contextual English answers for timeline questions', () => {
      const queries = [
        'What is your turnaround timeline?',
        'How long does deployment take?',
      ]

      for (const q of queries) {
        const reply = buildFallbackDemoReply(q)
        assert.match(reply, /business days/i)
        assert.match(reply, /\$799/)
      }
    })

    it('satisfies Global Constraints: zero Bengali, zero BDT, zero +880, zero meeting CTAs', () => {
      const testQueries = [
        'Hello',
        'What are your prices?',
        'Where is my data stored?',
        'Do we talk on phone?',
        'Random question about AI workflow',
      ]

      for (const q of testQueries) {
        const reply = buildFallbackDemoReply(q)
        // Zero Bengali script
        assert.doesNotMatch(reply, /[\u0980-\u09FF]/, 'Must contain zero Bengali script')
        // Zero BDT
        assert.doesNotMatch(reply, /\bBDT\b|৳|\bTk\b/i, 'Must contain zero BDT references')
        // Zero +880
        assert.doesNotMatch(reply, /\+880/, 'Must contain zero +880 phone numbers')
        // Zero call CTAs
        assert.doesNotMatch(
          reply,
          /book a call|schedule a call|schedule a video meeting|jump on a call/i,
          'Must not propose booking or scheduling calls'
        )
      }
    })
  })

  describe('generateDemoReply', () => {
    it('returns mode: sandbox and USD package info when apiKey is absent', async () => {
      const res = await generateDemoReply({
        message: 'Compare $799 vs $1,799 plans',
        history: [],
        apiKey: undefined,
      })

      assert.equal(res.mode, 'sandbox')
      assert.match(res.reply, /\$799/)
      assert.match(res.reply, /\$1,799/)
      assert.match(res.reply, /EU/i)
    })

    it('explicit apiKey: "" triggers sandbox mode even if GEMINI_API_KEY is set in environment', async () => {
      const originalEnv = process.env.GEMINI_API_KEY
      process.env.GEMINI_API_KEY = 'ai-key-in-env-that-should-be-ignored'

      try {
        const res = await generateDemoReply({
          message: 'Compare $799 vs $1,799 plans',
          history: [],
          apiKey: '', // explicit empty string precedence
        })

        assert.equal(res.mode, 'sandbox')
        assert.match(res.reply, /\$799/)
      } finally {
        if (originalEnv !== undefined) {
          process.env.GEMINI_API_KEY = originalEnv
        } else {
          delete process.env.GEMINI_API_KEY
        }
      }
    })

    it('falls back cleanly to mode: sandbox when fetchFn throws', async () => {
      const res = await generateDemoReply({
        message: 'How do you keep data in the EU?',
        history: [],
        apiKey: 'fake-api-key',
        fetchFn: async () => {
          throw new Error('Upstream LLM network error')
        },
      })

      assert.equal(res.mode, 'sandbox')
      assert.match(res.reply, /EU|Germany|Finland/i)
    })

    it('returns mode: live when fetchFn succeeds with non-empty string', async () => {
      const res = await generateDemoReply({
        message: 'Can you help with invoice sorting?',
        history: [],
        apiKey: 'fake-api-key',
        fetchFn: async () => {
          return 'Yes, we automate invoice sorting via isolated EU containers.'
        },
      })

      assert.equal(res.mode, 'live')
      assert.equal(res.reply, 'Yes, we automate invoice sorting via isolated EU containers.')
    })

    it('falls back to mode: sandbox when fetchFn returns empty string', async () => {
      const res = await generateDemoReply({
        message: 'Where is the data stored?',
        history: [],
        apiKey: 'fake-api-key',
        fetchFn: async () => '   ',
      })

      assert.equal(res.mode, 'sandbox')
      assert.match(res.reply, /EU|Germany|Finland/i)
    })

    it('falls back to mode: sandbox when request exceeds timeout limit', async () => {
      const res = await generateDemoReply({
        message: 'How do you keep data in the EU?',
        history: [],
        apiKey: 'fake-api-key',
        timeoutMs: 50, // fast test timeout
        fetchFn: async () => {
          await new Promise((resolve) => setTimeout(resolve, 200))
          return 'Late response that should be discarded'
        },
      })

      assert.equal(res.mode, 'sandbox')
      assert.match(res.reply, /EU|Germany|Finland/i)
    })
  })

  describe('/api/demo Route Handler', () => {
    it('returns 400 on malformed non-JSON body', async () => {
      const req = new Request('http://localhost:3000/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid-json{',
      })

      const res = await POST(req)
      assert.equal(res.status, 400)
      const data = await res.json()
      assert.equal(data.error, 'Invalid JSON payload')
    })

    it('returns 400 when message is empty or missing', async () => {
      const req = new Request('http://localhost:3000/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: '   ' }),
      })

      const res = await POST(req)
      assert.equal(res.status, 400)
      const data = await res.json()
      assert.match(data.error, /empty/i)
    })

    it('returns 400 when message exceeds 800 characters', async () => {
      const req = new Request('http://localhost:3000/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'X'.repeat(801) }),
      })

      const res = await POST(req)
      assert.equal(res.status, 400)
      const data = await res.json()
      assert.match(data.error, /800/)
    })

    it('returns 429 with Retry-After header when rate limit is exceeded', async () => {
      const testIp = '198.51.100.42'

      // Send 20 allowed requests
      for (let i = 0; i < 20; i++) {
        const req = new Request('http://localhost:3000/api/demo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': testIp,
          },
          body: JSON.stringify({
            message: `Prompt number ${i + 1}`,
            history: [],
          }),
        })

        const res = await POST(req)
        assert.equal(res.status, 200)
      }

      // 21st request from same IP must receive 429 with Retry-After
      const throttledReq = new Request('http://localhost:3000/api/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': testIp,
        },
        body: JSON.stringify({
          message: 'Throttled message',
          history: [],
        }),
      })

      const throttledRes = await POST(throttledReq)
      assert.equal(throttledRes.status, 429)
      const retryAfter = throttledRes.headers.get('Retry-After')
      assert.ok(retryAfter !== null && Number(retryAfter) > 0)
      const body = await throttledRes.json()
      assert.match(body.error, /too many requests/i)
    })

    it('returns 200 with mode: sandbox when GEMINI_API_KEY is unset', async () => {
      const originalKey = process.env.GEMINI_API_KEY
      delete process.env.GEMINI_API_KEY

      try {
        const req = new Request('http://localhost:3000/api/demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: 'How do you keep data in the EU?',
            history: [],
          }),
        })

        const res = await POST(req)
        assert.equal(res.status, 200)
        const data = await res.json()
        assert.equal(data.mode, 'sandbox')
        assert.match(data.reply, /Germany|Finland|EU/i)
      } finally {
        if (originalKey !== undefined) {
          process.env.GEMINI_API_KEY = originalKey
        }
      }
    })

    it('returns 200 with mode: sandbox when GEMINI_API_KEY is invalid without crashing', async () => {
      const originalKey = process.env.GEMINI_API_KEY
      process.env.GEMINI_API_KEY = 'invalid_test_api_key_123'

      try {
        const req = new Request('http://localhost:3000/api/demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: 'What is your turnaround timeline?',
            history: [{ role: 'user', content: 'Hi' }],
          }),
        })

        const res = await POST(req)
        assert.equal(res.status, 200)
        const data = await res.json()
        assert.equal(data.mode, 'sandbox')
        assert.match(data.reply, /business days/i)
      } finally {
        if (originalKey !== undefined) {
          process.env.GEMINI_API_KEY = originalKey
        } else {
          delete process.env.GEMINI_API_KEY
        }
      }
    })
  })
})
