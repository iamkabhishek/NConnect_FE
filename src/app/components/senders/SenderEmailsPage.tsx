import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ModuleLayout } from '@/app/components/layout/ModuleLayout';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';
import { Button } from '@/app/components/ui/button';
import {
  Mail,
  Plus,
  Search,
  MoreVertical,
  X,
  Shield,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Star,
  Copy,
  Check,
  RefreshCw,
  Settings,
  Eye,
  XCircle,
} from 'lucide-react';

interface SenderEmail {
  id: string;
  email: string;
  displayName: string;
  replyTo?: string;
  isVerified: boolean;
  isDefault: boolean;
  dateAdded: string;
  lastUsed: string;
  campaignsSent: number;
  workflowsUsing: number;
  workspaceId?: string;
  verificationRecords?: {
    spf: string;
    dkim: string;
    dmarc: string;
  };
}

interface SenderEmailsPageProps {
  onNavigate: (page: string) => void;
  userName?: string;
}

export function SenderEmailsPage({
  onNavigate,
  userName = 'John Doe',
}: SenderEmailsPageProps) {
  const { selectedWorkspace } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedSender, setSelectedSender] = useState<SenderEmail | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Add/Edit form state
  const [formEmail, setFormEmail] = useState('');
  const [formDisplayName, setFormDisplayName] = useState('');
  const [formReplyTo, setFormReplyTo] = useState('');
  const [formSetAsDefault, setFormSetAsDefault] = useState(false);

  // Move allSenders outside to prevent recreation
  const allSenders: SenderEmail[] = useMemo(() => [
    {
      id: 'SND-001',
      email: 'support@nconnect.com',
      displayName: 'Support Team',
      replyTo: 'support@nconnect.com',
      isVerified: true,
      isDefault: true,
      workspaceId: 'workspace-1',
      dateAdded: '2024-01-15',
      lastUsed: '2 hours ago',
      campaignsSent: 45,
      workflowsUsing: 3,
      verificationRecords: {
        spf: 'v=spf1 include:_spf.nconnect.com ~all',
        dkim: 'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...',
        dmarc: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@nconnect.com',
      },
    },
    {
      id: 'SND-002',
      email: 'hello@nconnect.com',
      displayName: 'Hello',
      replyTo: 'hello@nconnect.com',
      isVerified: true,
      isDefault: false,
      dateAdded: '2024-02-10',
      lastUsed: '1 day ago',
      campaignsSent: 28,
      workflowsUsing: 2,
      workspaceId: 'workspace-1',
      verificationRecords: {
        spf: 'v=spf1 include:_spf.nconnect.com ~all',
        dkim: 'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...',
        dmarc: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@nconnect.com',
      },
    },
    {
      id: 'SND-003',
      email: 'marketing@nconnect.com',
      displayName: 'Marketing',
      replyTo: 'marketing@nconnect.com',
      isVerified: true,
      isDefault: false,
      dateAdded: '2024-02-20',
      lastUsed: '3 days ago',
      campaignsSent: 15,
      workflowsUsing: 1,
      workspaceId: 'workspace-2',
      verificationRecords: {
        spf: 'v=spf1 include:_spf.nconnect.com ~all',
        dkim: 'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...',
        dmarc: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@nconnect.com',
      },
    },
    {
      id: 'SND-004',
      email: 'john@company.com',
      displayName: 'John Doe',
      replyTo: 'john@company.com',
      isVerified: false,
      isDefault: false,
      dateAdded: '2024-03-15',
      lastUsed: 'Never',
      campaignsSent: 0,
      workflowsUsing: 0,
      workspaceId: 'workspace-1',
      verificationRecords: {
        spf: 'v=spf1 include:_spf.nconnect.com ~all',
        dkim: 'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...',
        dmarc: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@nconnect.com',
      },
    },
    {
      id: 'SND-005',
      email: 'sales@company.com',
      displayName: 'Sales Team',
      replyTo: 'sales@company.com',
      isVerified: false,
      isDefault: false,
      dateAdded: '2024-03-20',
      lastUsed: 'Never',
      campaignsSent: 0,
      workflowsUsing: 0,
      workspaceId: 'workspace-2',
      verificationRecords: {
        spf: 'v=spf1 include:_spf.nconnect.com ~all',
        dkim: 'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...',
        dmarc: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@nconnect.com',
      },
    },
  ], []);

  const [senders, setSenders] = useState<SenderEmail[]>([]);

  // Filter senders by workspace
  useEffect(() => {
    const workspaceSenders = allSenders.filter(s => s.workspaceId === selectedWorkspace?.id);
    setSenders(workspaceSenders);
  }, [selectedWorkspace?.id, allSenders]);

  const filteredSenders = senders.filter(
    (sender) =>
      sender.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sender.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const verifiedCount = senders.filter((s) => s.isVerified).length;
  const unverifiedCount = senders.filter((s) => !s.isVerified).length;
  const totalCampaigns = senders.reduce((sum, s) => sum + s.campaignsSent, 0);

  const handleAddSender = () => {
    if (formEmail.trim() && formDisplayName.trim()) {
      const newSender: SenderEmail = {
        id: `SND-${String(senders.length + 1).padStart(3, '0')}`,
        email: formEmail.trim(),
        displayName: formDisplayName.trim(),
        replyTo: formReplyTo.trim() || formEmail.trim(),
        isVerified: false,
        isDefault: formSetAsDefault && senders.length === 0,
        dateAdded: new Date().toISOString().split('T')[0],
        lastUsed: 'Never',
        campaignsSent: 0,
        workflowsUsing: 0,
        verificationRecords: {
          spf: 'v=spf1 include:_spf.nconnect.com ~all',
          dkim: 'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...',
          dmarc: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@nconnect.com',
        },
      };

      if (formSetAsDefault) {
        setSenders(
          senders.map((s) => ({ ...s, isDefault: false })).concat(newSender)
        );
      } else {
        setSenders([...senders, newSender]);
      }

      resetForm();
      setShowAddModal(false);
    }
  };

  const handleEditSender = () => {
    if (selectedSender && formEmail.trim() && formDisplayName.trim()) {
      setSenders(
        senders.map((s) => {
          if (s.id === selectedSender.id) {
            return {
              ...s,
              email: formEmail.trim(),
              displayName: formDisplayName.trim(),
              replyTo: formReplyTo.trim() || formEmail.trim(),
              isDefault: formSetAsDefault ? true : s.isDefault,
            };
          }
          return formSetAsDefault ? { ...s, isDefault: false } : s;
        })
      );
      resetForm();
      setShowEditModal(false);
      setSelectedSender(null);
    }
  };

  const handleSetDefault = (senderId: string) => {
    setSenders(
      senders.map((s) => ({
        ...s,
        isDefault: s.id === senderId,
      }))
    );
    setOpenDropdown(null);
  };

  const handleDeleteSender = (senderId: string) => {
    const sender = senders.find((s) => s.id === senderId);
    if (sender?.isDefault) {
      alert('Cannot delete the default sender. Please set another sender as default first.');
      return;
    }
    if (confirm('Are you sure you want to delete this sender email?')) {
      setSenders(senders.filter((s) => s.id !== senderId));
      setOpenDropdown(null);
    }
  };

  const handleVerify = (sender: SenderEmail) => {
    setSelectedSender(sender);
    setShowVerificationModal(true);
    setOpenDropdown(null);
  };

  const handleCheckVerification = () => {
    if (selectedSender) {
      // Simulate verification check
      setSenders(
        senders.map((s) =>
          s.id === selectedSender.id ? { ...s, isVerified: true } : s
        )
      );
      alert('Email verified successfully!');
      setShowVerificationModal(false);
    }
  };

  const openEditModal = (sender: SenderEmail) => {
    setSelectedSender(sender);
    setFormEmail(sender.email);
    setFormDisplayName(sender.displayName);
    setFormReplyTo(sender.replyTo || '');
    setFormSetAsDefault(sender.isDefault);
    setShowEditModal(true);
    setOpenDropdown(null);
  };

  const resetForm = () => {
    setFormEmail('');
    setFormDisplayName('');
    setFormReplyTo('');
    setFormSetAsDefault(false);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  useEffect(() => {
    const currentRef = dropdownButtonRefs.current[openDropdown || ''];
    if (currentRef) {
      const rect = currentRef.getBoundingClientRect();
      setDropdownPosition({ top: rect.bottom, left: rect.left });
    }
  }, [openDropdown]);

  return (
    <ModuleLayout activeItem="sender-emails" userName={userName} onNavigate={onNavigate}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Mail className="size-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sender Emails
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage and verify sender email addresses for your campaigns and workflows
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="size-4 mr-2" />
            Add Sender Email
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 text-sm font-medium">Total Senders</span>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{senders.length}</div>
            <p className="text-xs text-gray-500 mt-1">Active sender addresses</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 text-sm font-medium">Verified</span>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600">{verifiedCount}</div>
            <p className="text-xs text-gray-500 mt-1">Ready to send emails</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 text-sm font-medium">Unverified</span>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-orange-600">{unverifiedCount}</div>
            <p className="text-xs text-gray-500 mt-1">Pending verification</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 text-sm font-medium">Campaigns Sent</span>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{totalCampaigns}</div>
            <p className="text-xs text-gray-500 mt-1">Total campaigns delivered</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email or display name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Senders Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sender Information
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Verification Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Usage Stats
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSenders.map((sender) => (
                  <tr key={sender.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900 truncate">
                              {sender.displayName}
                            </p>
                            {sender.isDefault && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full flex-shrink-0">
                                <Star className="w-3 h-3 fill-current" />
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">{sender.email}</p>
                          {sender.replyTo && sender.replyTo !== sender.email && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              Reply-to: {sender.replyTo}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {sender.isVerified ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200">
                          <CheckCircle className="w-4 h-4" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-700 text-sm font-medium rounded-lg border border-orange-200">
                          <AlertCircle className="w-4 h-4" />
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-900 font-medium">
                            {sender.campaignsSent}
                          </span>
                          <span className="text-gray-500">campaigns</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-gray-900 font-medium">
                            {sender.workflowsUsing}
                          </span>
                          <span className="text-gray-500">workflows</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900 font-medium">
                          {sender.lastUsed}
                        </p>
                        <p className="text-xs text-gray-500">
                          Added {new Date(sender.dateAdded).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="relative inline-block">
                        <button
                          ref={(ref) => (dropdownButtonRefs.current[sender.id] = ref)}
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === sender.id ? null : sender.id
                            )
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>

                        {openDropdown === sender.id && createPortal(
                          <>
                            <div
                              className="fixed inset-0"
                              style={{ zIndex: 9998 }}
                              onClick={() => setOpenDropdown(null)}
                            />
                            <div 
                              className="fixed w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                              style={{ 
                                zIndex: 9999, 
                                top: `${dropdownPosition.top + 8}px`, 
                                left: `${dropdownPosition.left - 192}px`  // 192px = w-48
                              }}
                            >
                              {!sender.isVerified && (
                                <button
                                  onClick={() => handleVerify(sender)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Shield className="size-4" />
                                  Verify Email
                                </button>
                              )}
                              {sender.isVerified && (
                                <button
                                  onClick={() => handleVerify(sender)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Eye className="size-4" />
                                  View DNS Records
                                </button>
                              )}
                              {!sender.isDefault && (
                                <button
                                  onClick={() => handleSetDefault(sender.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Star className="size-4" />
                                  Set as Default
                                </button>
                              )}
                              <button
                                onClick={() => openEditModal(sender)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Edit className="size-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteSender(sender.id)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="size-4" />
                                Delete
                              </button>
                            </div>
                          </>,
                          document.body
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredSenders.length === 0 && (
              <div className="text-center py-12">
                <Mail className="size-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No sender emails found</p>
                <p className="text-sm text-gray-500 mt-1">
                  {searchQuery
                    ? 'Try adjusting your search'
                    : 'Add your first sender email to get started'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Sender Modal */}
      {showAddModal && (
        <>
          {createPortal(
            <div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
              style={{ zIndex: 9999 }}
            >
              <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Add Sender Email</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Configure a new sender email address
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="support@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Display Name *
                    </label>
                    <input
                      type="text"
                      value={formDisplayName}
                      onChange={(e) => setFormDisplayName(e.target.value)}
                      placeholder="e.g., Support Team"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      This name will appear in the "From" field
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Reply-To Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={formReplyTo}
                      onChange={(e) => setFormReplyTo(e.target.value)}
                      placeholder="Leave empty to use same as sender"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {senders.length > 0 && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="setAsDefault"
                        checked={formSetAsDefault}
                        onChange={(e) => setFormSetAsDefault(e.target.checked)}
                        className="size-4 text-blue-600 rounded"
                      />
                      <label htmlFor="setAsDefault" className="text-sm text-gray-700">
                        Set as default sender for this workspace
                      </label>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900 font-medium mb-1">
                      📧 Email Verification Required
                    </p>
                    <p className="text-sm text-blue-800">
                      After adding, you'll need to verify this email by adding DNS records to
                      your domain.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-6 border-t bg-gray-50">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddSender}
                    disabled={!formEmail.trim() || !formDisplayName.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Add Sender Email
                  </Button>
                </div>
              </div>
            </div>,
            document.body
          )}
        </>
      )}

      {/* Edit Sender Modal */}
      {showEditModal && selectedSender && (
        <>
          {createPortal(
            <div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
              style={{ zIndex: 9999 }}
            >
              <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Edit Sender Email</h3>
                    <p className="text-sm text-gray-600 mt-1">Update sender information</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedSender(null);
                      resetForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="support@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Display Name *
                    </label>
                    <input
                      type="text"
                      value={formDisplayName}
                      onChange={(e) => setFormDisplayName(e.target.value)}
                      placeholder="e.g., Support Team"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Reply-To Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={formReplyTo}
                      onChange={(e) => setFormReplyTo(e.target.value)}
                      placeholder="Leave empty to use same as sender"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {!selectedSender.isDefault && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="editSetAsDefault"
                        checked={formSetAsDefault}
                        onChange={(e) => setFormSetAsDefault(e.target.checked)}
                        className="size-4 text-blue-600 rounded"
                      />
                      <label htmlFor="editSetAsDefault" className="text-sm text-gray-700">
                        Set as default sender for this workspace
                      </label>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 p-6 border-t bg-gray-50">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedSender(null);
                      resetForm();
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEditSender}
                    disabled={!formEmail.trim() || !formDisplayName.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>,
            document.body
          )}
        </>
      )}

      {/* Verification Modal */}
      {showVerificationModal && selectedSender && (
        <>
          {createPortal(
            <div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
              style={{ zIndex: 9999 }}
            >
              <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Email Verification</h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedSender.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowVerificationModal(false);
                      setSelectedSender(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Status */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {selectedSender.isVerified ? (
                          <>
                            <CheckCircle className="size-6 text-green-600" />
                            <div>
                              <p className="font-semibold text-gray-900">Verified</p>
                              <p className="text-sm text-gray-600">
                                This email is verified and ready to use
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="size-6 text-orange-600" />
                            <div>
                              <p className="font-semibold text-gray-900">Not Verified</p>
                              <p className="text-sm text-gray-600">
                                Add the DNS records below to verify
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                      {!selectedSender.isVerified && (
                        <Button
                          onClick={handleCheckVerification}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <RefreshCw className="size-4" />
                          Check Status
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Verification Instructions
                    </h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                      <li>Log in to your domain registrar or DNS provider</li>
                      <li>Add the DNS records shown below</li>
                      <li>Wait for DNS propagation (can take up to 48 hours)</li>
                      <li>Click "Check Status" to verify the records</li>
                    </ol>
                  </div>

                  {/* SPF Record */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">SPF Record</h4>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            selectedSender.verificationRecords?.spf || '',
                            'spf'
                          )
                        }
                        className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        {copiedField === 'spf' ? (
                          <>
                            <Check className="size-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="size-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      {selectedSender.verificationRecords?.spf}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <span className="ml-2 font-medium text-gray-900">TXT</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Host:</span>
                        <span className="ml-2 font-medium text-gray-900">@</span>
                      </div>
                    </div>
                  </div>

                  {/* DKIM Record */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">DKIM Record</h4>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            selectedSender.verificationRecords?.dkim || '',
                            'dkim'
                          )
                        }
                        className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        {copiedField === 'dkim' ? (
                          <>
                            <Check className="size-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="size-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      {selectedSender.verificationRecords?.dkim}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <span className="ml-2 font-medium text-gray-900">TXT</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Host:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          default._domainkey
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* DMARC Record */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">DMARC Record</h4>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            selectedSender.verificationRecords?.dmarc || '',
                            'dmarc'
                          )
                        }
                        className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        {copiedField === 'dmarc' ? (
                          <>
                            <Check className="size-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="size-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      {selectedSender.verificationRecords?.dmarc}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <span className="ml-2 font-medium text-gray-900">TXT</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Host:</span>
                        <span className="ml-2 font-medium text-gray-900">_dmarc</span>
                      </div>
                    </div>
                  </div>

                  {/* Help */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-blue-900 mb-1">Need Help?</p>
                    <p className="text-sm text-blue-800">
                      DNS records help verify you own this domain and improve email
                      deliverability. Contact your domain provider if you need assistance
                      adding these records.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-6 border-t bg-gray-50 sticky bottom-0">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowVerificationModal(false);
                      setSelectedSender(null);
                    }}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  {!selectedSender.isVerified && (
                    <Button
                      onClick={handleCheckVerification}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <RefreshCw className="size-4 mr-2" />
                      Check Verification Status
                    </Button>
                  )}
                </div>
              </div>
            </div>,
            document.body
          )}
        </>
      )}
    </ModuleLayout>
  );
}