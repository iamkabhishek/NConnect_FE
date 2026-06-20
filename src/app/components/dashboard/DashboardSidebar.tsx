import {
  LayoutDashboard,
  Mail,
  Users,
  FileText,
  Send,
  BarChart3,
  Settings,
  FolderOpen,
  ChevronRight,
  Layers,
  Image,
  Shield,
  Zap,
  Book,
  Lock,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  badge?: number;
  active?: boolean;
  onClick?: () => void;
  permissionKey?: 'dashboard' | 'campaigns' | 'contacts' | 'templates' | 'media' | 'automation' | 'senderEmails' | 'reports' | 'users' | 'workspaces' | 'settings' | 'documentation';
}

interface DashboardSidebarProps {
  activeItem?: string;
  activePage?: string;
  onNavigate?: (item: string) => void;
  workspaceName?: string;
  workspaceColor?: string;
}

export function DashboardSidebar({ 
  activeItem, 
  activePage,
  onNavigate,
  workspaceName,
  workspaceColor,
}: DashboardSidebarProps) {
  const { currentUser } = useWorkspace();
  const currentPage = activePage || activeItem || 'dashboard';

  // Helper to check module permission
  const getPermission = (key?: string) => {
    if (!key || key === 'dashboard' || key === 'documentation') return 'admin';
    return currentUser.permissions[key as keyof typeof currentUser.permissions] || 'none';
  };

  const mainNavItems: NavItem[] = [
    {
      icon: <LayoutDashboard className="size-5" />,
      label: 'Dashboard',
      active: currentPage === 'dashboard',
      onClick: () => onNavigate?.('dashboard'),
      permissionKey: 'dashboard',
    },
    {
      icon: <Send className="size-5" />,
      label: 'Campaigns',
      badge: 3,
      active: currentPage === 'campaigns',
      onClick: () => onNavigate?.('campaigns'),
      permissionKey: 'campaigns',
    },
    {
      icon: <Users className="size-5" />,
      label: 'Contacts',
      active: currentPage === 'contacts',
      onClick: () => onNavigate?.('contacts'),
      permissionKey: 'contacts',
    },
    {
      icon: <Layers className="size-5" />,
      label: 'Groups',
      active: currentPage === 'groups',
      onClick: () => onNavigate?.('groups'),
      permissionKey: 'contacts', // shares contacts access
    },
    {
      icon: <FileText className="size-5" />,
      label: 'Templates',
      active: currentPage === 'templates',
      onClick: () => onNavigate?.('templates'),
      permissionKey: 'templates',
    },
    {
      icon: <Image className="size-5" />,
      label: 'Media Library',
      active: currentPage === 'media',
      onClick: () => onNavigate?.('media'),
      permissionKey: 'media',
    },
    {
      icon: <Zap className="size-5" />,
      label: 'Automation',
      active: currentPage === 'automation',
      onClick: () => onNavigate?.('automation'),
      permissionKey: 'automation',
    },
    {
      icon: <Mail className="size-5" />,
      label: 'Sender Emails',
      active: currentPage === 'sender-emails',
      onClick: () => onNavigate?.('sender-emails'),
      permissionKey: 'senderEmails',
    },
    {
      icon: <BarChart3 className="size-5" />,
      label: 'Reports',
      active: currentPage === 'reports',
      onClick: () => onNavigate?.('reports'),
      permissionKey: 'reports',
    },
  ];

  const secondaryNavItems: NavItem[] = [
    {
      icon: <Shield className="size-5" />,
      label: 'User Management',
      active: currentPage === 'users',
      onClick: () => onNavigate?.('users'),
      permissionKey: 'users',
    },
    {
      icon: <FolderOpen className="size-5" />,
      label: 'Workspaces',
      active: currentPage === 'workspaces',
      onClick: () => onNavigate?.('workspaces'),
      permissionKey: 'workspaces',
    },
    {
      icon: <Book className="size-5" />,
      label: 'Documentation',
      active: currentPage === 'documentation',
      onClick: () => onNavigate?.('documentation'),
      permissionKey: 'documentation',
    },
    {
      icon: <Settings className="size-5" />,
      label: 'Settings',
      active: currentPage === 'settings',
      onClick: () => onNavigate?.('settings'),
      permissionKey: 'settings',
    },
  ];

  const handleItemClick = (item: NavItem) => {
    const access = getPermission(item.permissionKey);
    if (access === 'none') {
      alert(`🔐 Custom Access Control Denied\n\nYour permission level for the "${item.label}" module is restricted to 'None'.\n\nActive Role: ${currentUser.name} (${currentUser.role.replace('_', ' ').toUpperCase()})\n\nPlease contact Organization Owner John Doe to adjust your custom module access line.`);
      return;
    }
    item.onClick?.();
  };

  return (
    <aside className="w-64 bg-white/90 border-r border-zinc-200/60 backdrop-blur-md flex flex-col h-screen sticky top-0 z-20">
      {/* Logo */}
      <div className="p-6 border-b border-zinc-200/50">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-fuchsia-600 via-purple-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-purple-500/20">
            <Mail className="size-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-zinc-950">NConnect</span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4 h-[calc(100vh-180px)]">
        {/* Main Navigation */}
        <div className="space-y-1 mb-8">
          <p className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase px-3 mb-2">
            Main
          </p>
          {mainNavItems.map((item, index) => {
            const access = getPermission(item.permissionKey);
            const isLocked = access === 'none';

            return (
              <button
                key={index}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                  isLocked 
                    ? 'text-zinc-400 bg-transparent opacity-65 hover:bg-zinc-50'
                    : item.active
                    ? 'bg-gradient-to-r from-fuchsia-500/10 via-purple-500/10 to-indigo-500/5 text-purple-700 shadow-[inset_1px_1px_2px_rgba(168,85,247,0.05)] border-l-4 border-purple-600 pl-2'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60 pl-3 border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`${isLocked ? 'text-zinc-300' : item.active ? 'text-purple-600' : 'text-zinc-400'} transition-colors`}>
                    {item.icon}
                  </div>
                  <span className={isLocked ? 'line-through decoration-zinc-300/60' : ''}>
                    {item.label}
                  </span>
                </div>
                {isLocked ? (
                  <Lock className="size-3.5 text-zinc-400" />
                ) : item.badge !== undefined ? (
                  <span className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm shadow-purple-500/10">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Secondary Navigation */}
        <div className="space-y-1 border-t border-zinc-200/50 pt-4 pb-4">
          <p className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase px-3 mb-2">
            Settings
          </p>
          {secondaryNavItems.map((item, index) => {
            const access = getPermission(item.permissionKey);
            const isLocked = access === 'none';

            return (
              <button
                key={index}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                  isLocked 
                    ? 'text-zinc-400 bg-transparent opacity-65 hover:bg-zinc-50'
                    : item.active
                    ? 'bg-gradient-to-r from-fuchsia-500/10 via-purple-500/10 to-indigo-500/5 text-purple-700 shadow-[inset_1px_1px_2px_rgba(168,85,247,0.05)] border-l-4 border-purple-600 pl-2'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60 pl-3 border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`${isLocked ? 'text-zinc-300' : item.active ? 'text-purple-600' : 'text-zinc-400'} transition-colors`}>
                    {item.icon}
                  </div>
                  <span className={isLocked ? 'line-through decoration-zinc-300/60' : ''}>
                    {item.label}
                  </span>
                </div>
                {isLocked && <Lock className="size-3.5 text-zinc-400" />}
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Upgrade CTA / Active Persona Display */}
      <div className="p-4 border-t border-zinc-200/50">
        <div className="bg-gradient-to-br from-purple-50 via-fuchsia-50/50 to-indigo-50/30 rounded-2xl p-4 border border-purple-100 shadow-sm relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-20 h-20 bg-purple-200/20 rounded-full blur-xl" />
          <h3 className="font-bold text-zinc-950 mb-1 text-xs uppercase font-mono text-purple-800">
            Active Persona:
          </h3>
          <p className="text-sm font-extrabold text-zinc-900 leading-tight">
            {currentUser.name}
          </p>
          <p className="text-[10px] text-purple-700 font-bold mb-3 uppercase tracking-wider">
            Role: {currentUser.role.replace('_', ' ')}
          </p>
          <div className="text-[11px] font-medium text-zinc-500 bg-white/75 px-2.5 py-1.5 rounded-xl border border-zinc-100">
            {currentUser.role === 'owner' ? (
              '⚡ Full System Control'
            ) : currentUser.role === 'workspace_admin' ? (
              '🏢 Full Workspace Admin'
            ) : (
              '👤 Custom Access Line'
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}