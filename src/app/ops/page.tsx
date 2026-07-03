'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
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
import ModuleDemoManagement from './components/ModuleDemoManagement';
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
      const isPowerUser = currentUser.role === 'owner' || currentUser.role === 'platform_admin';
      setActiveOperator(prev => ({
        ...prev,
        name: currentUser.name,
        email: currentUser.email,
        accessLevel: isPowerUser ? 'L3 - Full' : 'L1 - Viewer'
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
        return <ModuleDemoManagement />;
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
    <div className="space-y-6 animate-pulse select-none">
      {/* Title block skeleton */}
      <div className="space-y-2">
        <div className="h-6 w-72 bg-zinc-200/80 rounded-lg"></div>
        <div className="h-3 w-120 bg-zinc-200/50 rounded-md"></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Card skeleton: 3 columns */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white border border-zinc-200/40 rounded-2xl p-6 h-[480px] flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="h-9 w-full bg-zinc-200/50 rounded-xl"></div>
              <div className="h-6 w-full bg-zinc-200/40 rounded-lg"></div>
              <div className="space-y-3 pt-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-14 w-full bg-zinc-100/50 rounded-xl border border-zinc-100/30"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Card skeleton: 6 columns */}
        <div className="xl:col-span-6 space-y-6">
          <div className="bg-white border border-zinc-200/40 rounded-2xl p-6 h-[480px] flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="h-4 w-40 bg-zinc-200/60 rounded"></div>
                <div className="h-6 w-20 bg-zinc-200/40 rounded-full"></div>
              </div>
              <div className="space-y-3 pt-6">
                <div className="h-12 w-2/3 bg-zinc-100/40 rounded-xl"></div>
                <div className="h-16 w-1/2 bg-zinc-100/40 rounded-xl ml-auto"></div>
                <div className="h-10 w-3/4 bg-zinc-100/40 rounded-xl"></div>
              </div>
            </div>
            <div className="h-12 w-full bg-zinc-100/50 rounded-xl"></div>
          </div>
        </div>

        {/* Right Card skeleton: 3 columns */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white border border-zinc-200/40 rounded-2xl p-6 h-[480px] flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="h-4 w-32 bg-zinc-200/60 rounded border-b border-zinc-100 pb-3"></div>
              <div className="h-16 w-full bg-zinc-100/40 rounded-xl border border-zinc-100/20"></div>
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-zinc-150/40 rounded-full"></div>
                <div className="h-2 w-12 bg-zinc-150/40 rounded"></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-8 bg-zinc-100/40 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="h-9 w-full bg-zinc-200/50 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
