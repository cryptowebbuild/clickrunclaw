"use client"

import { useEffect } from 'react'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function GlobalError({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string }, 
  reset: () => void 
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <html>
      <body className="bg-[#FAFAFA] dark:bg-[#090A0F] text-zinc-900 dark:text-zinc-100 antialiased selection:bg-coral/30 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="mx-auto w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-black font-space tracking-tight text-zinc-900 dark:text-white uppercase">System Exception</h1>
            <p className="text-zinc-500 dark:text-zinc-500 font-light leading-relaxed">
              We encountered an unexpected error during execution. Our engineering team has been notified.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => reset()}
              className="w-full h-14 bg-coral hover:bg-coral-hover text-white font-black rounded-full transition-all shadow-[0_4px_25px_rgba(255,90,95,0.4)] flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              <RotateCcw className="w-5 h-5" />
              Attempt Recovery
            </button>
            
            <Link 
              href="/"
              className="w-full h-14 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 text-zinc-500 dark:text-zinc-400 font-black rounded-full transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm hover:text-zinc-900 dark:hover:text-white"
            >
              <Home className="w-5 h-5" />
              Return to Safety
            </Link>
          </div>
          
          <div className="pt-8 border-t border-zinc-100 dark:border-zinc-900">
             <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-700 tracking-tighter overflow-hidden text-ellipsis whitespace-nowrap">
               ERR_DIGEST: {error.digest || 'C0_X_UNRECOVERABLE'}
             </p>
          </div>
        </div>
      </body>
    </html>
  )
}
