import { ReactNode } from 'react';
import { DashboardHeader } from '@/app/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/app/components/dashboard/DashboardSidebar';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';

interface ModuleLayoutProps {
  children: ReactNode;
  activeItem: string;
  userName?: string;
  onNavigate?: (page: string) => void;
}

export function ModuleLayout({
  children,
  activeItem,
  onNavigate,
}: ModuleLayoutProps) {
  const { selectedWorkspace, currentUser } = useWorkspace();
  const userName = currentUser?.name || 'John Doe';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar activeItem={activeItem} onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Guest Banner */}
        {currentUser?.role === 'guest' && (
          <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 text-white px-6 py-2.5 flex items-center justify-between text-xs font-semibold shadow-md shrink-0 select-none z-10 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span>
                <strong>Sandbox Exploration Mode</strong> — You are viewing NConnect as a guest. All modules are fully interactive.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onNavigate?.('helpdesk')} 
                className="bg-white/15 hover:bg-white/25 border border-white/20 px-3 py-1 rounded-lg text-[11px] font-bold transition-all"
              >
                Open Helpdesk
              </button>
              <button 
                onClick={() => onNavigate?.('signup')} 
                className="bg-white text-orange-700 hover:bg-zinc-50 border border-transparent px-3 py-1 rounded-lg text-[11px] font-extrabold shadow-sm transition-all"
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* Header - now reads from workspace context */}
        <DashboardHeader
          userName={userName}
          onSettingsClick={() => onNavigate?.('settings')}
          onAddMemberClick={() => onNavigate?.('users')}
          onCreateWorkspaceClick={() => onNavigate?.('workspaces')}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
