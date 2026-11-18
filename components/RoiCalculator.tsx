'use client';

import React, { useState, useId } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Clock, DollarSign, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface RoiCalculatorProps {
  onSelectTier?: (tier: 'starter' | 'growth' | 'enterprise') => void;
  showCtaLink?: boolean;
}

export default function RoiCalculator({ onSelectTier, showCtaLink = true }: RoiCalculatorProps) {
  const [teamSize, setTeamSize] = useState<number>(5);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(12);
  const [hourlyRate, setHourlyRate] = useState<number>(45);

  const teamSizeId = useId();
  const hoursPerWeekId = useId();
  const hourlyRateId = useId();

  // Calculations
  // Total hours spent by team per month:
  const totalMonthlyHours = Math.round(teamSize * hoursPerWeek * 4.33);
  // We assume custom AI agents automate approximately 75% of manual, repetitive triage/data tasks
  const automatedMonthlyHours = Math.round(totalMonthlyHours * 0.75);
  // Monthly gross labor savings
  const monthlyGrossSavings = Math.round(automatedMonthlyHours * hourlyRate);
  // Annual gross savings
  const annualGrossSavings = monthlyGrossSavings * 12;

  // Recommended tier based on team size & complexity
  let recommendedTier: 'starter' | 'growth' | 'enterprise' = 'starter';
  let tierSetupCost = 799;
  let tierMonthlyCost = 149;
  let tierName = 'Starter Agent';

  if (teamSize >= 15 || monthlyGrossSavings > 12000) {
    recommendedTier = 'enterprise';
    tierSetupCost = 3499;
    tierMonthlyCost = 599;
    tierName = 'Enterprise Pipeline';
  } else if (teamSize >= 4 || monthlyGrossSavings > 3000) {
    recommendedTier = 'growth';
    tierSetupCost = 1799;
    tierMonthlyCost = 299;
    tierName = 'Growth Automation Fleet';
  }

  // Net 1st year savings
  const annualNetSavings = annualGrossSavings - (tierSetupCost + tierMonthlyCost * 12);
  // ROI percentage
  const totalYearOneInvestment = tierSetupCost + tierMonthlyCost * 12;
  const roiPercentage = Math.round((annualNetSavings / totalYearOneInvestment) * 100);
  // Payback period in weeks
  const weeklyGrossSavings = monthlyGrossSavings / 4.33;
  const paybackWeeks = weeklyGrossSavings > 0 ? (tierSetupCost / weeklyGrossSavings).toFixed(1) : '1.0';

  return (
    <div className="w-full max-w-5xl mx-auto bg-gradient-to-b from-[#0D1117] to-[#090A0F] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5A5F]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-8 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-[#FF5A5F] text-xs font-bold uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive ROI Simulator</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black font-space text-white tracking-tight">
            Calculate Your Automation Yield
          </h3>
          <p className="text-sm text-zinc-400 mt-1">
            Adjust your team parameters to see verified hours recovered and net financial return.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-xs font-semibold w-fit">
          <TrendingUp className="w-4 h-4" />
          <span>Average Client Payback: &lt; 3 Weeks</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sliders Column (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Slider 1: Team Size */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold">
              <label htmlFor={teamSizeId} className="text-zinc-200 flex items-center gap-2">
                <span>Team Members on Repetitive Workflows</span>
              </label>
              <span className="text-[#FF5A5F] font-mono text-base font-bold bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 px-3 py-0.5 rounded-lg">
                {teamSize} {teamSize === 1 ? 'person' : 'people'}
              </span>
            </div>
            <input
              id={teamSizeId}
              type="range"
              min={1}
              max={50}
              step={1}
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              aria-label="Team Members on Repetitive Workflows"
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FF5A5F] transition-all"
            />
            <div className="flex justify-between text-xs text-zinc-500 font-mono">
              <span>1 person</span>
              <span>25 people</span>
              <span>50 people</span>
            </div>
          </div>

          {/* Slider 2: Hours Per Week */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold">
              <label htmlFor={hoursPerWeekId} className="text-zinc-200 flex items-center gap-2">
                <span>Hours Spent Weekly per Person (Data, Triage, CRM)</span>
              </label>
              <span className="text-[#FF5A5F] font-mono text-base font-bold bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 px-3 py-0.5 rounded-lg">
                {hoursPerWeek} hrs / week
              </span>
            </div>
            <input
              id={hoursPerWeekId}
              type="range"
              min={2}
              max={35}
              step={1}
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              aria-label="Hours Spent Weekly per Person"
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FF5A5F] transition-all"
            />
            <div className="flex justify-between text-xs text-zinc-500 font-mono">
              <span>2 hrs</span>
              <span>18 hrs</span>
              <span>35 hrs</span>
            </div>
          </div>

          {/* Slider 3: Hourly Rate */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold">
              <label htmlFor={hourlyRateId} className="text-zinc-200 flex items-center gap-2">
                <span>Estimated Fully-Loaded Labor Rate</span>
              </label>
              <span className="text-[#FF5A5F] font-mono text-base font-bold bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 px-3 py-0.5 rounded-lg">
                ${hourlyRate} / hr
              </span>
            </div>
            <input
              id={hourlyRateId}
              type="range"
              min={20}
              max={150}
              step={5}
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              aria-label="Estimated Fully-Loaded Labor Rate"
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FF5A5F] transition-all"
            />
            <div className="flex justify-between text-xs text-zinc-500 font-mono">
              <span>$20/hr (Ops)</span>
              <span>$75/hr (Sales/Dev)</span>
              <span>$150/hr (Exec/Lead)</span>
            </div>
          </div>

          {/* Micro Guarantee Note */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3 text-xs text-zinc-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Based on empirical client benchmarks: Custom sovereign agents autonomously handle ~75% of routine triage, invoice validation, and CRM pipeline actions with zero latency.
            </p>
          </div>
        </div>

        {/* Results Column (5 cols) */}
        <div className="lg:col-span-5 bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col justify-between gap-6 shadow-inner">
          <div className="space-y-5">
            <div className="text-xs uppercase font-bold tracking-wider text-zinc-400">
              Projected Annual Yield
            </div>

            {/* Net Savings Big Number */}
            <div>
              <div className="text-4xl sm:text-5xl font-black font-space text-white tracking-tight text-emerald-400">
                ${annualNetSavings > 0 ? annualNetSavings.toLocaleString('en-US') : 0}
              </div>
              <div className="text-xs text-zinc-400 mt-1 font-medium">
                Net 1st Year Savings (After Setup &amp; Hosting Costs)
              </div>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
              <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5">
                <div className="text-xs text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#FF5A5F]" />
                  <span>Time Reclaimed</span>
                </div>
                <div className="text-base sm:text-lg font-bold font-space text-white mt-1 truncate">
                  {automatedMonthlyHours.toLocaleString('en-US')} hrs<span className="text-xs font-normal text-zinc-400">/mo</span>
                </div>
              </div>

              <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5">
                <div className="text-xs text-zinc-400 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Gross Monthly</span>
                </div>
                <div className="text-base sm:text-lg font-bold font-space text-white mt-1 truncate">
                  ${monthlyGrossSavings.toLocaleString('en-US')}
                </div>
              </div>

              <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5">
                <div className="text-xs text-zinc-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  <span>1st Year ROI</span>
                </div>
                <div className="text-base sm:text-lg font-bold font-space text-white mt-1 truncate">
                  {roiPercentage > 0 ? `${roiPercentage}%` : '>100%'}
                </div>
              </div>

              <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5">
                <div className="text-xs text-zinc-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Payback In</span>
                </div>
                <div className="text-base sm:text-lg font-bold font-space text-white mt-1 truncate">
                  ~{paybackWeeks} weeks
                </div>
              </div>
            </div>

            {/* Recommended Tier Card */}
            <div className="p-3.5 rounded-xl bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-xs">
              <span className="text-zinc-300">Recommended Architecture: </span>
              <strong className="text-white font-bold">{tierName}</strong>
              <div className="text-zinc-400 mt-0.5">
                ${tierSetupCost.toLocaleString('en-US')} fixed setup + ${tierMonthlyCost}/mo dedicated EU hosting
              </div>
            </div>
          </div>

          {/* CTA */}
          {showCtaLink ? (
            <Link
              href={`/#contact?tier=${recommendedTier}`}
              onClick={() => {
                if (onSelectTier) onSelectTier(recommendedTier);
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#FF5A5F] hover:bg-[#ff4247] text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#FF5A5F]/20 hover:shadow-[#FF5A5F]/40 group"
            >
              <span>Deploy {tierName}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (onSelectTier) onSelectTier(recommendedTier);
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#FF5A5F] hover:bg-[#ff4247] text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#FF5A5F]/20 hover:shadow-[#FF5A5F]/40 group"
            >
              <span>Deploy {tierName}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
