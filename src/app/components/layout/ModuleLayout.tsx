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
