'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Users, 
  FileText, 
  Zap, 
  BarChart3, 
  HelpCircle, 
  ArrowRight,
  ShieldAlert,
  Layers,
  ArrowUpRight,
  UserCheck
} from 'lucide-react';
import { ModuleLayout } from '@/app/components/layout/ModuleLayout';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';

interface GuestDashboardProps {
  onNavigate?: (page: string) => void;
}

export function GuestDashboard({ onNavigate }: GuestDashboardProps) {
  const { currentUser } = useWorkspace();
  const [pulsing, setPulsing] = useState(true);

  // Micro-animations effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsing(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const guestModules = [
    {
      id: 'campaigns',
      title: 'Campaign Manager',
      description: 'Design, draft, and dispatch newsletter broadcasts with real-time dynamic templating.',
      icon: <Send className="w-5 h-5 text-indigo-600" />,
      color: 'from-indigo-500/10 to-blue-500/5',
      borderColor: 'border-indigo-100',
      tag: 'Broadcasting'
    },
    {
      id: 'contacts',
      title: 'Contacts & Audiences',
      description: 'Filter subscriber segments, import custom CSV databases, and track delivery tags.',
      icon: <Users className="w-5 h-5 text-purple-600" />,
      color: 'from-purple-500/10 to-fuchsia-500/5',
      borderColor: 'border-purple-100',
      tag: 'CRM Lists'
    },
    {
      id: 'templates',
      title: 'HTML Templates',
      description: 'Customize stunning responsive drag-and-drop themes or deploy dynamic MJML components.',
      icon: <FileText className="w-5 h-5 text-pink-600" />,
      color: 'from-pink-500/10 to-rose-500/5',
      borderColor: 'border-pink-100',
      tag: 'Design Studio'
    },
    {
      id: 'automation',
      title: 'Automation Journeys',
      description: 'Trigger drip webhooks, trigger AI-generated follow-up steps, and auto-reply on handshakes.',
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      color: 'from-amber-500/10 to-yellow-500/5',
      borderColor: 'border-amber-100',
      tag: 'Workflows'
    },
    {
      id: 'reports',
      title: 'Analytics & Delivery',
      description: 'Inspect engagement charts, tracking open/click logs, and delivery handshakes.',
      icon: <BarChart3 className="w-5 h-5 text-emerald-600" />,
      color: 'from-emerald-500/10 to-teal-500/5',
      borderColor: 'border-emerald-100',
      tag: 'Live Reports'
    },
    {
      id: 'helpdesk',
      title: 'Support Helpdesk',
      description: 'Simulate conversational tickets directly with our customer success and developer operators.',
      icon: <HelpCircle className="w-5 h-5 text-cyan-600" />,
      color: 'from-cyan-500/10 to-sky-500/5',
      borderColor: 'border-cyan-100',
      tag: 'Direct Assistance'
    }
  ];

  return (
    <ModuleLayout activeItem="dashboard" onNavigate={onNavigate}>
      <div className="max-w-7xl mx-auto px-8 py-10 space-y-10">
        
        {/* Guest Warning Notice */}
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <span className="p-3 bg-amber-500/15 text-amber-700 rounded-xl border border-amber-500/20 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                <span>Guest Sandbox Session Active</span>
                <span className={`inline-block w-2 h-2 rounded-full bg-amber-500 ${pulsing ? 'animate-ping' : ''}`} />
              </h4>
              <p className="text-xs text-amber-800/80 font-medium mt-1 leading-relaxed max-w-3xl">
                You are currently exploring NConnect as a Guest. You can freely navigate, preview all modules, review simulated stats, and raise mock support tickets inside the Helpdesk.
              </p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate?.('signup')}
            className="px-4.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-600/10 transition-all shrink-0 border border-amber-500/30 flex items-center gap-1.5 self-start sm:self-center"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Register for Free</span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden border border-zinc-200/50 shadow-xl bg-gradient-to-br from-[#030213] via-[#0b0a2b] to-indigo-950 p-8 sm:p-10 select-none">
          <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/20 text-purple-300 text-[10px] font-extrabold font-mono tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>NConnect Interactive Sandbox</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight leading-tight uppercase">
              Welcome back, Guest Explorer!
            </h1>
            <p className="text-zinc-300 font-medium text-xs sm:text-sm leading-relaxed max-w-2xl">
              NConnect delivers robust automated email newsletters, custom audience segmentation, and live operator helpdesk queues in a unified platform. Use the dashboard links below or the left navigation panel to explore our rich feature layout.
            </p>
          </div>
        </div>

        {/* Dashboard Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Sandbox Active Modules', value: '6 / 6', sub: 'Explore any workspace tool', trend: '+100%' },
            { label: 'Simulated Subscribers', value: '2,847', sub: 'Mock contacts available', trend: 'CRM Ready' },
            { label: 'SLA Support Tickets', value: 'Unlimited', sub: 'Test helpdesk replies', trend: 'Live Chat' },
            { label: 'Automation Webhooks', value: 'Active', sub: 'Integrations preview mode', trend: 'Triggered' }
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-zinc-200/60 p-6 rounded-2xl shadow-md space-y-2">
              <p className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">{stat.label}</p>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-zinc-950 font-mono">{stat.value}</span>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100/50">
                  {stat.trend}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-bold leading-tight">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Navigation Sections Grid */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-extrabold text-zinc-950 font-mono uppercase tracking-tight">
              Interactive Module Catalog
            </h3>
            <p className="text-xs text-zinc-400 font-semibold mt-0.5">
              Click on any module below to dive directly into its sandbox interface and test its workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guestModules.map((mod) => (
              <div 
                key={mod.id} 
                onClick={() => onNavigate?.(mod.id)}
                className={`group cursor-pointer bg-white hover:bg-gradient-to-br ${mod.color} border ${mod.borderColor} hover:border-zinc-300 shadow-md hover:shadow-lg rounded-2xl p-6 transition-all duration-350 flex flex-col justify-between h-56`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="p-3 bg-white border border-zinc-100 rounded-xl shadow-sm shrink-0 flex items-center justify-center">
                      {mod.icon}
                    </span>
                    <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-zinc-400 border border-zinc-100 bg-zinc-50 px-2 py-1 rounded-lg">
                      {mod.tag}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-zinc-950 font-mono uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                      {mod.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 font-bold mt-1.5 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 group-hover:text-indigo-600 transition-colors pt-2 select-none self-end">
                  <span>Launch Sandbox</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Callouts: Support & Registration */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 pt-4">
          
          {/* Helpdesk Focus Card (3 cols) */}
          <div className="lg:col-span-3 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-white border border-indigo-100 rounded-2xl p-8 flex flex-col justify-between shadow-md relative overflow-hidden">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Simulated Help Desk Support</span>
              </div>
              <h3 className="text-lg font-extrabold text-zinc-950 font-mono uppercase tracking-tight">
                Have questions or need technical support?
              </h3>
              <p className="text-xs text-zinc-400 font-semibold leading-relaxed">
                Our helpdesk features real-time simulated support conversations. You can post multiple support queries, select priority urgency levels, and experience simulated support replies in real-time.
              </p>
            </div>
            <div className="pt-6">
              <button 
                onClick={() => onNavigate?.('helpdesk')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/10 transition-all border border-indigo-500/20"
              >
                <span>Go to Support Help Desk</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Registration (2 cols) */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#030213] to-indigo-950 border border-zinc-800 rounded-2xl p-8 flex flex-col justify-between shadow-md text-white">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 text-[10px] font-bold uppercase tracking-wider border border-zinc-700">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Production Launch</span>
              </div>
              <h3 className="text-lg font-extrabold font-mono uppercase tracking-tight text-white leading-snug">
                Ready to deploy real newsletters?
              </h3>
              <p className="text-xs text-zinc-400 font-semibold leading-relaxed">
                Exit sandbox mode and register a persistent workspace in seconds to manage real email campaigns, connect domains, and collaborate with your marketing team.
              </p>
            </div>
            <div className="pt-6">
              <button 
                onClick={() => onNavigate?.('signup')}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-purple-500/10 transition-all border border-purple-500/20"
              >
                <span>Register Permanent Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </ModuleLayout>
  );
}
