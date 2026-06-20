import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Star,
  Calendar,
  User,
  BarChart3,
  Trash2,
  Archive,
  TrendingUp,
  Mail,
  Eye,
  MousePointer,
  FileText,
  Crown,
  Check,
  X,
  AlertTriangle,
  UserMinus,
} from 'lucide-react';
import { Template } from './types';

interface TemplateDetailsDialogProps {
  template: Template | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (templateId: string) => void;
  onRetire: (templateId: string) => void;
}

export function TemplateDetailsDialog({
  template,
  open,
  onOpenChange,
  onDelete,
  onRetire,
}: TemplateDetailsDialogProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRetireConfirm, setShowRetireConfirm] = useState(false);

  if (!template) return null;

  const handleDelete = () => {
    onDelete(template.id);
    setShowDeleteConfirm(false);
    onOpenChange(false);
  };

  const handleRetire = () => {
    onRetire(template.id);
    setShowRetireConfirm(false);
    onOpenChange(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { color: 'bg-green-100 text-green-800', label: 'Published' },
      draft: { color: 'bg-yellow-100 text-yellow-800', label: 'Draft' },
      retired: { color: 'bg-gray-100 text-gray-800', label: 'Retired' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] lg:max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3 pr-8">
            Template Details
            {template.isFavorite && <Star className="size-5 fill-yellow-400 text-yellow-400" />}
          </DialogTitle>
          <DialogDescription>
            View comprehensive details, metrics, and associated campaigns for {template.name}
          </DialogDescription>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-full h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="size-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Template Info */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                  <FileText className="size-5" />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Template ID</label>
                    <p className="text-sm text-gray-900 font-mono mt-1">{template.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Template Name</label>
                    <p className="text-sm text-gray-900 mt-1">{template.name}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-600">Description</label>
                    <p className="text-sm text-gray-900 mt-1">{template.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Category</label>
                    <p className="text-sm text-gray-900 mt-1 capitalize">{template.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className="mt-1">{getStatusBadge(template.status)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Favorite</label>
                    <p className="text-sm text-gray-900 mt-1 flex items-center gap-1">
                      {template.isFavorite ? (
                        <>
                          <Star className="size-4 fill-yellow-400 text-yellow-400" />
                          Yes
                        </>
                      ) : (
                        'No'
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Usage Count</label>
                    <p className="text-sm text-gray-900 mt-1">{template.usageCount} times</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                  <Calendar className="size-5" />
                  Timeline & Attribution
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Calendar className="size-3.5" />
                      Created On
                    </label>
                    <p className="text-sm text-gray-900 mt-1">{formatDate(template.createdDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <User className="size-3.5" />
                      Created By
                    </label>
                    <p className="text-sm text-gray-900 mt-1">{template.createdBy || 'System'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Calendar className="size-3.5" />
                      Last Modified On
                    </label>
                    <p className="text-sm text-gray-900 mt-1">{formatDate(template.lastModified)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <User className="size-3.5" />
                      Last Modified By
                    </label>
                    <p className="text-sm text-gray-900 mt-1">{template.lastModifiedBy || 'System'}</p>
                  </div>
                  
                  {template.publishedOn && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                          <Calendar className="size-3.5" />
                          Published On
                        </label>
                        <p className="text-sm text-gray-900 mt-1">{formatDate(template.publishedOn)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                          <User className="size-3.5" />
                          Published By
                        </label>
                        <p className="text-sm text-gray-900 mt-1">{template.publishedBy || 'System'}</p>
                      </div>
                    </>
                  )}

                  {template.retiredOn && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                          <Calendar className="size-3.5" />
                          Retired On
                        </label>
                        <p className="text-sm text-gray-900 mt-1">{formatDate(template.retiredOn)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                          <User className="size-3.5" />
                          Retired By
                        </label>
                        <p className="text-sm text-gray-900 mt-1">{template.retiredBy || 'System'}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Metrics */}
          {template.engagementMetrics && (
            <div className="bg-green-50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                <BarChart3 className="size-5" />
                Engagement Metrics
              </h3>
              
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <Mail className="size-4" />
                    Total Campaigns
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {template.engagementMetrics.totalCampaigns}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {template.engagementMetrics.activeCampaigns} active
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <TrendingUp className="size-4" />
                    Total Sent
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {template.engagementMetrics.totalSent.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <Eye className="size-4" />
                    Open Rate
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {template.engagementMetrics.openRate}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {template.engagementMetrics.totalOpens.toLocaleString()} opens
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <MousePointer className="size-4" />
                    Click Rate
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {template.engagementMetrics.clickRate}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {template.engagementMetrics.totalClicks.toLocaleString()} clicks
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <AlertTriangle className="size-4" />
                    Bounce Rate
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {template.engagementMetrics.bounceRate}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {template.engagementMetrics.totalBounces.toLocaleString()} bounces
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <UserMinus className="size-4" />
                    Unsubscribe Rate
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {template.engagementMetrics.unsubscribeRate}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {template.engagementMetrics.totalUnsubscribes.toLocaleString()} unsubscribes
                  </p>
                </div>
              </div>

              {/* Associated Campaigns */}
              {template.engagementMetrics.associatedCampaigns.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Associated Campaigns</h4>
                  <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Campaign Name</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Sent Date</th>
                          <th className="px-4 py-3 text-right font-medium text-gray-700">Recipients</th>
                          <th className="px-4 py-3 text-right font-medium text-gray-700">Opens</th>
                          <th className="px-4 py-3 text-right font-medium text-gray-700">Clicks</th>
                          <th className="px-4 py-3 text-right font-medium text-gray-700">Bounce Rate</th>
                          <th className="px-4 py-3 text-right font-medium text-gray-700">Unsub Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {template.engagementMetrics.associatedCampaigns.map((campaign) => (
                          <tr key={campaign.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-900">{campaign.name}</td>
                            <td className="px-4 py-3">
                              <Badge className="text-xs">{campaign.status}</Badge>
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {new Date(campaign.sentDate).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-900">
                              {campaign.recipients.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-900">
                              {campaign.opens.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-900">
                              {campaign.clicks.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-900">
                              <span className="inline-flex items-center gap-1">
                                {campaign.bounceRate}%
                                <span className="text-xs text-gray-500">({campaign.bounces})</span>
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right text-gray-900">
                              <span className="inline-flex items-center gap-1">
                                {campaign.unsubscribeRate}%
                                <span className="text-xs text-gray-500">({campaign.unsubscribes})</span>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No Metrics State */}
          {!template.engagementMetrics && (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <BarChart3 className="size-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-1">No Engagement Data</h3>
              <p className="text-sm text-gray-600">
                This template hasn't been used in any campaigns yet.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {template.status !== 'retired' && (
              <>
                {!showRetireConfirm ? (
                  <Button
                    variant="outline"
                    onClick={() => setShowRetireConfirm(true)}
                    className="gap-2"
                  >
                    <Archive className="size-4" />
                    Retire Template
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm text-gray-600">Retire this template?</span>
                    <Button size="sm" variant="outline" onClick={handleRetire}>
                      Yes, Retire
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowRetireConfirm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </>
            )}

            {!showDeleteConfirm ? (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                className="gap-2 ml-auto"
              >
                <Trash2 className="size-4" />
                Delete Template
              </Button>
            ) : (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-600">Permanently delete?</span>
                <Button size="sm" variant="destructive" onClick={handleDelete}>
                  Yes, Delete
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}