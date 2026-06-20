import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { ArrowLeft, Search, Eye, Plus, Crown, Check } from 'lucide-react';
import { Template } from './types';
import { predefinedTemplateStructures } from './predefined-template-structures';

interface PredefinedTemplatesGalleryProps {
  onBack: () => void;
  onSelectTemplate: (template: any) => void;
}

export function PredefinedTemplatesGallery({
  onBack,
  onSelectTemplate,
}: PredefinedTemplatesGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);

  // Predefined templates library
  const predefinedTemplates = [
    {
      id: 'template-welcome-modern',
      name: 'Modern Welcome',
      description: 'Clean and modern welcome email with hero image',
      category: 'newsletter',
      thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop',
      features: ['Hero Image', 'Welcome Message', 'CTA Button', 'Social Links'],
      elements: predefinedTemplateStructures['template-welcome-modern'],
      tier: 'free',
    },
    {
      id: 'template-product-launch-bold',
      name: 'Product Launch Bold',
      description: 'Eye-catching product launch announcement',
      category: 'promotional',
      thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
      features: ['Product Showcase', 'Pricing', 'Launch Announcement', 'Call-to-Action'],
      elements: predefinedTemplateStructures['template-product-launch-bold'],
      tier: 'premium',
    },
    {
      id: 'template-newsletter-classic',
      name: 'Classic Newsletter',
      description: 'Traditional newsletter layout with multiple sections',
      category: 'newsletter',
      thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop',
      features: ['Header', 'Multiple Articles', 'Featured Content', 'Footer'],
      elements: predefinedTemplateStructures['template-newsletter-classic'],
      tier: 'free',
    },
    {
      id: 'template-flash-sale',
      name: 'Flash Sale Alert',
      description: 'Urgent promotional template for time-sensitive offers',
      category: 'promotional',
      thumbnail: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&h=400&fit=crop',
      features: ['Countdown Timer', 'Product Showcase', 'Limited Stock', 'Quick Checkout'],
      elements: predefinedTemplateStructures['template-flash-sale'],
      tier: 'premium',
    },
    {
      id: 'template-order-confirmation',
      name: 'Order Confirmation',
      description: 'Detailed order confirmation with tracking',
      category: 'transactional',
      thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop',
      features: ['Order Summary', 'Tracking Number', 'Shipping Details', 'Customer Support'],
      elements: predefinedTemplateStructures['template-order-confirmation'],
      tier: 'free',
    },
    {
      id: 'template-event-invitation',
      name: 'Event Invitation',
      description: 'Sophisticated event invitation template',
      category: 'event',
      thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop',
      features: ['Event Details', 'Date/Time', 'Location Info', 'RSVP Button'],
      elements: predefinedTemplateStructures['template-event-invitation'],
      tier: 'premium',
    },
    {
      id: 'template-password-reset',
      name: 'Password Reset',
      description: 'Secure password reset email template',
      category: 'transactional',
      thumbnail: 'https://images.unsplash.com/photo-1555421689-3f034debb7a6?w=600&h=400&fit=crop',
      features: ['Reset Button', 'Security Notice', 'Expiry Warning', 'Support Links'],
      elements: predefinedTemplateStructures['template-password-reset'],
      tier: 'free',
    },
    {
      id: 'template-promotional-minimal',
      name: 'Minimal Promo',
      description: 'Clean and simple promotional design',
      category: 'promotional',
      thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop',
      features: ['Centered Layout', 'Single CTA', 'Product Image', 'Simple Copy'],
      elements: predefinedTemplateStructures['template-promotional-minimal'],
      tier: 'free',
    },
    {
      id: 'template-welcome-elegant',
      name: 'Welcome Elegant',
      description: 'Sophisticated welcome email with personal touch',
      category: 'newsletter',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
      features: ['Personalized Greeting', 'Quote Block', 'Signature', 'Elegant Design'],
      elements: predefinedTemplateStructures['template-welcome-elegant'],
      tier: 'premium',
    },
    {
      id: 'template-monthly-roundup',
      name: 'Monthly Roundup',
      description: 'Comprehensive monthly newsletter template',
      category: 'newsletter',
      thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop',
      features: ['Navigation Menu', 'Two-Column Layout', 'Multiple Sections', 'Social Links'],
      elements: predefinedTemplateStructures['template-monthly-roundup'],
      tier: 'premium',
    },
    {
      id: 'template-seasonal-promotional',
      name: 'Seasonal Promotional',
      description: 'Seasonal campaign template with visual appeal',
      category: 'promotional',
      thumbnail: 'https://images.unsplash.com/photo-1513094735237-8f2714d57c13?w=600&h=400&fit=crop',
      features: ['Seasonal Banner', 'Product Grid', 'Discount Code', 'Social Integration'],
      elements: predefinedTemplateStructures['template-seasonal-promotional'],
      tier: 'premium',
    },
    {
      id: 'template-customer-thankyou',
      name: 'Customer Thank You',
      description: 'Appreciation email with special offer',
      category: 'newsletter',
      thumbnail: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&h=400&fit=crop',
      features: ['Thank You Message', 'Coupon Code', 'Loyalty Reward', 'Support Info'],
      elements: predefinedTemplateStructures['template-customer-thankyou'],
      tier: 'free',
    },
    {
      id: 'template-announcement-update',
      name: 'Announcement Update',
      description: 'Important announcement or system update template',
      category: 'newsletter',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
      features: ['Announcement Banner', 'Detailed Info', 'Action Items', 'Support CTA'],
      elements: predefinedTemplateStructures['template-announcement-update'],
      tier: 'free',
    },
  ];

  // Filter templates
  const filteredTemplates = predefinedTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.features.some((feature) =>
        feature.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      categoryFilter === 'all' || template.category === categoryFilter;

    const matchesTier =
      tierFilter === 'all' || template.tier === tierFilter;

    return matchesSearch && matchesCategory && matchesTier;
  });

  const handleUseTemplate = (template: any) => {
    onSelectTemplate(template);
  };

  const handlePreview = (template: any) => {
    setSelectedTemplate(template);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="gap-2"
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Choose a Template
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Select a predefined template to customize
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name, ID, category, features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
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

            {/* Tier Filter */}
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredTemplates.length} of {predefinedTemplates.length} templates
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Template Thumbnail */}
              <div className="relative h-48 bg-gray-100 overflow-hidden group">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Tier Badge - Always Visible */}
                {template.tier === 'premium' ? (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 font-semibold text-xs">
                    <Crown className="size-3.5 fill-white" />
                    Premium
                  </div>
                ) : (
                  <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 font-semibold text-xs">
                    <Check className="size-3.5" />
                    Free
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handlePreview(template)}
                  >
                    <Eye className="size-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleUseTemplate(template)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="size-4 mr-2" />
                    Use Template
                  </Button>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2 flex-wrap">
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 capitalize">
                    {template.category}
                  </span>
                  <span className="inline-block px-2 py-1 text-xs font-mono rounded bg-gray-100 text-gray-600">
                    {template.id}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {template.description}
                </p>

                {/* Features */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Includes:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {template.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleUseTemplate(template)}
                >
                  Use This Template
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="size-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No templates found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Preview Modal (Simple) */}
      {selectedTemplate && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTemplate(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedTemplate.name}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {selectedTemplate.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTemplate(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="mb-4">
                <img
                  src={selectedTemplate.thumbnail}
                  alt={selectedTemplate.name}
                  className="w-full rounded-lg border border-gray-200"
                />
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Features included:
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.features.map((feature: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    handleUseTemplate(selectedTemplate);
                    setSelectedTemplate(null);
                  }}
                >
                  Use This Template
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}