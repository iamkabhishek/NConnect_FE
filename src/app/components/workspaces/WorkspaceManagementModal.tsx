import { useState } from 'react';
import { 
  X, 
  Briefcase, 
  Users, 
  Settings as SettingsIcon, 
  BarChart3, 
  UserPlus, 
  Crown,
  Shield,
  Eye,
  Edit,
  Trash2,
  Copy,
  Check,
  Mail,
  Calendar,
  Activity,
  Building2,
  Palette,
  Globe,
  MapPin,
  Phone,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  AtSign,
  Workflow,
  FileText,
  FolderOpen,
  UserCircle,
  Zap,
  Search,
  Lock,
  Server,
  SendHorizontal,
  AlertCircle,
  CheckCircle,
  Star,
  Plus,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { InviteMemberModal } from '@/app/components/workspaces/InviteMemberModal';

interface WorkspaceData {
  id: string;
  workspaceId: string;
  name: string;
  category: string;
  color: string;
  logo?: string;
  logoShape?: 'square' | 'circular';
  role: 'owner' | 'admin' | 'member';
  members: number;
  campaigns: number;
  contacts: number;
  createdAt: string;
}

interface WorkspaceMember {
  id: string;
  userId?: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'creator' | 'viewer';
  avatar?: string;
  joinedAt: string;
  lastActive: string;
  status: 'active' | 'invited' | 'inactive';
  phone?: string;
  jobTitle?: string;
  department?: string;
  location?: string;
  permissions?: any[];
}

interface SenderEmail {
  id: string;
  email: string;
  displayName: string;
  replyTo: string;
  isVerified: boolean;
  isDefault: boolean;
  dateAdded: string;
  lastUsed: string;
  campaignsSent: number;
  workflowsUsing: number;
  smtpServer?: string;
  smtpPort?: string;
  smtpUsername?: string;
  smtpPassword?: string;
  encryption?: 'tls' | 'ssl' | 'none';
  authMethod?: 'password' | 'oauth' | 'api-key';
}

interface WorkspaceManagementModalProps {
  workspace: WorkspaceData;
  onClose: () => void;
  onUpdate?: (data: Partial<WorkspaceData>) => void;
}

type TabType = 'overview' | 'members' | 'company' | 'settings' | 'analytics' | 'sender-mail';

export function WorkspaceManagementModal({ workspace, onClose, onUpdate }: WorkspaceManagementModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [copiedId, setCopiedId] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [confirmRemoveMemberId, setConfirmRemoveMemberId] = useState<string | null>(null);
  
  // Company & Branding edit state
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  
  // Sender Mail Configuration state
  const [showAddSenderModal, setShowAddSenderModal] = useState(false);
  const [showEditSenderModal, setShowEditSenderModal] = useState(false);
  const [selectedSender, setSelectedSender] = useState<SenderEmail | null>(null);
  const [senderEmails, setSenderEmails] = useState<SenderEmail[]>([
    {
      id: 'SND-001',
      email: 'support@nconnect.com',
      displayName: 'Support Team',
      replyTo: 'support@nconnect.com',
      isVerified: true,
      isDefault: true,
      dateAdded: '2024-01-15',
      lastUsed: '2 hours ago',
      campaignsSent: 45,
      workflowsUsing: 3,
      smtpServer: 'smtp.gmail.com',
      smtpPort: '587',
      smtpUsername: 'support@nconnect.com',
      smtpPassword: '••••••••••••',
      encryption: 'tls',
      authMethod: 'password',
    },
    {
      id: 'SND-002',
      email: 'hello@nconnect.com',
      displayName: 'Hello Team',
      replyTo: 'hello@nconnect.com',
      isVerified: true,
      isDefault: false,
      dateAdded: '2024-02-10',
      lastUsed: '1 day ago',
      campaignsSent: 28,
      workflowsUsing: 1,
      smtpServer: 'smtp.gmail.com',
      smtpPort: '587',
      smtpUsername: 'hello@nconnect.com',
      smtpPassword: '••••••••••••',
      encryption: 'tls',
      authMethod: 'password',
    },
    {
      id: 'SND-003',
      email: 'noreply@nconnect.com',
      displayName: 'No Reply',
      replyTo: 'support@nconnect.com',
      isVerified: false,
      isDefault: false,
      dateAdded: '2024-03-05',
      lastUsed: 'Never',
      campaignsSent: 0,
      workflowsUsing: 0,
      smtpServer: 'smtp.gmail.com',
      smtpPort: '587',
      smtpUsername: 'noreply@nconnect.com',
      smtpPassword: '••••••••••••',
      encryption: 'tls',
      authMethod: 'password',
    },
  ]);
  
  // Sender email form state
  const [senderFormData, setSenderFormData] = useState({
    email: '',
    displayName: '',
    replyTo: '',
    smtpServer: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    encryption: 'tls' as 'tls' | 'ssl' | 'none',
    authMethod: 'password' as 'password' | 'oauth' | 'api-key',
    setAsDefault: false,
  });

  // Sender email search state
  const [senderSearchQuery, setSenderSearchQuery] = useState('');
  
  const [editableCompanyData, setEditableCompanyData] = useState({
    companyName: 'ABC Corporation',
    industry: 'Technology & SaaS',
    headquarters: '123 Tech Street, San Francisco, CA 94105',
    companySize: '50-200 employees',
    email: 'info@abccorp.com',
    phone: '+1 (555) 123-4567',
    website: 'www.abccorp.com',
    primaryColor: workspace.color,
    secondaryColor: '#10B981',
    tertiaryColor: '#F59E0B',
    font: 'Inter',
    linkedIn: 'linkedin.com/company/abccorp',
    twitter: '@abccorp',
    facebook: 'facebook.com/abccorp',
    instagram: '@abccorp',
    youtube: 'youtube.com/@abccorp',
  });

  // Mock members data
  const [members, setMembers] = useState<WorkspaceMember[]>([
    {
      id: '1',
      userId: `${workspace.workspaceId}-USR001`,
      name: 'John Doe',
      email: 'john@company.com',
      role: 'owner',
      joinedAt: workspace.createdAt,
      lastActive: new Date().toISOString(),
      status: 'active',
      phone: '+1 (555) 123-4567',
      jobTitle: 'CEO',
      department: 'Executive',
      location: 'San Francisco, CA',
    },
    {
      id: '2',
      userId: `${workspace.workspaceId}-USR002`,
      name: 'Sarah Smith',
      email: 'sarah@company.com',
      role: 'admin',
      joinedAt: '2024-01-15',
      lastActive: new Date(Date.now() - 86400000).toISOString(),
      status: 'active',
      phone: '+1 (555) 234-5678',
      jobTitle: 'Marketing Manager',
      department: 'Marketing',
      location: 'New York, NY',
    },
    {
      id: '3',
      userId: `${workspace.workspaceId}-USR003`,
      name: 'Mike Johnson',
      email: 'mike@company.com',
      role: 'editor',
      joinedAt: '2024-01-20',
      lastActive: new Date(Date.now() - 172800000).toISOString(),
      status: 'active',
      phone: '+1 (555) 345-6789',
      jobTitle: 'Content Creator',
      department: 'Content',
      location: 'Austin, TX',
    },
  ]);

  const handleCopyWorkspaceId = () => {
    navigator.clipboard.writeText(workspace.workspaceId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleInviteMember = (memberData: any, permissions: any) => {
    const fullName = `${memberData.firstName} ${memberData.lastName}`;
    const userId = `${workspace.workspaceId}-USR${String(members.length + 1).padStart(3, '0')}`;
    
    const newMember: WorkspaceMember = {
      id: String(members.length + 1),
      userId: userId,
      name: fullName,
      email: memberData.email,
      role: memberData.roleType === 'Full Access' ? 'admin' : 'editor',
      joinedAt: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString(),
      status: 'invited',
      phone: memberData.phone,
      jobTitle: memberData.jobTitle,
      department: memberData.department,
      location: memberData.location,
      permissions: permissions,
    };

    setMembers([...members, newMember]);
    
    console.log('Invited member with full details:', newMember);
    
    setShowInviteModal(false);
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId));
  };

  const handleUpdateMemberRole = (memberId: string, newRole: WorkspaceMember['role']) => {
    setMembers(members.map(m => m.id === memberId ? { ...m, role: newRole } : m));
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      owner: { icon: Crown, color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      admin: { icon: Shield, color: 'bg-purple-100 text-purple-800 border-purple-300' },
      editor: { icon: Edit, color: 'bg-blue-100 text-blue-800 border-blue-300' },
      creator: { icon: Activity, color: 'bg-green-100 text-green-800 border-green-300' },
      viewer: { icon: Eye, color: 'bg-gray-100 text-gray-800 border-gray-300' },
    };

    const badge = badges[role as keyof typeof badges] || badges.viewer;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${badge.color}`}>
        <Icon className="size-3" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      invited: 'bg-blue-100 text-blue-800',
      inactive: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${colors[status as keyof typeof colors]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleEditCompany = () => {
    setIsEditingCompany(true);
  };

  const handleCancelEditCompany = () => {
    // Reset to original values
    setEditableCompanyData({
      companyName: 'ABC Corporation',
      industry: 'Technology & SaaS',
      headquarters: '123 Tech Street, San Francisco, CA 94105',
      companySize: '50-200 employees',
      email: 'info@abccorp.com',
      phone: '+1 (555) 123-4567',
      website: 'www.abccorp.com',
      primaryColor: workspace.color,
      secondaryColor: '#10B981',
      tertiaryColor: '#F59E0B',
      font: 'Inter',
      linkedIn: 'linkedin.com/company/abccorp',
      twitter: '@abccorp',
      facebook: 'facebook.com/abccorp',
      instagram: '@abccorp',
      youtube: 'youtube.com/@abccorp',
    });
    setIsEditingCompany(false);
  };

  const handleSaveCompany = () => {
    // Here you would typically save to backend/database
    console.log('Saving company data:', editableCompanyData);
    setIsEditingCompany(false);
    // Optionally call onUpdate if needed
  };

  const updateCompanyField = (field: string, value: string) => {
    setEditableCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSender = () => {
    if (senderFormData.email && senderFormData.displayName) {
      const newSender: SenderEmail = {
        id: `SND-${String(senderEmails.length + 1).padStart(3, '0')}`,
        email: senderFormData.email,
        displayName: senderFormData.displayName,
        replyTo: senderFormData.replyTo || senderFormData.email,
        isVerified: false,
        isDefault: senderFormData.setAsDefault,
        dateAdded: new Date().toISOString().split('T')[0],
        lastUsed: 'Never',
        campaignsSent: 0,
        workflowsUsing: 0,
        smtpServer: senderFormData.smtpServer,
        smtpPort: senderFormData.smtpPort,
        smtpUsername: senderFormData.smtpUsername || senderFormData.email,
        smtpPassword: senderFormData.smtpPassword,
        encryption: senderFormData.encryption,
        authMethod: senderFormData.authMethod,
      };

      // If setting as default, remove default from others
      if (senderFormData.setAsDefault) {
        setSenderEmails(senderEmails.map(s => ({ ...s, isDefault: false })));
      }

      setSenderEmails([...senderEmails, newSender]);
      setShowAddSenderModal(false);
      resetSenderForm();
    }
  };

  const handleEditSender = () => {
    if (selectedSender && senderFormData.email && senderFormData.displayName) {
      setSenderEmails(senderEmails.map(s => {
        if (s.id === selectedSender.id) {
          return {
            ...s,
            email: senderFormData.email,
            displayName: senderFormData.displayName,
            replyTo: senderFormData.replyTo || senderFormData.email,
            smtpServer: senderFormData.smtpServer,
            smtpPort: senderFormData.smtpPort,
            smtpUsername: senderFormData.smtpUsername || senderFormData.email,
            smtpPassword: senderFormData.smtpPassword,
            encryption: senderFormData.encryption,
            authMethod: senderFormData.authMethod,
            isDefault: senderFormData.setAsDefault,
          };
        }
        // If setting new default, remove from others
        if (senderFormData.setAsDefault) {
          return { ...s, isDefault: false };
        }
        return s;
      }));
      setShowEditSenderModal(false);
      setSelectedSender(null);
      resetSenderForm();
    }
  };

  const handleDeleteSender = (senderId: string) => {
    if (confirm('Are you sure you want to delete this sender email?')) {
      setSenderEmails(senderEmails.filter(s => s.id !== senderId));
    }
  };

  const handleSetDefaultSender = (senderId: string) => {
    setSenderEmails(senderEmails.map(s => ({
      ...s,
      isDefault: s.id === senderId
    })));
  };

  const handleTestEmail = (sender: SenderEmail) => {
    console.log('Sending test email with configuration:', sender);
    alert(`Test email sent from ${sender.email}! Check your inbox.`);
  };

  const openEditSenderModal = (sender: SenderEmail) => {
    setSelectedSender(sender);
    setSenderFormData({
      email: sender.email,
      displayName: sender.displayName,
      replyTo: sender.replyTo,
      smtpServer: sender.smtpServer || 'smtp.gmail.com',
      smtpPort: sender.smtpPort || '587',
      smtpUsername: sender.smtpUsername || sender.email,
      smtpPassword: sender.smtpPassword || '',
      encryption: sender.encryption || 'tls',
      authMethod: sender.authMethod || 'password',
      setAsDefault: sender.isDefault,
    });
    setShowEditSenderModal(true);
  };

  const resetSenderForm = () => {
    setSenderFormData({
      email: '',
      displayName: '',
      replyTo: '',
      smtpServer: 'smtp.gmail.com',
      smtpPort: '587',
      smtpUsername: '',
      smtpPassword: '',
      encryption: 'tls',
      authMethod: 'password',
      setAsDefault: false,
    });
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: Briefcase },
    { id: 'members' as TabType, label: 'Members', icon: Users },
    { id: 'company' as TabType, label: 'Company', icon: Building2 },
    { id: 'sender-mail' as TabType, label: 'Sender Mail', icon: SendHorizontal },
    { id: 'settings' as TabType, label: 'Settings', icon: SettingsIcon },
    { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-white border-b">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 flex items-center justify-center overflow-hidden ${
                  workspace.logo 
                    ? workspace.logoShape === 'circular' ? 'rounded-full' : 'rounded-lg'
                    : 'rounded-lg'
                }`}
                style={{ backgroundColor: workspace.logo ? 'transparent' : workspace.color }}
              >
                {workspace.logo ? (
                  <img 
                    src={workspace.logo} 
                    alt={workspace.name}
                    className={`w-full h-full ${
                      workspace.logoShape === 'circular' ? 'object-cover' : 'object-contain p-1'
                    }`}
                  />
                ) : (
                  <span className="text-white font-bold text-xl">
                    {workspace.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{workspace.name}</h2>
                <p className="text-sm text-gray-600">{workspace.category}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="size-5 text-gray-600" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-t">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="size-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Workspace ID */}
              <div>
                <Label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Workspace ID
                </Label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs text-blue-700 mb-1 font-medium">Unique Identifier</p>
                      <p className="text-lg font-mono font-bold text-blue-900">
                        {workspace.workspaceId}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyWorkspaceId}
                    >
                      {copiedId ? (
                        <Check className="size-4 mr-1 text-green-600" />
                      ) : (
                        <Copy className="size-4 mr-1" />
                      )}
                      {copiedId ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Workspace Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Workspace Members */}
                  <div className="bg-white border border-blue-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <UserCircle className="size-4 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">Workspace Members</h4>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Total:</span>
                        <span className="text-sm font-bold text-gray-900">12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Active:</span>
                        <span className="text-sm font-semibold text-green-700">10</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Invited:</span>
                        <span className="text-sm font-semibold text-blue-700">2</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Inactive:</span>
                        <span className="text-sm font-semibold text-gray-500">0</span>
                      </div>
                    </div>
                  </div>

                  {/* Automation Workflows */}
                  <div className="bg-white border border-purple-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Zap className="size-4 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">Automation Workflows</h4>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Total:</span>
                        <span className="text-sm font-bold text-gray-900">8</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Active:</span>
                        <span className="text-sm font-semibold text-green-700">5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Inactive:</span>
                        <span className="text-sm font-semibold text-gray-500">2</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Archived:</span>
                        <span className="text-sm font-semibold text-orange-600">1</span>
                      </div>
                    </div>
                  </div>

                  {/* Campaigns */}
                  <div className="bg-white border border-green-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Mail className="size-4 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">Campaigns</h4>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Total:</span>
                        <span className="text-sm font-bold text-gray-900">{workspace.campaigns}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Published:</span>
                        <span className="text-sm font-semibold text-green-700">18</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Draft:</span>
                        <span className="text-sm font-semibold text-blue-700">7</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Archived:</span>
                        <span className="text-sm font-semibold text-orange-600">3</span>
                      </div>
                    </div>
                  </div>

                  {/* Templates */}
                  <div className="bg-white border border-indigo-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <FileText className="size-4 text-indigo-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">Templates</h4>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Total:</span>
                        <span className="text-sm font-bold text-gray-900">15</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Active:</span>
                        <span className="text-sm font-semibold text-green-700">12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Draft:</span>
                        <span className="text-sm font-semibold text-blue-700">2</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Archived:</span>
                        <span className="text-sm font-semibold text-orange-600">1</span>
                      </div>
                    </div>
                  </div>

                  {/* Groups */}
                  <div className="bg-white border border-pink-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-pink-100 rounded-lg">
                        <Users className="size-4 text-pink-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">Groups</h4>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Total:</span>
                        <span className="text-sm font-bold text-gray-900">24</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Active:</span>
                        <span className="text-sm font-semibold text-green-700">20</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Inactive:</span>
                        <span className="text-sm font-semibold text-gray-500">3</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Archived:</span>
                        <span className="text-sm font-semibold text-orange-600">1</span>
                      </div>
                    </div>
                  </div>

                  {/* Contacts */}
                  <div className="bg-white border border-cyan-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-cyan-100 rounded-lg">
                        <UserCircle className="size-4 text-cyan-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">Contacts</h4>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Total:</span>
                        <span className="text-sm font-bold text-gray-900">{workspace.contacts}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Active:</span>
                        <span className="text-sm font-semibold text-green-700">4,230</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Unsubscribed:</span>
                        <span className="text-sm font-semibold text-red-600">320</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Bounced:</span>
                        <span className="text-sm font-semibold text-orange-600">100</span>
                      </div>
                    </div>
                  </div>

                  {/* Media Files */}
                  <div className="bg-white border border-amber-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <FolderOpen className="size-4 text-amber-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">Media Files</h4>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Total:</span>
                        <span className="text-sm font-bold text-gray-900">156</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Active:</span>
                        <span className="text-sm font-semibold text-green-700">128</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Inactive:</span>
                        <span className="text-sm font-semibold text-gray-500">20</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Archived:</span>
                        <span className="text-sm font-semibold text-orange-600">8</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Workspace Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Workspace Information</h3>
                <div className="bg-gray-50 border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Category:</span>
                    <span className="text-sm text-gray-900">{workspace.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Your Role:</span>
                    <span className="text-sm text-gray-900">{getRoleBadge(workspace.role)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Contact Person:</span>
                    <span className="text-sm text-gray-900">John Doe</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Contact Email:</span>
                    <span className="text-sm text-blue-600 hover:underline cursor-pointer">john.doe@abccorp.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Contact Phone:</span>
                    <span className="text-sm text-gray-900">+1 (555) 987-6543</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Created:</span>
                    <span className="text-sm text-gray-900 flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(workspace.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Last Modified:</span>
                    <span className="text-sm text-gray-900 flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(new Date(workspace.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                  <p className="text-sm text-gray-600">{members.length} members in this workspace</p>
                </div>
                <Button
                  onClick={() => setShowInviteModal(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="size-4 mr-2" />
                  Invite Member
                </Button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  placeholder="Search by name, email, user ID, role, department, job title, location..."
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Members List */}
              <div className="space-y-3">
                {members.filter((member) => {
                  if (!memberSearchQuery.trim()) return true;
                  
                  const query = memberSearchQuery.toLowerCase();
                  
                  return (
                    member.name.toLowerCase().includes(query) ||
                    member.email.toLowerCase().includes(query) ||
                    (member.userId && member.userId.toLowerCase().includes(query)) ||
                    member.role.toLowerCase().includes(query) ||
                    member.status.toLowerCase().includes(query) ||
                    (member.phone && member.phone.toLowerCase().includes(query)) ||
                    (member.jobTitle && member.jobTitle.toLowerCase().includes(query)) ||
                    (member.department && member.department.toLowerCase().includes(query)) ||
                    (member.location && member.location.toLowerCase().includes(query)) ||
                    new Date(member.joinedAt).toLocaleDateString().toLowerCase().includes(query)
                  );
                }).map((member) => (
                  <div key={member.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(member.status)}
                        {getRoleBadge(member.role)}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedMemberId(member.id)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                        >
                          <Eye className="size-4 mr-1" />
                          View Details
                        </Button>
                        {member.role !== 'owner' && (workspace.role === 'owner' || workspace.role === 'admin' || workspace.role === 'platform_admin') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmRemoveMemberId(member.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t flex items-center gap-4 text-xs text-gray-500">
                      <span>Joined: {new Date(member.joinedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Last active: {new Date(member.lastActive).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Company Tab */}
          {activeTab === 'company' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Company & Branding</h3>
                  {!isEditingCompany ? (
                    <Button
                      onClick={handleEditCompany}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Edit className="size-4" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handleCancelEditCompany}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveCompany}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Check className="size-4 mr-1" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  {isEditingCompany ? 'Edit your company information and branding details' : 'View your company information and branding details'}
                </p>
              </div>

              {/* Company Details */}
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 border-b">
                  <div className="flex items-center gap-2">
                    <Building2 className="size-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Company Details</h4>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between py-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="size-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Company Name:</span>
                    </div>
                    {isEditingCompany ? (
                      <Input
                        value={editableCompanyData.companyName}
                        onChange={(e) => updateCompanyField('companyName', e.target.value)}
                        className="max-w-xs text-sm"
                      />
                    ) : (
                      <span className="text-sm text-gray-900 font-medium">{editableCompanyData.companyName}</span>
                    )}
                  </div>
                  <div className="flex items-start justify-between py-2 border-t">
                    <div className="flex items-center gap-2">
                      <Briefcase className="size-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Industry:</span>
                    </div>
                    {isEditingCompany ? (
                      <Input
                        value={editableCompanyData.industry}
                        onChange={(e) => updateCompanyField('industry', e.target.value)}
                        className="max-w-xs text-sm"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">{editableCompanyData.industry}</span>
                    )}
                  </div>
                  <div className="flex items-start justify-between py-2 border-t">
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Headquarters:</span>
                    </div>
                    {isEditingCompany ? (
                      <Input
                        value={editableCompanyData.headquarters}
                        onChange={(e) => updateCompanyField('headquarters', e.target.value)}
                        className="max-w-xs text-sm"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">{editableCompanyData.headquarters}</span>
                    )}
                  </div>
                  <div className="flex items-start justify-between py-2 border-t">
                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Company Size:</span>
                    </div>
                    {isEditingCompany ? (
                      <Select
                        value={editableCompanyData.companySize}
                        onValueChange={(value) => updateCompanyField('companySize', value)}
                      >
                        <SelectTrigger className="max-w-xs text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10 employees">1-10 employees</SelectItem>
                          <SelectItem value="11-50 employees">11-50 employees</SelectItem>
                          <SelectItem value="50-200 employees">50-200 employees</SelectItem>
                          <SelectItem value="201-500 employees">201-500 employees</SelectItem>
                          <SelectItem value="501-1000 employees">501-1000 employees</SelectItem>
                          <SelectItem value="1000+ employees">1000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-sm text-gray-900">{editableCompanyData.companySize}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-green-100 px-4 py-3 border-b">
                  <div className="flex items-center gap-2">
                    <Phone className="size-5 text-green-600" />
                    <h4 className="font-semibold text-gray-900">Contact Information</h4>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between py-2">
                    <div className="flex items-center gap-2">
                      <Mail className="size-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Email:</span>
                    </div>
                    {isEditingCompany ? (
                      <Input
                        type="email"
                        value={editableCompanyData.email}
                        onChange={(e) => updateCompanyField('email', e.target.value)}
                        className="max-w-xs text-sm"
                      />
                    ) : (
                      <span className="text-sm text-blue-600 hover:underline cursor-pointer">{editableCompanyData.email}</span>
                    )}
                  </div>
                  <div className="flex items-start justify-between py-2 border-t">
                    <div className="flex items-center gap-2">
                      <Phone className="size-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Phone:</span>
                    </div>
                    {isEditingCompany ? (
                      <Input
                        type="tel"
                        value={editableCompanyData.phone}
                        onChange={(e) => updateCompanyField('phone', e.target.value)}
                        className="max-w-xs text-sm"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">{editableCompanyData.phone}</span>
                    )}
                  </div>
                  <div className="flex items-start justify-between py-2 border-t">
                    <div className="flex items-center gap-2">
                      <Globe className="size-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Website:</span>
                    </div>
                    {isEditingCompany ? (
                      <Input
                        type="url"
                        value={editableCompanyData.website}
                        onChange={(e) => updateCompanyField('website', e.target.value)}
                        className="max-w-xs text-sm"
                      />
                    ) : (
                      <span className="text-sm text-blue-600 hover:underline cursor-pointer">{editableCompanyData.website}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Branding Details */}
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-4 py-3 border-b">
                  <div className="flex items-center gap-2">
                    <Palette className="size-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Branding Details</h4>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  {/* Logo */}
                  <div className="pb-3 border-b">
                    <p className="text-sm font-medium text-gray-700 mb-2">Company Logo</p>
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 flex items-center justify-center overflow-hidden border-2 border-gray-200 ${
                          workspace.logoShape === 'circular' ? 'rounded-full' : 'rounded-lg'
                        }`}
                        style={{ backgroundColor: workspace.logo ? 'transparent' : workspace.color }}
                      >
                        {workspace.logo ? (
                          <img 
                            src={workspace.logo} 
                            alt="Company Logo"
                            className={`w-full h-full ${
                              workspace.logoShape === 'circular' ? 'object-cover' : 'object-contain p-2'
                            }`}
                          />
                        ) : (
                          <span className="text-white font-bold text-2xl">
                            {workspace.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-900 font-medium">{workspace.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Shape: {workspace.logoShape === 'circular' ? 'Circular' : 'Square'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="pb-3 border-b">
                    <p className="text-sm font-medium text-gray-700 mb-3">Brand Colors</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-gray-600 mb-2">Primary Color</p>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-sm"
                            style={{ backgroundColor: editableCompanyData.primaryColor }}
                          ></div>
                          {isEditingCompany ? (
                            <Input
                              type="text"
                              value={editableCompanyData.primaryColor}
                              onChange={(e) => updateCompanyField('primaryColor', e.target.value)}
                              className="text-sm font-mono max-w-[120px]"
                              placeholder="#000000"
                            />
                          ) : (
                            <span className="text-sm font-mono text-gray-900">{editableCompanyData.primaryColor}</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-2">Secondary Color</p>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-sm"
                            style={{ backgroundColor: editableCompanyData.secondaryColor }}
                          ></div>
                          {isEditingCompany ? (
                            <Input
                              type="text"
                              value={editableCompanyData.secondaryColor}
                              onChange={(e) => updateCompanyField('secondaryColor', e.target.value)}
                              className="text-sm font-mono max-w-[120px]"
                              placeholder="#000000"
                            />
                          ) : (
                            <span className="text-sm font-mono text-gray-900">{editableCompanyData.secondaryColor}</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-2">Tertiary Color</p>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-sm"
                            style={{ backgroundColor: editableCompanyData.tertiaryColor }}
                          ></div>
                          {isEditingCompany ? (
                            <Input
                              type="text"
                              value={editableCompanyData.tertiaryColor}
                              onChange={(e) => updateCompanyField('tertiaryColor', e.target.value)}
                              className="text-sm font-mono max-w-[120px]"
                              placeholder="#000000"
                            />
                          ) : (
                            <span className="text-sm font-mono text-gray-900">{editableCompanyData.tertiaryColor}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Typography */}
                  <div className="pb-3 border-b">
                    <p className="text-sm font-medium text-gray-700 mb-3">Typography</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Font:</span>
                        {isEditingCompany ? (
                          <Select
                            value={editableCompanyData.font}
                            onValueChange={(value) => updateCompanyField('font', value)}
                          >
                            <SelectTrigger className="max-w-[150px] text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Inter">Inter</SelectItem>
                              <SelectItem value="Roboto">Roboto</SelectItem>
                              <SelectItem value="Open Sans">Open Sans</SelectItem>
                              <SelectItem value="Lato">Lato</SelectItem>
                              <SelectItem value="Montserrat">Montserrat</SelectItem>
                              <SelectItem value="Poppins">Poppins</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-sm font-medium text-gray-900">{editableCompanyData.font}</span>
                        )}
                      </div>
                    </div>
                  </div>


                </div>
              </div>

              {/* Social Media Links */}
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-4 py-3 border-b">
                  <div className="flex items-center gap-2">
                    <Globe className="size-5 text-orange-600" />
                    <h4 className="font-semibold text-gray-900">Social Media Presence</h4>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <Linkedin className="size-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">LinkedIn:</span>
                    </div>
                    {isEditingCompany ? (
                      <Input
                        value={editableCompanyData.linkedIn}
                        onChange={(e) => updateCompanyField('linkedIn', e.target.value)}
                        className="max-w-xs text-sm"
                        placeholder="linkedin.com/company/..."
                      />
                    ) : (
                      <a href="#" className="text-sm text-blue-600 hover:underline">{editableCompanyData.linkedIn}</a>
                    )}
                  </div>
                  <div className="flex items-center justify-between py-2 border-t">
                    <div className="flex items-center gap-2">
                      <Twitter className="size-4 text-sky-500" />
                      <span className="text-sm font-medium text-gray-700">Twitter (X):</span>
                    </div>
                    {isEditingCompany ? (
                      <Input
                        value={editableCompanyData.twitter}
                        onChange={(e) => updateCompanyField('twitter', e.target.value)}
                        className="max-w-xs text-sm"
                        placeholder="@username"
                      />
                    ) : (
                      <a href="#" className="text-sm text-blue-600 hover:underline">{editableCompanyData.twitter}</a>
                    )}
                  </div>
                  <div className="flex items-center justify-between py-2 border-t">
                    <div className="flex items-center gap-2">
                      <Facebook className="size-4 text-blue-700" />
                      <span className="text-sm font-medium text-gray-700">Facebook:</span>
                    </div>
                    {isEditingCompany ? (
                      <Input
                        value={editableCompanyData.facebook}
                        onChange={(e) => updateCompanyField('facebook', e.target.value)}
                        className="max-w-xs text-sm"
                        placeholder="facebook.com/..."
                      />
                    ) : (
                      <a href="#" className="text-sm text-blue-600 hover:underline">{editableCompanyData.facebook}</a>
                    )}
                  </div>
                  <div className="flex items-center justify-between py-2 border-t">
                    <div className="flex items-center gap-2">
                      <Instagram className="size-4 text-pink-600" />
                      <span className="text-sm font-medium text-gray-700">Instagram:</span>
                    </div>
                    {isEditingCompany ? (
                      <Input
                        value={editableCompanyData.instagram}
                        onChange={(e) => updateCompanyField('instagram', e.target.value)}
                        className="max-w-xs text-sm"
                        placeholder="@username"
                      />
                    ) : (
                      <a href="#" className="text-sm text-blue-600 hover:underline">{editableCompanyData.instagram}</a>
                    )}
                  </div>
                  <div className="flex items-center justify-between py-2 border-t">
                    <div className="flex items-center gap-2">
                      <Youtube className="size-4 text-red-600" />
                      <span className="text-sm font-medium text-gray-700">YouTube:</span>
                    </div>
                    {isEditingCompany ? (
                      <Input
                        value={editableCompanyData.youtube}
                        onChange={(e) => updateCompanyField('youtube', e.target.value)}
                        className="max-w-xs text-sm"
                        placeholder="youtube.com/@username"
                      />
                    ) : (
                      <a href="#" className="text-sm text-blue-600 hover:underline">{editableCompanyData.youtube}</a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Workspace Settings</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Configure your workspace preferences and settings
                </p>
              </div>

              {/* Notification Settings */}
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Notifications</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Email notifications for new campaigns</span>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Email notifications for new members</span>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Weekly activity summary</span>
                    <input type="checkbox" className="rounded" />
                  </label>
                </div>
              </div>

              {/* Access Settings */}
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Access Control</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Allow members to invite others</span>
                    <input type="checkbox" className="rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Require admin approval for new campaigns</span>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Enable two-factor authentication</span>
                    <input type="checkbox" className="rounded" />
                  </label>
                </div>
              </div>

              {/* Danger Zone */}
              {workspace.role === 'owner' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-3">Danger Zone</h4>
                  <p className="text-sm text-red-700 mb-3">
                    Once you delete a workspace, there is no going back. Please be certain.
                  </p>
                  <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                    <Trash2 className="size-4 mr-2" />
                    Delete Workspace
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Workspace Analytics</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Track your workspace performance and activity across all modules
                </p>
              </div>

              {/* Overall Performance Metrics */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Overall Performance</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white border rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Campaigns</p>
                    <p className="text-2xl font-bold text-gray-900">{workspace.campaigns}</p>
                    <p className="text-xs text-green-600 mt-1">↑ +12% this month</p>
                  </div>
                  <div className="bg-white border rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Active Contacts</p>
                    <p className="text-2xl font-bold text-gray-900">{workspace.contacts}</p>
                    <p className="text-xs text-green-600 mt-1">↑ +8% this month</p>
                  </div>
                  <div className="bg-white border rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Open Rate</p>
                    <p className="text-2xl font-bold text-gray-900">24.5%</p>
                    <p className="text-xs text-green-600 mt-1">↑ +3% this month</p>
                  </div>
                  <div className="bg-white border rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Click Rate</p>
                    <p className="text-2xl font-bold text-gray-900">3.2%</p>
                    <p className="text-xs text-red-600 mt-1">↓ -1% this month</p>
                  </div>
                </div>
              </div>

              {/* Module Analytics */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Module Analytics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Workspace Members Analytics */}
                  <div className="bg-white border border-blue-200 rounded-lg overflow-hidden">
                    <div className="bg-blue-50 px-4 py-3 border-b border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserCircle className="size-4 text-blue-600" />
                          <h5 className="font-semibold text-gray-900 text-sm">Workspace Members</h5>
                        </div>
                        <span className="text-xs text-blue-600 font-medium">12 Total</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Active Members:</span>
                        <span className="font-semibold text-green-700">10 (83%)</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">New This Month:</span>
                        <span className="font-semibold text-blue-700">+3</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Avg. Sessions/Day:</span>
                        <span className="font-semibold text-gray-900">4.2</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Activity Trend</span>
                          <span className="text-green-600">↑ +15%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Automation Workflows Analytics */}
                  <div className="bg-white border border-purple-200 rounded-lg overflow-hidden">
                    <div className="bg-purple-50 px-4 py-3 border-b border-purple-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="size-4 text-purple-600" />
                          <h5 className="font-semibold text-gray-900 text-sm">Automation Workflows</h5>
                        </div>
                        <span className="text-xs text-purple-600 font-medium">8 Total</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Active Workflows:</span>
                        <span className="font-semibold text-green-700">5 (62%)</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Executions Today:</span>
                        <span className="font-semibold text-blue-700">247</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Success Rate:</span>
                        <span className="font-semibold text-gray-900">98.5%</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Performance</span>
                          <span className="text-green-600">↑ +22%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Campaigns Analytics */}
                  <div className="bg-white border border-green-200 rounded-lg overflow-hidden">
                    <div className="bg-green-50 px-4 py-3 border-b border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="size-4 text-green-600" />
                          <h5 className="font-semibold text-gray-900 text-sm">Campaigns</h5>
                        </div>
                        <span className="text-xs text-green-600 font-medium">28 Total</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Published:</span>
                        <span className="font-semibold text-green-700">18 (64%)</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Sent This Month:</span>
                        <span className="font-semibold text-blue-700">12</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Avg. Open Rate:</span>
                        <span className="font-semibold text-gray-900">24.5%</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Engagement Trend</span>
                          <span className="text-green-600">↑ +8%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '64%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Templates Analytics */}
                  <div className="bg-white border border-indigo-200 rounded-lg overflow-hidden">
                    <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="size-4 text-indigo-600" />
                          <h5 className="font-semibold text-gray-900 text-sm">Templates</h5>
                        </div>
                        <span className="text-xs text-indigo-600 font-medium">15 Total</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Active Templates:</span>
                        <span className="font-semibold text-green-700">12 (80%)</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Most Used:</span>
                        <span className="font-semibold text-blue-700">Newsletter #1</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Usage Count:</span>
                        <span className="font-semibold text-gray-900">142 times</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Utilization Rate</span>
                          <span className="text-green-600">↑ +5%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Groups Analytics */}
                  <div className="bg-white border border-pink-200 rounded-lg overflow-hidden">
                    <div className="bg-pink-50 px-4 py-3 border-b border-pink-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="size-4 text-pink-600" />
                          <h5 className="font-semibold text-gray-900 text-sm">Groups</h5>
                        </div>
                        <span className="text-xs text-pink-600 font-medium">24 Total</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Active Groups:</span>
                        <span className="font-semibold text-green-700">20 (83%)</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Avg. Members/Group:</span>
                        <span className="font-semibold text-blue-700">194</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Largest Group:</span>
                        <span className="font-semibold text-gray-900">850 contacts</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Growth Rate</span>
                          <span className="text-green-600">↑ +18%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-pink-600 h-2 rounded-full" style={{ width: '83%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contacts Analytics */}
                  <div className="bg-white border border-cyan-200 rounded-lg overflow-hidden">
                    <div className="bg-cyan-50 px-4 py-3 border-b border-cyan-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserCircle className="size-4 text-cyan-600" />
                          <h5 className="font-semibold text-gray-900 text-sm">Contacts</h5>
                        </div>
                        <span className="text-xs text-cyan-600 font-medium">4,650 Total</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Active Contacts:</span>
                        <span className="font-semibold text-green-700">4,230 (91%)</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">New This Month:</span>
                        <span className="font-semibold text-blue-700">+342</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Engagement Score:</span>
                        <span className="font-semibold text-gray-900">7.8/10</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>List Health</span>
                          <span className="text-green-600">Excellent</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-cyan-600 h-2 rounded-full" style={{ width: '91%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Media Files Analytics */}
                  <div className="bg-white border border-amber-200 rounded-lg overflow-hidden">
                    <div className="bg-amber-50 px-4 py-3 border-b border-amber-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FolderOpen className="size-4 text-amber-600" />
                          <h5 className="font-semibold text-gray-900 text-sm">Media Files</h5>
                        </div>
                        <span className="text-xs text-amber-600 font-medium">156 Total</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Active Images:</span>
                        <span className="font-semibold text-green-700">128 (82%)</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Storage Used:</span>
                        <span className="font-semibold text-blue-700">342 MB</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Most Used Image:</span>
                        <span className="font-semibold text-gray-900">logo.png</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Storage Capacity</span>
                          <span className="text-blue-600">34% used</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-amber-600 h-2 rounded-full" style={{ width: '34%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Recent Activity</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Campaign "Summer Sale" created</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">New member Sarah Smith joined</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Automation workflow "Welcome Series" activated</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">150 new contacts imported</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sender Mail Configuration Tab */}
          {activeTab === 'sender-mail' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Sender Email Addresses</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage sender email addresses and SMTP configurations for this workspace</p>
                </div>
                <Button
                  onClick={() => setShowAddSenderModal(true)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="size-4 mr-1" />
                  Add Sender Email
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="size-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{senderEmails.length}</p>
                      <p className="text-xs text-gray-600">Total Senders</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="size-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{senderEmails.filter(s => s.isVerified).length}</p>
                      <p className="text-xs text-gray-600">Verified</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Star className="size-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{senderEmails.filter(s => s.isDefault).length}</p>
                      <p className="text-xs text-gray-600">Default</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Activity className="size-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{senderEmails.reduce((sum, s) => sum + s.campaignsSent, 0)}</p>
                      <p className="text-xs text-gray-600">Campaigns Sent</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="bg-white border rounded-lg p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search sender emails by email address or display name..."
                    value={senderSearchQuery}
                    onChange={(e) => setSenderSearchQuery(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  {senderSearchQuery && (
                    <button
                      onClick={() => setSenderSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="size-4 text-gray-500" />
                    </button>
                  )}
                </div>
                {senderSearchQuery && (
                  <p className="text-sm text-gray-600 mt-2">
                    Found {senderEmails.filter(sender =>
                      sender.email.toLowerCase().includes(senderSearchQuery.toLowerCase()) ||
                      sender.displayName.toLowerCase().includes(senderSearchQuery.toLowerCase())
                    ).length} of {senderEmails.length} sender emails
                  </p>
                )}
              </div>

              {/* Sender Emails List */}
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email & Display Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Reply-To</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Usage</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Last Used</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {senderEmails.filter(sender =>
                        sender.email.toLowerCase().includes(senderSearchQuery.toLowerCase()) ||
                        sender.displayName.toLowerCase().includes(senderSearchQuery.toLowerCase())
                      ).map((sender) => (
                        <tr key={sender.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Mail className="size-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{sender.displayName}</p>
                                <p className="text-sm text-gray-600">{sender.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-gray-900">{sender.replyTo}</p>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              {sender.isVerified ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle className="size-3" />
                                  Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
                                  <AlertCircle className="size-3" />
                                  Pending
                                </span>
                              )}
                              {sender.isDefault && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                                  <Star className="size-3" />
                                  Default
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm">
                              <p className="text-gray-900">{sender.campaignsSent} campaigns</p>
                              <p className="text-gray-600">{sender.workflowsUsing} workflows</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-gray-900">{sender.lastUsed}</p>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                onClick={() => handleTestEmail(sender)}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                <Mail className="size-3 mr-1" />
                                Test
                              </Button>
                              {!sender.isDefault && (
                                <Button
                                  onClick={() => handleSetDefaultSender(sender.id)}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                >
                                  <Star className="size-3 mr-1" />
                                  Set Default
                                </Button>
                              )}
                              <Button
                                onClick={() => openEditSenderModal(sender)}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                <Edit className="size-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDeleteSender(sender.id)}
                                variant="outline"
                                size="sm"
                                className="text-xs text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="size-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {senderEmails.filter(sender =>
                        sender.email.toLowerCase().includes(senderSearchQuery.toLowerCase()) ||
                        sender.displayName.toLowerCase().includes(senderSearchQuery.toLowerCase())
                      ).length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <Search className="size-8 text-gray-400" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">No sender emails found</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {senderSearchQuery
                                    ? `No results match "${senderSearchQuery}". Try a different search.`
                                    : 'Get started by adding your first sender email.'}
                                </p>
                              </div>
                              {senderSearchQuery && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSenderSearchQuery('')}
                                >
                                  Clear Search
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Best Practices */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="size-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Best Practices</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Verify all sender emails to improve deliverability</li>
                      <li>• Use TLS encryption for secure email transmission</li>
                      <li>• Configure SPF, DKIM, and DMARC records for better deliverability</li>
                      <li>• Test your configuration before sending to large groups</li>
                      <li>• Set a default sender email for quick campaign creation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Invite Member Modal */}
        {showInviteModal && (
          <InviteMemberModal
            onClose={() => setShowInviteModal(false)}
            onInvite={handleInviteMember}
          />
        )}

        {/* Remove Member Confirmation Modal */}
        {confirmRemoveMemberId && (() => {
          const memberToRemove = members.find(m => m.id === confirmRemoveMemberId);
          if (!memberToRemove) return null;

          return (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
              <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <Trash2 className="size-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Remove Member</h3>
                      <p className="text-sm text-gray-600">This action cannot be undone</p>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-900 mb-2">
                      You are about to remove <span className="font-semibold">{memberToRemove.name}</span> from this workspace.
                    </p>
                    <ul className="text-sm text-red-800 space-y-1 ml-4 list-disc">
                      <li>Their access will be revoked immediately</li>
                      <li>They will be removed from the workspace completely</li>
                      <li>All their permissions will be deleted</li>
                      <li>This action cannot be reversed</li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setConfirmRemoveMemberId(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => {
                        handleRemoveMember(confirmRemoveMemberId);
                        setConfirmRemoveMemberId(null);
                      }}
                    >
                      <Trash2 className="size-4 mr-2" />
                      Remove Member
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Member Details Modal */}
        {selectedMemberId && (() => {
          const member = members.find(m => m.id === selectedMemberId);
          if (!member) return null;
          
          return <MemberDetailsModal member={member} onClose={() => setSelectedMemberId(null)} />;
        })()}

        {/* Add Sender Email Modal */}
        {showAddSenderModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Add Sender Email</h3>
                  <p className="text-sm text-gray-600">Configure a new sender email with SMTP settings</p>
                </div>
                <button
                  onClick={() => {
                    setShowAddSenderModal(false);
                    resetSenderForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="size-5 text-gray-600" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Email Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Mail className="size-4 text-blue-600" />
                    Email Information
                  </h4>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Email Address *</Label>
                    <Input
                      type="email"
                      value={senderFormData.email}
                      onChange={(e) => setSenderFormData({...senderFormData, email: e.target.value})}
                      placeholder="noreply@example.com"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Display Name *</Label>
                    <Input
                      value={senderFormData.displayName}
                      onChange={(e) => setSenderFormData({...senderFormData, displayName: e.target.value})}
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Reply-To Email</Label>
                    <Input
                      type="email"
                      value={senderFormData.replyTo}
                      onChange={(e) => setSenderFormData({...senderFormData, replyTo: e.target.value})}
                      placeholder="support@example.com (leave blank to use same as email)"
                    />
                  </div>
                </div>

                {/* SMTP Configuration */}
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Server className="size-4 text-blue-600" />
                    SMTP Configuration
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">SMTP Server *</Label>
                      <Input
                        value={senderFormData.smtpServer}
                        onChange={(e) => setSenderFormData({...senderFormData, smtpServer: e.target.value})}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">SMTP Port *</Label>
                      <Input
                        value={senderFormData.smtpPort}
                        onChange={(e) => setSenderFormData({...senderFormData, smtpPort: e.target.value})}
                        placeholder="587"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">SMTP Username</Label>
                    <Input
                      value={senderFormData.smtpUsername}
                      onChange={(e) => setSenderFormData({...senderFormData, smtpUsername: e.target.value})}
                      placeholder="Leave blank to use email address"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">SMTP Password *</Label>
                    <Input
                      type="password"
                      value={senderFormData.smtpPassword}
                      onChange={(e) => setSenderFormData({...senderFormData, smtpPassword: e.target.value})}
                      placeholder="Enter SMTP password"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Encryption</Label>
                      <Select
                        value={senderFormData.encryption}
                        onValueChange={(value: 'tls' | 'ssl' | 'none') => setSenderFormData({...senderFormData, encryption: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tls">TLS (Recommended)</SelectItem>
                          <SelectItem value="ssl">SSL</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Authentication Method</Label>
                      <Select
                        value={senderFormData.authMethod}
                        onValueChange={(value: 'password' | 'oauth' | 'api-key') => setSenderFormData({...senderFormData, authMethod: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="password">Username & Password</SelectItem>
                          <SelectItem value="oauth">OAuth 2.0</SelectItem>
                          <SelectItem value="api-key">API Key</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Set as Default */}
                <div className="flex items-center gap-2 pt-4 border-t">
                  <input
                    type="checkbox"
                    id="setAsDefault"
                    checked={senderFormData.setAsDefault}
                    onChange={(e) => setSenderFormData({...senderFormData, setAsDefault: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <Label htmlFor="setAsDefault" className="text-sm text-gray-700">
                    Set as default sender email for this workspace
                  </Label>
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddSenderModal(false);
                    resetSenderForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddSender}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!senderFormData.email || !senderFormData.displayName}
                >
                  <Check className="size-4 mr-1" />
                  Add Sender Email
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Sender Email Modal */}
        {showEditSenderModal && selectedSender && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Edit Sender Email</h3>
                  <p className="text-sm text-gray-600">Update sender email configuration</p>
                </div>
                <button
                  onClick={() => {
                    setShowEditSenderModal(false);
                    setSelectedSender(null);
                    resetSenderForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="size-5 text-gray-600" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Email Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Mail className="size-4 text-blue-600" />
                    Email Information
                  </h4>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Email Address *</Label>
                    <Input
                      type="email"
                      value={senderFormData.email}
                      onChange={(e) => setSenderFormData({...senderFormData, email: e.target.value})}
                      placeholder="noreply@example.com"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Display Name *</Label>
                    <Input
                      value={senderFormData.displayName}
                      onChange={(e) => setSenderFormData({...senderFormData, displayName: e.target.value})}
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Reply-To Email</Label>
                    <Input
                      type="email"
                      value={senderFormData.replyTo}
                      onChange={(e) => setSenderFormData({...senderFormData, replyTo: e.target.value})}
                      placeholder="support@example.com (leave blank to use same as email)"
                    />
                  </div>
                </div>

                {/* SMTP Configuration */}
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Server className="size-4 text-blue-600" />
                    SMTP Configuration
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">SMTP Server *</Label>
                      <Input
                        value={senderFormData.smtpServer}
                        onChange={(e) => setSenderFormData({...senderFormData, smtpServer: e.target.value})}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">SMTP Port *</Label>
                      <Input
                        value={senderFormData.smtpPort}
                        onChange={(e) => setSenderFormData({...senderFormData, smtpPort: e.target.value})}
                        placeholder="587"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">SMTP Username</Label>
                    <Input
                      value={senderFormData.smtpUsername}
                      onChange={(e) => setSenderFormData({...senderFormData, smtpUsername: e.target.value})}
                      placeholder="Leave blank to use email address"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">SMTP Password *</Label>
                    <Input
                      type="password"
                      value={senderFormData.smtpPassword}
                      onChange={(e) => setSenderFormData({...senderFormData, smtpPassword: e.target.value})}
                      placeholder="Enter SMTP password"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Encryption</Label>
                      <Select
                        value={senderFormData.encryption}
                        onValueChange={(value: 'tls' | 'ssl' | 'none') => setSenderFormData({...senderFormData, encryption: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tls">TLS (Recommended)</SelectItem>
                          <SelectItem value="ssl">SSL</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Authentication Method</Label>
                      <Select
                        value={senderFormData.authMethod}
                        onValueChange={(value: 'password' | 'oauth' | 'api-key') => setSenderFormData({...senderFormData, authMethod: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="password">Username & Password</SelectItem>
                          <SelectItem value="oauth">OAuth 2.0</SelectItem>
                          <SelectItem value="api-key">API Key</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Set as Default */}
                <div className="flex items-center gap-2 pt-4 border-t">
                  <input
                    type="checkbox"
                    id="setAsDefaultEdit"
                    checked={senderFormData.setAsDefault}
                    onChange={(e) => setSenderFormData({...senderFormData, setAsDefault: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <Label htmlFor="setAsDefaultEdit" className="text-sm text-gray-700">
                    Set as default sender email for this workspace
                  </Label>
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditSenderModal(false);
                    setSelectedSender(null);
                    resetSenderForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditSender}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!senderFormData.email || !senderFormData.displayName}
                >
                  <Check className="size-4 mr-1" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Member Details Modal Component
interface MemberDetailsModalProps {
  member: WorkspaceMember;
  onClose: () => void;
}

function MemberDetailsModal({ member, onClose }: MemberDetailsModalProps) {
  const [copiedUserId, setCopiedUserId] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedAllText, setCopiedAllText] = useState(false);
  
  // Edit mode state
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [editableMemberData, setEditableMemberData] = useState({
    name: member.name,
    email: member.email,
    phone: member.phone || '',
    jobTitle: member.jobTitle || '',
    department: member.department || '',
    location: member.location || '',
    role: member.role,
    status: member.status,
  });

  const handleCopy = (text: string, type: 'userId' | 'password' | 'email' | 'all') => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        if (type === 'userId') setCopiedUserId(true);
        else if (type === 'password') setCopiedPassword(true);
        else if (type === 'email') setCopiedEmail(true);
        else if (type === 'all') setCopiedAllText(true);
        
        setTimeout(() => {
          if (type === 'userId') setCopiedUserId(false);
          else if (type === 'password') setCopiedPassword(false);
          else if (type === 'email') setCopiedEmail(false);
          else if (type === 'all') setCopiedAllText(false);
        }, 2000);
      });
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        if (type === 'userId') setCopiedUserId(true);
        else if (type === 'password') setCopiedPassword(true);
        else if (type === 'email') setCopiedEmail(true);
        else if (type === 'all') setCopiedAllText(true);
        
        setTimeout(() => {
          if (type === 'userId') setCopiedUserId(false);
          else if (type === 'password') setCopiedPassword(false);
          else if (type === 'email') setCopiedEmail(false);
          else if (type === 'all') setCopiedAllText(false);
        }, 2000);
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      document.body.removeChild(textarea);
    }
  };

  const getRoleBadgeInModal = (role: string) => {
    const badges = {
      owner: { icon: Crown, color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      admin: { icon: Shield, color: 'bg-purple-100 text-purple-800 border-purple-300' },
      editor: { icon: Edit, color: 'bg-blue-100 text-blue-800 border-blue-300' },
      creator: { icon: Activity, color: 'bg-green-100 text-green-800 border-green-300' },
      viewer: { icon: Eye, color: 'bg-gray-100 text-gray-800 border-gray-300' },
    };

    const badge = badges[role as keyof typeof badges] || badges.viewer;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium border ${badge.color}`}>
        <Icon className="size-4" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getStatusBadgeInModal = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-300',
      invited: 'bg-blue-100 text-blue-800 border-blue-300',
      inactive: 'bg-gray-100 text-gray-800 border-gray-300',
    };

    return (
      <span className={`px-3 py-1.5 rounded-md text-sm font-medium border ${colors[status as keyof typeof colors]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleEditMember = () => {
    setIsEditingMember(true);
  };

  const handleCancelEditMember = () => {
    // Reset to original values
    setEditableMemberData({
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      jobTitle: member.jobTitle || '',
      department: member.department || '',
      location: member.location || '',
      role: member.role,
      status: member.status,
    });
    setIsEditingMember(false);
  };

  const handleSaveMember = () => {
    // Here you would typically save to backend/database
    console.log('Saving member data:', editableMemberData);
    setIsEditingMember(false);
    // Optionally call a callback to update the parent component
  };

  const updateMemberField = (field: string, value: string) => {
    setEditableMemberData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const credentialsText = `Member Login Credentials

Name: ${member.name}
Email: ${member.email}
User ID: ${member.userId || 'N/A'}
Auth Method: Secure Passwordless OTP

Please keep this information secure.`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                {editableMemberData.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{editableMemberData.name}</h2>
                <p className="text-blue-100 text-sm">{editableMemberData.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isEditingMember ? (
                <>
                  <Button
                    onClick={handleEditMember}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    <Edit className="size-4 mr-1" />
                    Edit
                  </Button>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="size-6 text-white" />
                  </button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleCancelEditMember}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveMember}
                    size="sm"
                    className="bg-white text-blue-600 hover:bg-blue-50"
                  >
                    <Check className="size-4 mr-1" />
                    Save Changes
                  </Button>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="size-6 text-white" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Status and Role */}
            {!isEditingMember ? (
              <div className="flex items-center gap-3">
                {getStatusBadgeInModal(editableMemberData.status)}
                {getRoleBadgeInModal(editableMemberData.role)}
              </div>
            ) : (
              <div className="bg-white border rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Status</Label>
                    <Select
                      value={editableMemberData.status}
                      onValueChange={(value) => updateMemberField('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="invited">Invited</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Role</Label>
                    <Select
                      value={editableMemberData.role}
                      onValueChange={(value) => updateMemberField('role', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="creator">Creator</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* User ID Section */}
            {member.userId && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-700 font-medium mb-1">User ID</p>
                    <p className="text-lg font-mono font-bold text-blue-900">{member.userId}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(member.userId!, 'userId')}
                  >
                    {copiedUserId ? (
                      <Check className="size-4 mr-1 text-green-600" />
                    ) : (
                      <Copy className="size-4 mr-1" />
                    )}
                    {copiedUserId ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 border-b">
                <div className="flex items-center gap-2">
                  <UserCircle className="size-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Basic Information</h4>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between py-2">
                  <div className="flex items-center gap-2">
                    <UserCircle className="size-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Name:</span>
                  </div>
                  {isEditingMember ? (
                    <Input
                      value={editableMemberData.name}
                      onChange={(e) => updateMemberField('name', e.target.value)}
                      className="max-w-xs text-sm"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 font-medium">{editableMemberData.name}</span>
                  )}
                </div>
                <div className="flex items-start justify-between py-2 border-t">
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Email:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditingMember ? (
                      <Input
                        type="email"
                        value={editableMemberData.email}
                        onChange={(e) => updateMemberField('email', e.target.value)}
                        className="max-w-xs text-sm"
                      />
                    ) : (
                      <>
                        <span className="text-sm text-gray-900 font-medium">{editableMemberData.email}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                          onClick={() => handleCopy(editableMemberData.email, 'email')}
                        >
                          {copiedEmail ? (
                            <Check className="size-3 text-green-600" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-start justify-between py-2 border-t">
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Phone:</span>
                  </div>
                  {isEditingMember ? (
                    <Input
                      type="tel"
                      value={editableMemberData.phone}
                      onChange={(e) => updateMemberField('phone', e.target.value)}
                      className="max-w-xs text-sm"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{editableMemberData.phone || 'Not provided'}</span>
                  )}
                </div>
                <div className="flex items-start justify-between py-2 border-t">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Joined:</span>
                  </div>
                  <span className="text-sm text-gray-900">
                    {new Date(member.joinedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex items-start justify-between py-2 border-t">
                  <div className="flex items-center gap-2">
                    <Activity className="size-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Last Active:</span>
                  </div>
                  <span className="text-sm text-gray-900">
                    {new Date(member.lastActive).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-4 py-3 border-b">
                <div className="flex items-center gap-2">
                  <Briefcase className="size-5 text-purple-600" />
                  <h4 className="font-semibold text-gray-900">Job Details</h4>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="size-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Job Title:</span>
                  </div>
                  {isEditingMember ? (
                    <Input
                      value={editableMemberData.jobTitle}
                      onChange={(e) => updateMemberField('jobTitle', e.target.value)}
                      className="max-w-xs text-sm"
                      placeholder="Enter job title"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{editableMemberData.jobTitle || 'Not provided'}</span>
                  )}
                </div>
                <div className="flex items-start justify-between py-2 border-t">
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Department:</span>
                  </div>
                  {isEditingMember ? (
                    <Input
                      value={editableMemberData.department}
                      onChange={(e) => updateMemberField('department', e.target.value)}
                      className="max-w-xs text-sm"
                      placeholder="Enter department"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{editableMemberData.department || 'Not provided'}</span>
                  )}
                </div>
                <div className="flex items-start justify-between py-2 border-t">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Location:</span>
                  </div>
                  {isEditingMember ? (
                    <Input
                      value={editableMemberData.location}
                      onChange={(e) => updateMemberField('location', e.target.value)}
                      className="max-w-xs text-sm"
                      placeholder="Enter location"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{editableMemberData.location || 'Not provided'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Login Credentials */}
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-green-100 px-4 py-3 border-b">
                <div className="flex items-center gap-2">
                  <Lock className="size-5 text-green-600" />
                  <h4 className="font-semibold text-gray-900">Login Credentials</h4>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Lock className="size-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Auth Method:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-green-700 bg-green-50 px-3 py-1 rounded font-semibold">
                      Secure Passwordless OTP
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleCopy(credentialsText, 'all')}
                  >
                    {copiedAllText ? (
                      <Check className="size-4 mr-2 text-green-600" />
                    ) : (
                      <Copy className="size-4 mr-2" />
                    )}
                    {copiedAllText ? 'Credentials Copied!' : 'Copy All Credentials'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Permissions */}
            {member.permissions && member.permissions.length > 0 && (
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-4 py-3 border-b">
                  <div className="flex items-center gap-2">
                    <Shield className="size-5 text-orange-600" />
                    <h4 className="font-semibold text-gray-900">Module Permissions</h4>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    {member.permissions.map((perm: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                        <span className="text-sm font-medium text-gray-700">{perm.module}</span>
                        <div className="flex items-center gap-2">
                          {perm.fullAccess && (
                            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">Full Access</span>
                          )}
                          {!perm.fullAccess && perm.creator && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Creator</span>
                          )}
                          {!perm.fullAccess && perm.editor && (
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Editor</span>
                          )}
                          {!perm.fullAccess && perm.viewer && (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">Viewer</span>
                          )}
                          {!perm.fullAccess && !perm.creator && !perm.editor && !perm.viewer && (
                            <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">No Access</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}