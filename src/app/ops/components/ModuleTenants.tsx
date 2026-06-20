'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ChevronDown, 
  ChevronRight, 
  Check, 
  Database,
  Search,
  ExternalLink,
  Plus,
  X
} from 'lucide-react';
import { WorkspaceTenant, PendingOnboarding } from '../types';
import { toast } from 'sonner';

const getSubscriptionPlan = (details: any, defaultSlug: string) => {
  if (details && details.plan) return details.plan;

  // Mock plans for default mock onboarding requests
  if (defaultSlug === 'horizon-agency') {
    return {
      tier: 'Standard',
      cycle: 'monthly',
      addons: { workspaces: 1, users: 2, storage: 0 },
      pricing: { basePrice: 1500, addonsPrice: 700, subtotal: 2200, discount: 0, gst: 396, total: 2596 }
    };
  }
  if (defaultSlug === 'stark-comm') {
    return {
      tier: 'Business',
      cycle: 'yearly',
      addons: { workspaces: 0, users: 0, storage: 0 },
      pricing: { basePrice: 8000, addonsPrice: 0, subtotal: 81600, discount: 14400, gst: 14688, total: 96288 }
    };
  }
  if (defaultSlug === 'wayne-pr') {
    return {
      tier: 'Pro',
      cycle: 'monthly',
      addons: { workspaces: 1, users: 5, storage: 0 },
      pricing: { basePrice: 4000, addonsPrice: 1000, subtotal: 5000, discount: 0, gst: 900, total: 5900 }
    };
  }

  // Fallback default
  return {
    tier: 'Standard',
    cycle: 'monthly',
    addons: { workspaces: 0, users: 0, storage: 0 },
    pricing: { basePrice: 1500, addonsPrice: 0, subtotal: 1500, discount: 0, gst: 270, total: 1770 }
  };
};

export default function ModuleTenants() {
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'onboarding'>('directory');

  // Tenant Registry Mock Data
  const [tenants, setTenants] = useState<WorkspaceTenant[]>([
    { id: '1', companyName: 'Acme Holdings Group', ownerName: 'John Doe', domainSlug: 'acme-holdings', slaTier: 'Enterprise', status: 'Active', seatAllocation: 85, activeInvitations: 12, renewalDate: '2027-01-15', isParent: true },
    { id: '1-1', companyName: 'Acme Creative NConnect', ownerName: 'Sarah Smith', domainSlug: 'acme-creative', slaTier: 'Business', status: 'Active', seatAllocation: 50, activeInvitations: 8, renewalDate: '2026-12-01', isParent: false, parentId: '1' },
    { id: '1-2', companyName: 'Acme Video NConnect', ownerName: 'Mark Johnson', domainSlug: 'acme-video', slaTier: 'Starter', status: 'Active', seatAllocation: 35, activeInvitations: 4, renewalDate: '2026-11-20', isParent: false, parentId: '1' },
    
    { id: '2', companyName: 'Global Media Agency', ownerName: 'Alice Vance', domainSlug: 'global-media', slaTier: 'Business', status: 'Active', seatAllocation: 120, activeInvitations: 30, renewalDate: '2026-10-30', isParent: true },
    { id: '2-1', companyName: 'Global Campaigns Lab', ownerName: 'Bruce Wayne', domainSlug: 'global-campaigns', slaTier: 'Business', status: 'Active', seatAllocation: 70, activeInvitations: 18, renewalDate: '2026-09-15', isParent: false, parentId: '2' },
    { id: '2-2', companyName: 'Global PR NConnect', ownerName: 'Diana Prince', domainSlug: 'global-pr', slaTier: 'Business', status: 'Active', seatAllocation: 50, activeInvitations: 12, renewalDate: '2026-08-01', isParent: false, parentId: '2' },
    
    { id: '3', companyName: 'Vanguard Tech Solutions', ownerName: 'Ethan Hunt', domainSlug: 'vanguard-tech', slaTier: 'Starter', status: 'Active', seatAllocation: 25, activeInvitations: 2, renewalDate: '2026-12-15', isParent: true },
  ]);

  // Collapsed Parent Rows State
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({
    '1': true,
    '2': false,
    '3': false
  });

  // Pending Queue Data
  const [onboardingQueue, setOnboardingQueue] = useState<PendingOnboarding[]>([
    { id: 'p-1', workspaceName: 'Horizon Marketing Group', ownerName: 'Peter Parker', domainSlug: 'horizon-agency', slaTier: 'Business', status: 'In Review', submittedAt: '2026-06-18T08:15:00Z' },
    { id: 'p-2', workspaceName: 'Stark Communication Labs', ownerName: 'Tony Stark', domainSlug: 'stark-comm', slaTier: 'Enterprise', status: 'In Review', submittedAt: '2026-06-18T10:30:00Z' },
    { id: 'p-3', workspaceName: 'Wayne Enterprises PR', ownerName: 'Lucius Fox', domainSlug: 'wayne-pr', slaTier: 'Starter', status: 'In Review', submittedAt: '2026-06-18T11:45:00Z' }
  ]);

  // Selected for Review
  const [selectedOnboarding, setSelectedOnboarding] = useState<PendingOnboarding | null>(null);

  // Search Filter
  const [searchTerm, setSearchFilter] = useState('');

  // Sync custom/live registrations from localStorage
  useEffect(() => {
    const rawQueue = localStorage.getItem('nconnect_custom_queue');
    if (rawQueue) {
      try {
        const customQueue = JSON.parse(rawQueue);
        setOnboardingQueue(prev => {
          const combined = [...prev];
          customQueue.forEach((item: any) => {
            if (!combined.some(c => c.domainSlug === item.domainSlug)) {
              combined.push(item);
            }
          });
          return combined;
        });
      } catch (e) {
        console.error('Failed to sync custom queue', e);
      }
    }
  }, [activeSubTab]);

  const toggleParent = (parentId: string) => {
    setExpandedParents(prev => ({
      ...prev,
      [parentId]: !prev[parentId]
    }));
  };

  const handleSelectForReview = (item: PendingOnboarding) => {
    setSelectedOnboarding(item);
  };

  const handleApprove = (item: PendingOnboarding) => {
    // 1. Mark as APPROVED in localStorage
    localStorage.setItem(`nconnect_approval_${item.domainSlug}`, 'APPROVED');

    // 2. Fetch plan details to determine SLA, seat count, and renewal duration
    const details = getOnboardingDetails(item);
    const plan = getSubscriptionPlan(details, item.domainSlug);
    const baseSeats = plan.tier === 'Business' ? 20 : plan.tier === 'Pro' ? 10 : 5;
    const totalSeats = baseSeats + (plan.addons?.users || 0);
    const durationDays = plan.cycle === 'yearly' ? 365 : 30;

    // Add to active directory list
    const newParentTenant: WorkspaceTenant = {
      id: Math.random().toString(),
      companyName: item.workspaceName,
      ownerName: item.ownerName,
      domainSlug: item.domainSlug,
      slaTier: plan.tier,
      status: 'Active',
      seatAllocation: totalSeats,
      activeInvitations: 0,
      renewalDate: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isParent: true
    };

    setTenants(prev => [...prev, newParentTenant]);

    // 3. Remove from UI queue
    setOnboardingQueue(prev => prev.filter(p => p.id !== item.id));

    // 4. Remove from localStorage queue
    const rawQueue = localStorage.getItem('nconnect_custom_queue');
    if (rawQueue) {
      try {
        const customQueue = JSON.parse(rawQueue);
        const updated = customQueue.filter((q: any) => q.domainSlug !== item.domainSlug);
        localStorage.setItem('nconnect_custom_queue', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }

    setSelectedOnboarding(null);
    toast.success(`Tenant '${item.workspaceName}' has been APPROVED. Setup has completed successfully.`);
    setActiveSubTab('directory');
  };

  const handleDeny = (item: PendingOnboarding) => {
    // 1. Mark as DENIED in localStorage
    localStorage.setItem(`nconnect_approval_${item.domainSlug}`, 'DENIED');

    // 2. Remove from UI queue
    setOnboardingQueue(prev => prev.filter(p => p.id !== item.id));

    // 3. Remove from localStorage queue
    const rawQueue = localStorage.getItem('nconnect_custom_queue');
    if (rawQueue) {
      try {
        const customQueue = JSON.parse(rawQueue);
        const updated = customQueue.filter((q: any) => q.domainSlug !== item.domainSlug);
        localStorage.setItem('nconnect_custom_queue', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }

    setSelectedOnboarding(null);
    toast.error(`Workspace request for '${item.workspaceName}' has been DECLINED.`);
  };

  const filteredTenants = tenants.filter(t => 
    t.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.domainSlug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to extract onboarding data with mock fallbacks
  const getOnboardingDetails = (item: PendingOnboarding) => {
    if (item.onboardingData) return item.onboardingData;

    // Fallback mock onboardingData for the default demo items
    if (item.domainSlug === 'horizon-agency') {
      return {
        personal: { firstName: 'Peter', lastName: 'Parker', email: 'peter@horizon.com', role: 'Agency Admin' },
        agency: { name: 'Horizon Marketing Group', category: 'Marketing Agency', size: '11-50 Employees', timezone: 'UTC', email: 'billing@horizon.com', phone: '+1-555-0192', registrationNo: 'CIN-HOR-9201', gstRegistrationNo: '27HORIZ9201A1Z0' },
        workspace: { name: 'Horizon Marketing Group', slug: 'horizon-agency', slaTier: 'Business', primaryColor: '#8B5CF6', secondaryColor: '#3B82F6' },
        useCase: { primaryGoal: 'send', subscriberCount: 'Growing (100-500)', frequency: 'Weekly', industry: 'Marketing/Advertising' }
      };
    }
    if (item.domainSlug === 'stark-comm') {
      return {
        personal: { firstName: 'Tony', lastName: 'Stark', email: 'tony@stark.com', role: 'CEO / Founder' },
        agency: { name: 'Stark Communication Labs', category: 'Enterprise PR', size: '500+ Employees', timezone: 'America/New_York', email: 'corp@stark.com', phone: '+1-555-4766', registrationNo: 'CIN-STK-4811', gstRegistrationNo: '27STARK4811C1ZA' },
        workspace: { name: 'Stark Communication Labs', slug: 'stark-comm', slaTier: 'Enterprise', primaryColor: '#EF4444', secondaryColor: '#F59E0B' },
        useCase: { primaryGoal: 'both', subscriberCount: 'Large audience (5,000+)', frequency: 'Daily', industry: 'SaaS' }
      };
    }
    if (item.domainSlug === 'wayne-pr') {
      return {
        personal: { firstName: 'Lucius', lastName: 'Fox', email: 'lucius@wayne.com', role: 'Managing Director' },
        agency: { name: 'Wayne Enterprises PR', category: 'Consulting', size: '51-200 Employees', timezone: 'EST', email: 'office@wayne.com', phone: '+1-555-1939', registrationNo: 'CIN-WYN-1939', gstRegistrationNo: '27WAYNE1939F1ZC' },
        workspace: { name: 'Wayne Enterprises PR', slug: 'wayne-pr', slaTier: 'Starter', primaryColor: '#18181B', secondaryColor: '#10B981' },
        useCase: { primaryGoal: 'receive', subscriberCount: 'Established (500-1,000)', frequency: 'Bi-weekly', industry: 'Consulting' }
      };
    }

    // Default general fallback structure
    return {
      personal: { firstName: item.ownerName.split(' ')[0], lastName: item.ownerName.split(' ')[1] || '', email: `${item.domainSlug}@nconnect.sh`, role: 'Organization Owner' },
      agency: { name: item.workspaceName, category: 'Business Services', size: '1-10 Employees', timezone: 'UTC', email: `${item.domainSlug}@nconnect.sh`, phone: '+1-555-0100', registrationNo: 'CIN-GEN-8201', gstRegistrationNo: '27GEN8201A1Z9' },
      workspace: { name: item.workspaceName, slug: item.domainSlug, slaTier: item.slaTier, primaryColor: '#6366F1', secondaryColor: '#EC4899' },
      useCase: { primaryGoal: 'both', subscriberCount: 'Growing (100-500)', frequency: 'Monthly', industry: 'Other' }
    };
  };

  // Get details for selected request
  const selectedDetails = selectedOnboarding ? getOnboardingDetails(selectedOnboarding) : null;

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">Tenant Registry & Outbound Onboarding</h1>
          <p className="text-[12px] text-zinc-400 font-semibold tracking-tight">Provision active workspaces, supervise child organizations, and review pending registrations.</p>
        </div>
        <div className="flex bg-zinc-100 rounded-xl p-0.5 border border-zinc-200/50">
          <button
            onClick={() => setActiveSubTab('directory')}
            className={`px-4 py-2 rounded-lg text-[11px] font-bold tracking-tight transition-all ${
              activeSubTab === 'directory' 
                ? 'bg-white text-purple-700 shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Active Directory ({tenants.filter(t => t.isParent).length})
          </button>
          <button
            onClick={() => setActiveSubTab('onboarding')}
            className={`px-4 py-2 rounded-lg text-[11px] font-bold tracking-tight transition-all relative ${
              activeSubTab === 'onboarding' 
                ? 'bg-white text-purple-700 shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <span>Onboarding Queue</span>
            {onboardingQueue.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-fuchsia-600 text-[9px] font-extrabold text-white flex items-center justify-center animate-bounce">
                {onboardingQueue.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeSubTab === 'directory' ? (
        <div className="bg-white/80 backdrop-blur-md border border-zinc-200/60 rounded-2xl shadow-sm overflow-hidden">
          {/* Active directory search */}
          <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
            <div className="relative w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-3.5 h-3.5 text-zinc-400" />
              </span>
              <input 
                type="text" 
                placeholder="Filter workspaces, slugs..." 
                value={searchTerm}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full text-[11px] bg-zinc-50 border border-zinc-200/60 focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/5 rounded-lg py-1.5 pl-8 pr-4 font-semibold text-zinc-800 placeholder-zinc-400 transition-all outline-none"
              />
            </div>
          </div>

          {/* Directory Tree-Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/40">
                  <th className="px-6 py-3.5 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 w-80">Workspace / Client Company</th>
                  <th className="px-4 py-3.5 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">SLA Tier</th>
                  <th className="px-4 py-3.5 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">Status</th>
                  <th className="px-4 py-3.5 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 text-center">Seat Allocations</th>
                  <th className="px-4 py-3.5 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 text-center">Pending Invites</th>
                  <th className="px-4 py-3.5 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">Renewal Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.map((tenant) => {
                  if (tenant.parentId) return null; // We'll render child rows inline with their parent

                  const isExpanded = expandedParents[tenant.id];
                  const children = tenants.filter(t => t.parentId === tenant.id);
                  const hasChildren = children.length > 0;

                  return (
                    <React.Fragment key={tenant.id}>
                      {/* Parent Row */}
                      <tr 
                        onClick={() => hasChildren && toggleParent(tenant.id)}
                        className={`border-b border-zinc-100/60 hover:bg-zinc-50/40 transition-all duration-150 cursor-pointer ${hasChildren ? 'font-bold' : ''}`}
                      >
                        <td className="px-6 py-4 flex items-center gap-2">
                          {hasChildren ? (
                            isExpanded ? <ChevronDown className="w-4 h-4 text-purple-600" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />
                          ) : (
                            <span className="w-4"></span>
                          )}
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center border border-purple-100/40">
                              <Building2 className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-[12.5px] text-zinc-800">{tenant.companyName}</p>
                              <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-tight">slug: {tenant.domainSlug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                            tenant.slaTier === 'Enterprise' ? 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' :
                            tenant.slaTier === 'Business' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            tenant.slaTier === 'Starter' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                            'bg-zinc-50 text-zinc-700 border-zinc-200'
                          }`}>
                            {tenant.slaTier}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>{tenant.status}</span>
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-[12px] font-bold text-zinc-700">
                            {hasChildren 
                              ? tenant.seatAllocation + children.reduce((sum, c) => sum + c.seatAllocation, 0)
                              : tenant.seatAllocation
                            }
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-[12px] font-semibold text-zinc-500">
                            {hasChildren 
                              ? tenant.activeInvitations + children.reduce((sum, c) => sum + c.activeInvitations, 0)
                              : tenant.activeInvitations
                            }
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-[11.5px] font-semibold text-zinc-600">{tenant.renewalDate}</span>
                        </td>
                      </tr>

                      {/* Expanded Child Rows */}
                      {isExpanded && children.map((child, childIdx) => {
                        const isLastChild = childIdx === children.length - 1;
                        return (
                          <tr key={child.id} className="border-b border-zinc-100/40 bg-zinc-50/20 hover:bg-zinc-50/50 transition-all">
                            <td className="px-6 py-3.5 pl-14 flex items-center gap-2">
                              {/* Tree connector nodes (branch elbows) */}
                              <span className="text-zinc-300 font-mono text-[16px] leading-tight select-none">
                                {isLastChild ? '└── ' : '├── '}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="w-6.5 h-6.5 rounded-md bg-zinc-100 flex items-center justify-center border border-zinc-200/50 text-[10px] font-mono font-bold text-zinc-500">
                                  WS
                                </div>
                                <div>
                                  <p className="text-[11.5px] font-semibold text-zinc-700">{child.companyName}</p>
                                  <p className="text-[9px] font-mono font-bold text-zinc-400">slug: {child.domainSlug}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-zinc-600 uppercase">
                                {child.slaTier}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                                <span>{child.status}</span>
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <span className="text-[11.5px] font-bold text-zinc-600">{child.seatAllocation}</span>
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <span className="text-[11.5px] font-semibold text-zinc-400">{child.activeInvitations}</span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="text-[11px] font-semibold text-zinc-500">{child.renewalDate}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Pending Onboarding list */}
          <div className="xl:col-span-5 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 px-1">
              Workspaces Awaiting Provision
            </h3>
            <div className="space-y-3.5">
              {onboardingQueue.length === 0 ? (
                <div className="bg-white/60 border border-zinc-200/50 rounded-2xl p-8 text-center space-y-3">
                  <Database className="w-8 h-8 text-zinc-300 mx-auto" />
                  <p className="text-[12px] font-bold text-zinc-500">Onboarding queue completely cleared.</p>
                </div>
              ) : (
                onboardingQueue.map((item) => {
                  const isSelected = selectedOnboarding?.id === item.id;
                  return (
                    <div 
                      key={item.id}
                      onClick={() => handleSelectForReview(item)}
                      className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? 'bg-gradient-to-r from-fuchsia-50/40 via-purple-50/40 to-indigo-50/20 border-purple-500 shadow-md scale-[1.01]' 
                          : 'bg-white hover:bg-zinc-50/50 border-zinc-200/60 shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-[13px] font-extrabold text-zinc-900">{item.workspaceName}</h4>
                          <p className="text-[10px] font-mono font-bold text-zinc-400">slug: {item.domainSlug}</p>
                        </div>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-4 mt-4 border-t border-zinc-100 text-[11px] font-semibold text-zinc-600">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-tight">Owner</span>
                          <p className="truncate text-zinc-800 font-bold">{item.ownerName}</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-tight">SLA Tier</span>
                          <p>
                            <span className="text-[9.5px] font-mono font-bold uppercase text-purple-700 bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded">
                              {item.slaTier}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Simple Review & Actions Panel */}
          <div className="xl:col-span-7 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 px-1">
              Onboarding Review Control Center
            </h3>

            {selectedOnboarding && selectedDetails ? (
              <div className="bg-white border border-zinc-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                {/* Panel Header */}
                <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 border border-purple-100/50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Request ID: {selectedOnboarding.id}
                    </span>
                    <h4 className="text-base font-extrabold text-zinc-900 mt-2">
                      Reviewing: {selectedOnboarding.workspaceName}
                    </h4>
                  </div>
                </div>

                {/* Details Section (Scrollable) */}
                 <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[550px]">
                   {/* 👤 Owner Profile */}
                   <div className="space-y-2.5">
                     <h5 className="text-[10px] font-mono font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                       <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                       Owner Profile Details
                     </h5>
                     <div className="grid grid-cols-3 gap-3.5 bg-zinc-50/40 p-4 rounded-xl border border-zinc-100">
                       <div>
                         <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">First Name</span>
                         <p className="text-[12px] font-bold text-zinc-800 mt-0.5">{selectedDetails.personal?.firstName || '-'}</p>
                       </div>
                       <div>
                         <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Last Name</span>
                         <p className="text-[12px] font-bold text-zinc-800 mt-0.5">{selectedDetails.personal?.lastName || '-'}</p>
                       </div>
                       <div>
                         <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Contact Email</span>
                         <p className="text-[12px] font-bold text-zinc-800 mt-0.5 truncate">{selectedDetails.personal?.email || '-'}</p>
                       </div>
                       <div className="border-t border-zinc-100 pt-2.5 mt-2">
                         <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Role / Designation</span>
                         <p className="text-[12px] font-bold text-zinc-800 mt-0.5">{selectedDetails.personal?.role || 'Organization Owner'}</p>
                       </div>
                       <div className="border-t border-zinc-100 pt-2.5 mt-2">
                         <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Personal Phone</span>
                         <p className="text-[12px] font-bold text-zinc-800 mt-0.5">{selectedDetails.personal?.phone || '-'}</p>
                       </div>
                       <div className="border-t border-zinc-100 pt-2.5 mt-2 col-span-1">
                         <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Personal Company</span>
                         <p className="text-[12px] font-bold text-zinc-800 mt-0.5 truncate">{selectedDetails.personal?.company || '-'}</p>
                       </div>
                     </div>
                   </div>

                   {/* 🏢 Agency Details */}
                   <div className="space-y-2.5">
                     <h5 className="text-[10px] font-mono font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                       <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                       Agency Info & Compliance
                     </h5>
                     <div className="grid grid-cols-2 gap-3.5 bg-zinc-50/40 p-4 rounded-xl border border-zinc-100">
                       <div>
                         <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Legal Name</span>
                         <p className="text-[12px] font-bold text-zinc-800 mt-0.5">{selectedDetails.agency?.name || '-'}</p>
                       </div>
                       <div>
                         <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Category</span>
                         <p className="text-[12px] font-bold text-zinc-800 mt-0.5">{selectedDetails.agency?.category || '-'}</p>
                       </div>
                       <div>
                         <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Company Size</span>
                         <p className="text-[12px] font-bold text-zinc-800 mt-0.5">{selectedDetails.agency?.size || '-'}</p>
                       </div>
                       <div>
                         <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Timezone</span>
                         <p className="text-[12px] font-bold text-zinc-800 mt-0.5">{selectedDetails.agency?.timezone || '-'}</p>
                       </div>
                       <div>
                         <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Primary Phone</span>
                         <p className="text-[12px] font-bold text-zinc-800 mt-0.5">{selectedDetails.agency?.phoneNumber || selectedDetails.agency?.phone || '-'}</p>
                       </div>
                       <div>
                         <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Alternate Phone</span>
                         <p className="text-[12px] font-bold text-zinc-800 mt-0.5">{selectedDetails.agency?.telephoneNumber || '-'}</p>
                       </div>
                       <div>
                         <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Company Email</span>
                         <p className="text-[12px] font-bold text-zinc-800 mt-0.5 truncate">{selectedDetails.agency?.email || '-'}</p>
                       </div>
                       <div>
                         <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Alternate Email</span>
                         <p className="text-[12px] font-bold text-zinc-800 mt-0.5 truncate">{selectedDetails.agency?.alternateEmail || '-'}</p>
                       </div>
                       <div className="col-span-2 border-t border-zinc-100 pt-2.5 mt-2">
                         <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Website URL</span>
                         {selectedDetails.agency?.website ? (
                           <div className="flex items-center gap-2 mt-1">
                             <p className="text-[12px] font-bold text-zinc-800 truncate">{selectedDetails.agency.website}</p>
                             <a
                               href={selectedDetails.agency.website.startsWith('http') ? selectedDetails.agency.website : `https://${selectedDetails.agency.website}`}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="text-purple-600 hover:text-purple-800 flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-tight"
                             >
                               <span>Visit</span>
                               <ExternalLink className="w-3 h-3" />
                             </a>
                           </div>
                         ) : (
                           <p className="text-[12px] font-semibold text-zinc-500 mt-0.5">-</p>
                         )}
                       </div>
                       <div className="col-span-2 border-t border-zinc-100 pt-2.5 mt-2 grid grid-cols-2 gap-3">
                         <div>
                           <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Registration No. (CIN)</span>
                           <p className="text-[11px] font-mono font-bold text-zinc-800 mt-0.5">{selectedDetails.agency?.registrationNo || selectedDetails.agency?.registration_no || 'N/A'}</p>
                         </div>
                         <div>
                           <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">GST Registration No.</span>
                           <p className="text-[11px] font-mono font-bold text-zinc-800 mt-0.5">{selectedDetails.agency?.gstRegistrationNo || selectedDetails.agency?.gst_registration_no || 'N/A'}</p>
                         </div>
                       </div>
                     </div>
                   </div>

                   {/* 📍 Billing Address */}
                   {(selectedDetails.agency?.address || selectedDetails.agency?.billingAddress) && (
                     <div className="space-y-2.5">
                       <h5 className="text-[10px] font-mono font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                         <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                         Billing Address Details
                       </h5>
                       <div className="bg-zinc-50/40 p-4 rounded-xl border border-zinc-100 text-left text-[12.5px] font-semibold text-zinc-800 space-y-1">
                         {(() => {
                           const addr = selectedDetails.agency?.address || selectedDetails.agency?.billingAddress;
                           return (
                             <>
                               <p>{addr.addressLine1}</p>
                               {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                               <p>{addr.city || addr.district || '-'}{addr.state ? `, ${addr.state}` : ''}{addr.pincode ? ` - ${addr.pincode}` : ''}</p>
                               {addr.country && <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1.5">{addr.country}</p>}
                             </>
                           );
                         })()}
                       </div>
                     </div>
                   )}

                   {/* 🔗 Social Media Presence */}
                   {selectedDetails.agency?.socials && (
                     <div className="space-y-2.5">
                       <h5 className="text-[10px] font-mono font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                         <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                         Social Media Profiles
                       </h5>
                       <div className="grid grid-cols-2 gap-3.5 bg-zinc-50/40 p-4 rounded-xl border border-zinc-100">
                         <div>
                           <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">LinkedIn</span>
                           <p className="text-[12px] font-bold text-zinc-800 mt-0.5 truncate">{selectedDetails.agency.socials.linkedin || '-'}</p>
                         </div>
                         <div>
                           <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Twitter / X</span>
                           <p className="text-[12px] font-bold text-zinc-800 mt-0.5 truncate">{selectedDetails.agency.socials.twitter || '-'}</p>
                         </div>
                         <div>
                           <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Facebook</span>
                           <p className="text-[12px] font-bold text-zinc-800 mt-0.5 truncate">{selectedDetails.agency.socials.facebook || '-'}</p>
                         </div>
                         <div>
                           <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Instagram</span>
                           <p className="text-[12px] font-bold text-zinc-800 mt-0.5 truncate">{selectedDetails.agency.socials.instagram || '-'}</p>
                         </div>
                       </div>
                     </div>
                   )}

                   {/* 🌐 Workspace & Custom Branding */}
                   <div className="space-y-2.5">
                     <h5 className="text-[10px] font-mono font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                       <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                       Workspace & Branding Config
                     </h5>
                     <div className="grid grid-cols-2 gap-3.5 bg-zinc-50/40 p-4 rounded-xl border border-zinc-100">
                       <div>
                         <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Workspace Name</span>
                         <p className="text-[12px] font-bold text-zinc-800 mt-0.5">{selectedDetails.workspace?.name || selectedOnboarding.workspaceName}</p>
                       </div>
                       <div>
                         <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Workspace Slug</span>
                         <p className="text-[12px] font-bold text-zinc-800 mt-0.5">
                           {selectedDetails.workspace?.identifier || selectedDetails.workspace?.slug || selectedOnboarding.domainSlug}.socially.me
                         </p>
                       </div>
                       <div className="col-span-2">
                         <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Description</span>
                         <p className="text-[12px] font-bold text-zinc-800 mt-0.5 italic text-zinc-600 leading-relaxed">
                           {selectedDetails.workspace?.description || 'No description provided.'}
                         </p>
                       </div>
                       <div className="col-span-2 border-t border-zinc-100 pt-2.5 mt-2">
                         <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Subscription SLA</span>
                         <p className="mt-0.5">
                           <span className="text-[9px] font-mono font-bold uppercase text-purple-700 bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded">
                             {selectedDetails.workspace?.slaTier || selectedOnboarding.slaTier}
                           </span>
                         </p>
                       </div>
                       <div className="col-span-2 border-t border-zinc-100 pt-2.5 mt-2">
                         <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Chosen Theme Color</span>
                         {(() => {
                           const themeCol = selectedDetails.workspace?.color || selectedDetails.workspace?.primaryColor || '#4A90E2';
                           return (
                             <div className="flex items-center gap-2.5 mt-1.5">
                               <span className="w-8 h-8 rounded-lg border border-zinc-200 shadow-sm block shrink-0" style={{ backgroundColor: themeCol }}></span>
                               <div>
                                 <p className="text-[11px] font-mono font-bold text-zinc-800">{themeCol}</p>
                                 <p className="text-[9px] font-semibold text-zinc-400">Applied dynamically as header & sidebar primary branding color</p>
                               </div>
                             </div>
                           );
                         })()}
                       </div>
                     </div>
                   </div>

                   {/* 🎯 Platform Use-Case & Objectives */}
                   <div className="space-y-2.5">
                     <h5 className="text-[10px] font-mono font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                       <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                       Platform Use-Case & Goals
                     </h5>
                     <div className="grid grid-cols-2 gap-3.5 bg-zinc-50/40 p-4 rounded-xl border border-zinc-100">
                       <div>
                         <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Primary Goal</span>
                         <p className="text-[12px] font-bold text-zinc-800 mt-0.5 capitalize">
                           {selectedDetails.useCase?.primaryGoal === 'send' ? 'Campaign Newsletters' :
                            selectedDetails.useCase?.primaryGoal === 'receive' ? 'Manage incoming' :
                            selectedDetails.useCase?.primaryGoal === 'both' ? 'Sending & Receiving' : 'Sending Campaigns'}
                         </p>
                       </div>
                       <div>
                         <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Subscriber Count</span>
                         <p className="text-[12px] font-bold text-zinc-800 mt-0.5">{selectedDetails.useCase?.subscriberCount || 'Growing (100-500)'}</p>
                       </div>
                       <div>
                         <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Industry</span>
                         <p className="text-[12px] font-bold text-zinc-800 mt-0.5">{selectedDetails.useCase?.industry || 'Marketing'}</p>
                       </div>
                       <div>
                         <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Sending Frequency</span>
                         <p className="text-[12px] font-bold text-zinc-800 mt-0.5">{selectedDetails.useCase?.frequency || 'Weekly'}</p>
                       </div>
                     </div>
                   </div>

                   {/* 💳 Subscription Plan & Billing Details */}
                   {(() => {
                     const plan = getSubscriptionPlan(selectedDetails, selectedOnboarding.domainSlug);
                     const baseSeats = plan.tier === 'Business' ? 20 : plan.tier === 'Pro' ? 10 : 5;
                     const baseWS = plan.tier === 'Business' ? 10 : plan.tier === 'Pro' ? 5 : 2;
                     const baseSTG = plan.tier === 'Business' ? 10 : plan.tier === 'Pro' ? 5 : 2;

                     const totalWS = baseWS + (plan.addons?.workspaces || 0);
                     const totalUsers = baseSeats + (plan.addons?.users || 0);
                     const totalSTG = baseSTG + (plan.addons?.storage || 0);

                     const formatCurrencyINR = (val: number) => {
                       return new Intl.NumberFormat('en-IN', {
                         style: 'currency',
                         currency: 'INR',
                         maximumFractionDigits: 0,
                       }).format(val);
                     };

                     return (
                       <div className="space-y-2.5">
                         <h5 className="text-[10px] font-mono font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                           <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                           Chosen Subscription & Billing
                         </h5>
                         <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 border border-zinc-200 rounded-xl p-5 space-y-4 text-left">
                           <div className="flex items-start justify-between border-b border-zinc-200 pb-3">
                             <div>
                               <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                                 plan.tier === 'Business' ? 'bg-zinc-900 text-white border-zinc-950' :
                                 plan.tier === 'Pro' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                 'bg-blue-100 text-blue-700 border-blue-200'
                               }`}>
                                 {plan.tier} Plan
                               </span>
                               <span className="ml-2 text-[11px] font-semibold text-zinc-500 capitalize">
                                 Billing: {plan.cycle} Cycle
                               </span>
                             </div>
                             <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg uppercase">
                               PAID & SIMULATED
                             </span>
                           </div>

                           {/* Total Entitlements details */}
                           <div className="grid grid-cols-3 gap-2.5 text-[11px] font-semibold text-zinc-600">
                             <div className="bg-white border border-zinc-150 p-2.5 rounded-lg text-center">
                               <p className="text-zinc-400 text-[8.5px] font-mono font-bold uppercase tracking-tight">Workspaces</p>
                               <p className="text-[13px] font-extrabold text-zinc-800 mt-0.5">{totalWS}</p>
                               <p className="text-[8px] text-zinc-400 font-medium mt-0.5">({baseWS} base + {plan.addons?.workspaces || 0} addon)</p>
                             </div>
                             <div className="bg-white border border-zinc-150 p-2.5 rounded-lg text-center">
                               <p className="text-zinc-400 text-[8.5px] font-mono font-bold uppercase tracking-tight">Seats (Users)</p>
                               <p className="text-[13px] font-extrabold text-zinc-800 mt-0.5">{totalUsers}</p>
                               <p className="text-[8px] text-zinc-400 font-medium mt-0.5">({baseSeats} base + {plan.addons?.users || 0} addon)</p>
                             </div>
                             <div className="bg-white border border-zinc-150 p-2.5 rounded-lg text-center">
                               <p className="text-zinc-400 text-[8.5px] font-mono font-bold uppercase tracking-tight">Cloud Storage</p>
                               <p className="text-[13px] font-extrabold text-zinc-800 mt-0.5">{totalSTG} GB</p>
                               <p className="text-[8px] text-zinc-400 font-medium mt-0.5">({baseSTG} base + {plan.addons?.storage || 0} addon)</p>
                             </div>
                           </div>

                           {/* Cost itemization */}
                           <div className="border-t border-zinc-200 pt-3 space-y-1.5 text-[11px] font-semibold text-zinc-500">
                             <div className="flex justify-between">
                               <span className="text-zinc-400 font-medium">Plan Base Rate</span>
                               <span className="text-zinc-800 font-bold">
                                 {plan.cycle === 'yearly' ? formatCurrencyINR(plan.pricing?.basePrice * 12) : formatCurrencyINR(plan.pricing?.basePrice)}
                               </span>
                             </div>
                             {(plan.pricing?.addonsPrice || 0) > 0 && (
                               <div className="flex justify-between">
                                 <span className="text-zinc-400 font-medium">Add-on Resources</span>
                                 <span className="text-zinc-800 font-bold">
                                   {plan.cycle === 'yearly' ? formatCurrencyINR(plan.pricing?.addonsPrice * 12) : formatCurrencyINR(plan.pricing?.addonsPrice)}
                                 </span>
                               </div>
                             )}
                             {(plan.pricing?.discount || 0) > 0 && (
                               <div className="flex justify-between text-emerald-600">
                                 <span>15% Yearly Savings</span>
                                 <span>-{formatCurrencyINR(plan.pricing?.discount)}</span>
                               </div>
                             )}
                             <div className="flex justify-between">
                               <span className="text-zinc-400 font-medium">GST Tax (18%)</span>
                               <span className="text-zinc-800 font-bold">{formatCurrencyINR(plan.pricing?.gst)}</span>
                             </div>
                             <div className="flex justify-between border-t border-dashed border-zinc-200 pt-2 text-[12px] font-extrabold">
                               <span className="text-zinc-900">Total Charged Amount</span>
                               <span className="text-purple-700">{formatCurrencyINR(plan.pricing?.total)}</span>
                             </div>
                           </div>
                         </div>
                       </div>
                     );
                   })()}

                  {/* Safety Warning */}
                  <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4 flex gap-3">
                    <span className="text-amber-500 font-bold select-none text-sm">⚠️</span>
                    <p className="text-xs text-amber-800 font-medium leading-relaxed">
                      Please verify all business registration parameters, legal status, and compliance numbers (CIN & GSTIN) before granting administrative permission to create this tenant instance.
                    </p>
                  </div>
                </div>

                {/* Control Actions */}
                <div className="p-4 border-t border-zinc-100 bg-zinc-50/30 flex gap-3">
                  <button
                    onClick={() => handleDeny(selectedOnboarding)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 text-xs font-bold transition-all"
                  >
                    <X className="w-4 h-4" />
                    <span>Deny Request</span>
                  </button>
                  <button
                    onClick={() => handleApprove(selectedOnboarding)}
                    className="flex-[2] flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/15"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Workspace</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-zinc-200/50 rounded-2xl h-[400px] flex flex-col items-center justify-center p-8 text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-100">
                  <Building2 className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h4 className="text-[13px] font-extrabold text-zinc-800">Select Workspace to Review</h4>
                  <p className="text-[11px] font-semibold text-zinc-400 mt-1 max-w-xs">
                    Choose a pending tenant from the onboarding queue on the left to verify credentials, approve workspace registration, or decline access.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
