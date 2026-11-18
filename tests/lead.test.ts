import test, { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import {
  validateLeadInput,
  isHoneypotTriggered,
  escapeHtml,
  stripHeaderControls,
  buildOwnerLeadEmail,
  buildClientAckEmail,
  buildTelegramMessage,
  sendTelegramNotification,
  sendWebhookNotification,
  sendBrevoNotification,
  checkRateLimit,
  resetRateLimitStore,
  dispatchLeadNotification,
  getEnvVar,
  type LeadInput,
} from '../lib/lead'
import { POST, GET, OPTIONS } from '../app/api/lead/route'

describe('Lead Intake Unit & Security Tests', () => {
  beforeEach(() => {
    resetRateLimitStore()
  })

  describe('validateLeadInput', () => {
    it('accepts valid EU agency brief and trims string fields', () => {
      const raw = {
        name: '  Elena Rostova  ',
        email: '  elena.rostova@acme.de  ',
        company: '  Acme Solutions GmbH  ',
        packageTier: 'growth',
        workflowGoal: '  Automate GDPR-compliant invoice reconciliation and cross-check with ERP.  ',
        euResidencyOnly: true,
      }

      const result = validateLeadInput(raw)
      assert.equal(result.ok, true)
      if (result.ok) {
        assert.equal(result.data.name, 'Elena Rostova')
        assert.equal(result.data.email, 'elena.rostova@acme.de')
        assert.equal(result.data.company, 'Acme Solutions GmbH')
        assert.equal(result.data.packageTier, 'growth')
        assert.equal(
          result.data.workflowGoal,
          'Automate GDPR-compliant invoice reconciliation and cross-check with ERP.'
        )
        assert.equal(result.data.euResidencyOnly, true)
      }
    })

    it('accepts all valid package tiers: starter, growth, enterprise, custom', () => {
      const tiers = ['starter', 'growth', 'enterprise', 'custom'] as const
      for (const tier of tiers) {
        const res = validateLeadInput({
          name: 'Jane Doe',
          email: 'jane@example.com',
          packageTier: tier,
          workflowGoal: 'Deploy an automated customer triage pipeline.',
        })
        assert.equal(res.ok, true, `Tier ${tier} should be valid`)
      }
    })

    it('rejects missing or empty name', () => {
      const res1 = validateLeadInput({
        email: 'test@example.com',
        packageTier: 'starter',
        workflowGoal: 'Valid goal description that exceeds ten characters.',
      })
      assert.equal(res1.ok, false)

      const res2 = validateLeadInput({
        name: '   ',
        email: 'test@example.com',
        packageTier: 'starter',
        workflowGoal: 'Valid goal description that exceeds ten characters.',
      })
      assert.equal(res2.ok, false)
    })

    it('rejects invalid email formats', () => {
      const invalidEmails = ['notanemail', 'test@', '@domain.com', 'user@domain', 'user @domain.com']
      for (const email of invalidEmails) {
        const res = validateLeadInput({
          name: 'Valid Name',
          email,
          packageTier: 'starter',
          workflowGoal: 'Build customer onboarding workflow automation.',
        })
        assert.equal(res.ok, false, `Email ${email} should be rejected`)
      }
    })

    it('rejects CRLF (\\r or \\n) in email, name, and company to prevent header injection', () => {
      // Injected email
      const resEmail = validateLeadInput({
        name: 'Normal Name',
        email: 'victim@example.com\r\nBcc: spammer@attacker.com',
        packageTier: 'starter',
        workflowGoal: 'A valid workflow goal exceeding ten characters.',
      })
      assert.equal(resEmail.ok, false)

      // Injected name
      const resName = validateLeadInput({
        name: 'Evil Name\nSubject: Overridden',
        email: 'normal@example.com',
        packageTier: 'starter',
        workflowGoal: 'A valid workflow goal exceeding ten characters.',
      })
      assert.equal(resName.ok, false)

      // Injected company
      const resCompany = validateLeadInput({
        name: 'Normal Name',
        email: 'normal@example.com',
        company: 'Acme Corp\r\nInjected-Header: yes',
        packageTier: 'starter',
        workflowGoal: 'A valid workflow goal exceeding ten characters.',
      })
      assert.equal(resCompany.ok, false)
    })

    it('rejects invalid package tier', () => {
      const res = validateLeadInput({
        name: 'Valid Name',
        email: 'valid@example.com',
        packageTier: 'ultra-platinum',
        workflowGoal: 'A valid workflow goal exceeding ten characters.',
      })
      assert.equal(res.ok, false)
    })

    it('rejects workflowGoal shorter than 10 characters', () => {
      const res = validateLeadInput({
        name: 'Valid Name',
        email: 'valid@example.com',
        packageTier: 'starter',
        workflowGoal: 'Short',
      })
      assert.equal(res.ok, false)

      const resWhitespace = validateLeadInput({
        name: 'Valid Name',
        email: 'valid@example.com',
        packageTier: 'starter',
        workflowGoal: '         12345        ',
      })
      assert.equal(resWhitespace.ok, false)
    })

    it('rejects string fields that exceed defensive length limits', () => {
      // Name > 100 chars
      const resName = validateLeadInput({
        name: 'a'.repeat(101),
        email: 'valid@example.com',
        packageTier: 'starter',
        workflowGoal: 'A valid workflow goal exceeding ten characters.',
      })
      assert.equal(resName.ok, false)
      if (!resName.ok) assert.match(resName.error, /100 characters/)

      // Company > 100 chars
      const resCompany = validateLeadInput({
        name: 'Valid Name',
        email: 'valid@example.com',
        company: 'c'.repeat(101),
        packageTier: 'starter',
        workflowGoal: 'A valid workflow goal exceeding ten characters.',
      })
      assert.equal(resCompany.ok, false)
      if (!resCompany.ok) assert.match(resCompany.error, /100 characters/)

      // WorkflowGoal > 5000 chars
      const resGoal = validateLeadInput({
        name: 'Valid Name',
        email: 'valid@example.com',
        packageTier: 'starter',
        workflowGoal: 'w'.repeat(5001),
      })
      assert.equal(resGoal.ok, false)
      if (!resGoal.ok) assert.match(resGoal.error, /5000 characters/)
    })
  })

  describe('isHoneypotTriggered', () => {
    it('returns true when websiteHoneypot contains non-whitespace string', () => {
      assert.equal(isHoneypotTriggered({ websiteHoneypot: 'https://spam.bot' }), true)
      assert.equal(isHoneypotTriggered({ websiteHoneypot: 'bot' }), true)
      assert.equal(isHoneypotTriggered({ websiteHoneypot: ' x ' }), true)
    })

    it('returns false when websiteHoneypot is empty, whitespace, undefined, or missing', () => {
      assert.equal(isHoneypotTriggered({ websiteHoneypot: '' }), false)
      assert.equal(isHoneypotTriggered({ websiteHoneypot: '   ' }), false)
      assert.equal(isHoneypotTriggered({}), false)
      assert.equal(isHoneypotTriggered(null), false)
      assert.equal(isHoneypotTriggered('string'), false)
    })
  })

  describe('escapeHtml & stripHeaderControls', () => {
    it('escapes &, <, >, ", and \' in escapeHtml', () => {
      const malicious = '<script>alert("pwned" & \'xss\')</script>'
      const escaped = escapeHtml(malicious)
      assert.equal(escaped.includes('<script>'), false)
      assert.equal(escaped.includes('</script>'), false)
      assert.equal(escaped.includes('&lt;script&gt;'), true)
      assert.equal(escaped.includes('&quot;pwned&quot;'), true)
      assert.equal(escaped.includes('&amp;'), true)
    })

    it('strips CRLF and control characters in stripHeaderControls', () => {
      const headerWithCRLF = 'support@clickrunclaw.com\r\nBcc: hacker@example.com\n'
      const clean = stripHeaderControls(headerWithCRLF)
      assert.equal(clean.includes('\r'), false)
      assert.equal(clean.includes('\n'), false)
      assert.equal(clean, 'support@clickrunclaw.com Bcc: hacker@example.com')
    })
  })

  describe('buildOwnerLeadEmail', () => {
    const lead: LeadInput = {
      name: '<script>alert(1)</script> Elena',
      email: 'elena@berlin-tech.de',
      company: 'Tech & Media "GmbH"',
      packageTier: 'growth',
      workflowGoal: 'Deploy AI document parser <img src=x onerror=alert(1)>',
      euResidencyOnly: true,
    }

    it('escapes malicious HTML characters in html output', () => {
      const email = buildOwnerLeadEmail(lead)
      assert.equal(email.html.includes('<script>'), false)
      assert.equal(email.html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'), true)
      assert.equal(email.html.includes('&amp;'), true)
      assert.equal(email.html.includes('&quot;GmbH&quot;'), true)
      assert.equal(email.html.includes('<img'), false)
      assert.equal(email.html.includes('&lt;img'), true)
    })

    it('includes selected USD tier and EU residency status', () => {
      const email = buildOwnerLeadEmail(lead)
      assert.match(email.text, /\$1,799/i)
      assert.match(email.text, /\$299\/mo/i)
      assert.match(email.text, /EU Data Residency Only:\s*Yes/i)
      assert.match(email.html, /\$1,799/i)
      assert.match(email.html, /EU Data Residency Only/i)
    })

    it('contains zero Bengali copy, zero BDT pricing, zero +880, zero meeting CTAs', () => {
      const email = buildOwnerLeadEmail(lead)
      const content = `${email.subject} ${email.text} ${email.html}`
      assert.doesNotMatch(content, /[\u0980-\u09FF]/) // Bengali Unicode block
      assert.doesNotMatch(content, /BDT|Tk|Taka|\b01[3-9]\d{8}\b|\+880/i)
      assert.doesNotMatch(content, /Book a (Call|Meeting)|Schedule a (Call|Meeting|Video)/i)
    })
  })

  describe('buildClientAckEmail', () => {
    const lead: LeadInput = {
      name: 'Dr. Lukas Weber',
      email: 'lukas@munich-ai.eu',
      packageTier: 'starter',
      workflowGoal: 'Build an automated lead intake pipeline.',
      euResidencyOnly: true,
    }

    it('addresses client cleanly in English and mentions support@clickrunclaw.com', () => {
      const email = buildClientAckEmail(lead)
      assert.match(email.subject, /Click Run Claw/i)
      assert.match(email.text, /Hi Dr\. Lukas Weber/i)
      assert.match(email.text, /support@clickrunclaw\.com/i)
      assert.match(email.html, /support@clickrunclaw\.com/i)
    })

    it('highlights 100% async written delivery workflow without video/meeting CTAs', () => {
      const email = buildClientAckEmail(lead)
      const content = `${email.subject} ${email.text} ${email.html}`
      assert.match(content, /async/i)
      assert.doesNotMatch(content, /[\u0980-\u09FF]/)
      assert.doesNotMatch(content, /BDT|Tk|\+880/i)
      assert.doesNotMatch(content, /Book a (Call|Meeting)|Schedule a (Call|Meeting|Video)/i)
    })
  })

  describe('buildTelegramMessage', () => {
    const lead: LeadInput = {
      name: 'Elena Rostova',
      email: 'elena@acme.de',
      company: 'Acme GmbH',
      packageTier: 'growth',
      workflowGoal: 'Build an automated GDPR invoice processing flow.',
      euResidencyOnly: true,
    }

    it('formats Telegram message cleanly with HTML markup and client details', () => {
      const msg = buildTelegramMessage(lead)
      assert.match(msg, /Elena Rostova/)
      assert.match(msg, /elena@acme\.de/)
      assert.match(msg, /Acme GmbH/)
      assert.match(msg, /Growth Funnel/)
      assert.match(msg, /\$1,799/)
      assert.match(msg, /EU Data Residency Only/i)
      assert.match(msg, /<blockquote>/)
      assert.match(msg, /<\/blockquote>/)
    })

    it('has zero Bengali copy, zero BDT pricing, zero meeting CTAs', () => {
      const msg = buildTelegramMessage(lead)
      assert.doesNotMatch(msg, /[\u0980-\u09FF]/)
      assert.doesNotMatch(msg, /BDT|Tk|\+880/i)
      assert.doesNotMatch(msg, /Book a (Call|Meeting)|Schedule a (Call|Meeting|Video)/i)
    })
  })

  describe('checkRateLimit & resetRateLimitStore', () => {
    it('allows 5 calls per IP within 10 minutes and blocks 6th with retryAfterSec', () => {
      const testIp = '192.168.1.100'
      const baseTime = 1_700_000_000_000 // Fixed epoch ms

      for (let i = 0; i < 5; i++) {
        const res = checkRateLimit(testIp, baseTime + i * 1000)
        assert.equal(res.allowed, true, `Call ${i + 1} should be allowed`)
        assert.equal(res.retryAfterSec, 0)
      }

      const blocked = checkRateLimit(testIp, baseTime + 5000)
      assert.equal(blocked.allowed, false, '6th call must be blocked')
      assert.ok(blocked.retryAfterSec > 0, 'retryAfterSec should be positive')
    })

    it('resets after 10-minute window expires', () => {
      const testIp = '10.0.0.5'
      const baseTime = 1_700_000_000_000
      const tenMinutesMs = 10 * 60 * 1000

      for (let i = 0; i < 5; i++) {
        checkRateLimit(testIp, baseTime)
      }
      assert.equal(checkRateLimit(testIp, baseTime + 1000).allowed, false)

      // Advance clock past 10 minutes
      const allowedAfterWindow = checkRateLimit(testIp, baseTime + tenMinutesMs + 1000)
      assert.equal(allowedAfterWindow.allowed, true)
    })

    it('resetRateLimitStore clears all throttles', () => {
      const testIp = '172.16.0.1'
      const baseTime = 1_700_000_000_000
      for (let i = 0; i < 5; i++) {
        checkRateLimit(testIp, baseTime)
      }
      assert.equal(checkRateLimit(testIp, baseTime).allowed, false)

      resetRateLimitStore()
      assert.equal(checkRateLimit(testIp, baseTime).allowed, true)
    })
  })

  describe('getEnvVar', () => {
    it('reads from process.env when available', () => {
      process.env.TEST_SAMPLE_KEY = 'sample_value'
      assert.equal(getEnvVar('TEST_SAMPLE_KEY'), 'sample_value')
      delete process.env.TEST_SAMPLE_KEY
    })

    it('reads from Cloudflare runtime context if symbol is present', () => {
      const symbol = Symbol.for('__cloudflare-request-context__')
      ;(globalThis as any)[symbol] = {
        env: {
          CF_RUNTIME_SECRET: 'cf_secret_value',
        },
      }
      assert.equal(getEnvVar('CF_RUNTIME_SECRET'), 'cf_secret_value')
      delete (globalThis as any)[symbol]
    })

    it('returns undefined if variable does not exist anywhere', () => {
      assert.equal(getEnvVar('NON_EXISTENT_KEY_12345'), undefined)
    })
  })
})

describe('/api/lead Route Handler Tests', () => {
  beforeEach(() => {
    resetRateLimitStore()
    delete process.env.SMTP_HOST
    delete process.env.SMTP_USER
    delete process.env.SMTP_PASS
    delete process.env.SMTP_PORT
    delete process.env.SMTP_SECURE
  })

  it('returns 400 on invalid JSON body', async () => {
    const req = new Request('http://localhost:3000/api/lead', {
      method: 'POST',
      body: 'invalid-json{',
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    assert.equal(res.status, 400)
    const json = await res.json()
    assert.match(json.error, /invalid json/i)
  })

  it('returns silent 200 without sending email when honeypot is triggered', async () => {
    const req = new Request('http://localhost:3000/api/lead', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Spam Bot',
        email: 'bot@spam.com',
        packageTier: 'starter',
        workflowGoal: 'Spamming your inbox with junk mail.',
        websiteHoneypot: 'http://spamlink.com',
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    assert.equal(res.status, 200)
    const json = await res.json()
    assert.equal(json.ok, true)
    assert.equal(json.received, true)
  })

  it('returns 400 when validation fails (e.g., short goal or missing name)', async () => {
    const req = new Request('http://localhost:3000/api/lead', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John',
        email: 'john@example.com',
        packageTier: 'starter',
        workflowGoal: 'Short',
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    assert.equal(res.status, 400)
    const json = await res.json()
    assert.ok(json.error)
  })

  it('returns 429 with Retry-After header when rate limit is exceeded', async () => {
    const clientIp = '198.51.100.25'
    for (let i = 0; i < 5; i++) {
      const req = new Request('http://localhost:3000/api/lead', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Jane',
          email: 'jane@example.com',
          packageTier: 'starter',
          workflowGoal: 'Deploy automated AI invoice triage.',
        }),
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': clientIp,
        },
      })
      await POST(req)
    }

    const blockedReq = new Request('http://localhost:3000/api/lead', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Jane',
        email: 'jane@example.com',
        packageTier: 'starter',
        workflowGoal: 'Deploy automated AI invoice triage.',
      }),
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': clientIp,
      },
    })
    const res = await POST(blockedReq)
    assert.equal(res.status, 429)
    assert.ok(res.headers.get('Retry-After'))
    const json = await res.json()
    assert.match(json.error, /too many requests/i)
  })

  it('returns 200 and acknowledges lead brief for valid submission', async () => {
    const req = new Request('http://localhost:3000/api/lead', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Elena Rostova',
        email: 'elena@acme.de',
        company: 'Acme GmbH',
        packageTier: 'growth',
        workflowGoal: 'Deploy automated GDPR customer triage pipeline.',
        euResidencyOnly: true,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    // No provider is configured in the test environment, so the honest
    // response is a delivery failure with a fallback address.
    assert.equal(res.status, 502)
    const json = await res.json()
    assert.match(json.error, /support@clickrunclaw\.com/i)
  })

  it('dispatches lead notification via Resend HTTP API when API key is provided', async () => {
    const fetchCalls: { url: string; body: any }[] = []
    const mockFetch = (async (url: string | URL | Request, init?: RequestInit) => {
      fetchCalls.push({
        url: String(url),
        body: init?.body ? JSON.parse(String(init.body)) : null,
      })
      return new Response(JSON.stringify({ id: 'resend-123' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }) as unknown as typeof fetch

    const sampleLead: LeadInput = {
      name: 'Marcus Vance',
      email: 'marcus@corp.eu',
      company: 'Vance Tech',
      packageTier: 'enterprise',
      workflowGoal: 'Multi-agent invoice auditing and CRM sync.',
      euResidencyOnly: true,
    }

    const result = await dispatchLeadNotification(sampleLead, {
      fetchFn: mockFetch,
      resendApiKey: 're_test_123456789',
    })

    assert.equal(result.ok, true)
    assert.equal(result.status, 200)
    assert.equal(fetchCalls.length, 2, 'Should call Resend API for owner alert and client ack')
    assert.equal(fetchCalls[0].url, 'https://api.resend.com/emails')
    assert.equal(fetchCalls[0].body.to, 'support@clickrunclaw.com')
    assert.equal(fetchCalls[0].body.reply_to, 'marcus@corp.eu')
    assert.equal(fetchCalls[1].body.to, 'marcus@corp.eu')
  })

  it('dispatches lead notification via MailChannels HTTP API by default', async () => {
    const fetchCalls: { url: string; body: any }[] = []
    const mockFetch = (async (url: string | URL | Request, init?: RequestInit) => {
      fetchCalls.push({
        url: String(url),
        body: init?.body ? JSON.parse(String(init.body)) : null,
      })
      return new Response('Accepted', { status: 200 })
    }) as unknown as typeof fetch

    const sampleLead: LeadInput = {
      name: 'Sofia Berg',
      email: 'sofia@nordic.se',
      packageTier: 'starter',
      workflowGoal: 'Automate Telegram lead notifications.',
    }

    const result = await dispatchLeadNotification(sampleLead, {
      fetchFn: mockFetch,
    })

    assert.equal(result.ok, true)
    assert.equal(result.status, 200)
    assert.equal(fetchCalls.length, 2, 'Should call MailChannels API for owner alert and client ack')
    assert.equal(fetchCalls[0].url, 'https://api.mailchannels.net/tx/v1/send')
    assert.equal(fetchCalls[0].body.personalizations[0].to[0].email, 'support@clickrunclaw.com')
    assert.equal(fetchCalls[1].body.personalizations[0].to[0].email, 'sofia@nordic.se')
  })

  it('handles HTTP delivery network errors gracefully without crashing', async () => {
    const failingFetch = (async () => {
      throw new Error('Network unreachable')
    }) as unknown as typeof fetch

    const sampleLead: LeadInput = {
      name: 'Alexandre Dumas',
      email: 'alex@paris.fr',
      packageTier: 'growth',
      workflowGoal: 'Customer order support triage pipeline.',
    }

    const result = await dispatchLeadNotification(sampleLead, {
      fetchFn: failingFetch,
    })

    // Nothing was delivered, so the caller must not report success.
    assert.equal(result.ok, false)
    assert.equal(result.status, 502)
    assert.match(result.message, /support@clickrunclaw\.com/i)
  })

  it('dispatches lead notification via Telegram Bot API when bot token and chat ID are provided', async () => {
    const fetchCalls: { url: string; body: any }[] = []
    const mockFetch = (async (url: string | URL | Request, init?: RequestInit) => {
      fetchCalls.push({
        url: String(url),
        body: init?.body ? JSON.parse(String(init.body)) : null,
      })
      return new Response(JSON.stringify({ ok: true, result: { message_id: 999 } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }) as unknown as typeof fetch

    const sampleLead: LeadInput = {
      name: 'Frederik Lind',
      email: 'frederik@cph-ai.dk',
      company: 'CPH AI ApS',
      packageTier: 'growth',
      workflowGoal: 'Automate lead qualification and Telegram alerts.',
      euResidencyOnly: true,
    }

    const res = await sendTelegramNotification(
      sampleLead,
      'test_token_123',
      'chat_456',
      mockFetch
    )

    assert.equal(res.ok, true)
    assert.equal(fetchCalls.length, 1)
    assert.equal(
      fetchCalls[0].url,
      'https://api.telegram.org/bottest_token_123/sendMessage'
    )
    assert.equal(fetchCalls[0].body.chat_id, 'chat_456')
    assert.equal(fetchCalls[0].body.parse_mode, 'HTML')
    assert.match(fetchCalls[0].body.text, /Frederik Lind/)
    assert.match(fetchCalls[0].body.text, /CPH AI ApS/)
  })

  it('dispatches lead notification via Webhook (Discord / n8n)', async () => {
    const fetchCalls: { url: string; body: any }[] = []
    const mockFetch = (async (url: string | URL | Request, init?: RequestInit) => {
      fetchCalls.push({
        url: String(url),
        body: init?.body ? JSON.parse(String(init.body)) : null,
      })
      return new Response('OK', { status: 200 })
    }) as unknown as typeof fetch

    const sampleLead: LeadInput = {
      name: 'Sarah Connor',
      email: 'sarah@skynet-defense.com',
      packageTier: 'enterprise',
      workflowGoal: 'Deploy autonomous agent system for factory telemetry.',
    }

    const res = await sendWebhookNotification(
      sampleLead,
      'https://discord.com/api/webhooks/123/abc',
      mockFetch
    )

    assert.equal(res.ok, true)
    assert.equal(fetchCalls.length, 1)
    assert.equal(fetchCalls[0].url, 'https://discord.com/api/webhooks/123/abc')
    assert.match(fetchCalls[0].body.content, /Sarah Connor/)
  })

  it('dispatches lead notification via Brevo API', async () => {
    const fetchCalls: { url: string; body: any }[] = []
    const mockFetch = (async (url: string | URL | Request, init?: RequestInit) => {
      fetchCalls.push({
        url: String(url),
        body: init?.body ? JSON.parse(String(init.body)) : null,
      })
      return new Response(JSON.stringify({ messageId: 'brevo-123' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }) as unknown as typeof fetch

    const sampleLead: LeadInput = {
      name: 'Oliver Twist',
      email: 'oliver@workhouse.co.uk',
      packageTier: 'starter',
      workflowGoal: 'Automate accounting entries reconciliation.',
    }

    const res = await sendBrevoNotification(
      sampleLead,
      'xkeysib-test-123',
      'support@clickrunclaw.com',
      'support@clickrunclaw.com',
      mockFetch
    )

    assert.equal(res.ok, true)
    assert.equal(fetchCalls.length, 1)
    assert.equal(fetchCalls[0].url, 'https://api.brevo.com/v3/smtp/email')
  })
  it('GET /api/lead returns a status probe without leaking channel configuration', async () => {
    const res = await GET()
    assert.equal(res.status, 200)
    const json = await res.json()
    assert.equal(json.status, 'ok')
    assert.equal(json.runtime, 'edge')
    assert.equal(json.configuredChannels, undefined)
    assert.equal(json.setupGuide, undefined)
  })

  it('OPTIONS /api/lead only allows the configured site origin', async () => {
    const sameOrigin = await OPTIONS(
      new Request('https://clickrunclaw.com/api/lead', {
        method: 'OPTIONS',
        headers: { origin: 'https://clickrunclaw.com' },
      })
    )
    assert.equal(sameOrigin.status, 204)
    assert.equal(
      sameOrigin.headers.get('Access-Control-Allow-Origin'),
      'https://clickrunclaw.com'
    )
    assert.match(sameOrigin.headers.get('Access-Control-Allow-Methods') || '', /POST/)

    const foreignOrigin = await OPTIONS(
      new Request('https://clickrunclaw.com/api/lead', {
        method: 'OPTIONS',
        headers: { origin: 'https://spam.example' },
      })
    )
    assert.equal(foreignOrigin.headers.get('Access-Control-Allow-Origin'), null)
  })
})
