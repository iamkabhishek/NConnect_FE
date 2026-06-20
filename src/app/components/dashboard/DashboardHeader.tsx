import { Bell, Send, UserPlus, TrendingUp, AlertCircle, Settings, ChevronDown, FolderOpen, User, CreditCard, Users, LogOut, X, Upload, Mail, Lock, Save, Check, CheckCheck, Trash2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useState, useEffect } from 'react';
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
  const { selectedWorkspace, setSelectedWorkspace, workspaces, currentUser } = useWorkspace();
  
  const initials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  // Modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);

  // Profile form states
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileEmail, setProfileEmail] = useState(currentUser.email);

  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name);
      setProfileEmail(currentUser.email);
    }
  }, [currentUser]);


  // Team member states
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');

  // Workspace creation states
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('');
  const [newWorkspaceColor, setNewWorkspaceColor] = useState('#4A90E2');

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

  const handleSaveProfile = () => {
    // Save profile changes
    alert(`Profile updated!\nName: ${profileName}\nEmail: ${profileEmail}`);
    setShowProfileModal(false);
  };



  const handleInviteTeamMember = () => {
    if (!inviteEmail) {
      alert('Please enter an email address');
      return;
    }
    alert(`Invitation sent to ${inviteEmail} as ${inviteRole}`);
    setInviteEmail('');
    setInviteRole('viewer');
  };

  const handleCreateWorkspace = () => {
    if (!newWorkspaceName.trim()) {
      alert('Please enter a workspace name');
      return;
    }
    if (newWorkspaceName.trim().length < 3) {
      alert('Workspace name must be at least 3 characters long');
      return;
    }
    // Handle workspace creation logic here
    alert(`Workspace created successfully!\\n\\nName: ${newWorkspaceName}\\nDescription: ${newWorkspaceDescription || 'No description'}\\nColor: ${newWorkspaceColor}`);
    
    // Reset form
    setNewWorkspaceName('');
    setNewWorkspaceDescription('');
    setNewWorkspaceColor('#4A90E2');
    setShowWorkspaceModal(false);
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
                <DropdownMenuSeparator className="my-1 border-zinc-100" />
                <DropdownMenuItem
                  onClick={() => setShowProfileModal(true)}
                  className="rounded-xl p-2 cursor-pointer text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-all duration-150"
                >
                  <User className="size-4 mr-2.5 text-zinc-400" />
                  Profile Settings
                </DropdownMenuItem>
                
                {currentUser.role === 'owner' && (
                  <DropdownMenuItem
                    onClick={() => setShowBillingModal(true)}
                    className="rounded-xl p-2 cursor-pointer text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-all duration-150"
                  >
                    <CreditCard className="size-4 mr-2.5 text-zinc-400" />
                    Billing Plan
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={() => setShowTeamModal(true)}
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

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <User className="size-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <Avatar className="size-20">
                  <AvatarFallback className="bg-blue-500 text-white text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors flex items-center gap-2">
                    <Upload className="size-4" />
                    Change Avatar
                  </button>
                  <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max 2MB</p>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Mail className="size-4 text-gray-500" />
                  Basic Information
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </div>


            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3 rounded-b-xl">
              <Button
                variant="outline"
                onClick={() => setShowProfileModal(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="size-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Billing Modal */}
      {showBillingModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CreditCard className="size-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Billing & Subscription</h2>
              </div>
              <button
                onClick={() => setShowBillingModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Current Plan */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Professional Plan</h3>
                    <p className="text-gray-600 text-sm mt-1">Billed monthly</p>
                    <p className="text-3xl font-bold text-blue-600 mt-3">$49<span className="text-lg text-gray-600">/month</span></p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active</span>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-sm text-gray-700">Next billing date: <span className="font-medium">February 17, 2026</span></p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Payment Method</h3>
                
                {/* Current Card */}
                <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                      <CreditCard className="size-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-500">Expires 12/2026</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>

                {/* Add New Card */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Add New Payment Method</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                    Add Payment Method
                  </Button>
                </div>
              </div>

              {/* Billing History */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Billing History</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    {[
                      { date: 'Jan 17, 2026', amount: '$49.00', status: 'Paid', invoice: 'INV-2026-001' },
                      { date: 'Dec 17, 2025', amount: '$49.00', status: 'Paid', invoice: 'INV-2025-012' },
                      { date: 'Nov 17, 2025', amount: '$49.00', status: 'Paid', invoice: 'INV-2025-011' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900">{item.amount}</p>
                          <p className="text-sm text-gray-500">{item.date} • {item.invoice}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                            {item.status}
                          </span>
                          <Button variant="ghost" size="sm">Download</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between rounded-b-xl">
              <Button variant="outline" className="text-red-600 hover:bg-red-50">
                Cancel Subscription
              </Button>
              <Button
                onClick={() => setShowBillingModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Team Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Users className="size-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
              </div>
              <button
                onClick={() => setShowTeamModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Invite New Member */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <Users className="size-5 text-purple-600" />
                      Team Members
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Manage your team members and their access</p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setShowTeamModal(false);
                    onAddMemberClick?.();
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Users className="size-4 mr-2" />
                  Add Member
                </Button>
              </div>

              {/* Current Team Members */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Current Team Members</h3>
                  <span className="text-sm text-gray-500">4 members</span>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200">
                  {/* Owner */}
                  <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarFallback className="bg-blue-500 text-white">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{userName}</p>
                          <p className="text-sm text-gray-500">john@example.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          Owner
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Admin */}
                  <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarFallback className="bg-purple-500 text-white">
                            SM
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">Sarah Miller</p>
                          <p className="text-sm text-gray-500">sarah.m@example.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                          Full Access
                        </span>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>
                    </div>
                  </div>

                  {/* Editor */}
                  <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarFallback className="bg-green-500 text-white">
                            MJ
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">Mike Johnson</p>
                          <p className="text-sm text-gray-500">mike.j@example.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Editor
                        </span>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>
                    </div>
                  </div>

                  {/* Viewer */}
                  <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarFallback className="bg-orange-500 text-white">
                            LD
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">Lisa Davis</p>
                          <p className="text-sm text-gray-500">lisa.d@example.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          Viewer
                        </span>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Permissions Guide */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-gray-900 text-sm">Role Permissions:</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <p><span className="font-medium text-gray-900">Full Access:</span> Complete access to all modules including User Management and Workspaces</p>
                  <p><span className="font-medium text-gray-900">Editor:</span> Can create and edit campaigns, templates, and contacts</p>
                  <p><span className="font-medium text-gray-900">Creator:</span> Can create new content but requires approval for publishing</p>
                  <p><span className="font-medium text-gray-900">Viewer:</span> Read-only access to reports and analytics</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end rounded-b-xl">
              <Button
                onClick={() => setShowTeamModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}