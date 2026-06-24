'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, ArrowLeft, Crown, Lock, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';
import OpsSidebar from './components/OpsSidebar';
import OpsHeader from './components/OpsHeader';
import ModuleProfile from './components/ModuleProfile';
import ModuleTenants from './components/ModuleTenants';
import ModuleBilling from './components/ModuleBilling';
import ModuleCoupons from './components/ModuleCoupons';
import ModuleCMS from './components/ModuleCMS';
import ModuleSecurity from './components/ModuleSecurity';
import ModuleNotifications from './components/ModuleNotifications';
import ModuleHelpDesk from './components/ModuleHelpDesk';
import ModuleScheduler from './components/ModuleScheduler';
import { PlatformOperator, OwnerProfile } from './types';
import { Button } from '@/app/components/ui/button';

export default function OpsCockpitPage() {
  const router = useRouter();
  const { currentUser, switchPersona } = useWorkspace();

  // Active session operator metadata (SuperAdmin level)
  const [activeOperator, setActiveOperator] = useState<PlatformOperator>({
    id: 'op-1',
    name: 'John Doe',
    email: 'john@example.com',
    accessLevel: 'L3 - Full',
    status: 'Active',
    privilegeToken: 'NC_PRIV_TOKEN_L3_9240'
  });

  // Layout Tab selection
  const [activeTab, setActiveTab] = useState<number>(0);
  
  // Transition Skeleton loader state
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Synchronize operator name if updated in owner profile or if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setActiveOperator(prev => ({
        ...prev,
        name: currentUser.name,
        email: currentUser.email,
        accessLevel: currentUser.role === 'owner' ? 'L3 - Full' : 'L1 - Viewer'
      }));
    }
  }, [currentUser]);

  const handleProfileUpdate = (profile: OwnerProfile) => {
    setActiveOperator(prev => ({
      ...prev,
      name: `${profile.firstName} ${profile.lastName}`,
      email: profile.email
    }));
  };

  // Trigger 450ms skeleton loader simulation on tab selection
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // If NOT organization owner, deny access with an ultra-premium block
  if (currentUser.role !== 'owner') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-900 to-indigo-950 flex items-center justify-center p-6 text-white selection:bg-purple-500/30">
        <div className="w-full max-w-lg bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-fuchsia-600/10 rounded-full blur-3xl" />

          {/* Locked Badge */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center justify-center">
              <Lock className="size-10 text-red-400 animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-black text-center tracking-tight mb-2 text-zinc-100 flex items-center justify-center gap-2">
            <ShieldAlert className="size-6 text-red-400" />
            Access Restricted
          </h1>
          <p className="text-zinc-400 text-sm text-center mb-8 font-medium">
            This administrative panel is reserved exclusively for the <strong>Organization Owner</strong>.
          </p>

          {/* Current Persona Card */}
          <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-2xl p-5 mb-8">
            <p className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase mb-2">
              Your Current Identity:
            </p>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-white text-base">{currentUser.name}</h3>
                <p className="text-xs text-zinc-400">{currentUser.email}</p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                currentUser.role === 'workspace_admin'
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                  : 'bg-zinc-700/50 text-zinc-300 border border-zinc-600'
              }`}>
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={() => {
                switchPersona('john@example.com');
              }}
              className="w-full h-12 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-500/15 active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <Crown className="size-4" />
              Switch to John Doe (Owner)
              <ChevronRight className="size-4" />
            </button>

            <button
              onClick={() => {
                // Return to dashboard route or trigger Dev Nav redirect
                router.push('/dashboard');
              }}
              className="w-full h-12 bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-sm font-semibold transition-all border border-zinc-700/40 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="size-4" />
              Go Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tab router
  const renderActiveModule = () => {
    switch (activeTab) {
      case 0:
        return <ModuleProfile onProfileUpdate={handleProfileUpdate} />;
      case 1:
        return <ModuleTenants />;
      case 2:
        return <ModuleBilling />;
      case 3:
        return <ModuleCoupons />;
      case 4:
        return <ModuleScheduler />;
      case 5:
        return <ModuleCMS />;
      case 6:
        return <ModuleSecurity />;
      case 7:
        return <ModuleNotifications />;
      case 8:
        return <ModuleHelpDesk />;
      default:
        return <ModuleProfile onProfileUpdate={handleProfileUpdate} />;
    }
  };

  return (
    <div className="flex bg-zinc-50/60 min-h-screen font-sans text-[#030213] select-none selection:bg-purple-100 selection:text-purple-900">
      {/* Sidebar navigation dock */}
      <OpsSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        activeOperator={activeOperator} 
      />

      {/* Main viewport area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Unified system header */}
        <OpsHeader activeOperator={activeOperator} />

        {/* Dynamic module mounting panel */}
        <main className="flex-1 p-8 overflow-y-auto">
          {isLoading ? <SkeletonLoader /> : renderActiveModule()}
        </main>
      </div>
    </div>
  );
}

// Premium animated Shimmer Dashboard Skeleton Loader (strictly timed at 450ms)
function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title block skeleton */}
      <div className="space-y-2">
        <div className="h-6 w-72 bg-zinc-200/80 rounded-lg"></div>
        <div className="h-3 w-120 bg-zinc-200/50 rounded-md"></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Card skeleton: 5 columns */}
        <div className="xl:col-span-5 space-y-6">
          <div className="bg-white/80 border border-zinc-200/40 rounded-2xl p-6 h-[460px] flex flex-col justify-between">
            <div className="space-y-5">
              {/* Header group */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-200/80"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-40 bg-zinc-200/80 rounded"></div>
                  <div className="h-2.5 w-24 bg-zinc-200/50 rounded"></div>
                </div>
              </div>
              
              {/* Fake form input fields */}
              <div className="space-y-4 pt-4">
                <div className="space-y-1.5">
                  <div className="h-2.5 w-20 bg-zinc-200/60 rounded"></div>
                  <div className="h-9 w-full bg-zinc-100/60 rounded-xl border border-zinc-200/30"></div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2.5 w-24 bg-zinc-200/60 rounded flex-shrink-0"></div>
                  <div className="h-9 w-full bg-zinc-100/60 rounded-xl border border-zinc-200/30"></div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2.5 w-28 bg-zinc-200/60 rounded"></div>
                  <div className="h-24 w-full bg-zinc-100/60 rounded-xl border border-zinc-200/30"></div>
                </div>
              </div>
            </div>

            {/* Action button skeleton */}
            <div className="h-10 w-full bg-zinc-200/80 rounded-xl"></div>
          </div>
        </div>

        {/* Right Card skeleton: 7 columns */}
        <div className="xl:col-span-7 space-y-6">
          <div className="bg-white/80 border border-zinc-200/40 rounded-2xl p-6 h-[460px] flex flex-col justify-between">
            <div className="space-y-4">
              {/* Table / List Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-zinc-200/80"></div>
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-32 bg-zinc-200/80 rounded"></div>
                    <div className="h-2 w-48 bg-zinc-200/50 rounded"></div>
                  </div>
                </div>
                <div className="h-6 w-20 bg-zinc-100 rounded-full"></div>
              </div>

              {/* Fake List rows */}
              <div className="space-y-3 pt-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="p-3.5 border border-zinc-100 rounded-xl bg-zinc-50/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-200/80"></div>
                      <div className="space-y-1.5">
                        <div className="h-3 w-28 bg-zinc-200/80 rounded"></div>
                        <div className="h-2 w-20 bg-zinc-200/50 rounded"></div>
                      </div>
                    </div>
                    <div className="h-5 w-16 bg-zinc-200/80 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom help bar skeleton */}
            <div className="h-14 w-full bg-zinc-100/60 rounded-xl border border-zinc-200/20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
