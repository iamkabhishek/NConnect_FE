import { useState, useEffect } from 'react';
import { DashboardSidebar } from '@/app/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/app/components/dashboard/DashboardHeader';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';
import { toast } from 'sonner';
import { getProfile, updateProfile } from '@/app/lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Settings,
  User,
  Briefcase,
  Mail,
  Bell,
  CreditCard,
  Key,
  Save,
  Upload,
  Eye,
  EyeOff,
  Copy,
  Check,
  Plus,
  Trash2,
  RefreshCw,
  Lock,
  Building2,
  Globe,
  MapPin,
  Sparkles,
  Layers,
  Users,
  HardDrive,
  Send,
  Inbox,
  ArrowLeftRight,
  Phone,
  Clock,
  FileText,
  ShieldCheck,
  Activity,
} from 'lucide-react';

interface SettingsPageProps {
  onNavigate?: (page: string) => void;
}

type SettingsTab = 'workspace' | 'profile' | 'esp' | 'notifications' | 'billing' | 'api';

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { currentUser, selectedWorkspace, setCurrentUser, setSelectedWorkspace } = useWorkspace();
  const userName = currentUser?.name || 'John Doe';
  const [activeTab, setActiveTab] = useState<SettingsTab>('workspace');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Load active tab from URL query params on mount/update
  useEffect(() => {
    const handleUrlChange = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab') as SettingsTab;
        const validTabs: SettingsTab[] = ['workspace', 'profile', 'esp', 'notifications', 'billing', 'api'];
        if (tabParam && validTabs.includes(tabParam)) {
          if (tabParam === 'billing' && currentUser?.role !== 'owner') {
            setActiveTab('workspace');
          } else {
            setActiveTab(tabParam);
          }
        }
      }
    };

    handleUrlChange();

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handleUrlChange);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('popstate', handleUrlChange);
      }
    };
  }, [currentUser]);

  // Workspace Settings State
  const [workspaceSettings, setWorkspaceSettings] = useState({
    name: selectedWorkspace?.name || 'My Workspace',
    timezone: 'America/New_York',
    defaultFromName: 'NConnect',
    defaultFromEmail: 'hello@nconnect.com',
    defaultReplyTo: 'support@nconnect.com',
  });

  // Profile Settings State
  const [profileSettings, setProfileSettings] = useState({
    fullName: currentUser?.name || 'John Doe',
    email: currentUser?.email || 'john@example.com',
  });

  const [profileSubTab, setProfileSubTab] = useState<'personal' | 'agency' | 'workspace' | 'plan' | 'useCase'>('personal');
  const [onboardingData, setOnboardingData] = useState<any>(null);

  // Load onboarding details on mount or user/workspace context switch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('nconnect_onboarding_data');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setOnboardingData(parsed);
          // Keep name in sync if parsed has firstName and lastName
          if (parsed?.personal?.firstName) {
            const computedName = `${parsed.personal.firstName} ${parsed.personal.lastName || ''}`.trim();
            setProfileSettings((prev) => ({
              ...prev,
              fullName: computedName,
            }));
          }
        } catch (e) {
          console.error('Failed to parse cached onboarding data', e);
        }
      } else {
        // Fallback default details so page is beautifully populated with mock details
        const initialOnboarding = {
          personal: {
            firstName: currentUser?.name?.split(' ')[0] || 'John',
            lastName: currentUser?.name?.split(' ')[1] || 'Doe',
            company: 'Acme Agency',
            role: 'Marketer',
            phone: '+1 (555) 019-2834'
          },
          agency: {
            name: 'Acme Agency',
            category: 'Marketing Agency',
            registrationNo: 'REG-2024-991',
            gstRegistrationNo: 'GST-IN-22919A',
            website: 'https://acmeagency.com',
            size: '11-50 employees',
            timezone: 'UTC-5 (EST)',
            email: currentUser?.email || 'hello@acmeagency.com',
            alternateEmail: 'ops@acmeagency.com',
            phoneNumber: '+1 (555) 019-2834',
            telephoneNumber: '+1 (555) 019-2835',
            address: {
              addressLine1: '123 Innovation Way',
              addressLine2: 'Suite 400',
              city: 'New York',
              state: 'NY',
              country: 'United States',
              pincode: '10001',
              addressType: 'REGISTERED'
            },
            socials: {
              facebook: 'https://facebook.com/acmeagency',
              twitter: 'https://twitter.com/acmeagency',
              linkedin: 'https://linkedin.com/company/acmeagency',
              instagram: 'https://instagram.com/acmeagency'
            }
          },
          workspace: {
            name: selectedWorkspace?.name || 'Acme Workspace',
            identifier: selectedWorkspace?.id || 'acme-hq',
            description: 'Main communication workspace for Acme campaigns.',
            color: selectedWorkspace?.color || '#4A90E2'
          },
          plan: {
            tier: 'Pro',
            cycle: 'yearly',
            addons: {
              workspaces: 2,
              users: 5,
              storage: 50
            },
            pricing: {
              basePrice: 79,
              addonsPrice: 25,
              subtotal: 104,
              discount: 15,
              gst: 16,
              total: 105
            }
          },
          useCase: {
            primaryGoal: 'both',
            subscriberCount: 'Growing (100-500)',
            frequency: 'Weekly',
            industry: 'Technology / SaaS'
          }
        };
        setOnboardingData(initialOnboarding);
        localStorage.setItem('nconnect_onboarding_data', JSON.stringify(initialOnboarding));
      }
    }
  }, [currentUser, selectedWorkspace]);

  // Keep state synchronized with selected workspace and current user switch
  useEffect(() => {
    if (selectedWorkspace) {
      setWorkspaceSettings((prev) => ({
        ...prev,
        name: selectedWorkspace.name,
      }));
    }
  }, [selectedWorkspace]);

  useEffect(() => {
    if (currentUser) {
      setProfileSettings((prev) => ({
        ...prev,
        fullName: currentUser.name,
        email: currentUser.email,
      }));
    }
  }, [currentUser]);

  // Handle auto-routing away from billing if role is changed and is not owner
  useEffect(() => {
    if (currentUser?.role !== 'owner' && activeTab === 'billing') {
      setActiveTab('workspace');
    }
  }, [currentUser, activeTab]);

  // Fetch persistent user profile from backend on profile tab mount
  useEffect(() => {
    if (activeTab === 'profile') {
      const fetchProfile = async () => {
        setIsLoadingProfile(true);
        try {
          const token = typeof window !== 'undefined' ? localStorage.getItem('nconnect_id_token') : null;
          if (token) {
            const result = await getProfile(token);
            if (result && result.user) {
              setProfileSettings({
                fullName: result.user.name || '',
                email: result.user.email || '',
              });
              // Keep Context/localStorage persona state in sync with actual DB
              if (currentUser && (currentUser.name !== result.user.name || currentUser.email !== result.user.email)) {
                setCurrentUser({
                  ...currentUser,
                  name: result.user.name || currentUser.name,
                  email: result.user.email || currentUser.email,
                });
              }
            }
          }
        } catch (err: any) {
          console.error('[Settings] Failed to fetch profile from backend API:', err);
          toast.error('Failed to load profile details from server.');
        } finally {
          setIsLoadingProfile(false);
        }
      };
      fetchProfile();
    }
  }, [activeTab]);

  // ESP Integration State
  const [espProviders] = useState([
    { id: 'sendgrid', name: 'SendGrid', icon: '📧', connected: true },
    { id: 'mailgun', name: 'Mailgun', icon: '✉️', connected: false },
    { id: 'ses', name: 'Amazon SES', icon: '📮', connected: false },
    { id: 'postmark', name: 'Postmark', icon: '📬', connected: false },
  ]);

  const [espSettings, setEspSettings] = useState({
    provider: 'sendgrid',
    apiKey: '••••••••••••••••••••••••••••••••',
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    campaignSent: true,
    campaignFailed: true,
    newSubscriber: false,
    unsubscribe: true,
    weeklyReport: true,
    monthlyReport: false,
  });

  // Billing State
  const [billingInfo] = useState({
    plan: 'Professional',
    price: '$49/month',
    nextBillingDate: 'February 17, 2026',
    emailsSent: 45230,
    emailsLimit: 100000,
    contacts: 3420,
    contactsLimit: 10000,
  });

  // API Keys State
  const [apiKeys, setApiKeys] = useState([
    {
      id: '1',
      name: 'Production API Key',
      key: 'nct_live_a1b2c3d4e5f6g7h8i9j0',
      created: '2025-12-15',
      lastUsed: '2026-01-16',
    },
    {
      id: '2',
      name: 'Development API Key',
      key: 'nct_test_k1l2m3n4o5p6q7r8s9t0',
      created: '2026-01-10',
      lastUsed: 'Never',
    },
  ]);



  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const tabs = [
    { id: 'workspace' as SettingsTab, label: 'Workspace', icon: Briefcase },
    { id: 'profile' as SettingsTab, label: 'Profile', icon: User },
    { id: 'esp' as SettingsTab, label: 'ESP Integration', icon: Mail },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
    { id: 'billing' as SettingsTab, label: 'Billing', icon: CreditCard },
    { id: 'api' as SettingsTab, label: 'API Keys', icon: Key },
  ].filter(tab => tab.id !== 'billing' || currentUser?.role === 'owner');

  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveWorkspace = () => {
    console.log('Saving workspace settings:', workspaceSettings);
    if (selectedWorkspace) {
      const updatedWorkspace = { ...selectedWorkspace, name: workspaceSettings.name };
      setSelectedWorkspace(updatedWorkspace);
      toast.success('Workspace settings updated successfully!');
    }
  };

  const handleSaveProfile = async () => {
    console.log('Saving profile settings:', profileSettings, onboardingData);
    try {
      setIsLoadingProfile(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('nconnect_id_token') : null;

      // Compute full name if we have onboarding personal details, otherwise fall back to profileSettings.fullName
      const computedFullName = onboardingData?.personal
        ? `${onboardingData.personal.firstName || ''} ${onboardingData.personal.lastName || ''}`.trim()
        : profileSettings.fullName;

      if (token && computedFullName) {
        await updateProfile(token, computedFullName);
      }

      if (currentUser && computedFullName) {
        const initials = computedFullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
        setCurrentUser({
          ...currentUser,
          name: computedFullName,
          email: profileSettings.email,
          avatar: initials || currentUser.avatar,
        });
      }

      // Save onboarding data back to localStorage
      if (typeof window !== 'undefined' && onboardingData) {
        localStorage.setItem('nconnect_onboarding_data', JSON.stringify(onboardingData));

        // Also update the workspace context settings if workspace details changed
        if (onboardingData.workspace && selectedWorkspace) {
          const updatedWorkspace = {
            ...selectedWorkspace,
            name: onboardingData.workspace.name,
            color: onboardingData.workspace.color,
            description: onboardingData.workspace.description,
          };
          setSelectedWorkspace(updatedWorkspace);
          setWorkspaceSettings((prev) => ({
            ...prev,
            name: onboardingData.workspace.name,
          }));
        }
      }

      setProfileSettings((prev) => ({
        ...prev,
        fullName: computedFullName,
      }));

      toast.success('Profile and onboarding settings synchronized successfully!');
    } catch (err: any) {
      console.error('[Settings] Failed to save profile and onboarding details:', err);
      toast.error(err.message || 'Failed to update profile settings.');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleSaveESP = () => {
    console.log('Saving ESP settings:', espSettings);
    // Show success message
  };

  const handleSaveNotifications = () => {
    console.log('Saving notification settings:', notificationSettings);
    // Show success message
  };

  const handleGenerateApiKey = () => {
    const newKey = {
      id: String(apiKeys.length + 1),
      name: `API Key ${apiKeys.length + 1}`,
      key: `nct_live_${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
    };
    setApiKeys([...apiKeys, newKey]);
  };

  const handleDeleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id));
  };

  // Page-level access control guard
  if (currentUser?.permissions?.settings === 'none') {
    return (
      <div className="flex h-screen bg-gray-50">
        <DashboardSidebar activeItem="settings" onNavigate={onNavigate} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader
            userName={userName}
            onSettingsClick={() => onNavigate?.('settings')}
            onAddMemberClick={() => onNavigate?.('users')}
            onCreateWorkspaceClick={() => onNavigate?.('workspaces')}
          />
          <main className="flex-1 overflow-y-auto flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white border border-zinc-200/50 backdrop-blur-xl rounded-2xl p-10 shadow-xl shadow-purple-500/5 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 border border-red-200 p-4 rounded-2xl flex items-center justify-center">
                  <Lock className="size-10 text-red-600 animate-pulse" />
                </div>
              </div>
              <h1 className="text-2xl font-black text-zinc-950 mb-2">Access Restricted</h1>
              <p className="text-zinc-600 text-sm mb-6 leading-relaxed">
                Your account permission level for the <strong>Settings</strong> module is currently restricted to 'None'.
              </p>
              <div className="bg-zinc-50 border border-zinc-200/40 rounded-xl p-4 mb-6 text-left">
                <p className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase mb-1">Active User Profile:</p>
                <p className="font-extrabold text-sm text-zinc-800">{currentUser.name} ({currentUser.role.replace('_', ' ').toUpperCase()})</p>
              </div>
              <Button
                onClick={() => onNavigate?.('dashboard')}
                className="w-full h-11 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Go back to Dashboard
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar activeItem="settings" onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader
          userName={userName}
          onSettingsClick={() => onNavigate?.('settings')}
          onAddMemberClick={() => onNavigate?.('users')}
          onCreateWorkspaceClick={() => onNavigate?.('workspaces')}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Settings className="size-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              </div>
              <p className="text-gray-600">
                Manage your workspace, profile, and integration settings
              </p>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex gap-1 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="size-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {/* Workspace Settings Tab */}
              {activeTab === 'workspace' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Workspace Settings
                    </h2>
                    <p className="text-sm text-gray-600">
                      Configure your workspace name, branding, and default email settings
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Workspace Name */}
                    <div className="space-y-2">
                      <Label htmlFor="workspaceName">Workspace Name</Label>
                      <Input
                        id="workspaceName"
                        value={workspaceSettings.name}
                        onChange={(e) =>
                          setWorkspaceSettings({ ...workspaceSettings, name: e.target.value })
                        }
                        placeholder="My Workspace"
                      />
                      <p className="text-xs text-gray-500">
                        This name appears in your campaign IDs and throughout the platform
                      </p>
                    </div>

                    {/* Workspace Logo */}
                    <div className="space-y-2">
                      <Label>Workspace Logo</Label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                          {workspaceSettings.name.charAt(0)}
                        </div>
                        <Button variant="outline" size="sm">
                          <Upload className="size-4 mr-2" />
                          Upload Logo
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Recommended: 200x200px, PNG or JPG
                      </p>
                    </div>

                    {/* Timezone */}
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <select
                        id="timezone"
                        value={workspaceSettings.timezone}
                        onChange={(e) =>
                          setWorkspaceSettings({ ...workspaceSettings, timezone: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Europe/Paris">Paris (CET)</option>
                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                      </select>
                      <p className="text-xs text-gray-500">
                        Used for scheduling campaigns and reporting
                      </p>
                    </div>

                    {/* Default Email Settings */}
                    <div className="border-t pt-6 mt-6">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Default Email Settings
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="defaultFromName">Default From Name</Label>
                            <Input
                              id="defaultFromName"
                              value={workspaceSettings.defaultFromName}
                              onChange={(e) =>
                                setWorkspaceSettings({
                                  ...workspaceSettings,
                                  defaultFromName: e.target.value,
                                })
                              }
                              placeholder="Your Company"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="defaultFromEmail">Default From Email</Label>
                            <Input
                              id="defaultFromEmail"
                              type="email"
                              value={workspaceSettings.defaultFromEmail}
                              onChange={(e) =>
                                setWorkspaceSettings({
                                  ...workspaceSettings,
                                  defaultFromEmail: e.target.value,
                                })
                              }
                              placeholder="hello@yourcompany.com"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="defaultReplyTo">Default Reply-To Email</Label>
                          <Input
                            id="defaultReplyTo"
                            type="email"
                            value={workspaceSettings.defaultReplyTo}
                            onChange={(e) =>
                              setWorkspaceSettings({
                                ...workspaceSettings,
                                defaultReplyTo: e.target.value,
                              })
                            }
                            placeholder="support@yourcompany.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button onClick={handleSaveWorkspace} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="size-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}

              {/* Profile Settings Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile & Onboarding Details</h2>
                    <p className="text-sm text-gray-600">
                      View and manage your profile settings alongside detailed operational data captured during your onboarding.
                    </p>
                  </div>

                  {/* Operational Onboarding Sub-Tabs */}
                  <div className="flex border-b border-gray-200 pb-px overflow-x-auto whitespace-nowrap scrollbar-none gap-2">
                    <button
                      type="button"
                      onClick={() => setProfileSubTab('personal')}
                      className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all border-b-2 rounded-t-lg ${
                        profileSubTab === 'personal'
                          ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                          : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <User className="size-4" />
                      Personal details
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileSubTab('agency')}
                      className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all border-b-2 rounded-t-lg ${
                        profileSubTab === 'agency'
                          ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                          : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Building2 className="size-4" />
                      Agency Details
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileSubTab('workspace')}
                      className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all border-b-2 rounded-t-lg ${
                        profileSubTab === 'workspace'
                          ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                          : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Layers className="size-4" />
                      Workspace
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileSubTab('plan')}
                      className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all border-b-2 rounded-t-lg ${
                        profileSubTab === 'plan'
                          ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                          : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <CreditCard className="size-4" />
                      Subscription & Plan
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileSubTab('useCase')}
                      className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all border-b-2 rounded-t-lg ${
                        profileSubTab === 'useCase'
                          ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                          : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Activity className="size-4" />
                      Use Case
                    </button>
                  </div>

                  <div className="space-y-6 pt-2">
                    {/* Personal Sub-tab */}
                    {profileSubTab === 'personal' && onboardingData?.personal && (
                      <div className="space-y-4 animate-fadeIn">
                        <h3 className="font-semibold text-gray-900 text-base">Personal Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={onboardingData.personal.firstName || ''}
                              onChange={(e) => {
                                const updated = { ...onboardingData };
                                updated.personal.firstName = e.target.value;
                                setOnboardingData(updated);
                              }}
                              placeholder="John"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={onboardingData.personal.lastName || ''}
                              onChange={(e) => {
                                const updated = { ...onboardingData };
                                updated.personal.lastName = e.target.value;
                                setOnboardingData(updated);
                              }}
                              placeholder="Doe"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileSettings.email}
                            disabled
                            className="bg-zinc-50 text-zinc-500 cursor-not-allowed"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Input
                              id="company"
                              value={onboardingData.personal.company || ''}
                              onChange={(e) => {
                                const updated = { ...onboardingData };
                                updated.personal.company = e.target.value;
                                setOnboardingData(updated);
                              }}
                              placeholder="Acme Inc"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                              value={onboardingData.personal.role || ''}
                              onValueChange={(val) => {
                                const updated = { ...onboardingData };
                                updated.personal.role = val;
                                setOnboardingData(updated);
                              }}
                            >
                              <SelectTrigger id="role">
                                <SelectValue placeholder="Select your role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Content Creator">Content Creator</SelectItem>
                                <SelectItem value="Marketer">Marketer</SelectItem>
                                <SelectItem value="Developer/Engineer">Developer/Engineer</SelectItem>
                                <SelectItem value="Business Owner/Founder">Business Owner/Founder</SelectItem>
                                <SelectItem value="Agency Executive">Agency Executive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={onboardingData.personal.phone || ''}
                            onChange={(e) => {
                              const updated = { ...onboardingData };
                              updated.personal.phone = e.target.value;
                              setOnboardingData(updated);
                            }}
                            placeholder="+1 (555) 019-2834"
                          />
                        </div>
                      </div>
                    )}

                    {/* Agency Sub-tab */}
                    {profileSubTab === 'agency' && onboardingData?.agency && (
                      <div className="space-y-6 animate-fadeIn">
                        <h3 className="font-semibold text-gray-900 text-base">Agency & Corporate Registration Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="agencyName">Agency Name</Label>
                            <Input
                              id="agencyName"
                              value={onboardingData.agency.name || ''}
                              onChange={(e) => {
                                const updated = { ...onboardingData };
                                updated.agency.name = e.target.value;
                                setOnboardingData(updated);
                              }}
                              placeholder="My Agency"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="agencyCategory">Category</Label>
                            <Select
                              value={onboardingData.agency.category || ''}
                              onValueChange={(val) => {
                                const updated = { ...onboardingData };
                                updated.agency.category = val;
                                setOnboardingData(updated);
                              }}
                            >
                              <SelectTrigger id="agencyCategory">
                                <SelectValue placeholder="Select Category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Marketing Agency">Marketing Agency</SelectItem>
                                <SelectItem value="Advertising Agency">Advertising Agency</SelectItem>
                                <SelectItem value="Consulting Agency">Consulting Agency</SelectItem>
                                <SelectItem value="PR/Communications Agency">PR/Communications Agency</SelectItem>
                                <SelectItem value="Design Studio">Design Studio</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="regNo">Registration Number</Label>
                            <Input
                              id="regNo"
                              value={onboardingData.agency.registrationNo || ''}
                              onChange={(e) => {
                                const updated = { ...onboardingData };
                                updated.agency.registrationNo = e.target.value;
                                setOnboardingData(updated);
                              }}
                              placeholder="REG-12345"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gstNo">GST Registration No</Label>
                            <Input
                              id="gstNo"
                              value={onboardingData.agency.gstRegistrationNo || ''}
                              onChange={(e) => {
                                const updated = { ...onboardingData };
                                updated.agency.gstRegistrationNo = e.target.value;
                                setOnboardingData(updated);
                              }}
                              placeholder="GST-12345"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="agencyWebsite">Website</Label>
                            <Input
                              id="agencyWebsite"
                              value={onboardingData.agency.website || ''}
                              onChange={(e) => {
                                const updated = { ...onboardingData };
                                updated.agency.website = e.target.value;
                                setOnboardingData(updated);
                              }}
                              placeholder="https://example.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="agencySize">Company Size</Label>
                            <Select
                              value={onboardingData.agency.size || ''}
                              onValueChange={(val) => {
                                const updated = { ...onboardingData };
                                updated.agency.size = val;
                                setOnboardingData(updated);
                              }}
                            >
                              <SelectTrigger id="agencySize">
                                <SelectValue placeholder="Select Size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1-10 employees">1-10 employees</SelectItem>
                                <SelectItem value="11-50 employees">11-50 employees</SelectItem>
                                <SelectItem value="51-200 employees">51-200 employees</SelectItem>
                                <SelectItem value="201-500 employees">201-500 employees</SelectItem>
                                <SelectItem value="500+ employees">500+ employees</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="agencyEmail">Primary Email</Label>
                            <Input
                              id="agencyEmail"
                              type="email"
                              value={onboardingData.agency.email || ''}
                              onChange={(e) => {
                                const updated = { ...onboardingData };
                                updated.agency.email = e.target.value;
                                setOnboardingData(updated);
                              }}
                              placeholder="hello@agency.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="agencyAltEmail">Alternate Email</Label>
                            <Input
                              id="agencyAltEmail"
                              type="email"
                              value={onboardingData.agency.alternateEmail || ''}
                              onChange={(e) => {
                                const updated = { ...onboardingData };
                                updated.agency.alternateEmail = e.target.value;
                                setOnboardingData(updated);
                              }}
                              placeholder="ops@agency.com"
                            />
                          </div>
                        </div>

                        {/* Address */}
                        <div className="p-4 border border-gray-100 rounded-lg bg-gray-50/50 space-y-4">
                          <h4 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                            <MapPin className="size-4 text-blue-600" /> Address Details
                          </h4>
                          <div className="space-y-2">
                            <Label htmlFor="addressLine1">Address Line 1</Label>
                            <Input
                              id="addressLine1"
                              value={onboardingData.agency.address?.addressLine1 || ''}
                              onChange={(e) => {
                                const updated = { ...onboardingData };
                                updated.agency.address.addressLine1 = e.target.value;
                                setOnboardingData(updated);
                              }}
                              placeholder="Street address"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="city">City</Label>
                              <Input
                                id="city"
                                value={onboardingData.agency.address?.city || ''}
                                onChange={(e) => {
                                  const updated = { ...onboardingData };
                                  updated.agency.address.city = e.target.value;
                                  setOnboardingData(updated);
                                }}
                                placeholder="City"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="state">State</Label>
                              <Input
                                id="state"
                                value={onboardingData.agency.address?.state || ''}
                                onChange={(e) => {
                                  const updated = { ...onboardingData };
                                  updated.agency.address.state = e.target.value;
                                  setOnboardingData(updated);
                                }}
                                placeholder="State"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="country">Country</Label>
                              <Input
                                id="country"
                                value={onboardingData.agency.address?.country || ''}
                                onChange={(e) => {
                                  const updated = { ...onboardingData };
                                  updated.agency.address.country = e.target.value;
                                  setOnboardingData(updated);
                                }}
                                placeholder="Country"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="pincode">Pincode</Label>
                              <Input
                                id="pincode"
                                value={onboardingData.agency.address?.pincode || ''}
                                onChange={(e) => {
                                  const updated = { ...onboardingData };
                                  updated.agency.address.pincode = e.target.value;
                                  setOnboardingData(updated);
                                }}
                                placeholder="Pincode"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Social Links */}
                        <div className="p-4 border border-gray-100 rounded-lg bg-gray-50/50 space-y-4">
                          <h4 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                            <Globe className="size-4 text-blue-600" /> Social Links
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="facebook">Facebook</Label>
                              <Input
                                id="facebook"
                                value={onboardingData.agency.socials?.facebook || ''}
                                onChange={(e) => {
                                  const updated = { ...onboardingData };
                                  updated.agency.socials.facebook = e.target.value;
                                  setOnboardingData(updated);
                                }}
                                placeholder="https://facebook.com/..."
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="twitter">Twitter</Label>
                              <Input
                                id="twitter"
                                value={onboardingData.agency.socials?.twitter || ''}
                                onChange={(e) => {
                                  const updated = { ...onboardingData };
                                  updated.agency.socials.twitter = e.target.value;
                                  setOnboardingData(updated);
                                }}
                                placeholder="https://twitter.com/..."
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="linkedin">LinkedIn</Label>
                              <Input
                                id="linkedin"
                                value={onboardingData.agency.socials?.linkedin || ''}
                                onChange={(e) => {
                                  const updated = { ...onboardingData };
                                  updated.agency.socials.linkedin = e.target.value;
                                  setOnboardingData(updated);
                                }}
                                placeholder="https://linkedin.com/..."
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="instagram">Instagram</Label>
                              <Input
                                id="instagram"
                                value={onboardingData.agency.socials?.instagram || ''}
                                onChange={(e) => {
                                  const updated = { ...onboardingData };
                                  updated.agency.socials.instagram = e.target.value;
                                  setOnboardingData(updated);
                                }}
                                placeholder="https://instagram.com/..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Workspace Sub-tab */}
                    {profileSubTab === 'workspace' && onboardingData?.workspace && (
                      <div className="space-y-4 animate-fadeIn">
                        <h3 className="font-semibold text-gray-900 text-base">Workspace branding & Configuration</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="workspaceName">Workspace Name</Label>
                          <Input
                            id="workspaceName"
                            value={onboardingData.workspace.name || ''}
                            onChange={(e) => {
                              const updated = { ...onboardingData };
                              updated.workspace.name = e.target.value;
                              setOnboardingData(updated);
                            }}
                            placeholder="My Workspace"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="workspaceIdentifier">Workspace Slug / Domain</Label>
                          <div className="flex items-center">
                            <Input
                              id="workspaceIdentifier"
                              value={onboardingData.workspace.identifier || ''}
                              onChange={(e) => {
                                const updated = { ...onboardingData };
                                updated.workspace.identifier = e.target.value;
                                setOnboardingData(updated);
                              }}
                              placeholder="my-workspace"
                            />
                            <span className="ml-2 text-sm text-gray-500 font-medium">.nconnect.com</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="workspaceDesc">Workspace Description</Label>
                          <Textarea
                            id="workspaceDesc"
                            value={onboardingData.workspace.description || ''}
                            onChange={(e) => {
                              const updated = { ...onboardingData };
                              updated.workspace.description = e.target.value;
                              setOnboardingData(updated);
                            }}
                            placeholder="A short description of your workspace..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Accent / Branding Color</Label>
                          <div className="flex flex-wrap gap-3 pt-1">
                            {[
                              { name: 'Blue', value: '#4A90E2' },
                              { name: 'Green', value: '#27AE60' },
                              { name: 'Purple', value: '#9B59B6' },
                              { name: 'Red', value: '#E74C3C' },
                              { name: 'Orange', value: '#F39C12' },
                              { name: 'Teal', value: '#1ABC9C' },
                              { name: 'Dark Gray', value: '#34495E' },
                              { name: 'Pink', value: '#E91E63' },
                            ].map((colorObj) => (
                              <button
                                key={colorObj.value}
                                type="button"
                                onClick={() => {
                                  const updated = { ...onboardingData };
                                  updated.workspace.color = colorObj.value;
                                  setOnboardingData(updated);
                                }}
                                className="group relative size-8 rounded-full border border-gray-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                                style={{ backgroundColor: colorObj.value }}
                                title={colorObj.name}
                              >
                                {onboardingData.workspace.color === colorObj.value && (
                                  <span className="size-2.5 rounded-full bg-white shadow-sm" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Plan Sub-tab */}
                    {profileSubTab === 'plan' && onboardingData?.plan && (
                      <div className="space-y-6 animate-fadeIn">
                        <h3 className="font-semibold text-gray-900 text-base">Active Subscription Plan</h3>
                        
                        {/* Plan Showcase Card */}
                        <div className="relative overflow-hidden p-6 rounded-xl text-white bg-gradient-to-br from-indigo-600 via-blue-600 to-fuchsia-600 shadow-lg border border-indigo-500/20">
                          <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-10">
                            <CreditCard className="size-48" />
                          </div>
                          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-white/20 rounded-full text-white/90">
                                {onboardingData.plan.cycle === 'yearly' ? 'Yearly Plan' : 'Monthly Plan'}
                              </span>
                              <h3 className="text-3xl font-extrabold mt-2 flex items-center gap-2">
                                {onboardingData.plan.tier || 'Pro'} Tier <Sparkles className="size-5 text-amber-300 animate-pulse" />
                              </h3>
                              <p className="text-white/80 text-sm mt-1 max-w-md">
                                Fully featured high-volume email operations active with comprehensive automation, custom reviews, and live tracking.
                              </p>
                            </div>
                            <div className="text-right flex flex-col items-end">
                              <span className="text-sm text-white/70">Subtotal Price</span>
                              <span className="text-4xl font-black">${onboardingData.plan.pricing?.total || 105} <span className="text-lg font-normal">/ yr</span></span>
                              <span className="text-xs text-white/60 mt-0.5">including GST & Addons</span>
                            </div>
                          </div>
                        </div>

                        {/* Plan limits / Addons */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 border border-gray-100 bg-gray-50/50 rounded-lg text-center space-y-1">
                            <Layers className="size-5 mx-auto text-blue-600" />
                            <h4 className="font-semibold text-gray-900 text-sm">Workspaces</h4>
                            <p className="text-2xl font-bold text-gray-900">{onboardingData.plan.addons?.workspaces || 2}</p>
                            <span className="text-xs text-gray-500">Active Slots</span>
                          </div>
                          <div className="p-4 border border-gray-100 bg-gray-50/50 rounded-lg text-center space-y-1">
                            <Users className="size-5 mx-auto text-blue-600" />
                            <h4 className="font-semibold text-gray-900 text-sm">Team Seats</h4>
                            <p className="text-2xl font-bold text-gray-900">{onboardingData.plan.addons?.users || 5}</p>
                            <span className="text-xs text-gray-500">Allowed Members</span>
                          </div>
                          <div className="p-4 border border-gray-100 bg-gray-50/50 rounded-lg text-center space-y-1">
                            <HardDrive className="size-5 mx-auto text-blue-600" />
                            <h4 className="font-semibold text-gray-900 text-sm">Media Storage</h4>
                            <p className="text-2xl font-bold text-gray-900">{onboardingData.plan.addons?.storage || 50} GB</p>
                            <span className="text-xs text-gray-500">Cloud Files Capacity</span>
                          </div>
                        </div>

                        {/* Financial invoice receipt summary */}
                        <div className="border border-dashed border-gray-200 rounded-lg p-4 bg-zinc-50 space-y-3">
                          <h4 className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
                            <FileText className="size-4 text-gray-500" /> Pricing Breakout Invoice
                          </h4>
                          <div className="space-y-1.5 text-sm text-gray-600">
                            <div className="flex justify-between">
                              <span>Base Plan Price ({onboardingData.plan.tier || 'Pro'})</span>
                              <span>${onboardingData.plan.pricing?.basePrice || 79}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Limits & Addons Price</span>
                              <span>+${onboardingData.plan.pricing?.addonsPrice || 25}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-200/50 pt-1.5">
                              <span>Subtotal</span>
                              <span>${onboardingData.plan.pricing?.subtotal || 104}</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                              <span>Discount Applied</span>
                              <span>-${onboardingData.plan.pricing?.discount || 15}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Government Tax (GST 18%)</span>
                              <span>+${onboardingData.plan.pricing?.gst || 16}</span>
                            </div>
                            <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-1.5 text-base">
                              <span>Final Total Billed</span>
                              <span>${onboardingData.plan.pricing?.total || 105}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Use Case Sub-tab */}
                    {profileSubTab === 'useCase' && onboardingData?.useCase && (
                      <div className="space-y-4 animate-fadeIn">
                        <h3 className="font-semibold text-gray-900 text-base">Target Operations & Intent</h3>
                        
                        <div className="space-y-2">
                          <Label>Primary Campaign Goal</Label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[
                              { id: 'send', title: 'Send Campaigns Only', icon: <Send className="size-5 text-blue-600" />, desc: 'Focus strictly on dispatching marketing newsletters.' },
                              { id: 'receive', title: 'Receive & Manage', icon: <Inbox className="size-5 text-blue-600" />, desc: 'Handle high-volume customer correspondence.' },
                              { id: 'both', title: 'Dual Operations', icon: <ArrowLeftRight className="size-5 text-blue-600" />, desc: 'Fully bi-directional automated mailing pipeline.' },
                            ].map((goalObj) => (
                              <button
                                key={goalObj.id}
                                type="button"
                                onClick={() => {
                                  const updated = { ...onboardingData };
                                  updated.useCase.primaryGoal = goalObj.id;
                                  setOnboardingData(updated);
                                }}
                                className={`p-4 border-2 rounded-lg text-left transition-all hover:border-blue-300 ${
                                  onboardingData.useCase.primaryGoal === goalObj.id
                                    ? 'border-blue-600 bg-blue-50/50'
                                    : 'border-gray-200 hover:border-blue-200'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1.5 font-bold text-gray-900 text-sm">
                                  {goalObj.icon}
                                  {goalObj.title}
                                </div>
                                <p className="text-xs text-gray-500 leading-normal">{goalObj.desc}</p>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="useCaseSubCount">Estimated Contact Count / Volume</Label>
                          <Select
                            value={onboardingData.useCase.subscriberCount || ''}
                            onValueChange={(val) => {
                              const updated = { ...onboardingData };
                              updated.useCase.subscriberCount = val;
                              setOnboardingData(updated);
                            }}
                          >
                            <SelectTrigger id="useCaseSubCount">
                              <SelectValue placeholder="Select contact range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Just starting (0-100)">Just starting (0-100)</SelectItem>
                              <SelectItem value="Growing (100-500)">Growing (100-500)</SelectItem>
                              <SelectItem value="Established (500-1,000)">Established (500-1,000)</SelectItem>
                              <SelectItem value="Scaling (1,000-5,000)">Scaling (1,000-5,000)</SelectItem>
                              <SelectItem value="Enterprise (5,000+)">Enterprise (5,000+)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="useCaseFrequency">Mailing Frequency</Label>
                            <Select
                              value={onboardingData.useCase.frequency || ''}
                              onValueChange={(val) => {
                                const updated = { ...onboardingData };
                                updated.useCase.frequency = val;
                                setOnboardingData(updated);
                              }}
                            >
                              <SelectTrigger id="useCaseFrequency">
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Daily">Daily</SelectItem>
                                <SelectItem value="Weekly">Weekly</SelectItem>
                                <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                                <SelectItem value="Monthly">Monthly</SelectItem>
                                <SelectItem value="Irregular / Seasonal">Irregular / Seasonal</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="useCaseIndustry">Industry Vertical</Label>
                            <Select
                              value={onboardingData.useCase.industry || ''}
                              onValueChange={(val) => {
                                const updated = { ...onboardingData };
                                updated.useCase.industry = val;
                                setOnboardingData(updated);
                              }}
                            >
                              <SelectTrigger id="useCaseIndustry">
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Technology / SaaS">Technology / SaaS</SelectItem>
                                <SelectItem value="E-commerce">E-commerce</SelectItem>
                                <SelectItem value="Real Estate">Real Estate</SelectItem>
                                <SelectItem value="Healthcare / Wellness">Healthcare / Wellness</SelectItem>
                                <SelectItem value="Education">Education</SelectItem>
                                <SelectItem value="Marketing / Creative Agency">Marketing / Creative Agency</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700" disabled={isLoadingProfile}>
                      <Save className="size-4 mr-2" />
                      {isLoadingProfile ? 'Loading...' : 'Save Profile Changes'}
                    </Button>
                  </div>
                </div>
              )}

              {/* ESP Integration Tab */}
              {activeTab === 'esp' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">ESP Integration</h2>
                    <p className="text-sm text-gray-600">
                      Connect your email service provider to send campaigns
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Provider Selection */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Select Email Provider</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {espProviders.map((provider) => (
                          <button
                            key={provider.id}
                            onClick={() =>
                              setEspSettings({ ...espSettings, provider: provider.id })
                            }
                            className={`p-4 border-2 rounded-lg text-left transition-all ${
                              espSettings.provider === provider.id
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{provider.icon}</span>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                                  {provider.connected && (
                                    <span className="text-xs text-green-600 font-medium">
                                      ✓ Connected
                                    </span>
                                  )}
                                </div>
                              </div>
                              {espSettings.provider === provider.id && (
                                <Check className="size-5 text-blue-600" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* API Configuration */}
                    <div className="border-t pt-6 space-y-4">
                      <h3 className="font-semibold text-gray-900">API Configuration</h3>

                      <div className="space-y-2">
                        <Label htmlFor="espApiKey">API Key</Label>
                        <div className="relative">
                          <Input
                            id="espApiKey"
                            type="password"
                            value={espSettings.apiKey}
                            onChange={(e) =>
                              setEspSettings({ ...espSettings, apiKey: e.target.value })
                            }
                            placeholder="Enter your API key"
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Get your API key from your{' '}
                          {espProviders.find((p) => p.id === espSettings.provider)?.name} dashboard
                        </p>
                      </div>

                      <Button variant="outline" size="sm">
                        <RefreshCw className="size-4 mr-2" />
                        Test Connection
                      </Button>
                    </div>

                    {/* Connection Status */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Check className="size-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-green-900">Connected Successfully</h4>
                          <p className="text-sm text-green-700 mt-1">
                            Your workspace is connected to{' '}
                            {espProviders.find((p) => p.id === espSettings.provider)?.name}. You
                            can now send campaigns.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button onClick={handleSaveESP} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="size-4 mr-2" />
                      Save Configuration
                    </Button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Notification Preferences
                    </h2>
                    <p className="text-sm text-gray-600">
                      Choose which email notifications you want to receive
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Campaign Notifications */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Campaign Notifications</h3>

                      <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900">Campaign Sent</p>
                          <p className="text-sm text-gray-600">
                            Notify when a campaign is successfully sent
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notificationSettings.campaignSent}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              campaignSent: e.target.checked,
                            })
                          }
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900">Campaign Failed</p>
                          <p className="text-sm text-gray-600">
                            Notify when a campaign fails to send
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notificationSettings.campaignFailed}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              campaignFailed: e.target.checked,
                            })
                          }
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                      </label>
                    </div>

                    {/* Subscriber Notifications */}
                    <div className="space-y-3 border-t pt-6">
                      <h3 className="font-semibold text-gray-900">Subscriber Notifications</h3>

                      <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900">New Subscriber</p>
                          <p className="text-sm text-gray-600">
                            Notify when someone subscribes to your list
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notificationSettings.newSubscriber}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              newSubscriber: e.target.checked,
                            })
                          }
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900">Unsubscribe</p>
                          <p className="text-sm text-gray-600">
                            Notify when someone unsubscribes from your list
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notificationSettings.unsubscribe}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              unsubscribe: e.target.checked,
                            })
                          }
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                      </label>
                    </div>

                    {/* Report Notifications */}
                    <div className="space-y-3 border-t pt-6">
                      <h3 className="font-semibold text-gray-900">Report Notifications</h3>

                      <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900">Weekly Report</p>
                          <p className="text-sm text-gray-600">
                            Receive a weekly summary of your campaigns
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notificationSettings.weeklyReport}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              weeklyReport: e.target.checked,
                            })
                          }
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900">Monthly Report</p>
                          <p className="text-sm text-gray-600">
                            Receive a monthly summary of your campaigns
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notificationSettings.monthlyReport}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              monthlyReport: e.target.checked,
                            })
                          }
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      onClick={handleSaveNotifications}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="size-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Billing & Subscription
                    </h2>
                    <p className="text-sm text-gray-600">
                      Manage your plan, usage, and payment methods
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Current Plan */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-blue-900">{billingInfo.plan}</h3>
                          <p className="text-blue-700 mt-1">{billingInfo.price}</p>
                          <p className="text-sm text-blue-600 mt-2">
                            Next billing date: {billingInfo.nextBillingDate}
                          </p>
                        </div>
                        <Button variant="outline" className="bg-white">
                          Change Plan
                        </Button>
                      </div>
                    </div>

                    {/* Usage Stats */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Current Usage</h3>

                      <div className="space-y-4">
                        {/* Emails Sent */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Emails Sent This Month</span>
                            <span className="font-semibold text-gray-900">
                              {billingInfo.emailsSent.toLocaleString()} /{' '}
                              {billingInfo.emailsLimit.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${(billingInfo.emailsSent / billingInfo.emailsLimit) * 100}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Contacts */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Total Contacts</span>
                            <span className="font-semibold text-gray-900">
                              {billingInfo.contacts.toLocaleString()} /{' '}
                              {billingInfo.contactsLimit.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{
                                width: `${(billingInfo.contacts / billingInfo.contactsLimit) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="border-t pt-6 space-y-4">
                      <h3 className="font-semibold text-gray-900">Payment Method</h3>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 bg-gray-900 rounded flex items-center justify-center text-white text-xs font-bold">
                            VISA
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                            <p className="text-sm text-gray-600">Expires 12/2027</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Update
                        </Button>
                      </div>
                    </div>

                    {/* Billing History */}
                    <div className="border-t pt-6 space-y-4">
                      <h3 className="font-semibold text-gray-900">Billing History</h3>

                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                Date
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                Description
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                Amount
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                Status
                              </th>
                              <th className="px-4 py-3"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            <tr>
                              <td className="px-4 py-3 text-sm text-gray-900">Jan 17, 2026</td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                Professional Plan
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">$49.00</td>
                              <td className="px-4 py-3">
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                  Paid
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button variant="ghost" size="sm">
                                  Invoice
                                </Button>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm text-gray-900">Dec 17, 2025</td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                Professional Plan
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">$49.00</td>
                              <td className="px-4 py-3">
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                  Paid
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button variant="ghost" size="sm">
                                  Invoice
                                </Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* API Keys Tab */}
              {activeTab === 'api' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">API Keys</h2>
                    <p className="text-sm text-gray-600">
                      Manage API keys for programmatic access to NConnect
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* API Documentation Link */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Key className="size-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-900">API Documentation</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Learn how to integrate NConnect with your applications using our API.
                          </p>
                          <Button variant="link" className="text-blue-600 p-0 mt-2 h-auto">
                            View Documentation →
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* API Keys List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Your API Keys</h3>
                        <Button
                          onClick={handleGenerateApiKey}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="size-4 mr-2" />
                          Generate New Key
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {apiKeys.map((apiKey) => (
                          <div
                            key={apiKey.id}
                            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-900">{apiKey.name}</h4>
                                <p className="text-xs text-gray-600 mt-1">
                                  Created: {new Date(apiKey.created).toLocaleDateString()} • Last
                                  used: {apiKey.lastUsed}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteApiKey(apiKey.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>

                            <div className="flex items-center gap-2">
                              <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono text-gray-900 border">
                                {apiKey.key}
                              </code>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopyApiKey(apiKey.key)}
                              >
                                {copiedKey === apiKey.key ? (
                                  <>
                                    <Check className="size-4 mr-2 text-green-600" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="size-4 mr-2" />
                                    Copy
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Security Warning */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        <strong>⚠️ Security Notice:</strong> Keep your API keys secure and never
                        share them publicly. If you believe a key has been compromised, delete it
                        immediately and generate a new one.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
