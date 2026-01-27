'use client';

import { useState, useEffect } from 'react';

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-14 bg-[#0d0d14] border-b border-[#1e1e2d] flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-semibold text-lg tracking-tight">ChevronLift</span>
          <span className="text-xs text-zinc-500 font-medium ml-1">FracFlow</span>
        </div>
        <div className="h-6 w-px bg-[#1e1e2d]" />
        <nav className="flex items-center gap-1">
          <button className="px-3 py-1.5 text-sm font-medium text-white bg-[#1e1e2d] rounded">
            Operations
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-[#1e1e2d] rounded transition-colors">
            Analytics
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-[#1e1e2d] rounded transition-colors">
            Reports
          </button>
        </nav>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-zinc-400">System Online</span>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium mono">
            {currentTime.toLocaleTimeString('en-US', { hour12: false })}
          </div>
          <div className="text-xs text-zinc-500">
            {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#1e1e2d] flex items-center justify-center text-sm font-medium">
          TJ
        </div>
      </div>
    </header>
  );
}
