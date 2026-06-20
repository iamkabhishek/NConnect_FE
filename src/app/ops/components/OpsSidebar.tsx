'use client';

import React from 'react';
import { 
  Building2, 
  CreditCard, 
  Tag, 
  ShieldCheck, 
  User, 
  Network, 
  Cpu, 
  Radio,
  FileText,
  Terminal,
  BellRing,
  HelpCircle
} from 'lucide-react';
import { PlatformOperator } from '../types';

interface OpsSidebarProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  activeOperator: PlatformOperator;
}

export default function OpsSidebar({ activeTab, setActiveTab, activeOperator }: OpsSidebarProps) {
  const menuGroups = [
    {
      title: "Core Administration",
      items: [
        { id: 0, label: "Profile & Cockpit", icon: User },
        { id: 1, label: "Tenant Registry", icon: Building2 },
      ]
    },
    {
      title: "Commercials & SaaS",
      items: [
        { id: 2, label: "SaaS Billing Units", icon: CreditCard },
        { id: 3, label: "Coupon Sandbox", icon: Tag },
      ]
    },
    {
      title: "Platform Operations",
      items: [
        { id: 5, label: "CMS Policy Manager", icon: FileText },
        { id: 6, label: "Security & Keys", icon: Terminal },
        { id: 7, label: "Notification Workflows", icon: BellRing },
        { id: 8, label: "Help Desk Tickets", icon: HelpCircle },
      ]
    },
    {
      title: "System & Access",
      items: [
        { id: 4, label: "Platform Operators", icon: ShieldCheck },
      ]
    }
  ];

  return (
    <aside className="w-72 bg-white/90 border-r border-zinc-200/60 backdrop-blur-md flex flex-col h-screen sticky top-0 z-20">
      {/* Brand Header */}
      <div className="p-6 border-b border-zinc-200/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-fuchsia-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Network className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[16px] tracking-tight text-zinc-950">NConnect</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200/60">OPS</span>
            </div>
            <span className="text-[11px] text-zinc-400 font-medium">Administration Cockpit</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 overflow-y-auto space-y-7">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-2">
            <h3 className="px-3 text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-fuchsia-500/10 via-purple-500/10 to-indigo-500/5 text-purple-700 shadow-[inset_1px_1px_2px_rgba(168,85,247,0.05)] border-l-4 border-purple-600 pl-2' 
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60 pl-3 border-l-4 border-transparent'
                    }`}
                  >
                    <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-purple-600' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* System Pulse Panel */}
      <div className="px-6 py-4 border-t border-zinc-200/40 bg-zinc-50/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider">Relay Host Status</span>
        </div>
        <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          HEALTHY
        </span>
      </div>

      {/* Footer Active Operator Card */}
      <div 
        onClick={() => setActiveTab(0)}
        className="p-4 border-t border-zinc-200/60 bg-white hover:bg-zinc-50/80 transition-all duration-200 cursor-pointer flex items-center gap-3"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center font-bold text-white text-sm border-2 border-white shadow-md">
            {activeOperator.name.charAt(0)}
          </div>
          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[12px] font-bold text-zinc-900 truncate">{activeOperator.name}</h4>
          <p className="text-[10px] font-mono font-bold text-zinc-400 truncate uppercase tracking-tight">{activeOperator.accessLevel.split(' - ')[0]}</p>
        </div>
        <div className="w-6 h-6 rounded-lg bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-all">
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        </div>
      </div>
    </aside>
  );
}

interface ChevronRightProps {
  className?: string;
}
function ChevronRight({ className }: ChevronRightProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
