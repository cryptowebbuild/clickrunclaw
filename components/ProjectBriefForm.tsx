'use client'

import React, { useState } from 'react'
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Send,
  Lock,
} from 'lucide-react'

export type PackageTier = 'starter' | 'growth' | 'enterprise' | 'custom'

export interface ProjectBriefFormProps {
  selectedTier: PackageTier
  onTierChange?: (tier: PackageTier) => void
}

interface TierOption {
  id: PackageTier
  name: string
  price: string
  subtext: string
  popular?: boolean
}

const TIER_OPTIONS: TierOption[] = [
  {
    id: 'starter',
    name: 'Starter Automation',
    price: '$799 + $149/mo',
    subtext: '1 workflow, web or Telegram agent',
  },
  {
    id: 'growth',
    name: 'Growth Funnel',
    price: '$1,799 + $299/mo',
    subtext: 'Multi-step AI pipeline + CRM & landing page',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Full AI Partner',
    price: '$3,499+ + $599/mo',
    subtext: 'Custom multi-agent system + human-in-the-loop',
  },
  {
    id: 'custom',
    name: 'Custom Architecture',
    price: 'Custom Scope',
    subtext: 'Bespoke enterprise integration & infrastructure',
  },
]

export default function ProjectBriefForm({
  selectedTier,
  onTierChange,
}: ProjectBriefFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [workflowGoal, setWorkflowGoal] = useState('')
  const [euResidencyOnly, setEuResidencyOnly] = useState(true)
  const [websiteHoneypot, setWebsiteHoneypot] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submittedData, setSubmittedData] = useState<{
    name: string
    email: string
    tier: PackageTier
    euResidencyOnly: boolean
  } | null>(null)

  const handleTierSelect = (tier: PackageTier) => {
    if (onTierChange) {
      onTierChange(tier)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    // Client-side quick check
    if (!name.trim()) {
      setErrorMessage('Please enter your full name.')
      return
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Please enter a valid work email address.')
      return
    }

    if (!workflowGoal.trim() || workflowGoal.trim().length < 10) {
      setErrorMessage(
        'Please describe your automation or workflow goal in at least 10 characters.'
      )
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        company: company.trim() || undefined,
        packageTier: selectedTier,
        workflowGoal: workflowGoal.trim(),
        euResidencyOnly,
        websiteHoneypot: websiteHoneypot.trim() || undefined,
      }

      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(
          data.error ||
            'Failed to submit project brief. Please try again or email support@clickrunclaw.com directly.'
        )
      }

      setSubmittedData({
        name: name.trim(),
        email: email.trim(),
        tier: selectedTier,
        euResidencyOnly,
      })
      setIsSuccess(true)
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please contact support@clickrunclaw.com.'
      setErrorMessage(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setName('')
    setEmail('')
    setCompany('')
    setWorkflowGoal('')
    setEuResidencyOnly(true)
    setWebsiteHoneypot('')
    setErrorMessage(null)
    setIsSuccess(false)
    setSubmittedData(null)
  }

  if (isSuccess && submittedData) {
    const activeTierObj = TIER_OPTIONS.find((t) => t.id === submittedData.tier)

    return (
      <div className="bg-[#111318] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl text-white">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl md:text-3xl font-black font-space tracking-tight text-white">
              Project Brief Received!
            </h3>
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
              You will receive an email confirmation shortly and a tailored written
              architecture + sandbox preview within 24 hours — zero meetings
              required.
            </p>
          </div>

          <div className="bg-[#090A0F] border border-white/10 rounded-2xl p-6 text-left space-y-3">
            <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
              <span className="text-zinc-500 uppercase tracking-wider font-mono">
                Client Name
              </span>
              <span className="font-semibold text-zinc-200">{submittedData.name}</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
              <span className="text-zinc-500 uppercase tracking-wider font-mono">
                Delivery Email
              </span>
              <span className="font-semibold text-zinc-200">{submittedData.email}</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
              <span className="text-zinc-500 uppercase tracking-wider font-mono">
                Selected Package
              </span>
              <span className="font-semibold text-[#FF5A5F]">
                {activeTierObj?.name} ({activeTierObj?.price})
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500 uppercase tracking-wider font-mono">
                EU Residency Guarantee
              </span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {submittedData.euResidencyOnly
                  ? 'Active (Germany & Finland)'
                  : 'Standard'}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-zinc-400">
            Need to add urgent workflow details? Email us directly at{' '}
            <a
              href="mailto:support@clickrunclaw.com"
              className="text-[#FF5A5F] hover:underline font-semibold"
            >
              support@clickrunclaw.com
            </a>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <span>Submit Another Project Brief</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-[#111318] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative"
    >
      {/* Honeypot field - hidden from real users, caught by bots */}
      <input
        type="text"
        name="websiteHoneypot"
        value={websiteHoneypot}
        onChange={(e) => setWebsiteHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none -left-[9999px]"
      />

      <div className="space-y-8">
        {/* Tier Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 font-mono">
            1. Select Package Tier
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TIER_OPTIONS.map((opt) => {
              const isSelected = selectedTier === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleTierSelect(opt.id)}
                  className={`text-left p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#FF5A5F] bg-[#FF5A5F]/10 shadow-[0_0_20px_rgba(255,90,95,0.15)] ring-1 ring-[#FF5A5F]'
                      : 'border-white/10 bg-[#090A0F]/60 hover:border-white/20 hover:bg-[#090A0F]'
                  }`}
                >
                  {opt.popular && (
                    <span className="absolute -top-2.5 right-3 bg-[#FF5A5F] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                      Most Popular
                    </span>
                  )}
                  <div>
                    <div className="font-space font-bold text-sm text-white flex items-center justify-between">
                      <span>{opt.name}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#FF5A5F] shrink-0" />
                      )}
                    </div>
                    <div className="text-xs font-mono font-semibold text-[#FF5A5F] mt-1">
                      {opt.price}
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                    {opt.subtext}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="brief-name"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-mono"
            >
              Full Name <span className="text-[#FF5A5F]">*</span>
            </label>
            <input
              id="brief-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alexander Schmidt"
              className="w-full bg-[#090A0F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F] transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="brief-email"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-mono"
            >
              Work Email <span className="text-[#FF5A5F]">*</span>
            </label>
            <input
              id="brief-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alexander@company.de"
              className="w-full bg-[#090A0F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F] transition-colors"
            />
          </div>
        </div>

        {/* Company / Website */}
        <div>
          <label
            htmlFor="brief-company"
            className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-mono"
          >
            Company &amp; Website{' '}
            <span className="text-zinc-500 font-normal normal-case">(optional)</span>
          </label>
          <input
            id="brief-company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme GmbH — acme.eu"
            className="w-full bg-[#090A0F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F] transition-colors"
          />
        </div>

        {/* Workflow Goal Textarea */}
        <div>
          <label
            htmlFor="brief-goal"
            className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-mono"
          >
            Workflow Goals &amp; Tools <span className="text-[#FF5A5F]">*</span>
          </label>
          <textarea
            id="brief-goal"
            rows={4}
            required
            value={workflowGoal}
            onChange={(e) => setWorkflowGoal(e.target.value)}
            placeholder="Describe what you want to automate. (e.g. 24/7 web chat agent qualifying sales leads, syncing them to HubSpot and Google Sheets, and alerting our sales team via Telegram. We require strict EU data residency.)"
            className="w-full bg-[#090A0F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F] transition-colors leading-relaxed"
          />
          <div className="flex justify-between items-center mt-1 text-[11px] text-zinc-500">
            <span>Minimum 10 characters required</span>
            <span>{workflowGoal.trim().length} chars</span>
          </div>
        </div>

        {/* EU Data Residency Preference */}
        <div className="p-4 rounded-2xl bg-[#090A0F]/80 border border-white/10 flex items-start gap-3">
          <input
            id="brief-eu-residency"
            type="checkbox"
            checked={euResidencyOnly}
            onChange={(e) => setEuResidencyOnly(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-white/20 bg-zinc-900 text-[#FF5A5F] focus:ring-[#FF5A5F] focus:ring-offset-0 cursor-pointer accent-[#FF5A5F]"
          />
          <label htmlFor="brief-eu-residency" className="text-xs cursor-pointer select-none">
            <span className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Guarantee EU Dedicated Infrastructure (Frankfurt &amp; Helsinki)
            </span>
            <span className="block text-zinc-400 mt-1 leading-relaxed">
              Enforce deployment exclusively inside sovereign European data centers with
              isolated containers and zero training on your customer or proprietary data.
            </span>
          </label>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button & Async Assurance */}
        <div className="space-y-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 rounded-2xl bg-[#FF5A5F] hover:bg-[#ff4247] text-white font-bold text-base transition-all shadow-[0_4px_25px_rgba(255,90,95,0.35)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Submitting Brief...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit Written Project Brief &bull; Get 24h Architecture</span>
              </>
            )}
          </button>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-2 px-1">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
              100% Async Delivery &bull; Zero Meetings &bull; Written Proposal
            </span>
            <span>
              Direct questions?{' '}
              <a
                href="mailto:support@clickrunclaw.com"
                className="text-zinc-400 hover:text-[#FF5A5F] underline"
              >
                support@clickrunclaw.com
              </a>
            </span>
          </div>
        </div>
      </div>
    </form>
  )
}
