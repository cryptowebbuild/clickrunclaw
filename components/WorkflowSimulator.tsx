'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Server,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Database,
  Terminal,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

interface Scenario {
  id: string;
  name: string;
  iconName: string;
  description: string;
  source: string;
  steps: {
    title: string;
    node: string;
    latency: string;
    status: 'idle' | 'running' | 'success';
    log: string;
  }[];
  finalOutput: {
    action: string;
    target: string;
    confidence: string;
    sovereignRegion: string;
    details: Record<string, string | number | boolean>;
  };
}

const SCENARIOS: Scenario[] = [
  {
    id: 'lead-triage',
    name: 'Inbound Lead Qualification',
    iconName: 'Sparkles',
    description: 'Autonomous enrichment, ICP scoring, and instant personalized sales response.',
    source: 'POST /webhooks/v1/inbound-lead',
    steps: [
      {
        title: 'Webhook Ingest & PII Scrub',
        node: 'Cloudflare Edge (Frankfurt)',
        latency: '34ms',
        status: 'idle',
        log: 'Validating HMAC SHA-256 signature. Tokenizing client email & stripping sensitive cookies.',
      },
      {
        title: 'B2B Firmographic Enrichment',
        node: 'Apollo & Clearbit Resolver',
        latency: '112ms',
        log: 'Domain resolved: "novatech-eu.de". Industry: FinTech, Employees: 85, Est. ARR: €12M.',
        status: 'idle',
      },
      {
        title: 'Deterministic ICP Scoring',
        node: 'LangGraph Reasoning State Machine',
        latency: '85ms',
        log: 'ICP Score: 94/100 (Tier 1 Enterprise). Budget verified: Growth tier fits criteria.',
        status: 'idle',
      },
      {
        title: 'CRM Sync & Executive Alert',
        node: 'HubSpot API & Slack Webhook',
        latency: '62ms',
        log: 'Created Deal #9482 in HubSpot CRM. Pushed instant notification to #leads channel.',
        status: 'idle',
      },
    ],
    finalOutput: {
      action: 'LEAD_QUALIFIED_AND_NOTIFIED',
      target: 'HubSpot & Slack #leads',
      confidence: '98.8%',
      sovereignRegion: 'Germany (Frankfurt / Hetzner Bare-Metal)',
      details: {
        company: 'NovaTech EU GmbH',
        icpTier: 'Tier-1 High Priority',
        recommendedAgent: 'Growth Automation Fleet',
        estimatedValue: '$1,799 Setup + $299/mo',
        timeToTriage: '293ms',
      },
    },
  },
  {
    id: 'invoice-audit',
    name: 'PDF Invoice 2-Way Match',
    iconName: 'Database',
    description: 'Cross-border PDF extraction, VAT validation, and automated ERP reconciliation.',
    source: 'EMAIL_TRIGGER /procurement/invoices',
    steps: [
      {
        title: 'Encrypted Inbound Attachment Parser',
        node: 'Helsinki Sovereign S3 Bucket',
        latency: '48ms',
        log: 'Extracted PDF "INV-2026-904.pdf". SHA-256 verification passed. Zero external cloud exposure.',
        status: 'idle',
      },
      {
        title: 'OCR & Line-Item Table Extraction',
        node: 'Local Document Extraction Engine',
        latency: '145ms',
        log: 'Parsed 14 line items. Subtotal: €14,250.00. EU VAT (19% DE): €2,707.50. Total: €16,957.50.',
        status: 'idle',
      },
      {
        title: 'ERP Purchase Order 2-Way Match',
        node: 'SAP / NetSuite Connector',
        latency: '98ms',
        log: 'Matched against PO-78421. Quantities match within 0.00% variance. Vendor IBAN verified.',
        status: 'idle',
      },
      {
        title: 'Accounting Approval & Slack Gate',
        node: 'PostgreSQL Audit Ledger',
        latency: '41ms',
        log: 'Status marked "APPROVED_FOR_PAYMENT". Dispatched 1-click Slack interactive confirmation.',
        status: 'idle',
      },
    ],
    finalOutput: {
      action: 'INVOICE_MATCHED_AND_SCHEDULED',
      target: 'ERP Ledger & Audit Trail',
      confidence: '99.6%',
      sovereignRegion: 'Finland (Helsinki / Hetzner Private Cloud)',
      details: {
        invoiceNumber: 'INV-2026-904',
        supplier: 'Nordic Logistics AB',
        totalEUR: '€16,957.50',
        variance: '0.00%',
        auditStatus: 'VERIFIED_SOVEREIGN',
      },
    },
  },
  {
    id: 'support-triage',
    name: 'Multilingual Customer Support Triage',
    iconName: 'Server',
    description: 'Instant ticket classification, courier lookup, and return label generation in German.',
    source: 'ZENDESK_WEBHOOK /tickets/new',
    steps: [
      {
        title: 'Language & Intent Identification',
        node: 'Sovereign FastText & NLU Model',
        latency: '28ms',
        log: 'Detected German (de-DE). Intent: "ORDER_RETURN_REQUEST". Sentiment: Neutral/Urgent.',
        status: 'idle',
      },
      {
        title: 'E-Commerce Store Order Lookup',
        node: 'Shopify Admin API',
        latency: '78ms',
        log: 'Order #DE-88291 found. Delivered 4 days ago. Eligible for 14-day statutory EU return.',
        status: 'idle',
      },
      {
        title: 'Automated DHL Return Label Generation',
        node: 'DHL Express European API',
        latency: '135ms',
        log: 'Created return tracking #003404342894. Pre-paid PDF label generated and signed.',
        status: 'idle',
      },
      {
        title: 'Zendesk Response & Close Ticket',
        node: 'Zendesk REST API',
        latency: '54ms',
        log: 'Dispatched native German reply with return instructions and PDF link. Marked Resolved.',
        status: 'idle',
      },
    ],
    finalOutput: {
      action: 'TICKET_AUTONOMOUSLY_RESOLVED',
      target: 'Zendesk & DHL API',
      confidence: '97.4%',
      sovereignRegion: 'Germany (Frankfurt / Hetzner Bare-Metal)',
      details: {
        ticketLanguage: 'German (de)',
        orderNumber: 'DE-88291',
        resolutionType: 'Instant Return Label Generated',
        humanIntervention: false,
        totalExecutionTime: '295ms',
      },
    },
  },
];

export default function WorkflowSimulator() {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const scenario = SCENARIOS[selectedScenarioIndex];

  // Auto-run simulation when scenario changes or user triggers run
  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCompleted(false);
    setActiveStep(0);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && activeStep >= 0 && activeStep < scenario.steps.length) {
      timer = setTimeout(() => {
        if (activeStep + 1 < scenario.steps.length) {
          setActiveStep((prev) => prev + 1);
        } else {
          setIsRunning(false);
          setCompleted(true);
        }
      }, 700);
    }
    return () => clearTimeout(timer);
  }, [isRunning, activeStep, scenario.steps.length]);

  const handleSelectScenario = (idx: number) => {
    setSelectedScenarioIndex(idx);
    setIsRunning(false);
    setActiveStep(-1);
    setCompleted(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setActiveStep(-1);
    setCompleted(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-gradient-to-b from-[#0D1117] to-[#090A0F] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-[#FF5A5F]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-[#FF5A5F] text-xs font-bold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Interactive Workflow Engine</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-black font-space text-white tracking-tight">
            See Sovereign Agents In Action
          </h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Simulate how our custom EU agents ingest, scrub, reason, and dispatch production tasks in under 300ms.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={runSimulation}
            disabled={isRunning}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs tracking-wider uppercase transition-all shadow-lg ${
              isRunning
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-[#FF5A5F] hover:bg-[#ff4247] text-white shadow-[#FF5A5F]/20 hover:shadow-[#FF5A5F]/40'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Processing...' : completed ? 'Re-Run Pipeline' : 'Run Pipeline'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isRunning || activeStep === -1}
            className="p-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Reset simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scenario Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {SCENARIOS.map((sc, idx) => {
          const isSelected = idx === selectedScenarioIndex;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => handleSelectScenario(idx)}
              className={`p-4 rounded-2xl text-left border transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-white/[0.08] border-[#FF5A5F] shadow-[0_0_20px_rgba(255,90,95,0.15)]'
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Pipeline 0{idx + 1}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-[#FF5A5F] animate-pulse" />
                )}
              </div>
              <h4 className="text-sm font-bold text-white font-space mb-1">
                {sc.name}
              </h4>
              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {sc.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Interactive Pipeline Visualizer (Node Graph) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Step Nodes (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-1">
            <span>TRIGGER SOURCE</span>
            <span className="text-[#FF5A5F] font-bold">{scenario.source}</span>
          </div>

          <div className="space-y-3 relative">
            {scenario.steps.map((st, i) => {
              const isPast = activeStep > i || completed;
              const isCurrent = activeStep === i && !completed;
              const isWaiting = activeStep < i && !completed;

              return (
                <motion.div
                  key={st.title}
                  initial={false}
                  animate={{
                    borderColor: isCurrent
                      ? 'rgba(255, 90, 95, 0.8)'
                      : isPast
                      ? 'rgba(52, 211, 153, 0.4)'
                      : 'rgba(255, 255, 255, 0.05)',
                    backgroundColor: isCurrent
                      ? 'rgba(255, 90, 95, 0.08)'
                      : isPast
                      ? 'rgba(52, 211, 153, 0.04)'
                      : 'rgba(255, 255, 255, 0.02)',
                  }}
                  className="p-4 rounded-2xl border transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                          isPast
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : isCurrent
                            ? 'bg-[#FF5A5F] text-white animate-pulse'
                            : 'bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {isPast ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                      </div>
                      <span className="text-sm font-bold font-space text-white">
                        {st.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-500">
                        {st.node}
                      </span>
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded ${
                          isCurrent
                            ? 'bg-[#FF5A5F]/20 text-[#FF5A5F]'
                            : isPast
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'text-zinc-600'
                        }`}
                      >
                        {st.latency}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 pl-9 font-mono leading-relaxed">
                    {st.log}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Terminal & State Inspection (5 Cols) */}
        <div className="lg:col-span-5 bg-black/50 border border-white/10 rounded-2xl p-5 font-mono text-xs shadow-inner flex flex-col justify-between h-full min-h-[380px]">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 text-zinc-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#FF5A5F]" />
                <span className="font-bold text-zinc-300">SOVEREIGN AGENT DISPATCH LOG</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-400 uppercase tracking-widest">Live Node</span>
              </div>
            </div>

            <div className="space-y-2 text-zinc-400 leading-relaxed text-[11px] overflow-y-auto max-h-48 pr-1 scrollbar-thin">
              <div className="text-zinc-500">
                [SYSTEM] Container: hetzner-fra-agent-v4 &bull; IP: 159.69.142.12
              </div>
              <div className="text-zinc-500">
                [SYSTEM] Zero External Model Retention &bull; EU Sovereign Boundary: ACTIVE
              </div>
              
              {activeStep >= 0 && (
                <div className="text-amber-400 animate-fadeIn">
                  &gt; [T+{scenario.steps[0].latency}] Inbound request tokenized. PII masked.
                </div>
              )}
              {activeStep >= 1 && (
                <div className="text-cyan-400 animate-fadeIn">
                  &gt; [T+146ms] State machine step 2: firmographics resolved.
                </div>
              )}
              {activeStep >= 2 && (
                <div className="text-emerald-400 animate-fadeIn">
                  &gt; [T+231ms] Intent reasoned with deterministic guardrails.
                </div>
              )}
              {activeStep >= 3 && (
                <div className="text-emerald-300 animate-fadeIn">
                  &gt; [T+293ms] Actions committed: CRM deals &amp; alerts finalized.
                </div>
              )}
              {completed && (
                <div className="text-[#FF5A5F] font-bold animate-fadeIn pt-1">
                  ✓ Pipeline completed in &lt; 300ms. Zero human overhead.
                </div>
              )}
            </div>
          </div>

          {/* JSON Result State */}
          <div className="mt-4 pt-4 border-t border-white/10 bg-white/[0.02] p-3 rounded-xl border border-white/5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center justify-between">
              <span>Verified Output Payload</span>
              <span className="text-emerald-400 font-bold">{scenario.finalOutput.confidence} Confidence</span>
            </div>
            <pre className="text-[10px] text-zinc-300 overflow-x-auto leading-tight">
              {JSON.stringify(
                {
                  status: completed ? 'SUCCESS_DISPATCHED' : isRunning ? 'PROCESSING' : 'READY',
                  action: scenario.finalOutput.action,
                  sovereignRegion: scenario.finalOutput.sovereignRegion,
                  ...scenario.finalOutput.details,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
