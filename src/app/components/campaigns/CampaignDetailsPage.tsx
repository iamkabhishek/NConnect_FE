import { useState } from 'react';
import { DashboardSidebar } from '@/app/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/app/components/dashboard/DashboardHeader';
import { Button } from '@/app/components/ui/button';
import {
  ArrowLeft,
  Mail,
  Calendar,
  Users,
  TrendingUp,
  Eye,
  MousePointerClick,
  XCircle,
  Copy,
  Edit,
  Trash2,
  Send,
  Clock,
  CheckCircle,
  Download,
  BarChart3,
} from 'lucide-react';

interface CampaignDetailsPageProps {
  campaignId: string;
  onBack?: () => void;
  onEdit?: (id: string) => void;
  onNavigate?: (page: string) => void;
}

// Sample campaign data - in real app, this would be fetched based on campaignId
const CAMPAIGN_DATA = {
  '1': {
    id: '1',
    name: 'Welcome Series - Week 1',
    subject: 'Welcome to NConnect! Get Started',
    status: 'sent' as const,
    template: 'Modern Welcome',
    fromName: 'NConnect Team',
    fromEmail: 'hello@nconnect.com',
    replyTo: 'support@nconnect.com',
    preheader: 'Get started with your newsletter journey',
    recipients: 1250,
    sent: 1250,
    delivered: 1235,
    opens: 687,
    uniqueOpens: 612,
    clicks: 234,
    uniqueClicks: 189,
    bounces: 15,
    unsubscribes: 8,
    complaints: 2,
    scheduledDate: '2024-01-10T09:00:00',
    sentDate: '2024-01-10T09:00:00',
    createdAt: '2024-01-08T14:30:00',
    recipientGroups: ['Newsletter Subscribers', 'VIP Customers'],
  },
  '2': {
    id: '2',
    name: 'Monthly Newsletter - January',
    subject: 'Your January Newsletter is Here!',
    status: 'scheduled' as const,
    template: 'Classic Newsletter',
    fromName: 'NConnect Team',
    fromEmail: 'hello@nconnect.com',
    replyTo: 'support@nconnect.com',
    preheader: 'Monthly updates and insights',
    recipients: 3420,
    scheduledDate: '2024-01-20T10:00:00',
    createdAt: '2024-01-15T11:20:00',
    recipientGroups: ['Newsletter Subscribers', 'Trial Users'],
  },
  '3': {
    id: '3',
    name: 'Flash Sale - Weekend Special',
    subject: '🔥 48-Hour Flash Sale - Up to 50% Off',
    status: 'draft' as const,
    template: 'Bold Promotion',
    fromName: 'NConnect Team',
    fromEmail: 'hello@nconnect.com',
    replyTo: '',
    preheader: 'Limited time offer - don\'t miss out!',
    recipients: 2100,
    createdAt: '2024-01-16T16:45:00',
    recipientGroups: ['VIP Customers'],
  },
  '4': {
    id: '4',
    name: 'Product Launch Announcement',
    subject: 'Introducing Our Latest Innovation',
    status: 'sent' as const,
    template: 'Minimal Promo',
    fromName: 'NConnect Team',
    fromEmail: 'hello@nconnect.com',
    replyTo: 'support@nconnect.com',
    preheader: 'Be the first to know about our new product',
    recipients: 4200,
    sent: 4200,
    delivered: 4150,
    opens: 2310,
    uniqueOpens: 2100,
    clicks: 892,
    uniqueClicks: 750,
    bounces: 50,
    unsubscribes: 18,
    complaints: 5,
    sentDate: '2024-01-05T08:00:00',
    createdAt: '2024-01-03T10:15:00',
    recipientGroups: ['Newsletter Subscribers', 'VIP Customers', 'Trial Users'],
  },
};

export function CampaignDetailsPage({ campaignId, onBack, onEdit, onNavigate }: CampaignDetailsPageProps) {
  const [userName] = useState('John Doe');
  const [workspaceName] = useState('My Workspace');
  const [workspaceColor] = useState('#4A90E2');

  const campaign = CAMPAIGN_DATA[campaignId as keyof typeof CAMPAIGN_DATA];

  if (!campaign) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Not Found</h2>
          <p className="text-gray-600 mb-4">The campaign you're looking for doesn't exist.</p>
          <Button onClick={onBack}>Back to Campaigns</Button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleDuplicate = () => {
    console.log('Duplicate campaign:', campaignId);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(campaignId);
    }
  };

  const handleDelete = () => {
    console.log('Delete campaign:', campaignId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateRate = (numerator: number, denominator: number) => {
    if (!denominator) return 0;
    return Math.round((numerator / denominator) * 100);
  };

  const getStatusBadge = () => {
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

    const config = statusConfig[campaign.status];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border ${config.className}`}
      >
        <Icon className="size-4" />
        {config.text}
      </span>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar activeItem="campaigns" onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader
          userName={userName}
          workspaceName={workspaceName}
          workspaceColor={workspaceColor}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Back Button */}
            <Button variant="ghost" onClick={handleBack} className="mb-4 -ml-2">
              <ArrowLeft className="size-4 mr-2" />
              Back to Campaigns
            </Button>

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
                    {getStatusBadge()}
                  </div>
                  <p className="text-gray-600">
                    <Mail className="size-4 inline mr-1" />
                    Subject: {campaign.subject}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleDuplicate}>
                    <Copy className="size-4 mr-2" />
                    Duplicate
                  </Button>
                  {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                    <Button variant="outline" onClick={handleEdit}>
                      <Edit className="size-4 mr-2" />
                      Edit
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700">
                    <Trash2 className="size-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>

            {/* Campaign Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Campaign Details */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="size-5 text-blue-600" />
                  Campaign Details
                </h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-gray-600 mb-1">From</dt>
                    <dd className="font-medium text-gray-900">
                      {campaign.fromName}
                      <br />
                      <span className="text-gray-600">{campaign.fromEmail}</span>
                    </dd>
                  </div>
                  {campaign.replyTo && (
                    <div>
                      <dt className="text-gray-600 mb-1">Reply-To</dt>
                      <dd className="font-medium text-gray-900">{campaign.replyTo}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-gray-600 mb-1">Template</dt>
                    <dd className="font-medium text-gray-900">{campaign.template}</dd>
                  </div>
                  {campaign.preheader && (
                    <div>
                      <dt className="text-gray-600 mb-1">Preheader</dt>
                      <dd className="font-medium text-gray-900">{campaign.preheader}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Recipients */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="size-5 text-blue-600" />
                  Recipients
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {campaign.recipients.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Total recipients</p>
                  </div>
                  {campaign.recipientGroups && campaign.recipientGroups.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-600 mb-2">Groups:</p>
                      <div className="flex flex-wrap gap-1">
                        {campaign.recipientGroups.map((group, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700"
                          >
                            {group}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="size-5 text-blue-600" />
                  Timeline
                </h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-gray-600 mb-1">Created</dt>
                    <dd className="font-medium text-gray-900">{formatDate(campaign.createdAt)}</dd>
                  </div>
                  {campaign.status === 'scheduled' && campaign.scheduledDate && (
                    <div>
                      <dt className="text-gray-600 mb-1">Scheduled for</dt>
                      <dd className="font-medium text-gray-900">{formatDate(campaign.scheduledDate)}</dd>
                    </div>
                  )}
                  {campaign.status === 'sent' && campaign.sentDate && (
                    <div>
                      <dt className="text-gray-600 mb-1">Sent</dt>
                      <dd className="font-medium text-gray-900">{formatDate(campaign.sentDate)}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* Performance Metrics - Only show for sent campaigns */}
            {campaign.status === 'sent' && campaign.sent && (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h2>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Delivery Rate</p>
                        <Send className="size-5 text-green-600" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">
                        {calculateRate(campaign.delivered || 0, campaign.sent)}%
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {campaign.delivered?.toLocaleString()} of {campaign.sent.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Open Rate</p>
                        <Eye className="size-5 text-blue-600" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">
                        {calculateRate(campaign.uniqueOpens || 0, campaign.sent)}%
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {campaign.uniqueOpens?.toLocaleString()} unique opens
                      </p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Click Rate</p>
                        <MousePointerClick className="size-5 text-purple-600" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">
                        {calculateRate(campaign.uniqueClicks || 0, campaign.sent)}%
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {campaign.uniqueClicks?.toLocaleString()} unique clicks
                      </p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Bounce Rate</p>
                        <XCircle className="size-5 text-red-600" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">
                        {calculateRate(campaign.bounces || 0, campaign.sent)}%
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {campaign.bounces?.toLocaleString()} bounces
                      </p>
                    </div>
                  </div>

                  {/* Detailed Stats */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Engagement Stats */}
                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="size-5 text-blue-600" />
                        Engagement Statistics
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b">
                          <span className="text-sm text-gray-600">Total Opens</span>
                          <span className="font-semibold text-gray-900">
                            {campaign.opens?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pb-3 border-b">
                          <span className="text-sm text-gray-600">Unique Opens</span>
                          <span className="font-semibold text-gray-900">
                            {campaign.uniqueOpens?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pb-3 border-b">
                          <span className="text-sm text-gray-600">Total Clicks</span>
                          <span className="font-semibold text-gray-900">
                            {campaign.clicks?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pb-3 border-b">
                          <span className="text-sm text-gray-600">Unique Clicks</span>
                          <span className="font-semibold text-gray-900">
                            {campaign.uniqueClicks?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pb-3 border-b">
                          <span className="text-sm text-gray-600">Click-to-Open Rate</span>
                          <span className="font-semibold text-gray-900">
                            {calculateRate(campaign.uniqueClicks || 0, campaign.uniqueOpens || 0)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Issues & Actions */}
                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <BarChart3 className="size-5 text-blue-600" />
                        Issues & Actions
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b">
                          <span className="text-sm text-gray-600">Bounces</span>
                          <span className="font-semibold text-red-600">
                            {campaign.bounces?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pb-3 border-b">
                          <span className="text-sm text-gray-600">Unsubscribes</span>
                          <span className="font-semibold text-orange-600">
                            {campaign.unsubscribes?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pb-3 border-b">
                          <span className="text-sm text-gray-600">Spam Complaints</span>
                          <span className="font-semibold text-red-600">
                            {campaign.complaints?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pb-3 border-b">
                          <span className="text-sm text-gray-600">Unsubscribe Rate</span>
                          <span className="font-semibold text-gray-900">
                            {calculateRate(campaign.unsubscribes || 0, campaign.sent)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between pb-3 border-b">
                          <span className="text-sm text-gray-600">Complaint Rate</span>
                          <span className="font-semibold text-gray-900">
                            {calculateRate(campaign.complaints || 0, campaign.sent)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Export Button */}
                <div className="flex justify-end">
                  <Button variant="outline">
                    <Download className="size-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </>
            )}

            {/* Draft/Scheduled Campaign Info */}
            {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <p className="text-blue-800">
                  {campaign.status === 'draft' && (
                    <>
                      <Clock className="size-5 inline mr-2" />
                      This campaign is in draft mode. Performance metrics will be available after it's sent.
                    </>
                  )}
                  {campaign.status === 'scheduled' && (
                    <>
                      <Calendar className="size-5 inline mr-2" />
                      This campaign is scheduled to be sent on {formatDate(campaign.scheduledDate!)}.
                      Performance metrics will be available after it's sent.
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}