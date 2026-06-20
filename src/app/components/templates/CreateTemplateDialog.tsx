import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
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
import { Plus, Check, ChevronRight } from 'lucide-react';

interface CreateTemplateDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateTemplate: (data: TemplateFormData) => void;
}

export interface TemplateFormData {
  name: string;
  description: string;
  category: string;
  subjectLine: string;
  preheaderText: string;
  selectedDesign: string;
}

// Prebuilt template designs
const PREBUILT_DESIGNS = [
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

export function CreateTemplateDialog({
  open,
  onClose,
  onCreateTemplate,
}: CreateTemplateDialogProps) {
  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    description: '',
    category: 'newsletter',
    subjectLine: '',
    preheaderText: '',
    selectedDesign: '',
  });

  const [step, setStep] = useState<'design' | 'details'>('design');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateTemplate(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      category: 'newsletter',
      subjectLine: '',
      preheaderText: '',
      selectedDesign: '',
    });
    setStep('design');
    setCategoryFilter('all');
    onClose();
  };

  const handleDesignSelect = (designId: string) => {
    const design = PREBUILT_DESIGNS.find((d) => d.id === designId);
    setFormData({
      ...formData,
      selectedDesign: designId,
      category: design?.category || 'newsletter',
    });
    setStep('details');
  };

  const filteredDesigns =
    categoryFilter === 'all'
      ? PREBUILT_DESIGNS
      : PREBUILT_DESIGNS.filter((d) => d.category === categoryFilter);

  const selectedDesign = PREBUILT_DESIGNS.find(
    (d) => d.id === formData.selectedDesign
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {step === 'design' ? 'Choose Template Design' : 'Configure Template'}
          </DialogTitle>
          <DialogDescription>
            {step === 'design'
              ? 'Select a professionally designed template to start with'
              : 'Provide details for your new email template'}
          </DialogDescription>
        </DialogHeader>

        {step === 'design' ? (
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Category Filter */}
            <div className="flex items-center gap-2 pb-4 border-b">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <div className="flex gap-2">
                <Button
                  variant={categoryFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategoryFilter('all')}
                  className={
                    categoryFilter === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''
                  }
                >
                  All Templates
                </Button>
                <Button
                  variant={categoryFilter === 'newsletter' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategoryFilter('newsletter')}
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
                  onClick={() => setCategoryFilter('promotional')}
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
                  onClick={() => setCategoryFilter('transactional')}
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
                  onClick={() => setCategoryFilter('event')}
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

            {/* Template Grid */}
            <div className="flex-1 overflow-y-auto py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDesigns.map((design) => (
                  <button
                    key={design.id}
                    onClick={() => handleDesignSelect(design.id)}
                    className="group relative bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all text-left"
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
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {design.name}
                        </h3>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded capitalize">
                          {design.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{design.description}</p>
                      
                      {/* Select Button Overlay */}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-blue-600 font-medium group-hover:underline">
                          Select Template
                        </span>
                        <ChevronRight className="size-4 text-blue-600" />
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-5 transition-all pointer-events-none" />
                  </button>
                ))}
              </div>

              {filteredDesigns.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No templates found for this category
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="space-y-6 py-4">
              {/* Selected Design Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-18 rounded overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
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
                    <p className="text-sm text-blue-700">
                      {selectedDesign?.description}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setStep('design')}
                  >
                    Change
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
                <h3 className="font-semibold text-gray-900 mb-4">Email Settings</h3>

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
                      setFormData({ ...formData, preheaderText: e.target.value })
                    }
                  />
                  <p className="text-xs text-gray-500">
                    This text appears in the inbox preview
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('design')}
              >
                Back
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="size-4 mr-2" />
                Create Template
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === 'design' && (
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
