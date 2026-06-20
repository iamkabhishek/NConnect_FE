'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Activity, 
  ShieldCheck, 
  Clock, 
  Terminal, 
  Sliders 
} from 'lucide-react';
import { PlatformOperator } from '../types';

interface OpsHeaderProps {
  activeOperator: PlatformOperator;
}

export default function OpsHeader({ activeOperator }: OpsHeaderProps) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 border-b border-zinc-200/60 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10 w-full">
      {/* Search Input Bar */}
      <div className="relative w-80">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          <Search className="w-4 h-4 text-zinc-400" />
        </span>
        <input 
          type="text" 
          placeholder="Global system search..." 
          className="w-full text-[12px] bg-zinc-100/60 border border-zinc-200/50 hover:border-zinc-300/80 focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/5 rounded-xl py-2 pl-10 pr-4 font-semibold text-zinc-800 placeholder-zinc-400 transition-all outline-none"
        />
      </div>

      {/* Header Quick Stats & Widgets */}
      <div className="flex items-center gap-6">
        {/* Core Clock */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200/40 text-zinc-700 font-mono text-[12px] font-bold">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span>{time || "00:00:00"}</span>
        </div>

        {/* Database Health */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider uppercase">Node Latency</span>
            <span className="text-[11px] font-bold text-zinc-700">14 ms</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200/40 flex items-center justify-center">
            <Activity className="w-4 h-4 text-purple-600 animate-pulse" />
          </div>
        </div>

        {/* Console Integrity Token */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider uppercase">Privilege Level</span>
            <span className="text-[11px] font-bold text-zinc-700">{activeOperator.accessLevel.split(' - ')[0]}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-fuchsia-50 border border-fuchsia-200/40 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-fuchsia-600" />
          </div>
        </div>

        {/* Divider */}
        <div className="h-6 w-[1px] bg-zinc-200/60"></div>

        {/* Mini operator info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[12px] font-bold text-zinc-800">{activeOperator.name}</p>
            <p className="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-tight">Console Authorized</p>
          </div>
        </div>
      </div>
    </header>
  );
}
