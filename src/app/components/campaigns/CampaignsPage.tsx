import { useState, useEffect } from 'react';
import { ModuleLayout } from '@/app/components/layout/ModuleLayout';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Search,
  Plus,
  MoreVertical,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Copy,
  Trash2,
  Calendar,
  Users,
  Mail,
  TrendingUp,
  Edit,
  Archive,
  ChevronDown,
  FileText,
  Zap,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

// Sample campaign data
const SAMPLE_CAMPAIGNS = [
  {
    id: '1',
    campaignId: 'My Workspace-C001',
    name: 'Welcome Series - Week 1',
    subject: 'Welcome to NConnect! Get Started',
    status: 'sent',
    template: 'Modern Welcome',
    recipients: 1250,
    sent: 1250,
    opens: 687,
    clicks: 234,
    scheduledDate: '2024-01-10T09:00:00',
    sentDate: '2024-01-10T09:00:00',
    createdAt: '2024-01-08T14:30:00',
    workspaceId: 'workspace-1',
  },
  {
    id: '2',
    campaignId: 'My Workspace-C002',
    name: 'Monthly Newsletter - January',
    subject: 'Your January Newsletter is Here!',
    status: 'scheduled',
    template: 'Classic Newsletter',
    recipients: 3420,
    scheduledDate: '2024-01-20T10:00:00',
    createdAt: '2024-01-15T11:20:00',
    workspaceId: 'workspace-1',
  },
  {
    id: '3',
    campaignId: 'My Workspace-C003',
    name: 'Flash Sale - Weekend Special',
    subject: '🔥 48-Hour Flash Sale - Up to 50% Off',
    status: 'draft',
    template: 'Bold Promotion',
    recipients: 2100,
    createdAt: '2024-01-16T16:45:00',
    workspaceId: 'workspace-2',
  },
  {
    id: '4',
    campaignId: 'My Workspace-C004',
    name: 'Product Launch Announcement',
    subject: 'Introducing Our Latest Innovation',
    status: 'sent',
    template: 'Minimal Promo',
    recipients: 4200,
    sent: 4200,
    opens: 2310,
    clicks: 892,
    sentDate: '2024-01-05T08:00:00',
    createdAt: '2024-01-03T10:15:00',
    workspaceId: 'workspace-1',
  },
  {
    id: '5',
    campaignId: 'My Workspace-C005',
    name: 'Re-engagement Campaign',
    subject: "We Miss You! Here's 20% Off",
    status: 'failed',
    template: 'Bold Promotion',
    recipients: 850,
    sent: 620,
    createdAt: '2024-01-12T13:00:00',
    workspaceId: 'workspace-2',
  },
];

type CampaignStatus = 'draft' | 'scheduled' | 'sent' | 'failed';

type CampaignCreationType = 'scratch' | 'template' | 'quick';

interface CampaignsPageProps {
  userName?: string;
  onCreateCampaign?: (type?: CampaignCreationType) => void;
  onViewCampaign?: (id: string) => void;
  onEditCampaign?: (id: string) => void;
  onNavigate?: (page: string) => void;
}

export function CampaignsPage({ userName = 'John Doe', onCreateCampaign, onViewCampaign, onEditCampaign, onNavigate }: CampaignsPageProps) {
  const { selectedWorkspace } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all');
  const [selectedStatCard, setSelectedStatCard] = useState<'all' | 'sent' | 'scheduled' | 'draft'>('all');
  
  // Filter campaigns by workspace
  const workspaceCampaigns = SAMPLE_CAMPAIGNS.filter(c => c.workspaceId === selectedWorkspace?.id);
  const [campaigns, setCampaigns] = useState(workspaceCampaigns);
  const [archivedCampaigns, setArchivedCampaigns] = useState<string[]>([]);
  const [showArchived, setShowArchived] = useState(false);

  // Update campaigns when workspace changes
  useEffect(() => {
    const workspaceCampaigns = SAMPLE_CAMPAIGNS.filter(c => c.workspaceId === selectedWorkspace?.id);
    setCampaigns(workspaceCampaigns);
  }, [selectedWorkspace?.id]);

  // Sync selectedStatCard with statusFilter
  useEffect(() => {
    if (selectedStatCard === 'all') {
      setStatusFilter('all');
      setShowArchived(false);
    } else if (selectedStatCard === 'sent') {
      setStatusFilter('sent');
      setShowArchived(false);
    } else if (selectedStatCard === 'scheduled') {
      setStatusFilter('scheduled');
      setShowArchived(false);
    } else if (selectedStatCard === 'draft') {
      setStatusFilter('draft');
      setShowArchived(false);
    }
  }, [selectedStatCard]);

  const handleCreateCampaign = () => {
    if (onCreateCampaign) {
      onCreateCampaign();
    }
  };

  const handleCreateFromScratch = () => {
    // Standard campaign creation flow - all 5 steps
    if (onCreateCampaign) {
      onCreateCampaign('scratch');
    }
  };

  const handleCreateUseTemplate = () => {
    // Template-first campaign creation - shows template selector first
    if (onCreateCampaign) {
      onCreateCampaign('template');
    }
  };

  const handleCreateQuickCampaign = () => {
    // Quick campaign creation - simplified 3-step flow
    if (onCreateCampaign) {
      onCreateCampaign('quick');
    }
  };

  const handleViewCampaign = (id: string) => {
    if (onViewCampaign) {
      onViewCampaign(id);
    }
  };

  const handleEditCampaign = (id: string) => {
    if (onEditCampaign) {
      onEditCampaign(id);
    }
  };

  const handleDuplicate = (id: string) => {
    const originalCampaign = campaigns.find((c) => c.id === id);
    if (!originalCampaign) return;

    // Generate next campaign ID
    const campaignNumbers = campaigns
      .map((c) => {
        const match = c.campaignId.match(/C(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((num) => !isNaN(num));
    const nextNumber = Math.max(...campaignNumbers, 0) + 1;
    const newCampaignId = `${selectedWorkspace?.name}-C${String(nextNumber).padStart(3, '0')}`;

    // Create duplicate
    const newCampaign = {
      ...originalCampaign,
      id: Date.now().toString(), // Generate unique ID
      campaignId: newCampaignId,
      name: `${originalCampaign.name} (Copy)`,
      status: 'draft' as CampaignStatus,
      createdAt: new Date().toISOString(),
      // Reset campaign-specific data
      sent: undefined,
      opens: undefined,
      clicks: undefined,
      sentDate: undefined,
    };

    // Add to campaigns
    setCampaigns((prev) => [...prev, newCampaign]);

    // Navigate to edit
    if (onEditCampaign) {
      onEditCampaign(newCampaign.id);
    }
  };

  const handleArchive = (id: string) => {
    setArchivedCampaigns((prev) => [...prev, id]);
    console.log('Archive campaign:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete campaign:', id);
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    
    // If showing archived, only show archived campaigns
    // If not showing archived, only show non-archived campaigns
    const matchesArchiveFilter = showArchived 
      ? archivedCampaigns.includes(campaign.id)
      : !archivedCampaigns.includes(campaign.id);
    
    return matchesSearch && matchesStatus && matchesArchiveFilter;
  });

  const getStatusBadge = (status: CampaignStatus) => {
    const statusConfig = {
      draft: {
        icon: Clock,
        text: 'Draft',
        className: 'bg-gray-100 text-gray-700 border-gray-300',
      },
      scheduled: {
        icon: Calendar,
        text: 'Scheduled',
        className: 'bg-blue-100 text-blue-700 border-blue-300',
      },
      sent: {
        icon: CheckCircle,
        text: 'Sent',
        className: 'bg-green-100 text-green-700 border-green-300',
      },
      failed: {
        icon: XCircle,
        text: 'Failed',
        className: 'bg-red-100 text-red-700 border-red-300',
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
      >
        <Icon className="size-3" />
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateOpenRate = (opens: number, sent: number) => {
    if (!sent) return 0;
    return Math.round((opens / sent) * 100);
  };

  const calculateClickRate = (clicks: number, sent: number) => {
    if (!sent) return 0;
    return Math.round((clicks / sent) * 100);
  };

  // Calculate summary stats
  const stats = {
    total: campaigns.length,
    sent: campaigns.filter((c) => c.status === 'sent').length,
    scheduled: campaigns.filter((c) => c.status === 'scheduled').length,
    draft: campaigns.filter((c) => c.status === 'draft').length,
  };

  return (
    <ModuleLayout activeItem="campaigns" userName={userName} onNavigate={onNavigate}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
              <p className="text-gray-600 mt-1">
                Create and manage your email campaigns
              </p>
            </div>
            <Button 
              onClick={handleCreateFromScratch}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="size-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div
            className={`bg-white rounded-lg border p-4 cursor-pointer transition-all ${
              selectedStatCard === 'all'
                ? 'border-blue-500 shadow-md ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
            }`}
            onClick={() => setSelectedStatCard('all')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="size-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div
            className={`bg-white rounded-lg border p-4 cursor-pointer transition-all ${
              selectedStatCard === 'sent'
                ? 'border-green-500 shadow-md ring-2 ring-green-200'
                : 'border-gray-200 hover:border-green-300 hover:shadow-sm'
            }`}
            onClick={() => setSelectedStatCard('sent')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sent</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.sent}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="size-6 text-green-600" />
              </div>
            </div>
          </div>

          <div
            className={`bg-white rounded-lg border p-4 cursor-pointer transition-all ${
              selectedStatCard === 'scheduled'
                ? 'border-blue-500 shadow-md ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
            }`}
            onClick={() => setSelectedStatCard('scheduled')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.scheduled}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="size-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div
            className={`bg-white rounded-lg border p-4 cursor-pointer transition-all ${
              selectedStatCard === 'draft'
                ? 'border-gray-500 shadow-md ring-2 ring-gray-200'
                : 'border-gray-200 hover:border-gray-400 hover:shadow-sm'
            }`}
            onClick={() => setSelectedStatCard('draft')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.draft}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Clock className="size-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setStatusFilter('all');
                  setShowArchived(false);
                }}
                className={statusFilter === 'all' && !showArchived ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'draft' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setStatusFilter('draft');
                  setShowArchived(false);
                }}
                className={statusFilter === 'draft' && !showArchived ? 'bg-gray-600 hover:bg-gray-700' : ''}
              >
                Draft
              </Button>
              <Button
                variant={statusFilter === 'scheduled' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setStatusFilter('scheduled');
                  setShowArchived(false);
                }}
                className={
                  statusFilter === 'scheduled' && !showArchived ? 'bg-blue-600 hover:bg-blue-700' : ''
                }
              >
                Scheduled
              </Button>
              <Button
                variant={statusFilter === 'sent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setStatusFilter('sent');
                  setShowArchived(false);
                }}
                className={statusFilter === 'sent' && !showArchived ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Sent
              </Button>
              <Button
                variant={statusFilter === 'failed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setStatusFilter('failed');
                  setShowArchived(false);
                }}
                className={statusFilter === 'failed' && !showArchived ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                Failed
              </Button>

              {/* Separator */}
              <div className="w-px bg-gray-300 mx-1" />

              {/* Archive Filter */}
              <Button
                variant={showArchived ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setShowArchived(!showArchived);
                  setStatusFilter('all');
                }}
                className={showArchived ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                <Archive className="size-4 mr-1" />
                Archived {archivedCampaigns.length > 0 && `(${archivedCampaigns.length})`}
              </Button>
            </div>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {filteredCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <Send className="size-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || statusFilter !== 'all'
                  ? 'No campaigns found'
                  : 'No campaigns yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first campaign to get started'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Button
                  onClick={handleCreateCampaign}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="size-4 mr-2" />
                  Create Campaign
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Campaign Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {campaign.name}
                        </h3>
                        <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                          {campaign.campaignId}
                        </span>
                        {getStatusBadge(campaign.status)}
                      </div>

                      <p className="text-sm text-gray-600 mb-3 truncate">
                        <Mail className="size-3 inline mr-1" />
                        Subject: {campaign.subject}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="size-3.5" />
                          {campaign.recipients.toLocaleString()} recipients
                        </span>

                        {campaign.status === 'scheduled' && campaign.scheduledDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3.5" />
                            Scheduled: {formatDate(campaign.scheduledDate)}
                          </span>
                        )}

                        {campaign.status === 'sent' && campaign.sentDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3.5" />
                            Sent: {formatDate(campaign.sentDate)}
                          </span>
                        )}
                      </div>

                      {/* Stats for sent campaigns */}
                      {campaign.status === 'sent' && campaign.sent && (
                        <div className="flex items-center gap-6 mt-3 pt-3 border-t">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="size-4 text-green-600" />
                            <div>
                              <p className="text-xs text-gray-500">Open Rate</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {calculateOpenRate(campaign.opens || 0, campaign.sent)}%
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="size-4 text-blue-600" />
                            <div>
                              <p className="text-xs text-gray-500">Click Rate</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {calculateClickRate(campaign.clicks || 0, campaign.sent)}%
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Opens</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {campaign.opens?.toLocaleString() || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Clicks</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {campaign.clicks?.toLocaleString() || 0}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewCampaign(campaign.id)}
                      >
                        <Eye className="size-4 mr-1" />
                        View
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* Edit - Show for Draft and Scheduled campaigns only */}
                          {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                            <DropdownMenuItem onClick={() => handleEditCampaign(campaign.id)}>
                              <Edit className="size-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuItem onClick={() => handleDuplicate(campaign.id)}>
                            <Copy className="size-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          
                          {/* Archive - Show for Sent campaigns only */}
                          {campaign.status === 'sent' && !archivedCampaigns.includes(campaign.id) && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleArchive(campaign.id)}>
                                <Archive className="size-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                            </>
                          )}
                          
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(campaign.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="size-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results count */}
        {filteredCampaigns.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Showing {filteredCampaigns.length} of {campaigns.length} campaigns
          </div>
        )}
      </div>
    </ModuleLayout>
  );
}