'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Server,
  ArrowRight,
  Cpu,
  Lock,
} from 'lucide-react'
import type { DemoMessage } from '@/lib/demo-agent'

export interface LiveAgentDemoProps {
  onSelectTier?: (tier: 'starter' | 'growth' | 'enterprise') => void
}

const INITIAL_MESSAGES: DemoMessage[] = [
  {
    role: 'assistant',
    content:
      "Hello! I am ClickRunClaw's EU AI Automation Consultant. Ask me anything about our dedicated EU infrastructure (Germany & Finland), transparent USD packages ($799, $1,799, $3,499+), or our 100% async delivery model (zero phone or video meetings). How can we automate your business workflow?",
  },
]

const QUICK_PROMPTS = [
  'How do you keep data in the EU?',
  'Compare $799 vs $1,799 plans',
  'Do we need any video calls?',
]

export default function LiveAgentDemo({ onSelectTier }: LiveAgentDemoProps) {
  const [messages, setMessages] = useState<DemoMessage[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeMode, setActiveMode] = useState<'live' | 'sandbox'>('sandbox')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const isFirstMount = useRef(true)

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }
    scrollToBottom()
  }, [messages, isLoading])

  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend !== undefined ? textToSend : input
    const message = rawText.trim()
    if (!message || isLoading) return

    if (message.length > 800) {
      setErrorMsg('Message exceeds 800 characters limit.')
      return
    }

    setErrorMsg(null)
    setInput('')

    // Exclude initial static greeting so history sent to /api/demo begins with a user turn
    const firstUserIdx = messages.findIndex((m) => m.role === 'user')
    const historyToSend = firstUserIdx >= 0 ? messages.slice(firstUserIdx) : []

    const updatedHistory: DemoMessage[] = [...messages, { role: 'user', content: message }]
    setMessages(updatedHistory)
    setIsLoading(true)

    try {
      const res = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: historyToSend,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        if (res.status === 429) {
          setErrorMsg('Rate limit reached (20 msgs / 10 min). Please wait a moment.')
        }
        throw new Error(errorData.error || `HTTP error ${res.status}`)
      }

      const data: { reply: string; mode: 'live' | 'sandbox' } = await res.json()
      setActiveMode(data.mode)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply,
        },
      ])
    } catch {
      // Graceful local fallback if network or endpoint fails completely
      setActiveMode('sandbox')
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'We encountered a temporary network delay. ClickRunClaw builds and deploys production AI agents on dedicated EU infrastructure in Germany (Frankfurt) and Finland (Helsinki). Packages start at $799 setup ($149/mo) for Starter, $1,799 setup ($299/mo) for Growth, and $3,499+ ($599/mo) for Full AI Partner with 100% async delivery (zero meetings). You can also email support@clickrunclaw.com.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES)
    setInput('')
    setErrorMsg(null)
    setActiveMode('sandbox')
  }

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl bg-[#111318] border border-white/10 shadow-2xl overflow-hidden font-sans">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-4 border-b border-white/10 bg-[#090A0F]/80 backdrop-blur-md gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#FF5A5F]/15 border border-[#FF5A5F]/30 text-[#FF5A5F]">
            <Bot className="w-5 h-5" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#090A0F]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white text-sm sm:text-base tracking-wide">
                EU AI Agent Live Sandbox
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FF5A5F]/15 text-[#FF5A5F] border border-[#FF5A5F]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A5F] animate-pulse" />
                EU Sandbox Live
              </span>
            </div>
            <p className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-1">
                <Server className="w-3 h-3 text-zinc-500" />
                Frankfurt & Helsinki
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Lock className="w-3 h-3 text-zinc-500" />
                Zero Client Training
              </span>
              <span>•</span>
              <span className="text-zinc-500">100% Async</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] font-mono text-zinc-400">
            {activeMode === 'live' ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <Cpu className="w-3 h-3" /> Live Agent
              </span>
            ) : (
              <span className="text-zinc-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#FF5A5F]" /> Sovereign Sandbox
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleReset}
            title="Reset Conversation"
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2.5 bg-[#0e1015] border-b border-white/5 flex flex-wrap items-center gap-2">
        <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#FF5A5F]" /> Quick Prompts:
        </span>
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={isLoading}
            onClick={() => handleSendMessage(prompt)}
            className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/5 hover:border-[#FF5A5F]/40 transition-all cursor-pointer disabled:opacity-50"
          >
            &quot;{prompt}&quot;
          </button>
        ))}
      </div>

      {/* Chat Messages Feed */}
      <div
        ref={chatContainerRef}
        role="log"
        aria-live="polite"
        className="p-4 sm:p-6 space-y-4 max-h-[420px] min-h-[300px] overflow-y-auto bg-gradient-to-b from-[#111318] to-[#0d0f14]"
      >
        {messages.map((m, idx) => {
          const isUser = m.role === 'user'
          return (
            <div
              key={idx}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div className="flex items-center gap-1.5 px-1 text-[11px] text-zinc-500 font-mono">
                {isUser ? (
                  <span>You (Verified Lead)</span>
                ) : (
                  <span className="flex items-center gap-1 text-[#FF5A5F]">
                    <Bot className="w-3 h-3" /> EU AI Consultant
                  </span>
                )}
              </div>
              <div
                className={`text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-[#FF5A5F]/15 border border-[#FF5A5F]/35 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%]'
                    : 'bg-[#181920] border border-white/5 text-zinc-200 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%] shadow-lg'
                }`}
              >
                {m.content}
              </div>
            </div>
          )
        })}

        {isLoading && (
          <div className="flex flex-col items-start space-y-1">
            <div className="flex items-center gap-1.5 px-1 text-[11px] text-[#FF5A5F] font-mono">
              <Bot className="w-3 h-3" /> EU AI Consultant
            </div>
            <div className="bg-[#181920] border border-white/5 text-zinc-400 rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5A5F] animate-ping" />
              <span>Querying sovereign EU container sandbox...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 sm:p-4 border-t border-white/10 bg-[#090A0F]">
        {errorMsg && (
          <p className="text-xs text-rose-400 mb-2 px-1 font-mono">{errorMsg}</p>
        )}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            maxLength={800}
            placeholder="Ask about sovereign EU hosting, custom workflows, or fixed packages..."
            className="flex-1 bg-[#181920] text-sm text-white placeholder-zinc-500 px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#FF5A5F]/60 transition-colors disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-[#FF5A5F] hover:bg-[#fa4a4a] text-white text-sm font-medium flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        <div className="flex justify-between items-center mt-2 px-1 text-[11px] text-zinc-500">
          <span>100% Async written architecture • Zero meetings required</span>
          <span>{input.length}/800 chars</span>
        </div>
      </div>

      {/* Quick Package Selectors Footer */}
      {onSelectTier && (
        <div className="px-4 py-3 bg-[#13151b] border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-zinc-400">
            <span className="text-white font-medium">Ready to deploy?</span> Select a package to pre-fill your brief:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onSelectTier('starter')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 hover:border-[#FF5A5F]/40 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Starter ($799)</span>
              <ArrowRight className="w-3 h-3 text-[#FF5A5F]" />
            </button>
            <button
              type="button"
              onClick={() => onSelectTier('growth')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-[#FF5A5F]/15 hover:bg-[#FF5A5F]/25 text-[#FF5A5F] border border-[#FF5A5F]/35 transition-all flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>Growth Funnel ($1,799)</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => onSelectTier('enterprise')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 hover:border-[#FF5A5F]/40 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Full Partner ($3,499+)</span>
              <ArrowRight className="w-3 h-3 text-[#FF5A5F]" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
