import { useState, useEffect } from 'react';
import { DashboardSidebar } from '@/app/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/app/components/dashboard/DashboardHeader';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';
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
} from 'lucide-react';

interface SettingsPageProps {
  onNavigate?: (page: string) => void;
}

type SettingsTab = 'workspace' | 'profile' | 'esp' | 'notifications' | 'billing' | 'api';

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { currentUser, selectedWorkspace } = useWorkspace();
  const userName = currentUser?.name || 'John Doe';
  const [activeTab, setActiveTab] = useState<SettingsTab>('workspace');

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
    // Show success message
  };

  const handleSaveProfile = () => {
    console.log('Saving profile settings:', profileSettings);
    // Show success message
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Settings</h2>
                    <p className="text-sm text-gray-600">
                      Update your personal information
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Personal Information</h3>

                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={profileSettings.fullName}
                          onChange={(e) =>
                            setProfileSettings({ ...profileSettings, fullName: e.target.value })
                          }
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileSettings.email}
                          onChange={(e) =>
                            setProfileSettings({ ...profileSettings, email: e.target.value })
                          }
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>


                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="size-4 mr-2" />
                      Save Changes
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
