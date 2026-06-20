import { useState, useEffect } from 'react';
import { ModuleLayout } from '@/app/components/layout/ModuleLayout';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Search, Plus, Grid3x3, List, Star, ChevronDown } from 'lucide-react';
import { TemplateGrid } from './TemplateGrid';
import { TemplateList } from './TemplateList';
import { CreateTemplateDialog } from './CreateTemplateDialog';
import { CreateCustomTemplateDialog } from './CreateCustomTemplateDialog';
import { TemplatePreviewDialog } from './TemplatePreviewDialog';
import { DeleteTemplateDialog } from './DeleteTemplateDialog';
import { VisualTemplateBuilderComplete } from './VisualTemplateBuilderComplete';
import { Template } from './types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { PredefinedTemplatesGallery } from './PredefinedTemplatesGallery';

interface TemplatesPageProps {
  userName?: string;
  onNavigateToCreate?: () => void;
  onNavigate?: (page: string) => void;
}

export function TemplatesPage({ userName = 'John Doe', onNavigateToCreate, onNavigate }: TemplatesPageProps) {
  const { selectedWorkspace } = useWorkspace();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createCustomDialogOpen, setCreateCustomDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [showPredefinedGallery, setShowPredefinedGallery] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'retired' | 'favorites'>('all');

  // Mock templates data with workspace associations
  const allTemplates: Template[] = [
    {
      id: '1',
      name: 'Welcome Newsletter',
      description: 'A warm welcome email for new subscribers',
      category: 'newsletter',
      thumbnail: 'https://via.placeholder.com/400x300/4A90E2/ffffff?text=Welcome+Newsletter',
      lastModified: '2025-01-17',
      createdDate: '2025-01-10',
      isFavorite: true,
      usageCount: 24,
      status: 'published',
      workspaceId: 'workspace-1',
      createdBy: 'John Doe',
      lastModifiedBy: 'Jane Smith',
      publishedOn: '2025-01-11',
      publishedBy: 'John Doe',
      engagementMetrics: {
        totalCampaigns: 12,
        activeCampaigns: 3,
        totalSent: 15420,
        totalOpens: 9252,
        totalClicks: 3084,
        openRate: 60,
        clickRate: 20,
        bounceRate: 2.5,
        totalBounces: 386,
        unsubscribeRate: 0.8,
        totalUnsubscribes: 123,
        associatedCampaigns: [
          {
            id: 'camp-1',
            name: 'January Welcome Series',
            status: 'sent',
            sentDate: '2025-01-15',
            recipients: 2500,
            opens: 1500,
            clicks: 500,
            bounces: 63,
            unsubscribes: 20,
            bounceRate: 2.5,
            unsubscribeRate: 0.8,
          },
          {
            id: 'camp-2',
            name: 'December Onboarding',
            status: 'sent',
            sentDate: '2024-12-20',
            recipients: 1800,
            opens: 1080,
            clicks: 360,
            bounces: 45,
            unsubscribes: 14,
            bounceRate: 2.5,
            unsubscribeRate: 0.8,
          },
          {
            id: 'camp-3',
            name: 'November Welcome Campaign',
            status: 'sent',
            sentDate: '2024-11-25',
            recipients: 2100,
            opens: 1260,
            clicks: 420,
            bounces: 53,
            unsubscribes: 17,
            bounceRate: 2.5,
            unsubscribeRate: 0.8,
          },
        ],
      },
    },
    {
      id: '2',
      name: 'Product Launch',
      description: 'Announce new product releases',
      category: 'promotional',
      thumbnail: 'https://via.placeholder.com/400x300/9B59B6/ffffff?text=Product+Launch',
      lastModified: '2025-01-16',
      createdDate: '2025-01-12',
      isFavorite: false,
      usageCount: 18,
      status: 'published',
      workspaceId: 'workspace-1',
      createdBy: 'Sarah Johnson',
      lastModifiedBy: 'John Doe',
      publishedOn: '2025-01-13',
      publishedBy: 'Sarah Johnson',
      engagementMetrics: {
        totalCampaigns: 6,
        activeCampaigns: 1,
        totalSent: 8500,
        totalOpens: 4250,
        totalClicks: 1700,
        openRate: 50,
        clickRate: 20,
        bounceRate: 3.2,
        totalBounces: 272,
        unsubscribeRate: 1.2,
        totalUnsubscribes: 102,
        associatedCampaigns: [
          {
            id: 'camp-4',
            name: 'New Feature Launch',
            status: 'sent',
            sentDate: '2025-01-14',
            recipients: 3000,
            opens: 1500,
            clicks: 600,
            bounces: 96,
            unsubscribes: 36,
            bounceRate: 3.2,
            unsubscribeRate: 1.2,
          },
          {
            id: 'camp-5',
            name: 'Product Update Q4',
            status: 'sent',
            sentDate: '2024-12-15',
            recipients: 2500,
            opens: 1250,
            clicks: 500,
            bounces: 80,
            unsubscribes: 30,
            bounceRate: 3.2,
            unsubscribeRate: 1.2,
          },
        ],
      },
    },
    {
      id: '3',
      name: 'Weekly Digest',
      description: 'Summary of the week\'s content',
      category: 'newsletter',
      thumbnail: 'https://via.placeholder.com/400x300/2ECC71/ffffff?text=Weekly+Digest',
      lastModified: '2025-01-15',
      createdDate: '2025-01-08',
      isFavorite: true,
      usageCount: 42,
      status: 'published',
      workspaceId: 'workspace-2',
    },
    {
      id: '4',
      name: 'Flash Sale',
      description: 'Limited time offer announcement',
      category: 'promotional',
      thumbnail: 'https://via.placeholder.com/400x300/E67E22/ffffff?text=Flash+Sale',
      lastModified: '2025-01-14',
      createdDate: '2025-01-05',
      isFavorite: false,
      usageCount: 31,
      status: 'published',
      workspaceId: 'workspace-1',
    },
    {
      id: '5',
      name: 'Order Confirmation',
      description: 'Transactional email for order confirmations',
      category: 'transactional',
      thumbnail: 'https://via.placeholder.com/400x300/3498DB/ffffff?text=Order+Confirmation',
      lastModified: '2025-01-13',
      createdDate: '2025-01-03',
      isFavorite: false,
      usageCount: 156,
      status: 'published',
      workspaceId: 'workspace-1',
    },
    {
      id: '6',
      name: 'Event Invitation',
      description: 'Invite subscribers to upcoming events',
      category: 'event',
      thumbnail: 'https://via.placeholder.com/400x300/E74C3C/ffffff?text=Event+Invitation',
      lastModified: '2025-01-12',
      createdDate: '2025-01-01',
      isFavorite: true,
      usageCount: 12,
      status: 'published',
      workspaceId: 'workspace-1',
    },
    {
      id: '7',
      name: 'Monthly Newsletter',
      description: 'Monthly roundup template',
      category: 'newsletter',
      thumbnail: 'https://via.placeholder.com/400x300/1ABC9C/ffffff?text=Monthly+Newsletter',
      lastModified: '2025-01-11',
      createdDate: '2024-12-28',
      isFavorite: false,
      usageCount: 8,
      status: 'draft',
      workspaceId: 'workspace-1',
    },
    {
      id: '8',
      name: 'Password Reset',
      description: 'Secure password reset email',
      category: 'transactional',
      thumbnail: 'https://via.placeholder.com/400x300/95A5A6/ffffff?text=Password+Reset',
      lastModified: '2025-01-10',
      createdDate: '2024-12-25',
      isFavorite: false,
      usageCount: 89,
      status: 'published',
      workspaceId: 'workspace-1',
    },
  ];

  // Filter templates by workspace
  const [templates, setTemplates] = useState<Template[]>([]);
  useEffect(() => {
    if (selectedWorkspace) {
      setTemplates(allTemplates.filter(template => template.workspaceId === selectedWorkspace.id));
    } else {
      setTemplates([]);
    }
  }, [selectedWorkspace]);

  // Filter and sort templates
  const filteredTemplates = templates
    .filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === 'all' || template.category === categoryFilter;

      // Handle status and favorites filter
      let matchesStatusFilter = true;
      if (statusFilter === 'published') {
        matchesStatusFilter = template.status === 'published';
      } else if (statusFilter === 'draft') {
        matchesStatusFilter = template.status === 'draft';
      } else if (statusFilter === 'retired') {
        matchesStatusFilter = template.status === 'retired';
      } else if (statusFilter === 'favorites') {
        matchesStatusFilter = template.isFavorite === true;
      }

      return matchesSearch && matchesCategory && matchesStatusFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
        case 'oldest':
          return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popular':
          return b.usageCount - a.usageCount;
        default:
          return 0;
      }
    });

  const handleCreateTemplate = (data: any) => {
    // Map selected design to appropriate thumbnail
    const designThumbnails: { [key: string]: string } = {
      'welcome-modern': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
      'newsletter-classic': 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
      'promo-bold': 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop',
      'promo-minimal': 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop',
      'transactional-clean': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop',
      'event-elegant': 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop',
    };

    // Generate workspace-prefixed ID for user-created template
    const workspaceId = selectedWorkspace?.id || 'workspace-1';
    const templateNumber = templates.length + 1;
    const newTemplateId = `${workspaceId}-template-${templateNumber}`;

    const newTemplate: Template = {
      id: newTemplateId,
      name: data.name,
      description: data.description,
      category: data.category,
      thumbnail: designThumbnails[data.selectedDesign] || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
      lastModified: new Date().toISOString().split('T')[0],
      createdDate: new Date().toISOString().split('T')[0],
      isFavorite: false,
      usageCount: 0,
      status: 'draft',
      workspaceId: workspaceId,
    };
    setTemplates([newTemplate, ...templates]);
    setCreateDialogOpen(false);
  };

  const handleEditTemplate = (template: Template) => {
    // Navigate to template editor (in real app)
    setIsEditing(true);
    setEditingTemplate(template);
  };

  const handleSaveTemplate = (updatedTemplate: Template) => {
    setTemplates(
      templates.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t))
    );
    setIsEditing(false);
    setEditingTemplate(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingTemplate(null);
  };

  const handleDuplicateTemplate = (template: Template) => {
    // Generate workspace-prefixed ID for duplicated template
    const workspaceId = selectedWorkspace?.id || 'workspace-1';
    const templateNumber = templates.length + 1;
    const newTemplateId = `${workspaceId}-template-${templateNumber}`;

    const duplicatedTemplate: Template = {
      ...template,
      id: newTemplateId,
      name: `${template.name} (Copy)`,
      lastModified: new Date().toISOString().split('T')[0],
      createdDate: new Date().toISOString().split('T')[0],
      usageCount: 0,
      workspaceId: workspaceId,
    };
    setTemplates([duplicatedTemplate, ...templates]);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setDeleteDialogOpen(true);
    setSelectedTemplate(templates.find(t => t.id === templateId) || null);
  };

  const handleConfirmDeleteTemplate = () => {
    if (selectedTemplate) {
      setTemplates(templates.filter((t) => t.id !== selectedTemplate.id));
      setDeleteDialogOpen(false);
      setSelectedTemplate(null);
    }
  };

  const handleToggleFavorite = (templateId: string) => {
    setTemplates(
      templates.map((t) =>
        t.id === templateId ? { ...t, isFavorite: !t.isFavorite } : t
      )
    );
  };

  const handleRetireTemplate = (templateId: string) => {
    setTemplates(
      templates.map((t) =>
        t.id === templateId 
          ? { 
              ...t, 
              status: 'retired' as const,
              retiredOn: new Date().toISOString(),
              retiredBy: userName
            } 
          : t
      )
    );
  };

  const handlePreviewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setPreviewDialogOpen(true);
  };

  const handleSelectPredefinedTemplate = (predefinedTemplate: any) => {
    // Generate workspace-prefixed ID for template created from predefined template
    const workspaceId = selectedWorkspace?.id || 'workspace-1';
    const templateNumber = templates.length + 1;
    const newTemplateId = `${workspaceId}-template-${templateNumber}`;

    // Create a new template based on the predefined template
    const newTemplate: Template = {
      id: newTemplateId,
      name: predefinedTemplate.name,
      description: predefinedTemplate.description,
      category: predefinedTemplate.category,
      thumbnail: predefinedTemplate.thumbnail,
      lastModified: new Date().toISOString().split('T')[0],
      createdDate: new Date().toISOString().split('T')[0],
      isFavorite: false,
      usageCount: 0,
      status: 'draft',
      workspaceId: workspaceId,
      elements: predefinedTemplate.elements || [], // Include the predefined elements
    };
    
    // Add the template to the templates list immediately
    setTemplates([newTemplate, ...templates]);
    
    // Close the predefined gallery and open the template builder
    setShowPredefinedGallery(false);
    setEditingTemplate(newTemplate);
    setIsEditing(true);
  };

  const handleCreateCustomTemplate = (data: any) => {
    // Generate workspace-prefixed ID for custom template
    const workspaceId = selectedWorkspace?.id || 'workspace-1';
    const templateNumber = templates.length + 1;
    const newTemplateId = `${workspaceId}-template-${templateNumber}`;

    const newTemplate: Template = {
      id: newTemplateId,
      name: data.name,
      description: data.description,
      category: data.category,
      thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
      lastModified: new Date().toISOString().split('T')[0],
      createdDate: new Date().toISOString().split('T')[0],
      isFavorite: false,
      usageCount: 0,
      status: 'draft',
      workspaceId: workspaceId,
      elements: [], // Start with empty canvas
    };

    // Add the template to the templates list
    setTemplates([newTemplate, ...templates]);

    // Close the dialog and open the template builder
    setCreateCustomDialogOpen(false);
    setEditingTemplate(newTemplate);
    setIsEditing(true);
  };

  // Stats
  const stats = {
    total: templates.length,
    published: templates.filter((t) => t.status === 'published').length,
    drafts: templates.filter((t) => t.status === 'draft').length,
    archived: templates.filter((t) => t.status === 'retired').length,
    favorites: templates.filter((t) => t.isFavorite).length,
  };

  return (
    <>
      {showPredefinedGallery ? (
        <PredefinedTemplatesGallery
          onBack={() => setShowPredefinedGallery(false)}
          onSelectTemplate={handleSelectPredefinedTemplate}
        />
      ) : isEditing ? (
        <VisualTemplateBuilderComplete
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onCancel={handleCancelEdit}
        />
      ) : (
        <ModuleLayout activeItem="templates" userName={userName} onNavigate={onNavigate}>
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="space-y-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
                  <p className="text-gray-600 mt-1">
                    Create and manage your email templates
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="size-4 mr-2" />
                      Create Template
                      <ChevronDown className="size-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => setShowPredefinedGallery(true)}>
                      Choose From Template
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCreateCustomDialogOpen(true)}>
                      Create Your Own
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`bg-white rounded-lg border p-3 text-left transition-all hover:shadow-md ${
                    statusFilter === 'all' 
                      ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <p className="text-xs text-gray-600 mb-1">Total Templates</p>
                  <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                </button>
                <button
                  onClick={() => setStatusFilter('published')}
                  className={`bg-white rounded-lg border p-3 text-left transition-all hover:shadow-md ${
                    statusFilter === 'published' 
                      ? 'border-green-500 ring-2 ring-green-500 ring-opacity-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <p className="text-xs text-gray-600 mb-1">Published</p>
                  <p className="text-xl font-bold text-green-600">{stats.published}</p>
                </button>
                <button
                  onClick={() => setStatusFilter('draft')}
                  className={`bg-white rounded-lg border p-3 text-left transition-all hover:shadow-md ${
                    statusFilter === 'draft' 
                      ? 'border-orange-500 ring-2 ring-orange-500 ring-opacity-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <p className="text-xs text-gray-600 mb-1">Drafts</p>
                  <p className="text-xl font-bold text-orange-600">{stats.drafts}</p>
                </button>
                <button
                  onClick={() => setStatusFilter('favorites')}
                  className={`bg-white rounded-lg border p-3 text-left transition-all hover:shadow-md flex items-center gap-2 ${
                    statusFilter === 'favorites' 
                      ? 'border-yellow-500 ring-2 ring-yellow-500 ring-opacity-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">Favorites</p>
                    <p className="text-xl font-bold text-yellow-600">{stats.favorites}</p>
                  </div>
                  <Star className="size-6 text-yellow-500 fill-yellow-500" />
                </button>
                <button
                  onClick={() => setStatusFilter('retired')}
                  className={`bg-white rounded-lg border p-3 text-left transition-all hover:shadow-md ${
                    statusFilter === 'retired' 
                      ? 'border-gray-500 ring-2 ring-gray-500 ring-opacity-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <p className="text-xs text-gray-600 mb-1">Archived</p>
                  <p className="text-xl font-bold text-gray-500">{stats.archived}</p>
                </button>
              </div>

              {/* Filters and View Controls */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  {/* Search */}
                  <div className="flex-1 min-w-[300px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search templates by name or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Category Filter */}
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="newsletter">Newsletter</SelectItem>
                        <SelectItem value="promotional">Promotional</SelectItem>
                        <SelectItem value="transactional">Transactional</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Sort By */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                        <SelectItem value="popular">Most Used</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Drafts</SelectItem>
                        <SelectItem value="retired">Archived</SelectItem>
                        <SelectItem value="favorites">Favorites</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* View Mode Toggle */}
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className={viewMode === 'grid' ? 'bg-gray-100' : ''}
                      >
                        <Grid3x3 className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className={viewMode === 'list' ? 'bg-gray-100' : ''}
                      >
                        <List className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Results Count */}
                <div className="mt-3 pt-3 border-t text-sm text-gray-600">
                  Showing {filteredTemplates.length} of {templates.length} templates
                </div>
              </div>

              {/* Templates Display */}
              {viewMode === 'grid' ? (
                <TemplateGrid
                  templates={filteredTemplates}
                  onEdit={handleEditTemplate}
                  onDuplicate={handleDuplicateTemplate}
                  onDelete={handleDeleteTemplate}
                  onToggleFavorite={handleToggleFavorite}
                  onPreview={handlePreviewTemplate}
                  onRetire={handleRetireTemplate}
                />
              ) : (
                <TemplateList
                  templates={filteredTemplates}
                  onEdit={handleEditTemplate}
                  onDuplicate={handleDuplicateTemplate}
                  onDelete={handleDeleteTemplate}
                  onToggleFavorite={handleToggleFavorite}
                  onPreview={handlePreviewTemplate}
                />
              )}
            </div>
          </div>
        </ModuleLayout>
      )}

      {/* Dialogs */}
      <CreateTemplateDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreateTemplate={handleCreateTemplate}
      />

      <CreateCustomTemplateDialog
        open={createCustomDialogOpen}
        onClose={() => setCreateCustomDialogOpen(false)}
        onCreateTemplate={handleCreateCustomTemplate}
        workspaceId={selectedWorkspace?.id || 'workspace-1'}
        templateCount={templates.length}
      />

      <TemplatePreviewDialog
        open={previewDialogOpen}
        onClose={() => {
          setPreviewDialogOpen(false);
          setSelectedTemplate(null);
        }}
        template={selectedTemplate}
        onEdit={(template) => {
          setPreviewDialogOpen(false);
          handleEditTemplate(template);
        }}
      />

      <DeleteTemplateDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        template={selectedTemplate}
        onConfirmDelete={(templateId) => {
          setTemplates(templates.filter((t) => t.id !== templateId));
        }}
      />
    </>
  );
}