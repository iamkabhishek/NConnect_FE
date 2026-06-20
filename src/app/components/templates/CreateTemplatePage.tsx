import { TemplateDesignPreview } from './TemplateDesignPreview';
import { VisualTemplateBuilder } from './VisualTemplateBuilder';
import { useState } from 'react';
import { ArrowLeft, Check, Eye, ChevronRight, ChevronLeft } from 'lucide-react';
import { DashboardSidebar } from '@/app/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/app/components/dashboard/DashboardHeader';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

// Prebuilt template designs
export const PREBUILT_DESIGNS = [
  {
    id: 'welcome-modern',
    name: 'Modern Welcome',
    category: 'newsletter',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
    description: 'Clean, modern design perfect for welcome emails',
  },
  {
    id: 'newsletter-classic',
    name: 'Classic Newsletter',
    category: 'newsletter',
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
    description: 'Traditional newsletter layout with header and sections',
  },
  {
    id: 'promo-bold',
    name: 'Bold Promotion',
    category: 'promotional',
    thumbnail: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop',
    description: 'Eye-catching design for promotional campaigns',
  },
  {
    id: 'promo-minimal',
    name: 'Minimal Promo',
    category: 'promotional',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop',
    description: 'Minimalist promotional template with focus on CTA',
  },
  {
    id: 'transactional-clean',
    name: 'Clean Transaction',
    category: 'transactional',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop',
    description: 'Professional template for order confirmations',
  },
  {
    id: 'event-elegant',
    name: 'Elegant Event',
    category: 'event',
    thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop',
    description: 'Sophisticated design for event invitations',
  },
];

export interface TemplateFormData {
  name: string;
  description: string;
  category: string;
  subjectLine: string;
  preheaderText: string;
  selectedDesign: string;
}

interface CreateTemplatePageProps {
  onCreateTemplate?: (data: TemplateFormData) => void;
  onNavigate?: (page: string) => void;
}

export function CreateTemplatePage({ onCreateTemplate, onNavigate }: CreateTemplatePageProps) {
  const [userName] = useState('John Doe');
  const [workspaceName] = useState('My Workspace');
  const [workspaceColor] = useState('#4A90E2');

  const [step, setStep] = useState<'design' | 'details'>('design');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [previewDesign, setPreviewDesign] = useState<typeof PREBUILT_DESIGNS[0] | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    description: '',
    category: 'newsletter',
    subjectLine: '',
    preheaderText: '',
    selectedDesign: '',
  });

  const handleDesignSelect = (designId: string) => {
    const design = PREBUILT_DESIGNS.find((d) => d.id === designId);
    setFormData({
      ...formData,
      selectedDesign: designId,
      category: design?.category || 'newsletter',
    });
    setStep('details');
  };

  const handlePreview = (design: typeof PREBUILT_DESIGNS[0]) => {
    setPreviewDesign(design);
    setPreviewOpen(true);
  };

  const handleSelectFromPreview = () => {
    if (previewDesign) {
      handleDesignSelect(previewDesign.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCreateTemplate) {
      onCreateTemplate(formData);
    }
    // Navigate back to templates page
    if (onNavigate) {
      onNavigate('/templates');
    }
  };

  const handleCancel = () => {
    // navigate('/templates');
    if (onNavigate) {
      onNavigate('/templates');
    }
  };

  const handleCategoryFilterChange = (category: string) => {
    setCategoryFilter(category);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const filteredDesigns =
    categoryFilter === 'all'
      ? PREBUILT_DESIGNS
      : PREBUILT_DESIGNS.filter((d) => d.category === categoryFilter);

  const selectedDesign = PREBUILT_DESIGNS.find(
    (d) => d.id === formData.selectedDesign
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar activeItem="templates" onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader
          userName={userName}
          workspaceName={workspaceName}
          workspaceColor={workspaceColor}
          onSettingsClick={() => onNavigate?.('settings')}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Breadcrumb & Header */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={handleCancel}
                className="mb-4 -ml-2"
              >
                <ArrowLeft className="size-4 mr-2" />
                Back to Templates
              </Button>

              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {step === 'design' ? 'Choose Template Design' : 'Configure Template'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {step === 'design'
                    ? 'Select a professionally designed template to start with'
                    : 'Provide details for your new email template'}
                </p>
              </div>
            </div>

            {/* Step Indicator */}
            <div className="mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      step === 'design'
                        ? 'bg-blue-600 text-white'
                        : 'bg-green-600 text-white'
                    }`}
                  >
                    {step === 'design' ? '1' : <Check className="size-5" />}
                  </div>
                  <span
                    className={`font-medium ${
                      step === 'design' ? 'text-blue-600' : 'text-green-600'
                    }`}
                  >
                    Select Design
                  </span>
                </div>

                <div className="flex-1 h-0.5 bg-gray-300">
                  <div
                    className={`h-full transition-all ${
                      step === 'details' ? 'bg-blue-600 w-full' : 'w-0'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      step === 'details'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    2
                  </div>
                  <span
                    className={`font-medium ${
                      step === 'details' ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  >
                    Configure Details
                  </span>
                </div>
              </div>
            </div>

            {/* Content Based on Step */}
            {step === 'design' ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                {/* Category Filter */}
                <div className="mb-6 pb-6 border-b">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-700">
                      Filter by Category:
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant={categoryFilter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleCategoryFilterChange('all')}
                        className={
                          categoryFilter === 'all'
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : ''
                        }
                      >
                        All Templates
                      </Button>
                      <Button
                        variant={categoryFilter === 'newsletter' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleCategoryFilterChange('newsletter')}
                        className={
                          categoryFilter === 'newsletter'
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : ''
                        }
                      >
                        Newsletter
                      </Button>
                      <Button
                        variant={categoryFilter === 'promotional' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleCategoryFilterChange('promotional')}
                        className={
                          categoryFilter === 'promotional'
                            ? 'bg-purple-600 hover:bg-purple-700'
                            : ''
                        }
                      >
                        Promotional
                      </Button>
                      <Button
                        variant={
                          categoryFilter === 'transactional' ? 'default' : 'outline'
                        }
                        size="sm"
                        onClick={() => handleCategoryFilterChange('transactional')}
                        className={
                          categoryFilter === 'transactional'
                            ? 'bg-gray-600 hover:bg-gray-700'
                            : ''
                        }
                      >
                        Transactional
                      </Button>
                      <Button
                        variant={categoryFilter === 'event' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleCategoryFilterChange('event')}
                        className={
                          categoryFilter === 'event'
                            ? 'bg-red-600 hover:bg-red-700'
                            : ''
                        }
                      >
                        Event
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Template Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDesigns
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((design) => (
                      <div
                        key={design.id}
                        className="group bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all"
                      >
                        {/* Template Preview Image */}
                        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                          <img
                            src={design.thumbnail}
                            alt={design.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Template Info */}
                        <div className="p-4 relative z-10 bg-white">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {design.name}
                            </h3>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded capitalize flex-shrink-0 ml-2">
                              {design.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            {design.description}
                          </p>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePreview(design)}
                              className="flex-1"
                            >
                              <Eye className="size-4 mr-1" />
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleDesignSelect(design.id)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                              Select
                              <ChevronRight className="size-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {filteredDesigns.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      No templates found for this category
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {filteredDesigns.length > itemsPerPage && (
                  <div className="flex items-center justify-center gap-3 mt-8 pt-6 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="size-4 mr-1" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Page <span className="font-semibold text-gray-900">{currentPage}</span> of{' '}
                        <span className="font-semibold text-gray-900">
                          {Math.ceil(filteredDesigns.length / itemsPerPage)}
                        </span>
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage * itemsPerPage >= filteredDesigns.length}
                      className="disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="size-4 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="space-y-6">
                    {/* Selected Design Info */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-32 h-24 rounded overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                          <img
                            src={selectedDesign?.thumbnail}
                            alt={selectedDesign?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Check className="size-5 text-blue-600" />
                            <p className="font-semibold text-blue-900">
                              {selectedDesign?.name}
                            </p>
                          </div>
                          <p className="text-sm text-blue-700 mb-2">
                            {selectedDesign?.description}
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => selectedDesign && handlePreview(selectedDesign)}
                          >
                            <Eye className="size-4 mr-1" />
                            Preview Design
                          </Button>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setStep('design')}
                        >
                          Change Design
                        </Button>
                      </div>
                    </div>

                    {/* Template Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Template Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Welcome Newsletter"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of this template's purpose..."
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        rows={3}
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newsletter">Newsletter</SelectItem>
                          <SelectItem value="promotional">Promotional</SelectItem>
                          <SelectItem value="transactional">Transactional</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Email Settings
                      </h3>

                      {/* Subject Line */}
                      <div className="space-y-2 mb-4">
                        <Label htmlFor="subject">Subject Line *</Label>
                        <Input
                          id="subject"
                          placeholder="Enter default subject line"
                          value={formData.subjectLine}
                          onChange={(e) =>
                            setFormData({ ...formData, subjectLine: e.target.value })
                          }
                          required
                        />
                      </div>

                      {/* Preheader Text */}
                      <div className="space-y-2">
                        <Label htmlFor="preheader">Preheader Text</Label>
                        <Input
                          id="preheader"
                          placeholder="Preview text that appears after subject"
                          value={formData.preheaderText}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              preheaderText: e.target.value,
                            })
                          }
                        />
                        <p className="text-xs text-gray-500">
                          This text appears in the inbox preview
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('design')}
                  >
                    <ArrowLeft className="size-4 mr-2" />
                    Back to Design Selection
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Check className="size-4 mr-2" />
                      Create Template
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>

      {/* Preview Dialog */}
      <TemplateDesignPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        design={previewDesign}
        onSelect={step === 'design' ? handleSelectFromPreview : undefined}
      />
    </div>
  );
}