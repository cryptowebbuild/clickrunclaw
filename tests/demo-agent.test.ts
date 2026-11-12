import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  validateDemoRequest,
  buildFallbackDemoReply,
  generateDemoReply,
  type DemoMessage,
} from '../lib/demo-agent'
import { POST } from '../app/api/demo/route'

describe('Live Demo Agent Unit & Security Tests', () => {
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
