import { useState, useEffect } from 'react';
import { 
  Zap, Plus, Search, Filter, Play, Pause, Copy, Trash2, 
  MoreVertical, TrendingUp, Users, Mail, Clock, BarChart3,
  ChevronRight, Eye, Edit2, Lock
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { ModuleLayout } from '@/app/components/layout/ModuleLayout';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';

interface NavigationProps {
  userName?: string;
  onNavigate: (page: string) => void;
}

type WorkflowStatus = 'active' | 'paused' | 'draft';

interface Workflow {
  id: string;
  workflowId: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  trigger: string;
  totalSubscribers: number;
  activeSubscribers: number;
  completedSubscribers: number;
  conversionRate: number;
  lastModified: string;
  createdDate: string;
  steps: number;
  workspaceId?: string;
}

export function AutomationPage({ userName: propUserName, onNavigate }: NavigationProps) {
  const { selectedWorkspace, currentUser } = useWorkspace();
  const userName = propUserName || currentUser?.name || 'John Doe';
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | WorkflowStatus>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Mock data with workspace associations
  const allWorkflows: Workflow[] = [
    {
      id: '1',
      workflowId: 'My Workspace-W001',
      name: 'Welcome Series',
      description: 'Automated welcome emails for new subscribers',
      status: 'active',
      trigger: 'Subscriber Joins Group',
      totalSubscribers: 1245,
      activeSubscribers: 89,
      completedSubscribers: 1156,
      conversionRate: 34.5,
      lastModified: '2 hours ago',
      createdDate: 'Jan 10, 2026',
      steps: 5,
      workspaceId: 'workspace-1',
    },
    {
      id: '2',
      workflowId: 'My Workspace-W002',
      name: 'Re-engagement Campaign',
      description: 'Win back inactive subscribers with targeted content',
      status: 'active',
      trigger: 'Inactive for 30 Days',
      totalSubscribers: 567,
      activeSubscribers: 34,
      completedSubscribers: 533,
      conversionRate: 18.2,
      lastModified: '1 day ago',
      createdDate: 'Jan 5, 2026',
      steps: 3,
      workspaceId: 'workspace-1',
    },
    {
      id: '3',
      workflowId: 'My Workspace-W003',
      name: 'Product Onboarding',
      description: 'Guide new users through product features',
      status: 'paused',
      trigger: 'User Signs Up',
      totalSubscribers: 892,
      activeSubscribers: 0,
      completedSubscribers: 892,
      conversionRate: 42.1,
      lastModified: '3 days ago',
      createdDate: 'Dec 28, 2025',
      steps: 7,
      workspaceId: 'workspace-2',
    },
    {
      id: '4',
      workflowId: 'My Workspace-W004',
      name: 'Birthday Campaign',
      description: 'Send personalized birthday wishes and offers',
      status: 'active',
      trigger: 'Birthday Date',
      totalSubscribers: 234,
      activeSubscribers: 12,
      completedSubscribers: 222,
      conversionRate: 56.8,
      lastModified: '5 hours ago',
      createdDate: 'Jan 1, 2026',
      steps: 2,
      workspaceId: 'workspace-1',
    },
    {
      id: '5',
      workflowId: 'My Workspace-W005',
      name: 'Abandoned Cart Recovery',
      description: 'Recover lost sales from abandoned shopping carts',
      status: 'draft',
      trigger: 'Cart Abandoned',
      totalSubscribers: 0,
      activeSubscribers: 0,
      completedSubscribers: 0,
      conversionRate: 0,
      lastModified: '1 week ago',
      createdDate: 'Jan 8, 2026',
      steps: 4,
      workspaceId: 'workspace-2',
    },
    {
      id: '6',
      workflowId: 'My Workspace-W006',
      name: 'Post-Purchase Follow-up',
      description: 'Collect feedback and encourage repeat purchases',
      status: 'active',
      trigger: 'Purchase Complete',
      totalSubscribers: 456,
      activeSubscribers: 23,
      completedSubscribers: 433,
      conversionRate: 28.7,
      lastModified: '6 hours ago',
      createdDate: 'Dec 20, 2025',
      steps: 4,
      workspaceId: 'workspace-1',
    }
  ];

  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  // Filter workflows by workspace
  useEffect(() => {
    const workspaceWorkflows = allWorkflows.filter(w => w.workspaceId === selectedWorkspace?.id);
    setWorkflows(workspaceWorkflows);
  }, [selectedWorkspace?.id]);

  // Page-level access control guard
  if (currentUser?.permissions?.automation === 'none') {
    return (
      <ModuleLayout activeItem="automation" userName={userName} onNavigate={onNavigate}>
        <div className="flex-1 flex items-center justify-center p-6 h-[calc(100vh-120px)]">
          <div className="w-full max-w-md bg-white border border-zinc-200/50 backdrop-blur-xl rounded-2xl p-10 shadow-xl shadow-purple-500/5 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 border border-red-200 p-4 rounded-2xl flex items-center justify-center">
                <Lock className="size-10 text-red-600 animate-pulse" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-zinc-950 mb-2">Access Restricted</h1>
            <p className="text-zinc-600 text-sm mb-6 leading-relaxed">
              Your account permission level for the <strong>Automation</strong> module is currently restricted to 'None'.
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
        </div>
      </ModuleLayout>
    );
  }

  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: workflows.length,
    active: workflows.filter(w => w.status === 'active').length,
    paused: workflows.filter(w => w.status === 'paused').length,
    draft: workflows.filter(w => w.status === 'draft').length,
    totalSubscribers: workflows.reduce((sum, w) => sum + w.totalSubscribers, 0),
    avgConversion: workflows.filter(w => w.totalSubscribers > 0).length > 0
      ? workflows.filter(w => w.totalSubscribers > 0)
        .reduce((sum, w) => sum + w.conversionRate, 0) / workflows.filter(w => w.totalSubscribers > 0).length
      : 0
  };

  const handleSelectWorkflow = (id: string) => {
    setSelectedWorkflows(prev =>
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedWorkflows.length === filteredWorkflows.length) {
      setSelectedWorkflows([]);
    } else {
      setSelectedWorkflows(filteredWorkflows.map(w => w.id));
    }
  };

  const getStatusColor = (status: WorkflowStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'paused':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: WorkflowStatus) => {
    switch (status) {
      case 'active':
        return <Play className="size-3" />;
      case 'paused':
        return <Pause className="size-3" />;
      case 'draft':
        return <Edit2 className="size-3" />;
    }
  };

  return (
    <ModuleLayout activeItem="automation" userName={userName} onNavigate={onNavigate}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
                <div className="size-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Zap className="size-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Automation Workflows</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Create automated email sequences based on triggers and actions
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => onNavigate('workflow-wizard')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="size-4 mr-2" />
                Create Workflow
              </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Workflows</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                  </div>
                  <div className="size-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Zap className="size-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs">
                  <span className="text-green-600 font-medium">{stats.active} Active</span>
                  <span className="text-amber-600">{stats.paused} Paused</span>
                  <span className="text-gray-600">{stats.draft} Draft</span>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Enrolled</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats.totalSubscribers.toLocaleString()}
                    </p>
                  </div>
                  <div className="size-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="size-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="size-3" />
                  <span>+12% from last month</span>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg. Conversion</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats.avgConversion.toFixed(1)}%
                    </p>
                  </div>
                  <div className="size-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="size-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="size-3" />
                  <span>+5.2% improvement</span>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Emails Sent</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">24.5K</p>
                  </div>
                  <div className="size-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Mail className="size-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs text-gray-600">
                  <Clock className="size-3" />
                  <span>This month</span>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search workflows..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="w-full sm:w-auto"
                  >
                    <Filter className="size-4 mr-2" />
                    {statusFilter === 'all' ? 'All Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                  </Button>
                  {showFilterDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <button
                        onClick={() => {
                          setStatusFilter('all');
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg ${
                          statusFilter === 'all' ? 'bg-blue-50 text-blue-700' : ''
                        }`}
                      >
                        All Status
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter('active');
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                          statusFilter === 'active' ? 'bg-blue-50 text-blue-700' : ''
                        }`}
                      >
                        Active
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter('paused');
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                          statusFilter === 'paused' ? 'bg-blue-50 text-blue-700' : ''
                        }`}
                      >
                        Paused
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter('draft');
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 last:rounded-b-lg ${
                          statusFilter === 'draft' ? 'bg-blue-50 text-blue-700' : ''
                        }`}
                      >
                        Draft
                      </button>
                    </div>
                  )}
                </div>

                {selectedWorkflows.length > 0 && (
                  <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                    <Trash2 className="size-4 mr-2" />
                    Delete ({selectedWorkflows.length})
                  </Button>
                )}
              </div>
            </div>

            {/* Workflows List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
                <div className="grid grid-cols-12 gap-4 items-center text-sm font-semibold text-gray-700">
                  <div className="col-span-4 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedWorkflows.length === filteredWorkflows.length && filteredWorkflows.length > 0}
                      onChange={handleSelectAll}
                      className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Workflow Name</span>
                  </div>
                  <div className="col-span-2">Trigger</div>
                  <div className="col-span-1 text-center">Status</div>
                  <div className="col-span-2 text-center">Enrolled / Completed</div>
                  <div className="col-span-1 text-center">Conv. Rate</div>
                  <div className="col-span-1 text-center">Steps</div>
                  <div className="col-span-1 text-center">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {filteredWorkflows.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <Zap className="size-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No workflows found</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {searchQuery ? 'Try adjusting your search criteria' : 'Create your first automation workflow to get started'}
                    </p>
                    {!searchQuery && (
                      <Button 
                        onClick={() => onNavigate('automation-builder')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="size-4 mr-2" />
                        Create Workflow
                      </Button>
                    )}
                  </div>
                ) : (
                  filteredWorkflows.map((workflow) => (
                    <div
                      key={workflow.id}
                      className="px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Workflow Name */}
                        <div className="col-span-4 flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedWorkflows.includes(workflow.id)}
                            onChange={() => handleSelectWorkflow(workflow.id)}
                            className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">{workflow.name}</h4>
                            <p className="text-sm text-gray-600 truncate">{workflow.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                                {workflow.workflowId}
                              </span>
                              <span className="text-xs text-gray-500">
                                Modified {workflow.lastModified}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Trigger */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <Clock className="size-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-700 truncate">{workflow.trigger}</span>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-1 flex justify-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(workflow.status)}`}>
                            {getStatusIcon(workflow.status)}
                            {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                          </span>
                        </div>

                        {/* Enrolled / Completed */}
                        <div className="col-span-2 text-center">
                          <div className="text-sm font-semibold text-gray-900">
                            {workflow.totalSubscribers.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-600">
                            {workflow.completedSubscribers.toLocaleString()} completed
                          </div>
                          {workflow.activeSubscribers > 0 && (
                            <div className="text-xs text-blue-600 mt-0.5">
                              {workflow.activeSubscribers} active
                            </div>
                          )}
                        </div>

                        {/* Conversion Rate */}
                        <div className="col-span-1 text-center">
                          <div className={`text-sm font-semibold ${
                            workflow.conversionRate >= 40 ? 'text-green-600' :
                            workflow.conversionRate >= 20 ? 'text-blue-600' :
                            workflow.conversionRate > 0 ? 'text-amber-600' : 'text-gray-400'
                          }`}>
                            {workflow.conversionRate > 0 ? `${workflow.conversionRate}%` : '-'}
                          </div>
                        </div>

                        {/* Steps */}
                        <div className="col-span-1 text-center">
                          <span className="inline-flex items-center justify-center size-8 bg-gray-100 rounded-full text-sm font-semibold text-gray-700">
                            {workflow.steps}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="col-span-1 flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onNavigate('automation-analytics')}
                            title="View Analytics"
                          >
                            <Eye className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onNavigate('automation-builder')}
                            title="Edit Workflow"
                          >
                            <Edit2 className="size-4" />
                          </Button>
                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowActionMenu(showActionMenu === workflow.id ? null : workflow.id)}
                            >
                              <MoreVertical className="size-4" />
                            </Button>
                            {showActionMenu === workflow.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-t-lg flex items-center gap-2 text-sm">
                                  <Copy className="size-4" />
                                  Duplicate
                                </button>
                                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm">
                                  {workflow.status === 'active' ? (
                                    <>
                                      <Pause className="size-4" />
                                      Pause
                                    </>
                                  ) : (
                                    <>
                                      <Play className="size-4" />
                                      Activate
                                    </>
                                  )}
                                </button>
                                <button className="w-full text-left px-4 py-2 hover:bg-red-50 rounded-b-lg flex items-center gap-2 text-sm text-red-600">
                                  <Trash2 className="size-4" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Start Templates */}
            {workflows.length === 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Start with a Template</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      name: 'Welcome Series',
                      description: 'Greet new subscribers with a warm welcome',
                      icon: '👋',
                      steps: 5
                    },
                    {
                      name: 'Re-engagement',
                      description: 'Win back inactive subscribers',
                      icon: '🎯',
                      steps: 3
                    },
                    {
                      name: 'Nurture Campaign',
                      description: 'Build relationships over time',
                      icon: '🌱',
                      steps: 7
                    }
                  ].map((template, index) => (
                    <button
                      key={index}
                      onClick={() => onNavigate('automation-builder')}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-md transition-all text-left group"
                    >
                      <div className="text-4xl mb-3">{template.icon}</div>
                      <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{template.steps} steps</span>
                        <ChevronRight className="size-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
      </div>
    </ModuleLayout>
  );
}