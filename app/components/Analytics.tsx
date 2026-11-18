'use client';

import { useEffect, useState } from 'react';
import { GA_ID } from '@/lib/site';

const STORAGE_KEY = 'crc-analytics-consent';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function loadAnalytics() {
  if (document.getElementById('ga4-script')) return;

  const script = document.createElement('script');
  script.id = 'ga4-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { anonymize_ip: true });
}

/**
 * Google Analytics stays off until the visitor allows it. The site targets
 * the EU, where loading analytics before consent is not lawful.
 */
export default function Analytics() {
  const [choice, setChoice] = useState<'granted' | 'denied' | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }

    if (stored === 'granted') {
      setChoice('granted');
      loadAnalytics();
    } else if (stored === 'denied') {
      setChoice('denied');
    }
    setReady(true);
  }, []);

  const decide = (value: 'granted' | 'denied') => {
    setChoice(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Storage can be blocked; the choice still applies to this page view.
    }
    if (value === 'granted') loadAnalytics();
  };

  if (!ready || choice !== null) return null;

  return (
    <div
      role="region"
      aria-label="Analytics consent"
      className="fixed inset-x-0 bottom-0 z-[55] border-t border-white/10 bg-[#0b0d12]/95 px-4 py-3 backdrop-blur sm:px-6"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-[12px] leading-relaxed text-zinc-400">
          <span className="font-semibold text-zinc-200">Analytics consent.</span>{' '}
          Google Analytics counts visits only. No advertising cookies, no cross-site profiles.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide('granted')}
            className="rounded-full bg-[#FF5A5F] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#ff4247]"
          >
            Allow
          </button>
          <button
            type="button"
            onClick={() => decide('denied')}
            className="rounded-full border border-white/15 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-zinc-300 transition-colors hover:bg-white/5"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
