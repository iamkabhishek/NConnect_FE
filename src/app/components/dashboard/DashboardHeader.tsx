import { Bell, Send, UserPlus, TrendingUp, AlertCircle, Settings, ChevronDown, FolderOpen, User, CreditCard, Users, LogOut, Lock } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
  userName: string;
  onSettingsClick?: () => void;
  onAddMemberClick?: () => void;
  onCreateWorkspaceClick?: () => void;
}

export function DashboardHeader({
  userName,
  onSettingsClick,
  onAddMemberClick,
  onCreateWorkspaceClick,
}: DashboardHeaderProps) {
  const router = useRouter();
  const { selectedWorkspace, setSelectedWorkspace, workspaces, currentUser } = useWorkspace();
  
  const initials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  // Notification states
  interface Notification {
    id: string;
    type: 'campaign' | 'subscriber' | 'system' | 'analytics';
    title: string;
    message: string;
    time: string;
    read: boolean;
    icon: React.ReactNode;
  }

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'campaign',
      title: 'Campaign Sent Successfully',
      message: 'Welcome Series - Week 1 sent to 1,234 subscribers',
      time: '5m ago',
      read: false,
      icon: <Send className="size-4" />,
    },
    {
      id: '2',
      type: 'subscriber',
      title: 'New Subscriber',
      message: 'sarah.jones@example.com joined your list',
      time: '15m ago',
      read: false,
      icon: <UserPlus className="size-4" />,
    },
    {
      id: '3',
      type: 'analytics',
      title: 'High Open Rate Alert',
      message: 'Your campaign achieved 45% open rate!',
      time: '1h ago',
      read: false,
      icon: <TrendingUp className="size-4" />,
    },
    {
      id: '4',
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance on Jan 20, 2026 at 2:00 AM',
      time: '2h ago',
      read: true,
      icon: <AlertCircle className="size-4" />,
    },
    {
      id: '5',
      type: 'subscriber',
      title: 'New Subscriber',
      message: 'john.smith@example.com joined your list',
      time: '3h ago',
      read: true,
      icon: <UserPlus className="size-4" />,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'campaign':
        return 'bg-blue-100 text-blue-600';
      case 'subscriber':
        return 'bg-green-100 text-green-600';
      case 'analytics':
        return 'bg-purple-100 text-purple-600';
      case 'system':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handleSignOut = () => {
    // Clear any session data
    localStorage.clear();
    sessionStorage.clear();
    // Redirect to login or show confirmation
    alert('Signing out... You will be redirected to the sign-in page.');
    window.location.href = '/signin';
  };

  return (
    <header className="bg-white/95 border-b border-zinc-200/60 backdrop-blur-md sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Workspace Selector */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3 h-auto py-1.5 px-2.5 rounded-xl hover:bg-zinc-100/80 transition-all duration-200">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md shadow-purple-500/10"
                    style={{ backgroundColor: selectedWorkspace?.color || '#8B5CF6' }}
                  >
                    <FolderOpen className="size-4.5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-zinc-950 flex items-center text-sm tracking-tight">
                      {selectedWorkspace?.name || 'My Workspace'}
                      <ChevronDown className="size-3.5 ml-1 text-zinc-400" />
                    </div>
                    <div className="text-[10px] font-medium text-zinc-400">Active Workspace</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 rounded-2xl border-zinc-200/60 shadow-xl shadow-purple-500/5 p-1.5">
                <DropdownMenuLabel className="px-2.5 py-1.5 text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase">
                  Your Workspaces
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1 border-zinc-100" />
                {workspaces.map(workspace => (
                  <DropdownMenuItem
                    key={workspace.id}
                    onClick={() => setSelectedWorkspace(workspace)}
                    className="rounded-xl p-2 cursor-pointer hover:bg-zinc-50 transition-all duration-150"
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: workspace.color }}
                      >
                        <FolderOpen className="size-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-zinc-900 text-sm truncate">{workspace.name}</div>
                        <div className="text-[10px] font-medium text-zinc-400">{workspace.id === selectedWorkspace?.id ? 'Current Active' : ''}</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="my-1 border-zinc-100" />
                <DropdownMenuItem
                  onClick={onCreateWorkspaceClick}
                  className="rounded-xl p-2 cursor-pointer text-purple-600 font-bold hover:bg-purple-50/50 hover:text-purple-700 transition-all duration-150 text-xs flex justify-center"
                >
                  + Create New Workspace
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right: User Actions */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-zinc-100/80 transition-all">
                  <Bell className="size-5 text-zinc-600" />
                  {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 rounded-2xl border-zinc-200/60 shadow-xl shadow-purple-500/5 p-1.5">
                <DropdownMenuLabel className="px-2.5 py-1.5 text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase">
                  Notifications
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1 border-zinc-100" />
                <div className="max-h-[300px] overflow-y-auto space-y-1">
                  {notifications.map(n => (
                    <DropdownMenuItem
                      key={n.id}
                      className="flex items-center gap-3 rounded-xl p-2 cursor-pointer hover:bg-zinc-50 transition-all duration-150"
                      onClick={() => handleMarkAsRead(n.id)}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getNotificationColor(n.type)}`}>
                        {n.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-zinc-900 text-sm truncate">{n.title}</div>
                        <div className="text-xs text-zinc-500 truncate">{n.message}</div>
                        <div className="text-[10px] text-zinc-400 mt-1 font-medium">{n.time}</div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator className="my-1 border-zinc-100" />
                <div className="grid grid-cols-2 gap-1 p-1">
                  <button
                    className="text-[11px] font-bold text-zinc-500 hover:text-zinc-800 text-center py-1.5 rounded-lg hover:bg-zinc-50 transition-all duration-150"
                    onClick={handleMarkAllAsRead}
                  >
                    Mark All as Read
                  </button>
                  <button
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 text-center py-1.5 rounded-lg hover:bg-rose-50/50 transition-all duration-150"
                    onClick={handleClearAll}
                  >
                    Clear All
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-zinc-100/80 transition-all" onClick={onSettingsClick}>
              <Settings className="size-5 text-zinc-600" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 h-auto py-1 px-1.5 rounded-xl hover:bg-zinc-100/80 transition-all">
                  <Avatar className="size-8.5 rounded-xl border border-zinc-200/40 shadow-sm">
                    <AvatarFallback className="bg-gradient-to-tr from-fuchsia-600 via-purple-600 to-indigo-600 text-white text-xs font-extrabold rounded-xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="size-3.5 text-zinc-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl border-zinc-200/60 shadow-xl shadow-purple-500/5 p-1.5">
                <DropdownMenuLabel className="px-2.5 py-2">
                  <div className="text-sm font-bold text-zinc-950 truncate">{currentUser.name}</div>
                  <div className="text-[11px] font-medium text-zinc-400 truncate mt-0.5">{currentUser.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    if (onSettingsClick) {
                      onSettingsClick();
                      if (typeof window !== 'undefined') {
                        const newUrl = window.location.pathname.includes('/settings')
                          ? '?tab=profile'
                          : '/dashboard/settings?tab=profile';
                        window.history.pushState(null, '', newUrl);
                        window.dispatchEvent(new Event('popstate'));
                      }
                    } else {
                      router.push('/dashboard/settings?tab=profile');
                    }
                  }}
                  className="rounded-xl p-2 cursor-pointer text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-all duration-150"
                >
                  <User className="size-4 mr-2.5 text-zinc-400" />
                  Profile Settings
                </DropdownMenuItem>
                
                {currentUser.role === 'owner' && (
                  <DropdownMenuItem
                    onClick={() => {
                      if (onSettingsClick) {
                        onSettingsClick();
                        if (typeof window !== 'undefined') {
                          const newUrl = window.location.pathname.includes('/settings')
                            ? '?tab=billing'
                            : '/dashboard/settings?tab=billing';
                          window.history.pushState(null, '', newUrl);
                          window.dispatchEvent(new Event('popstate'));
                        }
                      } else {
                        router.push('/dashboard/settings?tab=billing');
                      }
                    }}
                    className="rounded-xl p-2 cursor-pointer text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-all duration-150"
                  >
                    <CreditCard className="size-4 mr-2.5 text-zinc-400" />
                    Billing Plan
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={() => {
                    if (onAddMemberClick) {
                      onAddMemberClick();
                    } else {
                      router.push('/dashboard/users');
                    }
                  }}
                  className="rounded-xl p-2 cursor-pointer text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-all duration-150"
                >
                  <Users className="size-4 mr-2.5 text-zinc-400" />
                  Team Members
                </DropdownMenuItem>
                
                {currentUser.role === 'owner' && (
                  <>
                    <DropdownMenuSeparator className="my-1 border-zinc-100" />
                    <DropdownMenuItem
                      className="rounded-xl p-2 cursor-pointer text-xs font-bold text-purple-700 bg-purple-50/50 hover:bg-purple-50 hover:text-purple-800 transition-all duration-150"
                      onClick={() => window.location.href = '/ops'}
                    >
                      <Lock className="size-4 mr-2.5 text-purple-600" />
                      Operations Cockpit
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator className="my-1 border-zinc-100" />
                <DropdownMenuItem
                  className="rounded-xl p-2 cursor-pointer text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all duration-150"
                  onClick={handleSignOut}
                >
                  <LogOut className="size-4 mr-2.5" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

    </header>
  );
}